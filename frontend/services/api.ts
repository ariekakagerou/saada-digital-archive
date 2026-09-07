const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:5084/api`;
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5084/api";
};
const API_BASE_URL = getApiBaseUrl();

// ── Helper: Ambil token dari localStorage ──────────────────────────────────
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.token ?? null;
  } catch {
    return null;
  }
}

// ── Helper: Buat header dengan Authorization Bearer token ──────────────────
function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getAuthToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * 🛡️ Global Fetch Wrapper (Interceptor)
 * Fungsi ini membungkus fetch standar untuk menangani error autentikasi (401)
 * secara global di seluruh aplikasi.
 */
async function saadaFetch(url: string, options: RequestInit = {}) {
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (err: any) {
    if (err?.name === "TypeError" || err?.message === "Failed to fetch" || err?.message?.includes("fetch")) {
      throw new Error("Gagal terhubung ke server backend. Pastikan server (saada-backend) aktif.");
    }
    throw err;
  }

  if (response.status === 401) {
    console.warn(`[Auth Warning] 401 Unauthorized for URL: ${url}`);
    if (typeof window !== "undefined" && window.location.pathname !== "/login" && !url.includes("/auth/")) {
      const token = getAuthToken();
      if (!token) {
        localStorage.removeItem("user");
        document.cookie = "saada_token=; path=/; max-age=0; SameSite=Strict";
        window.location.href = "/login?error=session_expired";
      }
    }
  }

  return response;
}

// ── Helper: Logout — hapus semua sesi ─────────────────────────────────────
export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
  document.cookie = "saada_token=; path=/; max-age=0; SameSite=Strict";
  window.location.href = "/login";
}

// ── Helper: Cek apakah user sudah login ───────────────────────────────────
export function isLoggedIn(): boolean {
  return getAuthToken() !== null;
}

// ── Helper: Ambil data user dari localStorage ──────────────────────────────
export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ARCHIVES
// ═══════════════════════════════════════════════════════════════════════════

export const uploadArchive = async (file: File, archiveType: string = "Ijazah") => {
  const formData = new FormData();
  formData.append("File", file);
  formData.append("JenisArsip", archiveType);

  const response = await saadaFetch(`${API_BASE_URL}/archives/upload`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!response.ok) throw new Error("Gagal mengunggah dokumen OCR");
  return response.json();
};

export const getArchives = async (category?: string) => {
  const url = category
    ? `${API_BASE_URL}/archives?jenis=${encodeURIComponent(category)}`
    : `${API_BASE_URL}/archives`;
  const response = await saadaFetch(url, { headers: authHeaders() });
  if (!response.ok) throw new Error("Gagal mengambil daftar arsip");
  return response.json();
};

export const getArchiveDetail = async (id: number) => {
  const response = await saadaFetch(`${API_BASE_URL}/archives/${id}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil detail arsip");
  return response.json();
};

export const deleteArchive = async (id: number) => {
  const response = await saadaFetch(`${API_BASE_URL}/archives/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal menghapus arsip fisik");
  return response.json();
};

export const rescanArchive = async (id: number) => {
  // EasyOCR butuh waktu lama (1-3 menit) di CPU — set timeout 5 menit
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000);

  try {
    const response = await saadaFetch(`${API_BASE_URL}/archives/${id}/rescan`, {
      method: "POST",
      headers: authHeaders(),
      signal: controller.signal,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Gagal melakukan scan ulang arsip");
    }
    return response.json();
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("Timeout: Proses OCR terlalu lama. Pastikan AI Service berjalan dan coba lagi.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const updateOcrText = async (ocrId: number, extractedText: string) => {
  const response = await saadaFetch(`${API_BASE_URL}/ocr/${ocrId}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ extractedText }),
  });
  if (!response.ok) throw new Error("Gagal menyimpan koreksi OCR");
  return response.json();
};

export const getKategoriArsip = async () => {
  const response = await saadaFetch(`${API_BASE_URL}/kategoriarsip`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil kategori arsip");
  return response.json();
};

// ═══════════════════════════════════════════════════════════════════════════
// ALUMNI
// ═══════════════════════════════════════════════════════════════════════════

export const searchAlumni = async (query: string) => {
  const response = await saadaFetch(
    `${API_BASE_URL}/alumni/search?q=${encodeURIComponent(query)}`,
    { headers: authHeaders() }
  );
  if (!response.ok) throw new Error("Gagal mencari data alumni");
  const results = await response.json();
  return { data: results };
};

export const getAlumniDetail = async (id: number | string) => {
  const response = await saadaFetch(`${API_BASE_URL}/alumni/${id}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil detail alumni (Status: ${response.status})`);
  }

  return response.json();
};

