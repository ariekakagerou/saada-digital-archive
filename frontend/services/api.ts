const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5084/api";

export const uploadArchive = async (file: File, archiveType: string = "Ijazah") => {
  const formData = new FormData();
  formData.append("File", file);
  formData.append("JenisArsip", archiveType);

  const response = await fetch(`${API_BASE_URL}/archives/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Gagal mengunggah dokumen OCR");
  }

  return response.json();
};

export const searchAlumni = async (query: string) => {
  const response = await fetch(`${API_BASE_URL}/alumni/search?q=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    throw new Error("Gagal mencari data alumni");
  }

  const results = await response.json();
  return { data: results };
};

export const getBukuIndukList = async (pageSize = 1000) => {
  const response = await fetch(`${API_BASE_URL}/bukuinduk?pageSize=${pageSize}`);
  if (!response.ok) throw new Error("Gagal mengambil daftar buku induk");
  return response.json();
};

export const getAlumniDetail = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/alumni/${id}`);
  
  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    console.error(`API Error [${response.status}] for /alumni/${id}:`, errorBody);
    throw new Error(`Gagal mengambil detail alumni (Status: ${response.status})`);
  }

  return response.json(); // Akan mengembalikan JSON dengan { success: true, data: AlumniMappedDto }
};

export const createBukuInduk = async (payload: any) => {
  const response = await fetch(`${API_BASE_URL}/bukuinduk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Gagal menyimpan data ke Buku Induk");
  }

  return response.json();
};

export const saveAlumniToBukuInduk = createBukuInduk;

export const importBukuInduk = async (payload: any[]) => {
  const response = await fetch(`${API_BASE_URL}/bukuinduk/import`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Gagal mengimpor data ke Buku Induk");
  }

  return response.json();
};

export const getArchiveDetail = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/archives/${id}`);
  if (!response.ok) throw new Error("Gagal mengambil detail arsip");
  return response.json();
};
export const deleteBukuInduk = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/bukuinduk/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Gagal menghapus data buku induk");
  return response.json();
};

export const updateBukuInduk = async (id: number, payload: any) => {
  const response = await fetch(`${API_BASE_URL}/bukuinduk/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal memperbarui data buku induk");
  return response.json();
};

export const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) throw new Error("Gagal mengambil daftar pengguna");
  return response.json();
};

export const updateUser = async (id: number, payload: any) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal memperbarui data pengguna");
  return response.json();
};

export const deleteUser = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Gagal menghapus pengguna");
  return response.json();
};

export const getDashboardStats = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
  if (!response.ok) throw new Error("Gagal mengambil statistik dashboard");
  return response.json();
};

export const getLogs = async () => {
  const response = await fetch(`${API_BASE_URL}/logs`);
  if (!response.ok) throw new Error("Gagal mengambil histori log");
  return response.json();
};

export const clearLogs = async () => {
  const response = await fetch(`${API_BASE_URL}/logs/clear`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Gagal menghapus log");
  return response.json();
};

export const createLog = async (payload: { namaPengguna: string; aksi: string; targetObjek: string }) => {
  const response = await fetch(`${API_BASE_URL}/logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal menyimpan log");
  return response.json();
};

export const getArchives = async (category?: string) => {
  const url = category 
    ? `${API_BASE_URL}/archives?jenis=${encodeURIComponent(category)}`
    : `${API_BASE_URL}/archives`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Gagal mengambil daftar arsip");
  return response.json();
};

export const deleteArchive = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/archives/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Gagal menghapus arsip fisik");
  return response.json();
};
