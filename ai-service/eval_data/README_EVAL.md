# Evaluasi Akurasi OCR (Skripsi)

Folder ini digunakan untuk menghitung nilai CER (Character Error Rate) secara otomatis.

## Cara Menggunakan:
1. Masukkan gambar dokumen (ijazah/buku induk) ke folder `images/`.
   Contoh: `maba_001.jpg`
2. Masukkan teks asli (ground truth) ke folder `ground_truth/` dengan nama file yang sama.
   Contoh: `maba_001.txt`
3. Jalankan script evaluasi:
   ```bash
   python eval_engine.py
   ```
4. Hasil laporan akan muncul di folder `results/` dalam format CSV dan JSON.

## Metrik yang dihitung:
- **CER**: Character Error Rate (Semakin rendah semakin baik).
- **Accuracy**: Persentase ketepatan karakter.
- **Processing Time**: Kecepatan sistem mengolah satu dokumen.
- **Substitutions/Deletions/Insertions**: Detail jenis kesalahan.