export const updateAlumni = async (id: number | string, payload: any) => {
  const response = await saadaFetch(`${API_BASE_URL}/alumni/${id}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal memperbarui data alumni");
  return response.json();
};

export const deleteAlumni = async (id: number | string) => {
  const response = await saadaFetch(`${API_BASE_URL}/alumni/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal menghapus data alumni");
  return response.json();
};


// ═══════════════════════════════════════════════════════════════════════════
// TRACER STUDY
// ═══════════════════════════════════════════════════════════════════════════

export const getTracerStudy = async () => {
  const response = await saadaFetch(`${API_BASE_URL}/tracerstudy`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil data tracer study");
  return response.json();
};

export const getTracerStudyByAlumni = async (alumniId: number) => {
  const response = await saadaFetch(`${API_BASE_URL}/tracerstudy/alumni/${alumniId}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil data tracer study alumni");
  return response.json();
};

export const createTracerStudy = async (payload: any) => {
  const response = await saadaFetch(`${API_BASE_URL}/tracerstudy`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal mengirim data tracer study");
  return response.json();
};

export const updateTracerStudy = async (id: number, payload: any) => {
  const response = await saadaFetch(`${API_BASE_URL}/tracerstudy/${id}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal memperbarui data tracer study");
  return response.json();
};

export const deleteTracerStudy = async (id: number) => {
  const response = await saadaFetch(`${API_BASE_URL}/tracerstudy/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal menghapus data tracer study");
  return response.json();
};

// ═══════════════════════════════════════════════════════════════════════════
// PERMOHONAN DOKUMEN (DOCUMENT REQUEST)
// ═══════════════════════════════════════════════════════════════════════════

export const getPermohonanDokumen = async () => {
  const response = await saadaFetch(`${API_BASE_URL}/permohonandokumen`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil daftar permohonan dokumen");
  return response.json();
};

export const createPermohonanDokumen = async (payload: any) => {
  const response = await saadaFetch(`${API_BASE_URL}/permohonandokumen`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal mengirim permohonan dokumen");
  return response.json();
};

export const updatePermohonanStatus = async (id: number, status: string) => {
  const response = await saadaFetch(`${API_BASE_URL}/permohonandokumen/${id}/status`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Gagal memperbarui status permohonan");
  return response.json();
};

export const deletePermohonanDokumen = async (id: number) => {
  const response = await saadaFetch(`${API_BASE_URL}/permohonandokumen/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal menghapus permohonan dokumen");
  return response.json();
};

// ═══════════════════════════════════════════════════════════════════════════
// BUKU INDUK
// ═══════════════════════════════════════════════════════════════════════════

export const getBukuIndukList = async (pageSize = 1000) => {
  const response = await saadaFetch(`${API_BASE_URL}/bukuinduk?pageSize=${pageSize}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil daftar buku induk");
  return response.json();
};

export const createBukuInduk = async (payload: any) => {
  const response = await saadaFetch(`${API_BASE_URL}/bukuinduk`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal menyimpan data ke Buku Induk");
  return response.json();
};

export const updateBukuInduk = async (id: number, payload: any) => {
  const response = await saadaFetch(`${API_BASE_URL}/bukuinduk/${id}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal memperbarui data buku induk");
  return response.json();
};

export const importBukuInduk = async (payload: any[]) => {
  const response = await saadaFetch(`${API_BASE_URL}/bukuinduk/import`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal mengimpor data buku induk");
  return response.json();
};

export const deleteBukuInduk = async (id: number) => {
  const response = await saadaFetch(`${API_BASE_URL}/bukuinduk/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal menghapus data buku induk");
  return response.json();
};

export const getBukuIndukDetail = async (id: number) => {
  const response = await saadaFetch(`${API_BASE_URL}/bukuinduk/${id}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil detail data buku induk");
  return response.json();
};


// ═══════════════════════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════════════════════

export const getUsers = async () => {
  const response = await saadaFetch(`${API_BASE_URL}/users`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil daftar pengguna");
  return response.json();
};

export const updateUser = async (id: number, payload: any) => {
  const response = await saadaFetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal memperbarui data pengguna");
  return response.json();
};

export const deleteUser = async (id: number) => {
  const response = await saadaFetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal menghapus pengguna");
  return response.json();
};

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD & LOGS
// ═══════════════════════════════════════════════════════════════════════════

export const getDashboardStats = async () => {
  const response = await saadaFetch(`${API_BASE_URL}/dashboard/stats`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil statistik dashboard");
  return response.json();
};

export const getLogs = async () => {
  const response = await saadaFetch(`${API_BASE_URL}/logs`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil histori log");
  return response.json();
};

export const clearLogs = async () => {
  const response = await saadaFetch(`${API_BASE_URL}/logs/clear`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal menghapus log");
  return response.json();
};

export const createLog = async (payload: any) => {
  const response = await saadaFetch(`${API_BASE_URL}/logs`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal menyimpan log");
  return response.json();
};

// ═══════════════════════════════════════════════════════════════════════════
// MATA PELAJARAN
// ═══════════════════════════════════════════════════════════════════════════

export const getMataPelajaran = async (kategori?: string) => {
  const url = kategori
    ? `${API_BASE_URL}/matapelajaran?kategori=${encodeURIComponent(kategori)}`
    : `${API_BASE_URL}/matapelajaran`;
  const response = await saadaFetch(url, { headers: authHeaders() });
  if (!response.ok) throw new Error("Gagal mengambil data mata pelajaran");
  return response.json();
};

// ═══════════════════════════════════════════════════════════════════════════
// DETAIL IJAZAH (DATA AKADEMIK)
// ═══════════════════════════════════════════════════════════════════════════

export const getDetailIjazahByAlumni = async (alumniId: number) => {
  const response = await saadaFetch(`${API_BASE_URL}/detailijazah/alumni/${alumniId}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil data detail ijazah");
  return response.json();
};

export const getDetailIjazahList = async (search?: string) => {
  const url = search 
    ? `${API_BASE_URL}/detailijazah?search=${encodeURIComponent(search)}`
    : `${API_BASE_URL}/detailijazah`;
  const response = await saadaFetch(url, { headers: authHeaders() });
  if (!response.ok) throw new Error("Gagal mengambil daftar detail ijazah");
  return response.json();
};

export const saveDetailIjazah = async (payload: any) => {
  const response = await saadaFetch(`${API_BASE_URL}/detailijazah`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Gagal menyimpan detail ijazah");
  }
  return response.json();
};

export const updateDetailIjazah = async (id: number, payload: any) => {
  const response = await saadaFetch(`${API_BASE_URL}/detailijazah/${id}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Gagal memperbarui detail ijazah");
  }
  return response.json();
};

export const deleteDetailIjazah = async (id: number) => {
  const response = await saadaFetch(`${API_BASE_URL}/detailijazah/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal menghapus detail ijazah");
  return response.json();
};

// ═══════════════════════════════════════════════════════════════════════════
// DETAIL SKL (DATA AKADEMIK)
// ═══════════════════════════════════════════════════════════════════════════

export const getDetailSklByAlumni = async (alumniId: number) => {
  const response = await saadaFetch(`${API_BASE_URL}/detailskl/alumni/${alumniId}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil data detail SKL");
  return response.json();
};

export const getDetailSklList = async (search?: string) => {
  const url = search 
    ? `${API_BASE_URL}/detailskl?search=${encodeURIComponent(search)}`
    : `${API_BASE_URL}/detailskl`;
  const response = await saadaFetch(url, { headers: authHeaders() });
  if (!response.ok) throw new Error("Gagal mengambil daftar detail SKL");
  return response.json();
};

export const saveDetailSkl = async (payload: any) => {
  const response = await saadaFetch(`${API_BASE_URL}/detailskl`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Gagal menyimpan detail SKL");
  }
  return response.json();
};

export const updateDetailSkl = async (id: number, payload: any) => {
  const response = await saadaFetch(`${API_BASE_URL}/detailskl/${id}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Gagal memperbarui detail SKL");
  }
  return response.json();
};

export const deleteDetailSkl = async (id: number) => {
  const response = await saadaFetch(`${API_BASE_URL}/detailskl/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal menghapus detail SKL");
  return response.json();
};

// ═══════════════════════════════════════════════════════════════════════════
// LEGGER TAMBAHAN
// ═══════════════════════════════════════════════════════════════════════════

export const getLeggerTambahan = async (nilaiSemesterId: number) => {
  const response = await saadaFetch(`${API_BASE_URL}/bukuinduk/legger/${nilaiSemesterId}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil data legger tambahan");
  return response.json();
};

export const upsertLeggerTambahan = async (payload: any) => {
  const response = await saadaFetch(`${API_BASE_URL}/bukuinduk/legger`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal menyimpan data legger tambahan");
  return response.json();
};

// ═══════════════════════════════════════════════════════════════════════════
// ALUMNI PORTAL (ROLE ALUMNI)
// ═══════════════════════════════════════════════════════════════════════════

export const registerAlumni = async (payload: any) => {
  const response = await fetch(`${API_BASE_URL}/auth/register-alumni`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || "Gagal melakukan pendaftaran akun Alumni");
  }
  return response.json();
};

export const getAlumniPortalMe = async () => {
  const response = await saadaFetch(`${API_BASE_URL}/alumni-portal/me`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil data profil alumni");
  return response.json();
};

export const getAlumniPortalDashboard = async () => {
  const response = await saadaFetch(`${API_BASE_URL}/alumni-portal/dashboard`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil statistik dashboard alumni");
  return response.json();
};

export const getAlumniPortalDocuments = async () => {
  const response = await saadaFetch(`${API_BASE_URL}/alumni-portal/my-documents`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil dokumen pribadi alumni");
  return response.json();
};

export const getAlumniPortalRequests = async () => {
  const response = await saadaFetch(`${API_BASE_URL}/alumni-portal/my-requests`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil riwayat permohonan alumni");
  return response.json();
};

export const createAlumniDocumentRequest = async (payload: any) => {
  const response = await saadaFetch(`${API_BASE_URL}/alumni-portal/request-document`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || "Gagal mengajukan permohonan dokumen");
  }
  return response.json();
};

export const getAlumniPortalTracer = async () => {
  const response = await saadaFetch(`${API_BASE_URL}/alumni-portal/my-tracer`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil data tracer study alumni");
  return response.json();
};

export const saveAlumniPortalTracer = async (payload: any) => {
  const response = await saadaFetch(`${API_BASE_URL}/alumni-portal/my-tracer`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal menyimpan data tracer study");
  return response.json();
};


