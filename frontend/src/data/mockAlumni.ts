/**
 * ============================================================
 * MOCK DATA: ALUMNI SMART ARCHIVE
 * Madrasah Tsanawiyah (MTs)
 * ============================================================
 * Data simulasi berdasarkan Buku Induk Siswa MTs
 * untuk development dan testing sistem
 * ============================================================
 */

import { Alumni, AlumniListItem, ArsipDokumen, OrangTua, DataMasuk, RiwayatAkademik } from '../types/alumni.types';

// ========================================
// MOCK DATA: ALUMNI LENGKAP
// ========================================

export const mockAlumniLengkap: Alumni[] = [
    {
        id: 1,
        // Identitas Pribadi
        namaLengkap: "Ahmad Faisal",
        nis: "12345678",
        nisn: "0012345678",
        tempatLahir: "Bogor",
        tanggalLahir: "2005-02-10",
        jenisKelamin: "L",
        agama: "Islam",
        kewarganegaraan: "Indonesia",
        anakKe: 2,
        jumlahSaudara: 3,

        // Data Kelulusan
        tahunLulus: 2024,
        nomorIjazah: "DN-05-7/MTs/001/2024",
        nomorSkl: "DN-SKL/MTs/001/2024",
        tanggalKelulusan: "2024-06-15",
        statusKelulusan: "Lulus",
        nilaiAkhir: 88.5,
        rataRata: 87.3,

        // Data Administratif
        nomorHalamanBukuInduk: "001/2024",
        tanggalPencatatan: "2024-06-20",
        namaKepalaSekolah: "Drs. H. Abdullah, M.Pd.I",

        // Metadata
        createdAt: "2024-06-20T10:00:00Z",
        updatedAt: "2024-06-20T10:00:00Z",
    },
    {
        id: 2,
        namaLengkap: "Siti Aminah",
        nis: "21001",
        nisn: "0021001234",
        tempatLahir: "Surabaya",
        tanggalLahir: "2006-05-15",
        jenisKelamin: "P",
        agama: "Islam",
        kewarganegaraan: "Indonesia",
        anakKe: 1,
        jumlahSaudara: 2,

        tahunLulus: 2023,
        nomorIjazah: "DN-05-7/MTs/045/2023",
        nomorSkl: "DN-SKL/MTs/045/2023",
        tanggalKelulusan: "2023-06-10",
        statusKelulusan: "Lulus",
        nilaiAkhir: 92.0,
        rataRata: 90.5,

        nomorHalamanBukuInduk: "045/2023",
        tanggalPencatatan: "2023-06-15",
        namaKepalaSekolah: "Drs. H. Abdullah, M.Pd.I",

        createdAt: "2023-06-15T10:00:00Z",
        updatedAt: "2023-06-15T10:00:00Z",
    },
    {
        id: 3,
        namaLengkap: "Budi Santoso",
        nis: "21002",
        nisn: "0021002345",
        tempatLahir: "Bogor",
        tanggalLahir: "2006-08-20",
        jenisKelamin: "L",
        agama: "Islam",
        kewarganegaraan: "Indonesia",
        anakKe: 3,
        jumlahSaudara: 4,

        tahunLulus: 2023,
        nomorIjazah: "DN-05-7/MTs/046/2023",
        nomorSkl: "DN-SKL/MTs/046/2023",
        tanggalKelulusan: "2023-06-10",
        statusKelulusan: "Lulus",
        nilaiAkhir: 85.5,
        rataRata: 84.0,

        nomorHalamanBukuInduk: "046/2023",
        tanggalPencatatan: "2023-06-15",
        namaKepalaSekolah: "Drs. H. Abdullah, M.Pd.I",

        createdAt: "2023-06-15T10:00:00Z",
        updatedAt: "2023-06-15T10:00:00Z",
    },
];

// ========================================
// MOCK DATA: ORANG TUA
// ========================================

