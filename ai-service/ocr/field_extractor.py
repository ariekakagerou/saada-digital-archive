import re
from typing import Dict, Any

# Helper to convert OCR misread letters to digits in numeric contexts (e.g. NISN, NIS, NPSN, Tahun)
LETTER_TO_DIGIT_MAP = str.maketrans({
    'O': '0', 'o': '0',
    'I': '1', 'i': '1', 'l': '1', '|': '1', '!': '1',
    'Z': '2', 'z': '2',
    'E': '3', 'e': '3',
    'S': '5', 's': '5',
    'B': '8',
})

# Helper to convert OCR misread digits to letters in name/text contexts
DIGIT_TO_LETTER_MAP = str.maketrans({
    '0': 'O',
    '1': 'I',
    '3': 'E',
    '4': 'A',
    '5': 'S',
    '8': 'B'
})


def normalize_numeric_ocr(text: str) -> str:
    """
    Converts OCR homoglyph letters to digits (e.g. 'O01234567I' -> '0012345671').
    """
    if not text:
        return ""
    return text.translate(LETTER_TO_DIGIT_MAP)


def normalize_text_ocr(text: str) -> str:
    """
    Converts OCR homoglyph digits to letters in names (e.g. 'M0HAMMAD 1KH5AN' -> 'MOHAMMAD IKHSAN').
    """
    if not text:
        return ""
    return text.translate(DIGIT_TO_LETTER_MAP)


