import easyocr
import pytesseract
import logging
import numpy as np

logger = logging.getLogger(__name__)

# Initialize EasyOCR Reader once
# gpu=False for compatibility with standard laptops
reader = easyocr.Reader(['id', 'en'], gpu=False)

def extract_text(image) -> tuple[str, float]:
    """
    Hybrid Extraction:
    1. Try Tesseract (Fast)
    2. If confidence < 60%, Fallback to EasyOCR (Slow but robust for handwriting)
    """
    try:
        # --- PHASE 1: TESSERACT (Fast) ---
        custom_config = r'--oem 3 --psm 6'
        data = pytesseract.image_to_data(image, config=custom_config, output_type=pytesseract.Output.DICT)
        
        tess_text = " ".join(data['text'])
        confidences = [int(conf) for conf in data['conf'] if conf != '-1']
        
        tess_avg_conf = 0.0
        if confidences:
            tess_avg_conf = sum(confidences) / len(confidences)

        # Decide: Is Tesseract good enough?
        if tess_avg_conf > 60:
            logger.info(f"Tesseract Confidence ({tess_avg_conf:.2f}%) is good. Skipping Heavy OCR.")
            return " ".join(tess_text.split()), tess_avg_conf

        # --- PHASE 2: EASYOCR (Fallback for Handwriting/Bad Quality) ---
        logger.info(f"Tesseract Confidence ({tess_avg_conf:.2f}%) too low. Falling back to EasyOCR...")
        
        results = reader.readtext(image)
        
        extracted_texts = []
        total_confidence = 0.0
        count = 0

        for (bbox, text, prob) in results:
            extracted_texts.append(text)
            total_confidence += prob * 100 # EasyOCR uses 0-1 float, convert to 0-100
            count += 1
            
        easy_text = " ".join(extracted_texts)
        easy_avg_conf = (total_confidence / count) if count > 0 else 0.0

        return easy_text, easy_avg_conf

    except Exception as e:
        logger.error(f"Hybrid OCR Failed: {e}")
        return "", 0.0
