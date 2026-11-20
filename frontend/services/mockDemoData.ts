/**
 * Mock Data & Demo Handler untuk Deployment Portofolio (Vercel)
 * Berfungsi sebagai fallback cerdas saat backend .NET tidak dihosting,
 * sehingga reviewer HRD / Tech Lead dapat menjelajahi seluruh UI tanpa hambatan.
 */

export const MOCK_DASHBOARD_STATS = {
  totalArsip: 1420,
  totalAlumni: 1280,
  totalBukuInduk: 1280,
  totalPetugas: 6,
  ocrCount: 842,
  arsipBurukCount: 12,
  ijazahCount: 1280,
  progressPerTahun: [
    { tahun: 2020, jumlah: 210 },
    { tahun: 2021, jumlah: 245 },
    { tahun: 2022, jumlah: 260 },
    { tahun: 2023, jumlah: 275 },
    { tahun: 2024, jumlah: 290 }
  ]
};

export const MOCK_BUKU_INDUK_LIST = [
  {
    id: 1,
    namaLengkap: "Ahmad Faisal",
    nis: "12345678",
    nisn: "0012345678",
    tempatLahir: "Bogor",
    tanggalLahir: "2005-02-10",
    jenisKelamin: "L",
    tahunLulus: 2024,
    nomorIjazah: "DN-05-7/MTs/001/2024",
    statusKelulusan: "Lulus",
    nilaiAkhir: 88.5,
    rataRata: 87.3,
    nomorHalamanBukuInduk: "001/2024",
    statusVerifikasi: "Terverifikasi"
  },
  {
    id: 2,
    namaLengkap: "Siti Aminah",
    nis: "21001",
    nisn: "0021001234",
    tempatLahir: "Surabaya",
    tanggalLahir: "2006-05-15",
    jenisKelamin: "P",
    tahunLulus: 2024,
    nomorIjazah: "DN-05-7/MTs/002/2024",
    statusKelulusan: "Lulus",
    nilaiAkhir: 92.0,
    rataRata: 90.5,
    nomorHalamanBukuInduk: "002/2024",
    statusVerifikasi: "Terverifikasi"
  },
  {
    id: 3,
    namaLengkap: "Budi Santoso",
    nis: "21002",
    nisn: "0021001235",
    tempatLahir: "Jakarta",
    tanggalLahir: "2005-11-20",
    jenisKelamin: "L",
    tahunLulus: 2023,
    nomorIjazah: "DN-05-7/MTs/045/2023",
    statusKelulusan: "Lulus",
    nilaiAkhir: 86.5,
    rataRata: 85.0,
    nomorHalamanBukuInduk: "045/2023",
    statusVerifikasi: "Terverifikasi"
  },
  {
    id: 4,
    namaLengkap: "Dewi Lestari",
    nis: "21003",
    nisn: "0021001236",
    tempatLahir: "Bandung",
    tanggalLahir: "2006-01-30",
    jenisKelamin: "P",
    tahunLulus: 2023,
    nomorIjazah: "DN-05-7/MTs/046/2023",
    statusKelulusan: "Lulus",
    nilaiAkhir: 94.0,
    rataRata: 92.8,
    nomorHalamanBukuInduk: "046/2023",
    statusVerifikasi: "Terverifikasi"
  },
  {
    id: 5,
    namaLengkap: "Rizky Ramadhan",
    nis: "21004",
    nisn: "0021001237",
    tempatLahir: "Bogor",
    tanggalLahir: "2005-09-12",
    jenisKelamin: "L",
    tahunLulus: 2022,
    nomorIjazah: "DN-05-7/MTs/089/2022",
    statusKelulusan: "Lulus",
    nilaiAkhir: 85.0,
    rataRata: 84.2,
    nomorHalamanBukuInduk: "089/2022",
    statusVerifikasi: "Terverifikasi"
  }
];

export const MOCK_ARCHIVES_LIST = [
  {
    id: 1,
    namaDokumen: "Ijazah_Ahmad_Faisal_2024.pdf",
    namaPemilik: "Ahmad Faisal",
    jenisDokumen: "Ijazah",
    tahunLulus: 2024,
    nomorDokumen: "DN-05-7/MTs/001/2024",
    ukuranFile: "2.4 MB",
    kondisiFisik: "Baik",
    akurasiOcr: 98.5,
    statusVerifikasi: "Verified",
    createdAt: "2024-06-21T08:30:00Z"
  },
  {
    id: 2,
    namaDokumen: "SKL_Siti_Aminah_2024.pdf",
    namaPemilik: "Siti Aminah",
    jenisDokumen: "SKL",
    tahunLulus: 2024,
    nomorDokumen: "DN-SKL/MTs/002/2024",
    ukuranFile: "1.8 MB",
    kondisiFisik: "Baik",
    akurasiOcr: 99.1,
    statusVerifikasi: "Verified",
    createdAt: "2024-06-21T09:15:00Z"
  },
  {
    id: 3,
    namaDokumen: "Transkrip_Budi_Santoso_2023.pdf",
    namaPemilik: "Budi Santoso",
    jenisDokumen: "Transkrip Nilai",
    tahunLulus: 2023,
    nomorDokumen: "TR/MTs/045/2023",
    ukuranFile: "3.1 MB",
    kondisiFisik: "Cukup",
    akurasiOcr: 96.2,
    statusVerifikasi: "Verified",
    createdAt: "2023-06-25T11:00:00Z"
  }
];

