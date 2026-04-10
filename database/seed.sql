-- Seed Data for Testing
-- Use for initial population of the database

-- 1. Users
INSERT INTO
    `users` (
        `username`,
        `password_hash`,
        `role`
    )
VALUES ('admin', 'admin123', 'Admin'),
    (
        'staff_tu',
        'staff123',
        'Staff'
    );

-- 2. Alumni
INSERT INTO
    `alumni` (
        `nisn`,
        `full_name`,
        `graduation_year`,
        `birth_date`,
        `address`
    )
VALUES (
        '0012345678',
        'Ahmad Dahlan',
        2020,
        '2005-08-01',
        'Jl. KH. Ahmad Dahlan No. 1, Yogyakarta'
    ),
    (
        '0012345679',
        'Hasyim Asyari',
        2019,
        '2004-02-14',
        'Jl. Tebuireng No. 5, Jombang'
    ),
    (
        '0012345680',
        'Raden Ajeng Kartini',
        2021,
        '2006-04-21',
        'Jl. Rembang No. 21, Jawa Tengah'
    ),
    (
        '0012345681',
        'Ki Hajar Dewantara',
        2020,
        '2005-05-02',
        'Jl. Taman Siswa No. 10, Yogyakarta'
    ),
    (
        '0012345682',
        'Cut Nyak Dien',
        2018,
        '2003-11-12',
        'Aceh Barat'
    );

-- 3. Archives (Simulated Uploads)
INSERT INTO
    `archives` (
        `alumni_id`,
        `file_path`,
        `file_type`,
        `uploaded_by`
    )
VALUES (
        1,
        'uploads/ijazah_ahmad.jpg',
        'JPG',
        1
    ),
    (
        2,
        'uploads/skhun_hasyim.pdf',
        'PDF',
        1
    ),
    (
        3,
        'uploads/rapor_kartini.png',
        'PNG',
        2
    );

-- 4. OCR Results (Simulated Extraction)
INSERT INTO
    `ocr_results` (
        `archive_id`,
        `extracted_text`,
        `confidence_score`,
        `status`
    )
VALUES (
        1,
        'NAMA: AHMAD DAHLAN\nNISN: 0012345678\nLULUS: 2020',
        95.5,
        'Completed'
    ),
    (
        2,
        'NAMA: HASYIM ASYARI\nNISN: 0012345679\nLULUS: 2019',
        88.2,
        'Completed'
    ),
    (
        3,
        'NAMA: R.A. KARTINI\nNISN: 0012345680',
        75.0,
        'Completed'
    );

-- 5. Search Logs
INSERT INTO
    `search_logs` (
        `user_id`,
        `query`,
        `results_count`,
        `execution_time_ms`
    )
VALUES (1, 'Ahmad', 1, 120),
    (1, 'Hasym', 1, 350), -- Typo search example
    (2, 'Kartini', 1, 105);