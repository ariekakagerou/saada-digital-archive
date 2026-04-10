# Diagram Alur Proses OCR (Optical Character Recognition)

Dokumen ini menjelaskan tahapan teknis transformasi citra fisik menjadi teks digital dalam sistem.

## Alur Proses (Flowchart)

```mermaid
flowchart TD
    Start([Mulai]) --> InputImage[/Input Citra Dokumen/]
    InputImage --> ConvertGray[Konversi ke Grayscale]
    ConvertGray --> NoiseReduction[Reduksi Noise (Gaussian Blur)]
    NoiseReduction --> Thresholding[Adaptive Thresholding]
    
    Thresholding --> CheckQuality{Kualitas Citra Cukup?}
    CheckQuality -- Tidak --> ImageEnhance[Image Enhancement Tambahan]
    ImageEnhance --> Thresholding
    
    CheckQuality -- Ya --> Tesseract[Proses Tesseract OCR]
    Tesseract --> Segmentation[Segmentasi Halaman (PSM 6)]
    Segmentation --> charRecog[Pengenalan Karakter]
    
    charRecog --> Confidence{Confidence Score > 75%?}
    Confidence -- Ya --> ResultGiven[/Output: Teks Bersih/]
    Confidence -- Tidak --> FlagLowConf[/Output: Teks + Warning/]
    
    ResultGiven --> End([Selesai])
    FlagLowConf --> End
```

## Penjelasan Teknis

### 1. Preprocessing Citra (Image Preprocessing)
Tahap krusial untuk meningkatkan akurasi OCR dengan memisahkan teks (foreground) dari latar belakang (background).
- **Grayscale**: Mengubah citra RGB (3 channel) menjadi skala abu-abu (1 channel) untuk mengurangi kompleksitas komputasi.
- **Gaussian Blur**: Penerapan filter *low-pass* untuk menghaluskan citra dan mengurangi *noise* bintik (*speckle noise*) hasil pemindaian.
- **Adaptive Thresholding**: Teknik binarisasi dinamis yang menghitung nilai ambang (*threshold*) berdasarkan area lokal kecil di sekitar piksel, bukan nilai global. Ini sangat efektif untuk dokumen dengan pencahayaan tidak merata (misal: foto kamera HP).

### 2. Ekstraksi Teks (Text Extraction)
Menggunakan *engine* Tesseract OCR.
- **Page Segmentation Mode (PSM)**: Diatur ke mode 6 (*Assume a single uniform block of text*), cocok untuk dokumen arsip standar seperti ijazah yang tata letaknya terstruktur.
- **Output Data**: Selain teks mentah, sistem juga mengekstrak matriks tingkat keyakinan (*confidence level*) untuk setiap kata yang dikenali.

### 3. Pasca-Pemrosesan (Post-Processing)
- **Filtering**: Menghapus karakter sampah (*gibberish*) atau spasi berlebih.
- **Scoring**: Menghitung rata-rata *confidence score* seluruh dokumen untuk menentukan flag kualitas (Baik/Sedang/Buruk) pada antarmuka pengguna.
