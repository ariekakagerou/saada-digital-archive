/**
 * ============================================================
 * TYPESCRIPT INTERFACES: ALUMNI SMART ARCHIVE
 * Madrasah Tsanawiyah (MTs)
 * ============================================================
 * Type definitions berdasarkan Buku Induk Siswa MTs
 * untuk sistem digitalisasi arsip alumni berbasis OCR
 * ============================================================
 */

// ========================================
// 1. IDENTITAS PRIBADI SISWA
// ========================================
export interface IdentitasSiswa {
    namaLengkap: string;
    nis: string;
    nisn?: string;
    tempatLahir?: string;
    tanggalLahir?: Date | string;
    jenisKelamin: 'L' | 'P';
    agama?: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';
    kewarganegaraan?: string;
    anakKe?: number;
    jumlahSaudara?: number;
}

// ========================================
// 2. DATA ORANG TUA / WALI
// ========================================
export interface OrangTua {
    id?: number;
    alumniId: number;
    namaAyah?: string;
    pekerjaanAyah?: string;
    namaIbu?: string;
    pekerjaanIbu?: string;
    alamat?: string;
    nomorKontak?: string;
}

// ========================================
// 3. DATA AWAL MASUK SEKOLAH
// ========================================
export interface DataMasuk {
    id?: number;
    alumniId: number;
    asalSekolah?: string;
    tanggalMasuk?: Date | string;
    kelasAwal?: string;
    tahunAjaranMasuk?: string;
    nomorIndukSekolah?: string;
}

// ========================================
// 4. RIWAYAT AKADEMIK
// ========================================
export interface RiwayatAkademik {
    id?: number;
    alumniId: number;
    tingkatKelas: 'VII' | 'VIII' | 'IX';
    tahunAjaran: string;
    keterangan: 'Naik' | 'Tinggal' | 'Pindah';
    catatanPrestasi?: string;
}

// ========================================
// 5. DATA KELULUSAN / ALUMNI (PRIORITAS)
// ========================================
export interface DataKelulusan {
    tahunLulus: number;
    nomorIjazah?: string;
    nomorSkl?: string;
    tanggalKelulusan?: Date | string;
    statusKelulusan: 'Lulus' | 'Tidak Lulus' | 'Mengulang';
    nilaiAkhir?: number;
    rataRata?: number;
}

// ========================================
// 6. DATA MUTASI (OPSIONAL)
// ========================================
export interface Mutasi {
    id?: number;
    alumniId: number;
    jenisMutasi: 'Masuk' | 'Keluar';
    tanggalMutasi: Date | string;
    sekolahAsalTujuan?: string;
    alasanMutasi?: string;
}

// ========================================
// 7. DATA ADMINISTRATIF
// ========================================
export interface DataAdministratif {
    nomorHalamanBukuInduk?: string;
    tanggalPencatatan?: Date | string;
    namaKepalaSekolah?: string;
}

// ========================================
// ARSIP DOKUMEN
// ========================================
export interface ArsipDokumen {
    id?: number;
    alumniId: number;
    jenisDokumen: 'Ijazah' | 'SKL (Surat Keterangan Lulus)' | 'Rapor' | 'Transkrip' | 'Sertifikat' | 'Lainnya';
    namaFile: string;
    pathFile: string;
    pathFileProcessed?: string;
    ukuranFile?: number;
    formatFile?: string;

    // OCR Data
    ocrText?: string;
    ocrConfidence?: number;
    ocrProcessedAt?: Date | string;

    // Status
    statusArsip: 'Lengkap' | 'Belum Lengkap' | 'Arsip Hilang' | 'Rusak';
    keterangan?: string;

    // Metadata
    uploadedBy?: number;
    uploadedAt?: Date | string;
    updatedAt?: Date | string;
}

// ========================================
// ALUMNI (COMPLETE MODEL)
// ========================================
export interface Alumni extends IdentitasSiswa, DataKelulusan, DataAdministratif {
    id?: number;