export const mockOrangTua: OrangTua[] = [
    {
        id: 1,
        alumniId: 1,
        namaAyah: "Faisal Rahman",
        pekerjaanAyah: "Wiraswasta",
        namaIbu: "Siti Khadijah",
        pekerjaanIbu: "Ibu Rumah Tangga",
        alamat: "Jl. Merdeka No. 123, Bogor",
        nomorKontak: "081234567890",
    },
    {
        id: 2,
        alumniId: 2,
        namaAyah: "Ahmad Yusuf",
        pekerjaanAyah: "PNS",
        namaIbu: "Fatimah Zahra",
        pekerjaanIbu: "Guru",
        alamat: "Jl. Pahlawan No. 45, Surabaya",
        nomorKontak: "082345678901",
    },
    {
        id: 3,
        alumniId: 3,
        namaAyah: "Santoso Wijaya",
        pekerjaanAyah: "Petani",
        namaIbu: "Dewi Lestari",
        pekerjaanIbu: "Pedagang",
        alamat: "Jl. Raya Desa No. 78, Bogor",
        nomorKontak: "083456789012",
    },
];

// ========================================
// MOCK DATA: DATA MASUK
// ========================================

export const mockDataMasuk: DataMasuk[] = [
    {
        id: 1,
        alumniId: 1,
        asalSekolah: "SD Negeri 1 Bogor",
        tanggalMasuk: "2021-07-15",
        kelasAwal: "VII",
        tahunAjaranMasuk: "2021/2022",
        nomorIndukSekolah: "001/VII/2021",
    },
    {
        id: 2,
        alumniId: 2,
        asalSekolah: "SD Muhammadiyah Surabaya",
        tanggalMasuk: "2020-07-13",
        kelasAwal: "VII",
        tahunAjaranMasuk: "2020/2021",
        nomorIndukSekolah: "045/VII/2020",
    },
    {
        id: 3,
        alumniId: 3,
        asalSekolah: "SD Negeri 3 Bogor",
        tanggalMasuk: "2020-07-13",
        kelasAwal: "VII",
        tahunAjaranMasuk: "2020/2021",
        nomorIndukSekolah: "046/VII/2020",
    },
];

// ========================================
// MOCK DATA: RIWAYAT AKADEMIK
// ========================================

export const mockRiwayatAkademik: RiwayatAkademik[] = [
    // Ahmad Faisal
    {
        id: 1,
        alumniId: 1,
        tingkatKelas: "VII",
        tahunAjaran: "2021/2022",
        keterangan: "Naik",
        catatanPrestasi: "Juara 1 Lomba Matematika Tingkat Kota",
    },
    {
        id: 2,
        alumniId: 1,
        tingkatKelas: "VIII",
        tahunAjaran: "2022/2023",
        keterangan: "Naik",
        catatanPrestasi: "Juara 2 Olimpiade Sains Nasional",
    },
    {
        id: 3,
        alumniId: 1,
        tingkatKelas: "IX",
        tahunAjaran: "2023/2024",
        keterangan: "Naik",
        catatanPrestasi: "Lulus dengan predikat Terbaik",
    },

    // Siti Aminah
    {
        id: 4,
        alumniId: 2,
        tingkatKelas: "VII",
        tahunAjaran: "2020/2021",
        keterangan: "Naik",
    },
    {
        id: 5,
        alumniId: 2,
        tingkatKelas: "VIII",
        tahunAjaran: "2021/2022",
        keterangan: "Naik",
        catatanPrestasi: "Juara 1 Lomba Pidato Bahasa Arab",
    },
    {
        id: 6,
        alumniId: 2,
        tingkatKelas: "IX",
        tahunAjaran: "2022/2023",
        keterangan: "Naik",
    },
];

// ========================================
// MOCK DATA: ARSIP DOKUMEN
// ========================================

