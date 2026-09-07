import sys
from fuzzy.levenshtein import perform_fuzzy_search, normalize_ocr_homoglyphs
from ocr.field_extractor import perform_extraction, normalize_numeric_ocr, normalize_text_ocr

def test_fuzzy_ocr_confusion():
    print("=== TEST 1: FUZZY SEARCH DENGAN KESALAHAN OCR ANGKA <-> HURUF ===")
    candidates = [
        "Muhammad Ikhsan",
        "Ahmad Fauzi",
        "Siti Aminah",
        "Budi Santoso"
    ]

    test_queries = [
        "M0HAMMAD 1KH5AN",  # 0 -> O, 1 -> I, 5 -> S
        "AHMAD F4UZI",      # 4 -> A
        "5ITI AM1NAH",      # 5 -> S, 1 -> I
        "BUD1 5ANT050"      # 1 -> I, 5 -> S, 0 -> O
    ]

    for q in test_queries:
        res = perform_fuzzy_search(q, candidates, threshold=65)
        print(f"Query: '{q}'")
        if res:
            top = res[0]
            print(f"  -> Best Match: '{top['text']}' | Score: {top['score']}% | Match Type: {top['match_type']}")
        else:
            print("  -> NO MATCH FOUND")
        print("-" * 50)


def test_ocr_field_extraction():
    print("\n=== TEST 2: EKSTRAKSI FIELD DENGAN OCR HOMOGLYPH NORMALIZATION ===")
    sample_raw_ocr = """
    KEMENTERIAN AGAMA REPUBLIK INDONESIA
    IJAZAH MADRASAH ALIYAH TAHUN AJARAN 2023/2024
    
    Yang bertanda tangan di bawah ini menyatakan bahwa:
    Nama: M0HAMMAD 1KH5AN
    Tempat dan Tanggal Lahir: J4K4RT4, 15 Mei 2005
    NISN: O01234567I
    NIS: O12345
    dari Satuan Pendidikan: MAS ASSAADAH
    """

    extracted = perform_extraction(sample_raw_ocr)
    print("Hasil Ekstraksi:")
    for k, v in extracted.items():
        print(f"  - {k}: {v}")

    # Assertions
    assert extracted.get("namaLengkap") == "Mohammad Ikhsan", f"Expected 'Mohammad Ikhsan', got '{extracted.get('namaLengkap')}'"
    assert extracted.get("nisn") == "0012345671", f"Expected '0012345671', got '{extracted.get('nisn')}'"
    assert extracted.get("nis") == "012345", f"Expected '012345', got '{extracted.get('nis')}'"
    print("\n[SUCCESS] Semua Pengujian Berhasil Passed Cleanly!")

if __name__ == "__main__":
    test_fuzzy_ocr_confusion()
    test_ocr_field_extraction()