    // Relasi
    orangTua?: OrangTua;
    dataMasuk?: DataMasuk;
    riwayatAkademik?: RiwayatAkademik[];
    mutasi?: Mutasi[];
    arsipDokumen?: ArsipDokumen[];

    // Metadata
    createdAt?: Date | string;
    updatedAt?: Date | string;
    createdBy?: number;
    updatedBy?: number;
}

// ========================================
// VIEW MODELS (untuk UI)
// ========================================

/**
 * Model untuk tampilan list alumni (tabel/card)
 */
export interface AlumniListItem {
    id: number;
    namaLengkap: string;
    nis: string;
    nisn?: string;
    tahunLulus: number;
    kelas?: string;
    jenisDokumen?: string;
    statusArsip: 'Lengkap' | 'Belum Lengkap' | 'Arsip Hilang' | 'Rusak';
    statusColor: string;
    statusBg: string;
}

/**
 * Model untuk detail alumni (halaman detail)
 */
export interface AlumniDetail extends Alumni {
    // Computed fields
    umur?: number;
    lamaStudi?: number;

    // Statistik
    jumlahDokumen?: number;
    jenisDokumenTersedia?: string[];
}

/**
 * Model untuk pencarian alumni
 */
export interface AlumniSearchParams {
    keyword?: string;
    tahunLulus?: number;
    jenisDokumen?: string;
    statusArsip?: string;
    jenisKelamin?: 'L' | 'P';
    page?: number;
    limit?: number;
}

/**
 * Response pencarian alumni
 */
export interface AlumniSearchResponse {
    data: AlumniListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ========================================
// OCR MODELS
// ========================================

/**
 * Request OCR processing
 */
export interface OCRRequest {
    file: File | Blob;
    jenisDokumen: string;
    alumniId?: number;
}

/**
 * Response OCR processing
 */
export interface OCRResponse {
    text: string;
    confidence: number;
    extractedData?: {
        namaLengkap?: string;
        nis?: string;
        nisn?: string;
        tahunLulus?: number;
        nomorIjazah?: string;
        tempatLahir?: string;
        tanggalLahir?: string;
    };
    enhancementMetrics?: {
        skewAngle?: number;
        enhancementApplied?: boolean;
    };
}

/**
 * CER/WER Calculation Request
 */
export interface CERRequest {
    reference: string;
    hypothesis: string;
}

/**
 * CER/WER Calculation Response
 */
export interface CERResponse {
    cer: number;
    accuracy: number;
    metrics: {
        cer?: number;
        wer?: number;
        accuracy: number;
        editDistance: number;
        referenceLength?: number;
        hypothesisLength?: number;
        referenceWords?: number;
        hypothesisWords?: number;
        operations: {
            substitutions: number;
            deletions: number;
            insertions: number;
            totalErrors: number;
        };
    };
}

// ========================================
// FUZZY SEARCH MODELS
// ========================================

/**
 * Fuzzy search request
 */
export interface FuzzySearchRequest {
    query: string;
    candidates: string[];
    threshold?: number;
}

/**
 * Fuzzy search result item
 */
export interface FuzzySearchResult {
    text: string;
    score: number;
    matchType: 'Exact' | 'Fuzzy';
}

/**
 * Fuzzy search response
 */
export interface FuzzySearchResponse {
    query: string;
    results: FuzzySearchResult[];
}

// ========================================
// USER & AUTH MODELS
// ========================================

export interface User {
    id: number;
    username: string;
    namaLengkap: string;
    email?: string;
    role: 'Admin' | 'Petugas' | 'Viewer';
    isActive: boolean;
    lastLogin?: Date | string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
    expiresIn: number;
}

// ========================================
// AUDIT LOG MODELS
// ========================================

export interface RiwayatPerubahan {
    id: number;
    tableName: string;
    recordId: number;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    oldData?: any;
    newData?: any;
    changedBy?: number;
    changedAt: Date | string;
}

// ========================================
// STATISTICS MODELS
// ========================================

export interface StatistikTahun {
    tahunLulus: number;
    totalAlumni: number;
    totalLakiLaki: number;
    totalPerempuan: number;
    rataRataNilai: number;
    totalDokumen: number;
}

export interface StatistikDashboard {
    totalAlumni: number;
    totalDokumen: number;
    totalDokumenLengkap: number;
    totalDokumenBelumLengkap: number;
    totalDokumenHilang: number;
    statistikPerTahun: StatistikTahun[];
    alumniTerbaru: AlumniListItem[];
}

// ========================================
// FORM MODELS
// ========================================

/**
 * Form untuk input alumni baru
 */
export interface AlumniFormData {
    // Identitas
    namaLengkap: string;
    nis: string;
    nisn?: string;
    tempatLahir?: string;
    tanggalLahir?: string;
    jenisKelamin: 'L' | 'P';
    agama?: string;

