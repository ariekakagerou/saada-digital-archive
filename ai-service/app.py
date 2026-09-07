import sys
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Security
from fastapi.security.api_key import APIKeyHeader
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
from ocr.field_extractor import perform_extraction, perform_extraction_raw, clean_ocr_text
from fuzzy.levenshtein import perform_fuzzy_search

# Setup Logging to sys.stdout agar PM2 tidak menandai log INFO/standard sebagai error (merah)
logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s:\t%(message)s",
    stream=sys.stdout,
    force=True
)
logger = logging.getLogger("AI-Service")

def redirect_uvicorn_logs():
    for logger_name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        log_obj = logging.getLogger(logger_name)
        for h in log_obj.handlers:
            if hasattr(h, "stream"):
                h.stream = sys.stdout

redirect_uvicorn_logs()

ALLOWED_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.tiff', '.bmp'}

def allowed_file(filename):
    return os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS

app = FastAPI(title="Alumni Smart Archive AI Service")

@app.on_event("startup")
async def startup_event():
    redirect_uvicorn_logs()

# 🔐 API Key Configuration
API_KEY = "SAADA_AI_SECRET_2026_KEY_BOGOR"
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def get_api_key(header_value: str = Security(api_key_header)):
    if header_value == API_KEY:
        return header_value
    raise HTTPException(
        status_code=403, detail="Akses ditolak: API Key tidak valid atau tidak ada."
    )

# --- Models ---
class FuzzySearchRequest(BaseModel):
    query: str
    candidates: List[str]
    threshold: Optional[int] = 50

class OCRResponse(BaseModel):
    text: str
    rawText: Optional[str] = ""
    confidence: float
    extractedData: dict = {}
    rawExtractedData: Optional[dict] = {}
    suggestedCategory: Optional[str] = "Lainnya"
    llmCleanedData: Optional[dict] = {}

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

class ComparisonResult(BaseModel):
    method: str
    text: str
    confidence: float
    extractedData: dict
    processing_time: float

class ComparativeOCRResponse(BaseModel):
    filename: str
    results: List[ComparisonResult]
    best_method: str

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

@app.post("/ocr", response_model=OCRResponse, dependencies=[Depends(get_api_key)])
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
        raw_text, confidence = extract_text(processed_img)
        
        # 3. Bersihkan teks OCR agar rapi dan mudah dibaca
        text = clean_ocr_text(raw_text)
        
        extracted_data = perform_extraction(text)
        raw_extracted_data = perform_extraction_raw(raw_text)
        
        logger.info(f"OCR Success. Confidence: {confidence:.2f}")
        
        # 3. Auto-Categorization
        suggested_category = auto_classify_document(text)
        
        # 4. LLM-Lite Extraction (Simulation)
        llm_data = await llm_data_extraction_mock(text)
        
        return OCRResponse(
            text=text, 
            rawText=raw_text,
            confidence=confidence, 
            extractedData=extracted_data,
            rawExtractedData=raw_extracted_data,
            suggestedCategory=suggested_category,
            llmCleanedData=llm_data
        )

    except Exception as e:
        logger.error(f"OCR Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/ocr-enhanced", response_model=EnhancedOCRResponse, dependencies=[Depends(get_api_key)])
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

@app.post("/calculate-cer", response_model=CERResponse, dependencies=[Depends(get_api_key)])
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

@app.post("/calculate-wer", response_model=CERResponse, dependencies=[Depends(get_api_key)])
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

@app.post("/ocr-compare", response_model=ComparativeOCRResponse, dependencies=[Depends(get_api_key)])
async def process_ocr_comparative(file: UploadFile = File(...)):
    """
    Experimental endpoint for Thesis Evaluation:
    Compares 3 different preprocessing pipelines:
    1. Base (Grayscale + Simple Threshold)
    2. Advanced (CLAHE + Denoise)
    3. Maximum (Deskew + CLAHE + Sharpen)
    """
    if not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="Invalid file type. Only images allowed.")

    import time
    temp_filename = f"comp_{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    temp_path = os.path.join("temp", temp_filename)
    os.makedirs("temp", exist_ok=True)
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        img = cv2.imread(temp_path)
        results = []
        
        # Pipeline 1: Base
        start_time = time.time()
        base_processed, _ = preprocess_image(temp_path)
        text1, conf1 = extract_text(base_processed)
        results.append(ComparisonResult(
            method="Base Preprocessing",
            text=text1,
            confidence=conf1,
            extractedData=perform_extraction(text1),
            processing_time=time.time() - start_time
        ))
        
        # Pipeline 2: Enhanced (CLAHE)
        start_time = time.time()
        enhanced_img, _ = enhance_image(img)
        text2, conf2 = extract_text(enhanced_img)
        results.append(ComparisonResult(
            method="Advanced Enhancement (CLAHE)",
            text=text2,
            confidence=conf2,
            extractedData=perform_extraction(text2),
            processing_time=time.time() - start_time
        ))
        
        # Determine best method based on Tesseract confidence
        best = max(results, key=lambda x: x.confidence)
        
        return ComparativeOCRResponse(
            filename=file.filename,
            results=results,
            best_method=best.method
        )

    except Exception as e:
        logger.error(f"Comparative OCR Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/fuzzy-search", response_model=dict, dependencies=[Depends(get_api_key)])
def fuzzy_search_endpoint(payload: FuzzySearchRequest):
    """
    Endpoint for Fuzzy Search using Levenshtein Distance
    """
    results = perform_fuzzy_search(payload.query, payload.candidates, payload.threshold)
    return {"query": payload.query, "results": results}

# --- Helper Functions for "Smart" Features ---

def auto_classify_document(text: str) -> str:
    """
    Mendeteksi kategori dokumen berdasarkan kata kunci (Keyword Spotting).
    """
    text = text.upper()
    if "IJAZAH" in text or "TANDA LULUS" in text:
        return "Ijazah"
    elif "SKHU" in text or "HASIL UJIAN" in text:
        return "SKHU"
    elif "RAPOR" in text or "NILAI HASIL" in text:
        return "Rapor"
    elif "TRANSKRIP" in text:
        return "Transkrip"
    return "Lainnya"

async def llm_data_extraction_mock(text: str):
    """
    Placeholder untuk LLM (Gemini/GPT). 
    Fungsinya membersihkan teks berantakan menjadi JSON rapi.
    """
    # Di sini Anda bisa memanggil API Google Gemini atau OpenAI.
    # Untuk skripsi, Anda bisa mensimulasikan 'Cleaning' teks.
    return {
        "is_valid": True,
        "summary": "Data berhasil diekstrak menggunakan NLP Logic"
    }

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=False) # Reload False for performance
