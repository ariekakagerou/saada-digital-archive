import easyocr
import pytesseract
import logging
import numpy as np
import os
import subprocess
import torch

logger = logging.getLogger(__name__)

# Batasi thread PyTorch agar optimal di CPU ThinkPad T420 (Dual-Core)
try:
    torch.set_num_threads(2)
    logger.info("PyTorch threads restricted to 2 for optimal CPU performance.")
except Exception as e:
    logger.warning(f"Failed to set PyTorch threads: {e}")

# ── Tesseract Path Configuration (Windows) ────────────────────────────────
# Sesuaikan path ini dengan lokasi instalasi Tesseract di komputer Anda
_local_appdata = os.environ.get("LOCALAPPDATA", "")
_user_profile = os.environ.get("USERPROFILE", "")

TESSERACT_PATHS = [
    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
]
if _local_appdata:
    TESSERACT_PATHS.append(os.path.join(_local_appdata, "Programs", "Tesseract-OCR", "tesseract.exe"))
if _user_profile:
    TESSERACT_PATHS.append(os.path.join(_user_profile, "AppData", "Local", "Programs", "Tesseract-OCR", "tesseract.exe"))
TESSERACT_PATHS.append("tesseract")  # fallback: jika sudah ada di PATH

_tesseract_available = False
for _path in TESSERACT_PATHS:
    try:
        pytesseract.pytesseract.tesseract_cmd = _path
        pytesseract.get_tesseract_version()
        _tesseract_available = True
        logger.info(f"Tesseract ditemukan: {_path}")
        break
    except Exception:
        continue

if not _tesseract_available:
    logger.warning("⚠️  Tesseract TIDAK ditemukan! Hanya EasyOCR yang akan digunakan.")
    logger.warning("Install Tesseract dari: https://github.com/UB-Mannheim/tesseract/wiki")



# Initialize EasyOCR Reader lazily (agar tidak crash saat startup)
_easyocr_reader = None

def _get_reader():
    global _easyocr_reader
    if _easyocr_reader is None:
        logger.info("Inisialisasi EasyOCR reader...")
        # download_enabled=False mencegah EasyOCR men-download model dari internet (yang menyebabkan hang 5 menit)
        # recog_network='latin_g2' memaksa pakai model latin_g2.pth yang sudah ada di lokal
        try:
            _easyocr_reader = easyocr.Reader(['id', 'en'], gpu=False, recog_network='latin_g2', download_enabled=False)
        except FileNotFoundError:
            logger.warning("Model latin_g2.pth tidak ditemukan atau MD5 mismatch. Mencoba tanpa pembatasan download...")
            _easyocr_reader = easyocr.Reader(['id', 'en'], gpu=False, recog_network='latin_g2')
    return _easyocr_reader


def _extract_with_easyocr(image) -> tuple[str, float]:
    """Ekstraksi menggunakan EasyOCR (lebih lambat tapi robust)."""
    results = _get_reader().readtext(image)
    extracted_texts = []
    total_confidence = 0.0
    count = 0
    for (_, text, prob) in results:
        extracted_texts.append(text)
        total_confidence += prob * 100
        count += 1
    easy_text = " ".join(extracted_texts)
    easy_avg_conf = (total_confidence / count) if count > 0 else 0.0
    return easy_text, easy_avg_conf


def extract_text(image) -> tuple[str, float]:
    """
    Hybrid Extraction:
    1. Jika Tesseract tersedia: coba Tesseract (cepat)
    2. Jika confidence < 60% atau Tesseract tidak tersedia: gunakan EasyOCR
    """
    try:
        if _tesseract_available:
            # --- PHASE 1: TESSERACT (Fast) ---
            custom_config = r'--oem 3 --psm 6 -l ind+eng'
            data = pytesseract.image_to_data(image, config=custom_config, output_type=pytesseract.Output.DICT)

            tess_text = " ".join(data['text'])
            confidences = [int(conf) for conf in data['conf'] if str(conf) != '-1' and int(conf) >= 0]

            tess_avg_conf = 0.0
            if confidences:
                tess_avg_conf = sum(confidences) / len(confidences)

            # Apakah Tesseract cukup baik?
            if tess_avg_conf > 60:
                logger.info(f"Tesseract Confidence ({tess_avg_conf:.2f}%) bagus.")
                return " ".join(tess_text.split()), tess_avg_conf

            logger.info(f"Tesseract Confidence ({tess_avg_conf:.2f}%) rendah, fallback ke EasyOCR...")

        else:
            logger.info("Tesseract tidak tersedia. Menggunakan EasyOCR...")

        # --- PHASE 2: EASYOCR ---
        return _extract_with_easyocr(image)

    except Exception as e:
        logger.error(f"Hybrid OCR Failed: {e}")
        # Coba EasyOCR sebagai last resort
        try:
            logger.info("Mencoba EasyOCR sebagai last resort...")
            return _extract_with_easyocr(image)
        except Exception as e2:
            logger.error(f"EasyOCR juga gagal: {e2}")
            return "", 0.0
