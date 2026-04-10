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