    // Kelulusan
    tahunLulus: number;
    nomorIjazah?: string;
    nomorSkl?: string;

    // Orang Tua
    namaAyah?: string;
    namaIbu?: string;
    alamat?: string;

    // Dokumen
    dokumen?: File[];
}

/**
 * Form untuk edit OCR result
 */
export interface OCREditFormData {
    ocrText: string;
    extractedFields: {
        [key: string]: string;
    };
}

// ========================================
// API RESPONSE WRAPPER
// ========================================

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}

export interface PaginatedResponse<T = any> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// ========================================
// CONSTANTS & ENUMS
// ========================================

export const JENIS_KELAMIN = {
    LAKI_LAKI: 'L',
    PEREMPUAN: 'P'
} as const;

export const AGAMA = {
    ISLAM: 'Islam',
    KRISTEN: 'Kristen',
    KATOLIK: 'Katolik',
    HINDU: 'Hindu',
    BUDDHA: 'Buddha',
    KONGHUCU: 'Konghucu'
} as const;

export const JENIS_DOKUMEN = {
    IJAZAH: 'Ijazah',
    SKL: 'SKL (Surat Keterangan Lulus)',
    RAPOR: 'Rapor',
    TRANSKRIP: 'Transkrip',
    SERTIFIKAT: 'Sertifikat',
    LAINNYA: 'Lainnya'
} as const;

export const STATUS_ARSIP = {
    LENGKAP: 'Lengkap',
    BELUM_LENGKAP: 'Belum Lengkap',
    ARSIP_HILANG: 'Arsip Hilang',
    RUSAK: 'Rusak'
} as const;

export const TINGKAT_KELAS = {
    VII: 'VII',
    VIII: 'VIII',
    IX: 'IX'
} as const;

export const USER_ROLE = {
    ADMIN: 'Admin',
    PETUGAS: 'Petugas',
    VIEWER: 'Viewer'
} as const;

// ========================================
// TYPE GUARDS
// ========================================

export function isAlumni(obj: any): obj is Alumni {
    return obj && typeof obj.namaLengkap === 'string' && typeof obj.nis === 'string';
}

export function isArsipDokumen(obj: any): obj is ArsipDokumen {
    return obj && typeof obj.jenisDokumen === 'string' && typeof obj.pathFile === 'string';
}

// ========================================
// UTILITY TYPES
// ========================================

/**
 * Make all properties optional except specified keys
 */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Alumni dengan field wajib saja
 */
export type AlumniRequired = PartialExcept<Alumni, 'namaLengkap' | 'nis' | 'jenisKelamin' | 'tahunLulus'>;

/**
 * Arsip dokumen untuk upload
 */
export type ArsipDokumenUpload = Omit<ArsipDokumen, 'id' | 'uploadedAt' | 'updatedAt'>;