export const mockArsipDokumen: ArsipDokumen[] = [
    {
        id: 1,
        alumniId: 1,
        jenisDokumen: "Ijazah",
        namaFile: "ijazah_ahmad_faisal_2024.jpg",
        pathFile: "/uploads/ijazah/2024/ahmad_faisal.jpg",
        pathFileProcessed: "/uploads/processed/ijazah/2024/ahmad_faisal_processed.jpg",
        ukuranFile: 2048000,
        formatFile: "jpg",
        ocrText: "IJAZAH\\nNama: Ahmad Faisal\\nNIS: 12345678\\nNISN: 0012345678\\nTahun Lulus: 2024",
        ocrConfidence: 87.5,
        ocrProcessedAt: "2024-06-20T11:00:00Z",
        statusArsip: "Lengkap",
        uploadedBy: 1,
        uploadedAt: "2024-06-20T10:30:00Z",
    },
    {
        id: 2,
        alumniId: 1,
        jenisDokumen: "SKL (Surat Keterangan Lulus)",
        namaFile: "skl_ahmad_faisal_2024.jpg",
        pathFile: "/uploads/skl/2024/ahmad_faisal.jpg",
        ukuranFile: 1536000,
        formatFile: "jpg",
        ocrText: "SURAT KETERANGAN LULUS\\nNama: Ahmad Faisal\\nNIS: 12345678",
        ocrConfidence: 85.0,
        statusArsip: "Lengkap",
        uploadedBy: 1,
        uploadedAt: "2024-06-20T10:35:00Z",
    },
    {
        id: 3,
        alumniId: 2,
        jenisDokumen: "Ijazah",
        namaFile: "ijazah_siti_aminah_2023.jpg",
        pathFile: "/uploads/ijazah/2023/siti_aminah.jpg",
        ukuranFile: 2200000,
        formatFile: "jpg",
        ocrText: "IJAZAH\\nNama: Siti Aminah\\nNIS: 21001\\nNISN: 0021001234\\nTahun Lulus: 2023",
        ocrConfidence: 92.0,
        statusArsip: "Lengkap",
        uploadedBy: 1,
        uploadedAt: "2023-06-15T10:30:00Z",
    },
];

// ========================================
// MOCK DATA: ALUMNI LIST (untuk UI)
// ========================================

