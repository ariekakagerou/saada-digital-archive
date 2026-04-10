# Alumni Smart Archive - AI Service

## 📚 Overview

AI Service untuk Alumni Smart Archive yang menyediakan:
- **OCR (Optical Character Recognition)** dengan Tesseract
- **Advanced Image Enhancement** (Deskew, Denoise, CLAHE, Sharpening)
- **CER/WER Calculation** untuk mengukur akurasi OCR
- **Fuzzy String Matching** dengan Levenshtein Distance

---

## 🗂️ Struktur Folder

```
ai-service/
├── app.py                      # Main FastAPI application
├── requirements.txt            # Python dependencies
├── README.md                   # This file
├── ocr/                        # OCR Module
│   ├── preprocessing.py        # Basic image preprocessing
│   ├── enhancement.py          # Advanced image enhancement
│   ├── extractor.py            # Tesseract OCR extraction
│   └── cer_calculator.py       # CER/WER calculation
└── fuzzy/                      # Fuzzy Search Module
    └── levenshtein.py          # Fuzzy string matching
```

---

## 🚀 Installation

### 1. Install Python Dependencies

```bash
cd ai-service
pip install -r requirements.txt
```

### 2. Install Tesseract OCR

#### Windows:
1. Download installer dari: https://github.com/UB-Mannheim/tesseract/wiki
2. Install ke `C:\Program Files\Tesseract-OCR`
3. Tambahkan ke PATH atau set di code:
```python
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

#### Linux/Ubuntu:
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
sudo apt-get install libtesseract-dev
```

#### macOS:
```bash
brew install tesseract
```

### 3. Run Service

```bash
python app.py
```

Service akan berjalan di: **http://localhost:5000**

---

## 📡 API Endpoints

### 1. **GET /** - Health Check
```http
GET http://localhost:5000/
```

**Response:**
```json
{
  "message": "Alumni Smart Archive AI Service is Running",
  "version": "2.0.0",
  "features": [
    "OCR with Tesseract",
    "Advanced Image Enhancement",
    "CER/WER Calculation",
    "Fuzzy String Matching"
  ]
}
```

---

### 2. **POST /ocr** - Basic OCR

Upload gambar dan dapatkan hasil OCR.

**Request:**
```http
POST http://localhost:5000/ocr
Content-Type: multipart/form-data

Body:
- file: [image file]
```

**Response:**
```json
{
  "text": "Nama: Ahmad Faisal\nNIS: 12345678\nTahun Lulus: 2024",
  "confidence": 87.5
}
```

**Preprocessing Steps:**
1. Grayscale conversion
2. Gaussian blur (noise reduction)
3. Adaptive thresholding

---

### 3. **POST /ocr-enhanced** - Enhanced OCR

OCR dengan image enhancement untuk akurasi lebih tinggi.

**Request:**
```http
POST http://localhost:5000/ocr-enhanced
Content-Type: multipart/form-data

Body:
- file: [image file]
```

**Response:**
```json
{
  "text": "Nama: Ahmad Faisal\nNIS: 12345678\nTahun Lulus: 2024",
  "confidence": 92.3,
  "enhancement_metrics": {
    "skew_angle": -2.5,
    "enhancement_applied": true
  }
}
```

**Enhancement Steps:**
1. **Deskew** - Koreksi rotasi dokumen
2. **Advanced Denoise** - Non-local means denoising
3. **CLAHE** - Contrast enhancement
4. **Sharpening** - Meningkatkan ketajaman teks

---

### 4. **POST /calculate-cer** - Calculate CER

Hitung Character Error Rate untuk mengukur akurasi OCR.

**Request:**
```http
POST http://localhost:5000/calculate-cer
Content-Type: application/json

{
  "reference": "Ahmad Faisal",
  "hypothesis": "Ahmad Faisel"
}
```

**Response:**
```json
{
  "cer": 7.69,
  "accuracy": 92.31,
  "metrics": {
    "cer": 7.69,
    "accuracy": 92.31,
    "edit_distance": 1,
    "reference_length": 13,
    "hypothesis_length": 13,
    "operations": {
      "substitutions": 1,
      "deletions": 0,
      "insertions": 0,
      "total_errors": 1
    }
  }
}
```

**Formula:**
```
CER = (Substitutions + Deletions + Insertions) / Total Characters × 100
```

---

### 5. **POST /calculate-wer** - Calculate WER

Hitung Word Error Rate untuk mengukur akurasi OCR di level kata.

**Request:**
```http
POST http://localhost:5000/calculate-wer
Content-Type: application/json

{
  "reference": "Ahmad Faisal Mahasiswa",
  "hypothesis": "Ahmad Faisel Mahasiswa"
}
```

**Response:**
```json
{
  "cer": 33.33,
  "accuracy": 66.67,
  "metrics": {
    "wer": 33.33,
    "accuracy": 66.67,
    "edit_distance": 1,
    "reference_words": 3,
    "hypothesis_words": 3,
    "operations": {
      "total_errors": 1
    }
  }
}
```

**Formula:**
```
WER = (Word Substitutions + Deletions + Insertions) / Total Words × 100
```

---

### 6. **POST /fuzzy-search** - Fuzzy String Matching

Cari data dengan toleransi typo menggunakan Levenshtein Distance.