export const MOCK_TRACER_STUDY = {
  success: true,
  data: [
    {
      id: 1,
      alumniId: 1,
      namaAlumni: "Ahmad Faisal",
      tahunLulus: 2024,
      statusSaatIni: "Melanjutkan Studi",
      namaInstitusi: "MAN 1 Bogor",
      jurusan: "IPA",
      relevansiPendidikan: "Sangat Relevan",
      kepuasanFasilitas: "Puas",
      catatanMasukan: "Sistem arsip digital sangat mempermudah legalisir ijazah."
    },
    {
      id: 2,
      alumniId: 2,
      namaAlumni: "Siti Aminah",
      tahunLulus: 2024,
      statusSaatIni: "Melanjutkan Studi",
      namaInstitusi: "SMA Negeri 1 Sukaraja",
      jurusan: "MIPA",
      relevansiPendidikan: "Sangat Relevan",
      kepuasanFasilitas: "Sangat Puas",
      catatanMasukan: "Sangat bangga dengan inovasi digital MTs Assaadah."
    },
    {
      id: 3,
      alumniId: 3,
      namaAlumni: "Budi Santoso",
      tahunLulus: 2023,
      statusSaatIni: "Bekerja",
      namaInstitusi: "PT Teknologi Berkah Mandiri",
      jurusan: "IT Support Staff",
      relevansiPendidikan: "Relevan",
      kepuasanFasilitas: "Puas",
      catatanMasukan: "Pengalaman di madrasah sangat membentuk karakter disiplin."
    }
  ]
};

export const MOCK_LOGS = [
  {
    id: 1,
    action: "OCR Recognition",
    user: "Admin",
    details: "Sukses mengekstrak 14 entri teks dari Ijazah_Ahmad_Faisal.pdf (Akurasi: 98.5%)",
    timestamp: "10 menit yang lalu"
  },
  {
    id: 2,
    action: "Verifikasi Buku Induk",
    user: "Petugas TU",
    details: "Data alumni Siti Aminah (NIS: 21001) berhasil divalidasi dengan Buku Induk",
    timestamp: "25 menit yang lalu"
  },
  {
    id: 3,
    action: "Fuzzy Search Query",
    user: "Guest Reviewer",
    details: "Pencarian cerdas 'Ahmad Faizal' berhasil mencocokkan 'Ahmad Faisal' (Distance: 1)",
    timestamp: "1 jam yang lalu"
  }
];

export function getMockResponseForUrl(url: string, method: string = "GET"): any {
  const cleanUrl = url.toLowerCase();

  if (method !== "GET") {
    return {
      success: true,
      message: "Operasi simulasi berhasil (Mode Demo Portofolio)",
      data: { id: Date.now() }
    };
  }

  if (cleanUrl.includes("/dashboard/stats")) {
    return MOCK_DASHBOARD_STATS;
  }
  if (cleanUrl.includes("/bukuinduk") || cleanUrl.includes("/alumni")) {
    return {
      success: true,
      data: MOCK_BUKU_INDUK_LIST,
      total: MOCK_BUKU_INDUK_LIST.length
    };
  }
  if (cleanUrl.includes("/archives")) {
    return MOCK_ARCHIVES_LIST;
  }
  if (cleanUrl.includes("/tracerstudy")) {
    return MOCK_TRACER_STUDY;
  }
  if (cleanUrl.includes("/logs")) {
    return MOCK_LOGS;
  }
  if (cleanUrl.includes("/alumni-portal/dashboard")) {
    return {
      totalArchives: 2,
      totalRequests: 1,
      pendingRequests: 0,
      hasTracerStudy: true,
      archives: MOCK_ARCHIVES_LIST.slice(0, 2)
    };
  }
  if (cleanUrl.includes("/alumni-portal/me")) {
    return MOCK_BUKU_INDUK_LIST[0];
  }
  if (cleanUrl.includes("/alumni-portal/my-tracer")) {
    return MOCK_TRACER_STUDY.data[0];
  }
  if (cleanUrl.includes("/alumni-portal/my-documents")) {
    return MOCK_ARCHIVES_LIST.slice(0, 2);
  }
  if (cleanUrl.includes("/alumni-portal/my-requests")) {
    return [
      {
        id: 1,
        jenisDokumen: "Legalisir Ijazah",
        keperluan: "Pendaftaran Kuliah",
        status: "Selesai",
        createdAt: "2024-07-01T10:00:00Z"
      }
    ];
  }

  return { success: true, data: [] };
}