export const mockAlumniList: AlumniListItem[] = [
    {
        id: 1,
        namaLengkap: "Ahmad Faisal",
        nis: "12345678",
        nisn: "0012345678",
        tahunLulus: 2024,
        kelas: "9A",
        jenisDokumen: "Ijazah",
        statusArsip: "Lengkap",
        statusColor: "#15803d",
        statusBg: "#dcfce7",
    },
    {
        id: 2,
        namaLengkap: "Siti Aminah",
        nis: "21001",
        nisn: "0021001234",
        tahunLulus: 2023,
        kelas: "9A",
        jenisDokumen: "Ijazah",
        statusArsip: "Lengkap",
        statusColor: "#15803d",
        statusBg: "#dcfce7",
    },
    {
        id: 3,
        namaLengkap: "Budi Santoso",
        nis: "21002",
        nisn: "0021002345",
        tahunLulus: 2023,
        kelas: "9B",
        jenisDokumen: "SKL (Surat Keterangan Lulus)",
        statusArsip: "Lengkap",
        statusColor: "#15803d",
        statusBg: "#dcfce7",
    },
    {
        id: 4,
        namaLengkap: "Dewi Lestari",
        nis: "21003",
        nisn: "0021003456",
        tahunLulus: 2022,
        kelas: "9A",
        jenisDokumen: "Transkrip",
        statusArsip: "Belum Lengkap",
        statusColor: "#ca8a04",
        statusBg: "#fef9c3",
    },
    {
        id: 5,
        namaLengkap: "Rizky Ramadhan",
        nis: "21004",
        nisn: "0021004567",
        tahunLulus: 2024,
        kelas: "9C",
        jenisDokumen: "Rapor",
        statusArsip: "Lengkap",
        statusColor: "#15803d",
        statusBg: "#dcfce7",
    },
    {
        id: 6,
        namaLengkap: "Doni Kurniawan",
        nis: "21005",
        nisn: "0021005678",
        tahunLulus: 2021,
        kelas: "9B",
        jenisDokumen: "Ijazah",
        statusArsip: "Arsip Hilang",
        statusColor: "#991b1b",
        statusBg: "#fee2e2",
    },
    {
        id: 7,
        namaLengkap: "Fajar Nugraha",
        nis: "21006",
        nisn: "0021006789",
        tahunLulus: 2023,
        kelas: "9A",
        jenisDokumen: "SKL (Surat Keterangan Lulus)",
        statusArsip: "Lengkap",
        statusColor: "#15803d",
        statusBg: "#dcfce7",
    },
    {
        id: 8,
        namaLengkap: "Gita Pertiwi",
        nis: "21007",
        nisn: "0021007890",
        tahunLulus: 2022,
        kelas: "9C",
        jenisDokumen: "Transkrip",
        statusArsip: "Belum Lengkap",
        statusColor: "#ca8a04",
        statusBg: "#fef9c3",
    },
    {
        id: 9,
        namaLengkap: "Hendra Wijaya",
        nis: "21008",
        nisn: "0021008901",
        tahunLulus: 2024,
        kelas: "9B",
        jenisDokumen: "Rapor",
        statusArsip: "Lengkap",
        statusColor: "#15803d",
        statusBg: "#dcfce7",
    },
    {
        id: 10,
        namaLengkap: "Indah Sari",
        nis: "21009",
        nisn: "0021009012",
        tahunLulus: 2021,
        kelas: "9A",
        jenisDokumen: "Ijazah",
        statusArsip: "Arsip Hilang",
        statusColor: "#991b1b",
        statusBg: "#fee2e2",
    },
    {
        id: 11,
        namaLengkap: "Joko Anwar",
        nis: "21010",
        nisn: "0021010123",
        tahunLulus: 2023,
        kelas: "9B",
        jenisDokumen: "SKL (Surat Keterangan Lulus)",
        statusArsip: "Lengkap",
        statusColor: "#15803d",
        statusBg: "#dcfce7",
    },
    {
        id: 12,
        namaLengkap: "Kartika Putri",
        nis: "21011",
        nisn: "0021011234",
        tahunLulus: 2022,
        kelas: "9C",
        jenisDokumen: "Transkrip",
        statusArsip: "Lengkap",
        statusColor: "#15803d",
        statusBg: "#dcfce7",
    },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get alumni by ID
 */
export function getAlumniById(id: number): Alumni | undefined {
    return mockAlumniLengkap.find(a => a.id === id);
}

/**
 * Get orang tua by alumni ID
 */
export function getOrangTuaByAlumniId(alumniId: number): OrangTua | undefined {
    return mockOrangTua.find(ot => ot.alumniId === alumniId);
}

/**
 * Get data masuk by alumni ID
 */
export function getDataMasukByAlumniId(alumniId: number): DataMasuk | undefined {
    return mockDataMasuk.find(dm => dm.alumniId === alumniId);
}

/**
 * Get riwayat akademik by alumni ID
 */
export function getRiwayatAkademikByAlumniId(alumniId: number): RiwayatAkademik[] {
    return mockRiwayatAkademik.filter(ra => ra.alumniId === alumniId);
}

/**
 * Get arsip dokumen by alumni ID
 */
export function getArsipDokumenByAlumniId(alumniId: number): ArsipDokumen[] {
    return mockArsipDokumen.filter(ad => ad.alumniId === alumniId);
}

/**
 * Get complete alumni data with relations
 */
export function getCompleteAlumniData(id: number): Alumni | undefined {
    const alumni = getAlumniById(id);
    if (!alumni) return undefined;

    return {
        ...alumni,
        orangTua: getOrangTuaByAlumniId(id),
        dataMasuk: getDataMasukByAlumniId(id),
        riwayatAkademik: getRiwayatAkademikByAlumniId(id),
        arsipDokumen: getArsipDokumenByAlumniId(id),
    };
}

/**
 * Search alumni by keyword
 */
export function searchAlumni(keyword: string): AlumniListItem[] {
    const lowerKeyword = keyword.toLowerCase();
    return mockAlumniList.filter(alumni =>
        alumni.namaLengkap.toLowerCase().includes(lowerKeyword) ||
        alumni.nis.includes(keyword) ||
        alumni.nisn?.includes(keyword)
    );
}

/**
 * Filter alumni by tahun lulus
 */
export function filterByTahunLulus(tahunLulus: number): AlumniListItem[] {
    return mockAlumniList.filter(alumni => alumni.tahunLulus === tahunLulus);
}

/**
 * Get statistik per tahun
 */
export function getStatistikPerTahun() {
    const grouped = mockAlumniList.reduce((acc, alumni) => {
        const year = alumni.tahunLulus;
        if (!acc[year]) {
            acc[year] = {
                tahunLulus: year,
                totalAlumni: 0,
                totalLengkap: 0,
                totalBelumLengkap: 0,
                totalHilang: 0,
            };
        }
        acc[year].totalAlumni++;
        if (alumni.statusArsip === 'Lengkap') acc[year].totalLengkap++;
        if (alumni.statusArsip === 'Belum Lengkap') acc[year].totalBelumLengkap++;
        if (alumni.statusArsip === 'Arsip Hilang') acc[year].totalHilang++;
        return acc;
    }, {} as Record<number, any>);

    return Object.values(grouped).sort((a: any, b: any) => b.tahunLulus - a.tahunLulus);
}
