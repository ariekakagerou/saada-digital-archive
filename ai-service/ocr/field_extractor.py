import re
from typing import Dict, Any

def perform_extraction(text: str) -> Dict[str, Any]:
    """
    Ekstrak field-field penting (seperti Nama, NISN, Tahun, Ijazah) 
    dari teks mentah hasil bacaan OCR Ijazah/SKHU.
    """
    extracted = {}
    
    # 1. Bersihkan spasial liar agar aman
    normalized_text = re.sub(r'\s+', ' ', text)
    
    # 2. Ekstraksi NISN (Pencarian 10 Angka persis di sekitar kata NISN)
    nisn_match = re.search(r'NISN\s*[:;\-\.]?\s*(\d{10})', normalized_text, re.IGNORECASE)
    if nisn_match:
        extracted['nisn'] = nisn_match.group(1).strip()
        
    # 3. Ekstraksi NIS (Lebih pendek dari NISN)
    nis_match = re.search(r'NIS\s*[:;\-\.]?\s*([0-9]{4,6})\b(?!0)', normalized_text, re.IGNORECASE)
    if nis_match:
        extracted['nis'] = nis_match.group(1).strip()
        
    # 4. Nama Lengkap (Biasanya ditulis kapital setelah "Nama Siswa" atau "Nama")
    # Cara cerdas: Ambil kapital yang mengikuti kata 'Nama' sampai berhenti pada kata-kata non-nama
    nama_match = re.search(r'Nama\s*(?:Lengkap|Siswa)?\s*[:;]\s*([A-Z\s\.,\'`]{3,40})(?=\s+(?:Tempat|Lahir|Nomor|NIS|Tahun))', normalized_text, re.IGNORECASE)
    if not nama_match:
        # Fallback jika barisnya terpisah
        nama_match = re.search(r'Nama\s*[:;]\s*([A-Za-z\s\.,]{3,40})(?=\s+[A-Z][a-z]|\Z)', normalized_text, re.IGNORECASE)
        
    if nama_match:
        # Membantu mematikan huruf besar berlebihan
        extracted['namaLengkap'] = nama_match.group(1).title().strip()
        
    # 5. Tempat dan Tanggal Lahir
    ttl_match = re.search(r'(?:Tempat\s*,?\s*dan\s*Tanggal\s*Lahir|Lahir)\s*[:;]?\s*([A-Za-z\s\.]+,\s*\d{1,2}\s*[A-Za-z]+\s*\d{4})', normalized_text, re.IGNORECASE)
    if ttl_match:
        raw_ttl = ttl_match.group(1).strip()
        parts = raw_ttl.split(',')
        if len(parts) >= 2:
            extracted['tempatLahir'] = parts[0].strip()
            extracted['tanggalLahir'] = parts[1].strip()
            
    # 6. Tahun Lulus
    tahun_match = re.search(r'Tahun(?:.*?)Lulus(?:.*?)\s*(\d{4})', normalized_text, re.IGNORECASE)
    if not tahun_match:
         tahun_match = re.search(r'Tahun\s*(?:Pelajaran)?\s*[:;]?\s*(?:20\d{2}/)?(20\d{2})', normalized_text, re.IGNORECASE)
    if tahun_match:
        try:
            extracted['tahunLulus'] = int(tahun_match.group(1))
        except ValueError:
            pass
            
    # 7. Nomor Ijazah (Mengenali pola DN-xx/x/xxxx/xxxx atau pola gabungan panjang huruf+angka)
    ijazah_match = re.search(r'Nomor(?:.*?)(?:Ijazah)?\s*[:;]?\s*([A-Za-z0-9\-/\.]{10,30})', normalized_text, re.IGNORECASE)
    if ijazah_match and "SKHUN" not in ijazah_match.group(1).upper():
        extracted['nomorIjazah'] = ijazah_match.group(1).strip()
        
    # 8. Nomor SKHUN
    skhun_match = re.search(r'Nomor(?:.*?)SKHUN\s*[:;]?\s*([A-Za-z0-9\-/\.]{10,30})', normalized_text, re.IGNORECASE)
    if skhun_match:
         extracted['nomorSkhun'] = skhun_match.group(1).strip()
        
    return extracted