def clean_ocr_text(raw_text: str) -> str:
    """
    Bersihkan teks OCR mentah agar mudah dibaca:
    - Gabungkan karakter yang terpisah (misal "R E P U B L I K" → "REPUBLIK")
    - Hapus karakter noise (`, ~, ^, dll)
    - Normalisasi spasi berlebih
    - Pisahkan kalimat menjadi baris-baris yang logis
    """
    if not raw_text:
        return ""

    text = raw_text

    # 1. Gabungkan huruf-huruf yang terpisah spasi (OCR sering memisahkan karakter)
    text = re.sub(r'\b([A-Z0-9])\s(?=[A-Z0-9]\b)', r'\1', text)

    # 2. Bersihkan karakter noise umum dari OCR
    text = re.sub(r"[`~^*|\\]", " ", text)

    # 3. Normalisasi spasi berlebih
    text = re.sub(r' {2,}', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = text.strip()

    # 4. Bagi teks menjadi kalimat-kalimat bermakna berdasarkan kata kunci
    keywords = [
        "KEMENTERIAN", "IJAZAH", "MADRASAH", "TAHUN AJARAN", "No\\.", "Nomor",
        "Nama", "MURID", "Tempat", "lahir", "NISN", "NIS",
        "LULUS", "NILAI", "dari", "Satuan", "berdasarkan", "setelah",
        "Bogor", "Jakarta"
    ]
    pattern = r'(?<!\n)(?=' + '|'.join(keywords) + r')'
    text = re.sub(pattern, '\n', text)

    # 5. Bersihkan baris kosong ganda
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    text = '\n'.join(lines)

    return text


def perform_extraction(text: str) -> Dict[str, Any]:
    """
    Ekstrak field-field penting dari teks mentah hasil bacaan OCR.
    Field yang diekstrak sesuai kebutuhan tabel alumni di database:
    - namaLengkap  → alumni.nama_lengkap
    - nisn         → alumni.nisn
    - nis          → alumni.nis (Nomor Induk Siswa)
    - tempatLahir  → alumni.tempat_lahir
    - tanggalLahir → (untuk update alumni.tanggal_lahir)
    - tahunLulus   → alumni.tahun_lulus
    - nomorIjazah  → untuk referensi
    - namaSekolah  → nama madrasah penerbit
    - npsn         → Nomor Pokok Sekolah Nasional
    """
    extracted = {}

    # Normalisasi teks untuk parsing (hapus newline, normalize spasi)
    normalized = re.sub(r'\s+', ' ', text).strip()
    
    # Versi teks dengan normalisasi angka untuk NISN/NIS
    numeric_normalized = normalize_numeric_ocr(normalized)

    # ── 1. Nama Lengkap ────────────────────────────────────────────────────
    nama_patterns = [
        r'Nama\s*(?:Lengkap|Siswa|Peserta)?\s*[:\.\s]\s*([A-Z0-9][A-Za-z0-9\s\.\']{3,40}?)(?=\s+(?:Tempat|Lahir|Nomor|NISN|NIS|\n|$))',
        r'(?:menyatakan\s+bahwa|bahwa)\s*:\s*([A-Z0-9][A-Za-z0-9\s\.\']{3,40}?)(?=\s+(?:Tempat|Lahir|\n|$))',
        r'bahwa\s*:\s*\n?\s*([A-Z0-9][A-Z0-9\s]{3,40}?)(?=\s+Tempat|\s+lahir|\s+\n)',
    ]
    for pattern in nama_patterns:
        m = re.search(pattern, normalized, re.IGNORECASE)
        if m:
            raw_nama = m.group(1).strip()
            if len(raw_nama) <= 50 and not any(kw in raw_nama.upper() for kw in ['NOMOR', 'TAHUN', 'SEKOLAH', 'PENDIDIKAN']):
                # Bersihkan angka tertukar dalam nama (contoh: M0HAMMAD -> MOHAMMAD)
                cleaned_nama = normalize_text_ocr(raw_nama)
                extracted['namaLengkap'] = ' '.join(cleaned_nama.split()).title()
                break

    if 'namaLengkap' not in extracted:
        m = re.search(r'bahwa\s*:?\s*([A-Z0-9\s]{5,40?})\s+Tempat', normalized, re.IGNORECASE)
        if m:
            cleaned_nama = normalize_text_ocr(m.group(1))
            extracted['namaLengkap'] = ' '.join(cleaned_nama.split()).title()

    # ── 2. NISN (10 digit) ────────────────────────────────────────────────
    m = re.search(r'(?:NISN|Nomor\s+Induk\s+[Ss]iswa\s+[Nn]asional)\s*[-:.]?\s*([0-9OiIlLsSbB]{10})', normalized, re.IGNORECASE)
    if m:
        extracted['nisn'] = normalize_numeric_ocr(m.group(1))
    else:
        # Fallback pada numeric_normalized
        m_num = re.search(r'(?:NISN|Nomor\s+Induk\s+[Ss]iswa\s+[Nn]asional)\s*[-:.]?\s*(\d{10})', numeric_normalized, re.IGNORECASE)
        if m_num:
            extracted['nisn'] = m_num.group(1)

    # ── 3. NIS (Nomor Induk Siswa) ────────────────────────────────────────
    m = re.search(r'\bNIS\b\s*[-:.]?\s*([0-9OiIlLsSbB]{4,8})\b', normalized, re.IGNORECASE)
    if m:
        extracted['nis'] = normalize_numeric_ocr(m.group(1))

    # ── 4. Tempat Lahir ───────────────────────────────────────────────────
    m = re.search(
        r'(?:Tempat\s*(?:dan)?\s*[Tt]anggal\s*[Ll]ahir|lahir)\s*[-:.]?\s*([A-Za-z0-9\s\.]{3,25}?)\s*[,;]\s*(\d{1,2}\s+\w+\s+\d{4})',
        normalized, re.IGNORECASE
    )
    if m:
        cleaned_tempat = normalize_text_ocr(m.group(1).strip())
        extracted['tempatLahir'] = cleaned_tempat.title()
        extracted['tanggalLahir'] = m.group(2).strip()
    else:
        m = re.search(r'(?:Tempat|tempat)\s*lahir\s*[-:.]?\s*([A-Za-z0-9\s]{3,25}?)(?=[,;\n]|\d)', normalized, re.IGNORECASE)
        if m:
            cleaned_tempat = normalize_text_ocr(m.group(1).strip())
            extracted['tempatLahir'] = cleaned_tempat.title()

    # ── 5. Tahun Lulus ────────────────────────────────────────────────────
    m = re.search(r'[Tt]ahun\s*[Aa]jaran\s*(\d{4})/(\d{4})', numeric_normalized)
    if m:
        extracted['tahunLulus'] = int(m.group(2))
    else:
        m = re.search(r'[Tt]ahun\s*[Pp]elajaran\s*(?:\d{4}/)?(20\d{2})', numeric_normalized)
        if not m:
            m = re.search(r'[Tt]ahun\s*[Ll]ulus\s*[-:.]?\s*(20\d{2})', numeric_normalized)
        if m:
            try:
                extracted['tahunLulus'] = int(m.group(1))
            except ValueError:
                pass

    # ── 6. Nomor Ijazah ───────────────────────────────────────────────────
    m = re.search(r'[Nn]o\.?\s*[Ii]jazah\s*[-:.]?\s*([A-Za-z0-9\-/\.]{8,30})', normalized)
    if not m:
        m = re.search(r'(?:No|Nomor)\.\s*(?:Ijazah)?\s*:\s*([A-Za-z0-9\-]{8,30})', normalized)
    if m:
        extracted['nomorIjazah'] = m.group(1).strip()

    # ── 7. Nama Sekolah / Madrasah ────────────────────────────────────────
    m = re.search(r'(?:[Ss]atuan\s+[Pp]endidikan|dari\s+[Ss]atuan\s+[Pp]endidikan)\s+([A-Za-z0-9\s\'\.]{3,60}?)(?=\s+Nomor|\s+berdasarkan|\s*$|\s+\d)', normalized)
    if m:
        nama_sekolah = ' '.join(m.group(1).split()).strip()
        if nama_sekolah:
            extracted['namaSekolah'] = normalize_text_ocr(nama_sekolah)

    # ── 8. NPSN (Nomor Pokok Sekolah Nasional, 8 digit) ──────────────────
    m = re.search(r'(?:NPSN|[Nn]omor\s+[Pp]okok\s+[Ss]ekolah\s+[Nn]asional)\s*[-:.]?\s*([0-9OiIlLsSbB]{8})', normalized)
    if m:
        extracted['npsn'] = normalize_numeric_ocr(m.group(1))

    return extracted


def perform_extraction_raw(text: str) -> Dict[str, Any]:
    """
    Ekstrak field penting DENGAN teks mentah asli (sebelum homoglyph normalization)
    digunakan untuk komparasi 'Sebelum & Sesudah OCR'.
    """
    extracted = {}
    normalized = re.sub(r'\s+', ' ', text).strip()

    # 1. Nama Lengkap Mentah
    nama_patterns = [
        r'Nama\s*(?:Lengkap|Siswa|Peserta)?\s*[:\.\s]\s*([A-Z0-9][A-Za-z0-9\s\.\']{3,40}?)(?=\s+(?:Tempat|Lahir|Nomor|NISN|NIS|\n|$))',
        r'(?:menyatakan\s+bahwa|bahwa)\s*:\s*([A-Z0-9][A-Za-z0-9\s\.\']{3,40}?)(?=\s+(?:Tempat|Lahir|\n|$))',
        r'bahwa\s*:\s*\n?\s*([A-Z0-9][A-Z0-9\s]{3,40}?)(?=\s+Tempat|\s+lahir|\s+\n)',
    ]
    for pattern in nama_patterns:
        m = re.search(pattern, normalized, re.IGNORECASE)
        if m:
            raw_nama = m.group(1).strip()
            if len(raw_nama) <= 50 and not any(kw in raw_nama.upper() for kw in ['NOMOR', 'TAHUN', 'SEKOLAH', 'PENDIDIKAN']):
                extracted['namaLengkap'] = ' '.join(raw_nama.split())
                break

    # 2. NISN Mentah
    m = re.search(r'(?:NISN|Nomor\s+Induk\s+[Ss]iswa\s+[Nn]asional)\s*[-:.]?\s*([0-9OiIlLsSbB]{10})', normalized, re.IGNORECASE)
    if m:
        extracted['nisn'] = m.group(1)

    # 3. NIS Mentah
    m = re.search(r'\bNIS\b\s*[-:.]?\s*([0-9OiIlLsSbB]{4,8})\b', normalized, re.IGNORECASE)
    if m:
        extracted['nis'] = m.group(1)

    # 4. Tempat Lahir Mentah
    m = re.search(
        r'(?:Tempat\s*(?:dan)?\s*[Tt]anggal\s*[Ll]ahir|lahir)\s*[-:.]?\s*([A-Za-z0-9\s\.]{3,25}?)\s*[,;]\s*(\d{1,2}\s+\w+\s+\d{4})',
        normalized, re.IGNORECASE
    )
    if m:
        extracted['tempatLahir'] = m.group(1).strip()
        extracted['tanggalLahir'] = m.group(2).strip()

    return extracted

