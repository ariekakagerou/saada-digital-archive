import cv2
import numpy as np
import os
import logging

logger = logging.getLogger(__name__)

def preprocess_image(image_path: str) -> tuple[np.ndarray, str]:
    """
    Apply preprocessing to the image to improve OCR accuracy.
     Techniques: Grayscale, Gaussian Blur, Adaptive Thresholding.
    """
    try:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found at {image_path}")

        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Failed to read image")

        # 0. Resize gambar jika terlalu besar untuk performa CPU ThinkPad T420
        max_dim = 1500
        h, w = img.shape[:2]
        if max(h, w) > max_dim:
            scale = max_dim / float(max(h, w))
            img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
            logger.info(f"Image resized from {w}x{h} to {img.shape[1]}x{img.shape[0]} for faster CPU processing")

        # 1. Convert to Grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 2. Noise Reduction (Gaussian Blur)
        # Helps remove random dots/noise from scanning
        blur = cv2.GaussianBlur(gray, (5, 5), 0)

        # 3. Adaptive Thresholding
        # Creates a binary image (black/white) robust to lighting variations
        thresh = cv2.adaptiveThreshold(
            blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        
        # Save processed image for debugging/verification
        processed_path = image_path.replace(".", "_processed.")
        # cv2.imwrite(processed_path, thresh) # Disabled for performance
        
        return thresh, processed_path

    except Exception as e:
        logger.error(f"Preprocessing failed: {e}")
        raise e
