from rapidfuzz import process, fuzz, utils

candidates = [
    "Muhamad Indra",
    "Ahmad Fauzi",
    "Siti Aminah",
    "Citra Kirana",
    "Ahmad Faisal"
]

queries = [
    "Mhammad Indra",   # Typo
    "Indra Muhamad",   # Reversed word order
    "Muh Indra",       # Abbreviation
    "Siti Amnh"        # Missing characters / Typo
]

print("=== DEMO PENCARIAN CERDAS (FUZZY MATCHING) ===")
print(f"Daftar Alumni di Database (Kandidat): {candidates}\n")

for q in queries:
    print(f"Kata Kunci Pencarian: '{q}'")
    results = process.extract(
        q, 
        candidates, 
        scorer=fuzz.WRatio, 
        processor=utils.default_process,
        limit=3,
        score_cutoff=50
    )
    for match, score, index in results:
        match_type = "Exact Match" if score == 100 else "Fuzzy Match"
        print(f"  -> Cocok dengan: '{match}' | Skor Kemiripan: {score:.1f}% | Jenis: {match_type}")
    print("-" * 50)
