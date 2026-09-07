-- ============================================================
-- MIGRASI PASSWORD: Plain Text → BCrypt Hash
-- ============================================================
-- Jalankan SETELAH backend diupdate dengan BCrypt.
-- Ganti nilai hash di bawah sesuai password masing-masing user.
--
-- Cara generate hash BCrypt:
--   1. Buka endpoint sementara: POST /api/auth/hash-password
--   2. Kirim body: { "password": "passwordmu" }
--   3. Copy hash yang dikembalikan, paste ke sini
-- ============================================================

-- Contoh: Update semua user dengan password default "admin123"
-- UPDATE pengguna 
-- SET kata_sandi = '$2a$11$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
-- WHERE peran = 'Admin';

-- Cek user yang masih plain text (tidak diawali $2a$ atau $2b$):
SELECT id, nama_pengguna, peran, 
       CASE 
           WHEN kata_sandi LIKE '$2a$%' OR kata_sandi LIKE '$2b$%' 
           THEN 'SUDAH HASH ✓' 
           ELSE 'MASIH PLAIN TEXT ⚠' 
       END AS status_password
FROM pengguna;
