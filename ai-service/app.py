from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import shutil
import os
import uuid
import logging
import cv2

# Import Modular Logic
from ocr.preprocessing import preprocess_image
from ocr.extractor import extract_text
from ocr.cer_calculator import calculate_cer, calculate_wer
from ocr.enhancement import enhance_image
from ocr.field_extractor import perform_extraction
from fuzzy.levenshtein import perform_fuzzy_search

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AI-Service")

app = FastAPI(title="Alumni Smart Archive AI Service")

# --- Models ---
class FuzzySearchRequest(BaseModel):
    query: str
    candidates: List[str]
    threshold: Optional[int] = 60

class OCRResponse(BaseModel):
    text: str
    confidence: float
    extractedData: dict = {}

class EnhancedOCRResponse(BaseModel):
    text: str
    confidence: float
    extractedData: dict = {}
    enhancement_metrics: dict

class CERRequest(BaseModel):
    reference: str
    hypothesis: str

class CERResponse(BaseModel):
    cer: float
    accuracy: float
    metrics: dict

# --- Endpoints ---

@app.get("/")
def read_root():
    return {
        "message": "Alumni Smart Archive AI Service is Running", 
        "version": "2.0.0",
        "features": [
            "OCR with Tesseract",
            "Advanced Image Enhancement",
            "CER/WER Calculation",
            "Fuzzy String Matching"
        ]
    }

@app.post("/ocr", response_model=OCRResponse)
async def process_ocr(file: UploadFile = File(...)):
    """
    Endpoint to process an uploaded image:
    1. Preprocessing (Grayscale, Thresholding)
    2. OCR Extraction
    3. Return text & confidence
    """
    temp_filename = f"temp_{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    temp_path = os.path.join("temp", temp_filename)
    os.makedirs("temp", exist_ok=True)
    
    try:
        # Save File
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"Processing file: {temp_path}")
        
        # 1. Preprocessing
        processed_img, _ = preprocess_image(temp_path)
        
        # 2. Extraction
        text, confidence = extract_text(processed_img)
        extracted_data = perform_extraction(text)
        
        logger.info(f"OCR Success. Confidence: {confidence:.2f}")
        
        return OCRResponse(text=text, confidence=confidence, extractedData=extracted_data)

    except Exception as e:
        logger.error(f"OCR Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/ocr-enhanced", response_model=EnhancedOCRResponse)
async def process_ocr_enhanced(file: UploadFile = File(...)):
    """
    Enhanced OCR endpoint with advanced image processing:
    1. Deskew (rotation correction)
    2. Advanced denoising
    3. CLAHE (contrast enhancement)
    4. Sharpening
    5. OCR Extraction
    """
    temp_filename = f"temp_{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    temp_path = os.path.join("temp", temp_filename)
    os.makedirs("temp", exist_ok=True)
    
    try:
        # Save File
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"Processing file with enhancement: {temp_path}")
        
        # 1. Read image
        img = cv2.imread(temp_path)
        
        # 2. Apply advanced enhancement
        enhanced_img, enhancement_metrics = enhance_image(img)
        
        # 3. Standard preprocessing
        processed_img, _ = preprocess_image(temp_path)
        
        # 4. Extraction
        text, confidence = extract_text(enhanced_img)
        extracted_data = perform_extraction(text)
        
        logger.info(f"Enhanced OCR Success. Confidence: {confidence:.2f}")
        
        return EnhancedOCRResponse(
            text=text, 
            confidence=confidence,
            extractedData=extracted_data,
            enhancement_metrics=enhancement_metrics
        )

    except Exception as e:
        logger.error(f"Enhanced OCR Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/calculate-cer", response_model=CERResponse)
def calculate_cer_endpoint(payload: CERRequest):
    """
    Calculate Character Error Rate (CER) between reference and hypothesis text.
    
    CER measures OCR accuracy at character level.
    Lower CER = better accuracy.
    """
    try:
        cer, metrics = calculate_cer(payload.reference, payload.hypothesis)
        
        return CERResponse(
            cer=metrics['cer'],
            accuracy=metrics['accuracy'],
            metrics=metrics
        )
    
    except Exception as e:
        logger.error(f"CER Calculation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/calculate-wer", response_model=CERResponse)
def calculate_wer_endpoint(payload: CERRequest):
    """
    Calculate Word Error Rate (WER) between reference and hypothesis text.
    
    WER measures OCR accuracy at word level.
    Lower WER = better accuracy.
    """
    try:
        wer, metrics = calculate_wer(payload.reference, payload.hypothesis)
        
        return CERResponse(
            cer=metrics['wer'],  # Using same response model
            accuracy=metrics['accuracy'],
            metrics=metrics
        )
    
    except Exception as e:
        logger.error(f"WER Calculation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/fuzzy-search", response_model=dict)
def fuzzy_search_endpoint(payload: FuzzySearchRequest):
    """
    Endpoint for Fuzzy Search using Levenshtein Distance
    """
    results = perform_fuzzy_search(payload.query, payload.candidates, payload.threshold)
    return {"query": payload.query, "results": results}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=False) # Reload False for performance
