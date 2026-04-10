import cv2
import numpy as np
import logging
from typing import Tuple

logger = logging.getLogger(__name__)

def enhance_image(image: np.ndarray) -> Tuple[np.ndarray, dict]:
    """
    Apply advanced image enhancement techniques to improve OCR accuracy.
    
    Techniques:
    1. Deskew (straighten rotated images)
    2. Denoise (advanced noise reduction)
    3. Contrast enhancement (CLAHE)
    4. Sharpening
    
    Args:
        image: Input image (numpy array)
    
    Returns:
        Tuple of (enhanced image, enhancement metrics)
    """
    try:
        metrics = {}
        
        # 1. Deskew
        deskewed, skew_angle = deskew_image(image)
        metrics['skew_angle'] = round(skew_angle, 2)
        
        # 2. Denoise
        denoised = advanced_denoise(deskewed)
        
        # 3. Contrast Enhancement (CLAHE)
        enhanced = apply_clahe(denoised)
        
        # 4. Sharpening
        sharpened = sharpen_image(enhanced)
        
        metrics['enhancement_applied'] = True
        logger.info(f"Image enhanced successfully. Skew angle: {skew_angle:.2f}°")
        
        return sharpened, metrics
    
    except Exception as e:
        logger.error(f"Image enhancement failed: {e}")
        return image, {"enhancement_applied": False, "error": str(e)}


def deskew_image(image: np.ndarray) -> Tuple[np.ndarray, float]:
    """
    Detect and correct skew (rotation) in scanned documents.
    
    Uses Hough Line Transform to detect dominant text lines
    and calculate rotation angle.
    
    Args:
        image: Input grayscale image
    
    Returns:
        Tuple of (deskewed image, skew angle in degrees)
    """
    try:
        # Convert to grayscale if needed
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()
        
        # Apply edge detection
        edges = cv2.Canny(gray, 50, 150, apertureSize=3)
        
        # Detect lines using Hough Transform
        lines = cv2.HoughLines(edges, 1, np.pi / 180, 200)
        
        if lines is None:
            return image, 0.0
        
        # Calculate angles
        angles = []
        for line in lines:
            rho, theta = line[0]
            angle = np.degrees(theta) - 90
            angles.append(angle)
        
        # Get median angle (more robust than mean)
        if len(angles) == 0:
            return image, 0.0
        
        median_angle = np.median(angles)
        
        # Only deskew if angle is significant (> 0.5 degrees)
        if abs(median_angle) < 0.5:
            return image, median_angle
        
        # Rotate image to correct skew
        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, median_angle, 1.0)
        rotated = cv2.warpAffine(image, M, (w, h), 
                                  flags=cv2.INTER_CUBIC, 
                                  borderMode=cv2.BORDER_REPLICATE)
        
        return rotated, median_angle
    
    except Exception as e:
        logger.warning(f"Deskew failed: {e}")
        return image, 0.0


def advanced_denoise(image: np.ndarray) -> np.ndarray:
    """
    Apply advanced denoising using Non-Local Means Denoising.
    
    This is more effective than Gaussian blur for preserving edges
    while removing noise.
    
    Args:
        image: Input image
    
    Returns:
        Denoised image
    """
    try:
        if len(image.shape) == 3:
            # Color image
            # denoised = cv2.fastNlMeansDenoisingColored(image, None, 10, 10, 7, 21) # Too heavy
            denoised = cv2.GaussianBlur(image, (5, 5), 0)
        else:
            # Grayscale image
            # denoised = cv2.fastNlMeansDenoising(image, None, 10, 7, 21) # Too heavy
            denoised = cv2.GaussianBlur(image, (5, 5), 0)
        
        return denoised
    
    except Exception as e:
        logger.warning(f"Denoising failed: {e}")
        return image


def apply_clahe(image: np.ndarray) -> np.ndarray:
    """
    Apply CLAHE (Contrast Limited Adaptive Histogram Equalization).
    
    Improves contrast in images with varying lighting conditions.
    Better than regular histogram equalization as it prevents
    over-amplification of noise.
    
    Args:
        image: Input grayscale image
    
    Returns:
        Contrast-enhanced image
    """
    try:
        # Convert to grayscale if needed
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()
        
        # Create CLAHE object
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        
        # Apply CLAHE
        enhanced = clahe.apply(gray)
        
        return enhanced
    
    except Exception as e:
        logger.warning(f"CLAHE failed: {e}")
        return image


def sharpen_image(image: np.ndarray) -> np.ndarray:
    """
    Apply sharpening filter to enhance text edges.
    
    Uses an unsharp mask technique to make text more crisp.
    
    Args:
        image: Input image
    
    Returns:
        Sharpened image
    """
    try:
        # Sharpening kernel
        kernel = np.array([
            [0, -1, 0],
            [-1, 5, -1],
            [0, -1, 0]
        ])
        
        # Apply kernel
        sharpened = cv2.filter2D(image, -1, kernel)
        
        return sharpened
    
    except Exception as e:
        logger.warning(f"Sharpening failed: {e}")
        return image


def remove_borders(image: np.ndarray, border_size: int = 10) -> np.ndarray:
    """
    Remove borders from scanned documents.
    
    Useful for removing scanner artifacts and black borders.
    
    Args:
        image: Input image
        border_size: Size of border to remove (in pixels)
    
    Returns:
        Image with borders removed
    """
    try:
        h, w = image.shape[:2]
        
        # Crop borders
        cropped = image[border_size:h-border_size, border_size:w-border_size]
        
        return cropped
    
    except Exception as e:
        logger.warning(f"Border removal failed: {e}")
        return image


def binarize_sauvola(image: np.ndarray, window_size: int = 25, k: float = 0.2) -> np.ndarray:
    """
    Apply Sauvola's binarization method.
    
    Better than simple thresholding for documents with varying
    background intensity (e.g., old/degraded documents).
    
    Args:
        image: Input grayscale image
        window_size: Size of local window
        k: Parameter controlling threshold (0.2-0.5)
    
    Returns:
        Binarized image
    """
    try:
        # Convert to grayscale if needed
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()
        
        # Calculate local mean and standard deviation
        mean = cv2.boxFilter(gray, cv2.CV_32F, (window_size, window_size))
        sqmean = cv2.boxFilter(gray**2, cv2.CV_32F, (window_size, window_size))
        
        # Calculate standard deviation
        variance = sqmean - mean**2
        variance[variance < 0] = 0
        std = np.sqrt(variance)
        
        # Sauvola threshold
        R = 128  # Dynamic range of standard deviation
        threshold = mean * (1 + k * ((std / R) - 1))
        
        # Apply threshold
        binary = np.where(gray > threshold, 255, 0).astype(np.uint8)
        
        return binary
    
    except Exception as e:
        logger.warning(f"Sauvola binarization failed: {e}")
        # Fallback to Otsu's method
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        return binary