**Request:**
```http
POST http://localhost:5000/fuzzy-search
Content-Type: application/json

{
  "query": "Ahmad Faisal",
  "candidates": [
    "Ahmad Faisal",
    "Ahmad Faizan",
    "Muhammad Faisal",
    "Ahmad Faisel",
    "Budi Santoso"
  ],
  "threshold": 60
}
```

**Response:**
```json
{
  "query": "Ahmad Faisal",
  "results": [
    {
      "text": "Ahmad Faisal",
      "score": 100,
      "match_type": "Exact"
    },
    {
      "text": "Ahmad Faisel",
      "score": 92,
      "match_type": "Fuzzy"
    },
    {
      "text": "Ahmad Faizan",
      "score": 85,
      "match_type": "Fuzzy"
    },
    {
      "text": "Muhammad Faisal",
      "score": 73,
      "match_type": "Fuzzy"
    }
  ]
}
```

**Parameters:**
- `query`: Kata kunci pencarian
- `candidates`: List data yang akan dicari
- `threshold`: Minimum score (0-100), default 60

---

## 🔬 Technical Details

### OCR Processing Pipeline

#### Basic OCR (`/ocr`):
```
Input Image
    ↓
Grayscale Conversion
    ↓
Gaussian Blur (5x5)
    ↓
Adaptive Thresholding
    ↓
Tesseract OCR
    ↓
Text + Confidence
```

#### Enhanced OCR (`/ocr-enhanced`):
```
Input Image
    ↓
Deskew (Rotation Correction)
    ↓
Non-Local Means Denoising
    ↓
CLAHE (Contrast Enhancement)
    ↓
Sharpening
    ↓
Tesseract OCR
    ↓
Text + Confidence + Metrics
```

### CER/WER Calculation

**Levenshtein Distance Algorithm:**
- Dynamic Programming approach
- Time Complexity: O(m × n)
- Space Complexity: O(m × n)

**Operations Counted:**
1. **Substitution**: Mengganti karakter (A → B)
2. **Deletion**: Menghapus karakter
3. **Insertion**: Menambah karakter

### Fuzzy Matching

**RapidFuzz Library:**
- Optimized Levenshtein distance
- Faster than python-Levenshtein
- Supports partial matching

**Scoring:**
- 100: Exact match
- 80-99: Very close (1-2 char difference)
- 60-79: Partial match
- <60: Not returned

---

## 📊 Performance Metrics

### OCR Accuracy

| Document Quality | Basic OCR | Enhanced OCR |
|-----------------|-----------|--------------|
| High Quality    | 85-90%    | 90-95%       |
| Medium Quality  | 70-80%    | 80-90%       |
| Low Quality     | 50-70%    | 70-85%       |

### Processing Time

| Endpoint         | Average Time |
|-----------------|--------------|
| `/ocr`          | 1-2 seconds  |
| `/ocr-enhanced` | 2-4 seconds  |
| `/calculate-cer`| <0.1 second  |
| `/fuzzy-search` | <0.5 second  |

---

## 🧪 Testing

### Test OCR Endpoint

```bash
curl -X POST "http://localhost:5000/ocr" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/image.jpg"
```

### Test CER Calculation

```bash
curl -X POST "http://localhost:5000/calculate-cer" \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "Ahmad Faisal",
    "hypothesis": "Ahmad Faisel"
  }'
```

### Test Fuzzy Search

```bash
curl -X POST "http://localhost:5000/fuzzy-search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Ahmad",
    "candidates": ["Ahmad Faisal", "Muhammad Ahmad", "Budi"],
    "threshold": 60
  }'
```

---

## 🔧 Configuration

### Tesseract Configuration

Di `ocr/extractor.py`:
```python
custom_config = r'--oem 3 --psm 6'
```

**Options:**
- `--oem 3`: LSTM neural network mode
- `--psm 6`: Uniform block of text
- `--psm 3`: Fully automatic page segmentation
- `--psm 11`: Sparse text

### Image Enhancement Parameters

Di `ocr/enhancement.py`:
```python
# CLAHE
clipLimit=2.0
tileGridSize=(8, 8)

# Denoising
h=10  # Filter strength
templateWindowSize=7
searchWindowSize=21
```

---

## 📝 Dependencies

```
fastapi==0.104.1
uvicorn==0.24.0
python-multipart==0.0.6
opencv-python==4.8.1
pytesseract==0.3.10
numpy==1.26.2
rapidfuzz==3.5.2
```

---

## 🐛 Troubleshooting

### Error: Tesseract not found

**Solution:**
```python
# Tambahkan di extractor.py
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

### Error: Module not found

**Solution:**
```bash
pip install -r requirements.txt
```

### Low OCR Accuracy

**Solutions:**
1. Gunakan `/ocr-enhanced` endpoint
2. Pastikan gambar berkualitas baik (min 300 DPI)
3. Hindari gambar blur atau rotasi ekstrem
4. Gunakan format PNG/TIFF untuk kualitas terbaik

---

## 📚 References

- [Tesseract OCR Documentation](https://tesseract-ocr.github.io/)
- [OpenCV Documentation](https://docs.opencv.org/)
- [RapidFuzz Documentation](https://rapidfuzz.github.io/RapidFuzz/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

## 📄 License

MIT License - Alumni Smart Archive Project

---

## 👥 Contributors

- AI Service Development Team
- Alumni Smart Archive Project

---

**Version:** 2.0.0  
**Last Updated:** 2026-01-17
