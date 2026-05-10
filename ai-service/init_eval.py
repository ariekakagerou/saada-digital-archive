import os

def init_eval_structure():
    base = "eval_data"
    folders = ["images", "ground_truth", "results"]
    
    print(f"Initializing {base} structure...")
    for folder in folders:
        path = os.path.join(base, folder)
        if not os.path.exists(path):
            os.makedirs(path)
            print(f"Created: {path}")
        else:
            print(f"Exists: {path}")
            
    # Create a README for instructions
    readme_content = """# Evaluasi Akurasi OCR (Skripsi)

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
"""
    
    with open(os.path.join(base, "README_EVAL.md"), "w", encoding="utf-8") as f:
        f.write(readme_content)
    
    print("\nInitialization Complete! Please follow the instructions in eval_data/README_EVAL.md")

if __name__ == "__main__":
    init_eval_structure()
