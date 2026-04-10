# Diagram Alur Pengenalan Kemiripan Teks (Fuzzy Matching)

Dokumen ini menjelaskan logika pencarian data alumni yang toleran terhadap kesalahan pengetikan (*typo*) menggunakan algoritma *Levenshtein Distance*.

## Diagram Logika Pencarian

```mermaid
sequenceDiagram
    participant User as Staf Admin
    participant BE as Backend API
    participant DB as Database
    participant AI as AI Service (Fuzzy)

    User->>BE: Request GET /search?q="Ahmd Dalan"
    BE->>DB: Mengambil seluruh Nama Alumni (Candidates)
    DB-->>BE: List [Ahmad Dahlan, Hasyim Asyari, ...]
    
    BE->>AI: POST /fuzzy-search (Query + Candidates)
    
    Note over AI: Hitung Levenshtein Ratio
    loop Untuk setiap kandidat
        AI->>AI: Calculate Distance("Ahmd Dalan", Candidate)
        AI->>AI: Convert to Similarity Score (0-100)
    end
    
    AI->>AI: Filter Score >= 60 (Threshold)
    AI->>AI: Sort by Score Descending
    
    AI-->>BE: Return Top 10 Matches
    BE-->>User: Tampilkan Hasil Pencarian
```

## Metode Ilmiah: Levenshtein Distance

Pencarian *fuzzy* didasarkan pada perhitungan jumlah operasi minimum yang diperlukan untuk mengubah satu string ($s_1$) menjadi string lain ($s_2$). Operasi yang diizinkan adalah:
1. **Insertion** (Penyisipan karakter)
2. **Deletion** (Penghapusan karakter)
3. **Substitution** (Penggantian karakter)

### Implementasi Sistem
Sistem menggunakan pustaka **RapidFuzz** (implementasi C++ dari algoritma Levenshtein yang dioptimalkan untuk Python).

**Rumus Similarity Ratio:**
$$
Ratio = \frac{(|s_1| + |s_2|) - Distance}{|s_1| + |s_2|} \times 100
$$

### Contoh Kasus
- **Query**: "Ahmd"
- **Target**: "Ahmad"
- **Jarak (Distance)**: 1 (Menyisipkan 'a')
- **Skor Kemiripan**: Tinggi (>90%) -> Ditampilkan sebagai hasil paling relevan.

Fitur ini mengatasi masalah umum pada pencarian manual database SQL (yang biasanya menggunakan operator `LIKE %...%`) yang tidak dapat menangani *typo*.
