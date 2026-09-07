"use client";

import AdminLayout from "../../../components/AdminLayout";
import Link from "next/link";
import { Search, Filter, Eye, ChevronLeft, ChevronRight, FileText, X, Edit2, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import * as api from "../../../services/api";
import "./alumni-responsive.css";

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => (1980 + i).toString()).reverse();


export default function AlumniPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedArchiveType, setSelectedArchiveType] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string>("");
    const itemsPerPage = 5;

    const [stats, setStats] = useState({
        ijazahCount: 0,
        skhuCount: 0,
        transkripCount: 0,
        raporCount: 0,
        bukuIndukDocCount: 0
    });

    // Edit/Delete Modal States
    const [editingRecord, setEditingRecord] = useState<any | null>(null);
    const [deletingRecord, setDeletingRecord] = useState<any | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

    // Form data for edit
    const [formData, setFormData] = useState({
        namaLengkap: "",
        nis: "",
        nisn: "",
        jenisKelamin: "L",
        tempatLahir: "",
        tanggalLahir: "",
        agama: "Islam",
        kewarganegaraan: "WNI",
        namaAyah: "",
        namaIbu: "",
        pekerjaanAyah: "",
        pekerjaanIbu: "",
        alamatOrangTua: "",
        noHpWali: "",
        tahunMasuk: "",
        asalSekolah: "",
        kelasMasuk: "",
        tahunLulus: "",
        nomorIjazah: "",
        nomorSkhun: "",
        statusSiswa: "Lulus",
        statusArsip: "Lengkap"
    });

    const showToastNotification = (message: string, type: "success" | "error" | "info" = "success") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const triggerEdit = async (id: number) => {
        setIsLoadingDetail(true);
        try {
            const res = await api.getAlumniDetail(id);
            if (res.data) {
                const db = res.data;
                setEditingRecord(db);
                setFormData({
                    namaLengkap: db.namaLengkap || "",
                    nis: db.nis || "",
                    nisn: db.nisn || "",
                    jenisKelamin: db.jenisKelamin || "L",
                    tempatLahir: db.tempatLahir || "",
                    tanggalLahir: db.tanggalLahir ? new Date(db.tanggalLahir).toISOString().split('T')[0] : "",
                    agama: db.agama || "Islam",
                    kewarganegaraan: db.kewarganegaraan || "WNI",
                    namaAyah: db.orangTua?.namaAyah || "",
                    namaIbu: db.orangTua?.namaIbu || "",
                    pekerjaanAyah: db.orangTua?.pekerjaanAyah || "",
                    pekerjaanIbu: db.orangTua?.pekerjaanIbu || "",
                    alamatOrangTua: db.orangTua?.alamat || "",
                    noHpWali: db.orangTua?.nomorKontak || "",
                    tahunMasuk: db.dataMasuk?.tahunAjaranMasuk || "",
                    asalSekolah: db.dataMasuk?.asalSekolah || "",
                    kelasMasuk: db.dataMasuk?.kelasAwal || "",
                    tahunLulus: db.tahunLulus ? db.tahunLulus.toString() : "",
                    nomorIjazah: db.nomorIjazah || "",
                    nomorSkhun: db.nomorSkhun || "",
                    statusSiswa: db.statusSiswa || "Lulus",
                    statusArsip: db.statusArsip || "Lengkap"
                });
            } else {
                showToastNotification("Gagal memuat detail data alumni", "error");
            }
        } catch (err: any) {
            showToastNotification(err.message || "Gagal memuat data", "error");
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRecord) return;
        setIsSaving(true);
        try {
            await api.updateAlumni(editingRecord.id, formData);
            setEditingRecord(null);
            showToastNotification("✅ Data alumni berhasil diperbarui!", "success");
            
            if (hasSearched) {
                handleSearch();
            }
            fetchLatest();
        } catch (err: any) {
            showToastNotification(err.message || "Gagal memperbarui data", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const triggerDelete = (item: any) => {
        setDeletingRecord(item);
    };

    const handleConfirmDelete = async () => {
        if (!deletingRecord) return;
        setIsDeleting(true);
        try {
            await api.deleteAlumni(deletingRecord.id);
            setDeletingRecord(null);
            showToastNotification("🗑️ Data alumni berhasil dihapus!", "success");
            
            if (hasSearched) {
                handleSearch();
            }
            fetchLatest();
        } catch (err: any) {
            showToastNotification(err.message || "Gagal menghapus data", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getDashboardStats();
                setStats({
                    ijazahCount: data.ijazahCount || 0,
                    skhuCount: data.skhuCount || 0,
                    transkripCount: data.transkripCount || 0,
                    raporCount: data.raporCount || 0,
                    bukuIndukDocCount: data.totalBukuInduk || 0,
                });
            } catch (error) {
                console.error("Failed to fetch archive stats:", error);
            }
        };
        fetchStats();
    }, []);

    const [results, setResults] = useState<any[]>([]);
    const [latestAlumniData, setLatestAlumniData] = useState<any[]>([]);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [isLoadingLatest, setIsLoadingLatest] = useState(false);

    const totalPages = Math.ceil(latestAlumniData.length / itemsPerPage);

    const filteredData = selectedArchiveType
        ? latestAlumniData.filter(alumni => {
            if (selectedArchiveType === "SKL" || selectedArchiveType === "SKL (Surat Keterangan Lulus)") {
                return alumni.type === "SKL" || alumni.type === "SKHU" || alumni.type === "SKL (Surat Keterangan Lulus)" || alumni.type === "SKHUN";
            }
            return alumni.type === selectedArchiveType;
        })
        : latestAlumniData;

    const fetchLatest = async () => {
        setIsLoadingLatest(true);
        try {
            const res = await api.getBukuIndukList(10); // Get latest 10
            if (res.data) {
                const mapped = res.data.map((item: any) => ({
                    id: item.alumniId || item.id,
                    name: item.namaLengkap,
                    nis: item.nis,
                    year: item.tahunLulus,
                    class: item.kelasMasuk || "-",
                    type: "Buku Induk",
                    status: item.statusArsip || "Lengkap",
                    statusColor: item.statusArsip === 'Lengkap' ? "#15803d" : "#ca8a04",
                    statusBg: item.statusArsip === 'Lengkap' ? "#dcfce7" : "#fef9c3",
                }));
                setLatestAlumniData(mapped);
            }
        } catch (err) { console.error(err); }
        finally { setIsLoadingLatest(false); }
    };

    useEffect(() => {
        fetchLatest();
    }, []);

    const totalFilteredPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalFilteredPages) setCurrentPage(currentPage + 1);
    };

    const handleSearch = async () => {
        if (searchTerm.trim() !== "") {
            setIsLoadingResults(true);
            setHasSearched(true);
            try {
                const { searchAlumni } = await import("../../../services/api");
                const res = await searchAlumni(searchTerm);
                if (res.data) {
                    // Filter hanya hasil dengan type "Buku Induk" untuk ditampilkan di halaman ini
                    const alumniOnly = res.data.filter((item: any) => !item.type || item.type === "Buku Induk");
                    const mapped = alumniOnly.map((item: any) => ({
                        id: item.alumniId || item.id,
                        alumniId: item.alumniId || item.id,
                        link: item.link || `/alumni/${item.alumniId || item.id}`,
                        name: item.namaLengkap || item.fullName || "-",
                        nis: item.nis,
                        nisn: item.nisn,
                        year: item.tahunLulus || item.graduationYear,
                        class: item.kelasMasuk || "-",
                        type: item.type || "Buku Induk",
                        status: item.statusArsip || "Aktif",
                        statusColor: item.statusArsip === 'Lengkap' ? "#15803d" : "#ca8a04",
                        statusBg: item.statusArsip === 'Lengkap' ? "#dcfce7" : "#fef9c3",
                        matchScore: typeof item.matchScore === "number" ? item.matchScore : 100,
                        matchType: item.matchType || "Exact"
                    }));
                    setResults(mapped);
                } else {
                    setResults([]);
                }
            } catch (err) { console.error(err); setResults([]); }
            finally { setIsLoadingResults(false); }
        }
    };

    const clearSearch = () => {
        setSearchTerm("");
        setHasSearched(false);
    };

    const handleArchiveTypeFilter = (type: string) => {
        setSelectedArchiveType(type);
        setCurrentPage(1); // Reset to first page when filtering
    };

    const clearArchiveFilter = () => {
        setSelectedArchiveType(null);
        setCurrentPage(1);
    };

    return (
        <AdminLayout>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

                {/* Header */}
                <header style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem", color: "var(--text-heading)", fontWeight: "700", marginBottom: "0.5rem" }}>Cari Alumni</h1>
                    <div style={{ marginBottom: "0.5rem" }}>
                        <p style={{ fontSize: "1.05rem", color: "var(--text-heading)", fontWeight: "500", marginBottom: "0.25rem" }}>Pencarian Arsip Alumni</p>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Pencarian Arsip Alumni berdasarkan Buku Induk dan Dokumen Kelulusan</p>
                    </div>
                    <div style={{
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: "8px",
                        padding: "0.75rem 1rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.85rem",
                        color: "#166534"
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v20M2 12h20" />
                        </svg>
                        <span>Data bersumber dari arsip resmi MTs</span>
                    </div>
                </header>

                {/* Search Bar Section */}
                <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", marginBottom: "2rem" }}>
                    <div className="search-container" style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                        <div style={{ flex: 1, position: "relative" }}>
                            <Search size={20} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    if (e.target.value === "") {
                                        setHasSearched(false);
                                    }
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Masukkan Nama atau NISN..."
                                style={{ width: "100%", padding: "0.85rem 1rem 0.85rem 3rem", borderRadius: "8px", border: "1px solid #e5e7eb", outline: "none", background: "#f9fafb" }}
                            />
                            {searchTerm && (
                                <X size={16} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", cursor: "pointer" }} onClick={clearSearch} />
                            )}
                        </div>
                        <div style={{ width: "200px", position: "relative" }}>
                            <select 
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                style={{ width: "100%", padding: "0.85rem", borderRadius: "8px", border: "1px solid #e5e7eb", outline: "none", background: "#f9fafb", appearance: "none", cursor: "pointer" }}
                            >
                                <option value="">Semua Tahun</option>
                                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <div style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                                <ChevronRight size={16} style={{ transform: "rotate(90deg)" }} />
                            </div>
                        </div>
                        <button className="btn" style={{ background: "#15803d", color: "white", padding: "0 2rem" }} onClick={handleSearch}>
                            Cari Arsip
                        </button>
                    </div>
                    <div className="filter-links" style={{ display: "flex", gap: "1.5rem", fontSize: "0.9rem", color: "#15803d", fontWeight: "500" }}>
                        <span style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}>📁 Jenis Arsip <ChevronRight size={14} /></span>
                        <span style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}>📊 Status Arsip <ChevronRight size={14} /></span>
                        <span style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", color: "#dc2626" }}>✕ Hapus Filter</span>
                    </div>
                </div>

                {/* Results Section - Conditionally Rendered */}
                {hasSearched && (
                    <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", overflow: "hidden" }}>

                        {/* Result Header */}
                        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--text-heading)", marginBottom: "1rem" }}>Hasil Pencarian Arsip Alumni</h2>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff7ed", padding: "0.75rem", borderRadius: "6px", border: "1px solid #ffedd5" }}>
                                <span style={{ fontSize: "0.9rem", color: "#9a3412" }}>
                                    {isLoadingResults
                                        ? "Mencari..."
                                        : results.length === 0
                                            ? "Tidak ada hasil ditemukan"
                                            : `Menampilkan ${results.length} hasil untuk "${searchTerm}"`
                                    }
                                </span>

                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <ChevronLeft size={16} color="#9a3412" style={{ cursor: "pointer" }} />
                                    <ChevronRight size={16} color="#9a3412" style={{ cursor: "pointer" }} />
                                </div>
                            </div>
                            <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                                Pencarian: <span style={{ fontWeight: "600", color: "#15803d", background: "#dcfce7", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>{searchTerm}</span>
                            </div>
                        </div>

                        {/* Result Items - TABLE LAYOUT */}
                        <div>
                            {/* Header Row */}
                            <div className="alumni-table-header">
                                <div style={{ flex: 1.5 }}>Nama Alumni</div>
                                <div style={{ flex: 1 }}>Nomor Induk Siswa</div>
                                <div style={{ flex: 0.5 }}>Tahun Lulus</div>
                                <div style={{ flex: 1 }}>Tingkat Kemiripan (Fuzzy)</div>
                                <div style={{ width: "150px" }}>Status Dokumen</div>
                                <div style={{ width: "150px", textAlign: "right" }}>Aksi</div>
                            </div>

                             {/* Data Rows */}
                             {isLoadingResults ? (
                                 <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Mencari data alumni...</div>
                             ) : results.length === 0 ? (
                                 <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Data tidak ditemukan untuk kata kunci "{searchTerm}"</div>
                             ) : results.map((item) => (
                                 <div key={item.id} className="alumni-table-row">
                                     <div style={{ flex: 1.5, fontWeight: "600", color: "var(--text-heading)" }} data-label="Nama Alumni">{item.name}</div>
                                     <div style={{ flex: 1, color: "var(--text-body)" }} data-label="NIS">{item.nis}</div>
                                     <div style={{ flex: 0.5, color: "var(--text-body)" }} data-label="Tahun Lulus">{item.year}</div>
                                     <div style={{ flex: 1 }} data-label="Fuzzy Score">
                                         <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "flex-start" }}>
                                             <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%" }}>
                                                 <div style={{ flex: 1, maxWidth: "100px", height: "6px", background: "#e5e7eb", borderRadius: "3px", overflow: "hidden" }}>
                                                     <div style={{
                                                         width: `${item.matchScore}%`,
                                                         height: "100%",
                                                         background: item.matchScore > 80 ? "#22c55e" : item.matchScore > 60 ? "#f59e0b" : "#ef4444"
                                                     }}></div>
                                                 </div>
                                                 <span style={{ fontSize: "0.85rem", fontWeight: "700", color: item.matchScore > 80 ? "#15803d" : item.matchScore > 60 ? "#92400e" : "#b91c1c", minWidth: "40px" }}>
                                                     {item.matchScore}%
                                                 </span>
                                             </div>
                                             <span style={{
                                                 fontSize: "0.65rem",
                                                 fontWeight: "700",
                                                 textTransform: "uppercase" as const,
                                                 letterSpacing: "0.5px",
                                                 padding: "1px 6px",
                                                 borderRadius: "4px",
                                                 background: item.matchType === "Exact" ? "#dbeafe" : "#fef3c7",
                                                 color: item.matchType === "Exact" ? "#1d4ed8" : "#92400e"
                                             }}>
                                                 {item.matchType === "Exact" ? "⚡ Tepat" : "🔍 Fuzzy"}
                                             </span>
                                         </div>
                                     </div>
                                     <div style={{ width: "150px" }} data-label="Status">
                                         <span style={{
                                             padding: "0.35rem 1rem",
                                             borderRadius: "6px",
                                             background: item.statusBg,
                                             color: item.statusColor,
                                             fontSize: "0.85rem",
                                             fontWeight: "600",
                                             minWidth: "120px",
                                             textAlign: "center",
                                             display: "inline-block"
                                         }}>
                                             {item.status}
                                         </span>
                                     </div>
                                     <div style={{ width: "150px", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                                         <Link href={`/alumni/${item.id}`} style={{ textDecoration: "none" }} title="Lihat">
                                             <span style={{
                                                 background: "none",
                                                 border: "1px solid #e5e7eb",
                                                 padding: "0.4rem",
                                                 borderRadius: "6px",
                                                 cursor: "pointer",
                                                 color: "#4b5563",
                                                 display: "flex",
                                                 alignItems: "center"
                                             }}>
                                                 <Eye size={16} />
                                             </span>
                                         </Link>
                                         <button 
                                             style={{ border: "1px solid #e5e7eb", background: "white", padding: "0.4rem", borderRadius: "6px", cursor: "pointer", color: "#2563eb" }}
                                             onClick={() => triggerEdit(Number(item.id))}
                                             title="Edit"
                                         >
                                             <Edit2 size={16} />
                                         </button>
                                         <button 
                                             style={{ border: "1px solid #fee2e2", background: "white", padding: "0.4rem", borderRadius: "6px", cursor: "pointer", color: "#dc2626" }}
                                             onClick={() => triggerDelete(item)}
                                             title="Hapus"
                                         >
                                             <Trash2 size={16} />
                                         </button>
                                     </div>
                                 </div>
                             ))}
                        </div>

                        {/* Pagination */}
                        <div style={{ padding: "1rem 1.5rem", background: "#f9fafb", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e5e7eb" }}>
                            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>1 - 3 dari 3 data</span>
                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                <button style={{ padding: "0.4rem 0.8rem", border: "1px solid #e5e7eb", borderRadius: "6px", background: "white", cursor: "pointer", display: "flex", alignItems: "center" }}><ChevronLeft size={16} /></button>
                                <button style={{ padding: "0.4rem 0.8rem", border: "none", borderRadius: "6px", background: "#15803d", color: "white", cursor: "pointer", fontWeight: "600" }}>1</button>
                                <button style={{ padding: "0.4rem 0.8rem", border: "none", borderRadius: "6px", background: "transparent", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.9rem" }}>Sebelumnya</button>
                                <span style={{ color: "#e5e7eb" }}>|</span>
                                <button style={{ padding: "0.4rem 0.8rem", border: "none", borderRadius: "6px", background: "transparent", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.9rem", fontWeight: "600" }}>Berikutnya <ChevronRight size={16} /></button>
                            </div>
                        </div>

                    </div>
                )}

                {/* Default View (When not searching) */}
                {!hasSearched && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Section 1: Jelajahi Jenis Arsip */}
                        <div style={{ marginBottom: "2.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--text-heading)" }}>Jelajahi Jenis Arsip</h2>
                                {selectedArchiveType && (
                                    <button
                                        onClick={clearArchiveFilter}
                                        style={{
                                            color: "#dc2626",
                                            background: "none",
                                            border: "none",
                                            fontWeight: "600",
                                            fontSize: "0.85rem",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.25rem"
                                        }}
                                    >
                                        ✕ Hapus Filter
                                    </button>
                                )}
                            </div>
                            <div className="responsive-grid-4" style={{ gap: "1.5rem" }}>
                                {[
                                    { title: "Ijazah", count: `${stats.ijazahCount} Dokumen`, color: "var(--primary)", bg: "#dcfce7", icon: "📜" },
                                    { title: "SKL (Surat Keterangan Lulus)", count: `${stats.skhuCount} Dokumen`, color: "#ca8a04", bg: "#fef9c3", icon: "📋" },
                                    { title: "Transkrip Nilai", count: `${stats.transkripCount} Dokumen`, color: "#2563eb", bg: "#dbeafe", icon: "📊" },
                                    { title: "Legger Kelas", count: `${stats.raporCount} Dokumen`, color: "#9333ea", bg: "#f3e8ff", icon: "📚" },
                                    { title: "Buku Induk", count: `${stats.bukuIndukDocCount} Dokumen`, color: "#dc2626", bg: "#fee2e2", icon: "📖" }
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleArchiveTypeFilter(item.title)}
                                        className="hover-card"
                                        style={{
                                            background: selectedArchiveType === item.title ? item.bg : "white",
                                            padding: "1.5rem",
                                            borderRadius: "12px",
                                            border: selectedArchiveType === item.title ? `2px solid ${item.color}` : "1px solid transparent",
                                            boxShadow: selectedArchiveType === item.title ? `0 4px 12px ${item.bg}` : "0 2px 5px rgba(0,0,0,0.05)",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "1rem",
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                            transform: selectedArchiveType === item.title ? "scale(1.02)" : "scale(1)"
                                        }}
                                    >
                                        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-heading)", marginBottom: "0.25rem" }}>{item.title}</h3>
                                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{item.count}</p>
                                            <p style={{ fontSize: "0.75rem", color: item.color, marginTop: "0.5rem", fontWeight: "500" }}>
                                                {selectedArchiveType === item.title ? "✓ Filter aktif" : "Klik untuk filter →"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 2: Data Alumni Terbaru */}
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                                <div>
                                    <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--text-heading)", marginBottom: "0.25rem" }}>Data Alumni Terbaru</h2>
                                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Arsip alumni yang baru dipindai dari Buku Induk</p>
                                </div>
                                <button style={{ color: "var(--primary)", background: "none", border: "none", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer" }}>Lihat Semua</button>
                            </div>
                            <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", overflow: "hidden" }}>

                                {/* Header Row (Like a Table) */}
                                <div className="alumni-table-header">
                                    <div style={{ flex: 1.5 }}>Nama Alumni</div>
                                    <div style={{ flex: 1 }}>Nomor Induk Siswa</div>
                                    <div style={{ flex: 0.5 }}>Kelas</div>
                                    <div style={{ flex: 0.5 }}>Tahun Lulus</div>
                                    <div style={{ flex: 1 }}>Jenis Arsip</div>
                                    <div style={{ width: "150px" }}>Status Dokumen</div>
                                    <div style={{ width: "150px", textAlign: "right" }}>Aksi</div>
                                </div>

                                 {/* Data Rows (Styled like Cards) */}
                                 <div>
                                     {isLoadingLatest ? (
                                         <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Memuat data terbaru...</div>
                                     ) : currentData.length === 0 ? (
                                         <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Belum ada data alumni.</div>
                                     ) : currentData.map((item, index) => (
                                         <div key={index} className="alumni-table-row">
                                             <div style={{ flex: 1.5, fontWeight: "600", color: "var(--text-heading)" }} data-label="Nama Alumni">{item.name}</div>
                                             <div style={{ flex: 1, color: "var(--text-body)" }} data-label="NIS">{item.nis}</div>
                                             <div style={{ flex: 0.5, color: "var(--text-body)" }} data-label="Kelas">{item.class}</div>
                                             <div style={{ flex: 0.5, color: "var(--text-body)" }} data-label="Tahun Lulus">{item.year}</div>
                                             <div style={{ flex: 1, color: "var(--text-body)" }} data-label="Jenis Arsip">{item.type}</div>
                                             <div style={{ width: "150px" }} data-label="Status">
                                                 <span style={{
                                                     padding: "0.3rem 0.8rem",
                                                     borderRadius: "6px",
                                                     background: item.statusBg,
                                                     color: item.statusColor,
                                                     fontSize: "0.85rem",
                                                     fontWeight: "600",
                                                     display: "inline-block",
                                                     textAlign: "center"
                                                 }}>
                                                     {item.status}
                                                 </span>
                                             </div>
                                             <div style={{ width: "150px", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                                                 <Link href={item.link || `/alumni/${item.alumniId || item.id}`} style={{ textDecoration: "none" }} title="Lihat">
                                                     <span style={{
                                                         background: "none",
                                                         border: "1px solid #e5e7eb",
                                                         padding: "0.4rem",
                                                         borderRadius: "6px",
                                                         cursor: "pointer",
                                                         color: "#4b5563",
                                                         display: "flex",
                                                         alignItems: "center"
                                                     }}>
                                                         <Eye size={16} />
                                                     </span>
                                                 </Link>
                                                 <button 
                                                     style={{ border: "1px solid #e5e7eb", background: "white", padding: "0.4rem", borderRadius: "6px", cursor: "pointer", color: "#2563eb" }}
                                                     onClick={() => triggerEdit(Number(item.alumniId || item.id))}
                                                     title="Edit"
                                                 >
                                                     <Edit2 size={16} />
                                                 </button>
                                                 <button 
                                                     style={{ border: "1px solid #fee2e2", background: "white", padding: "0.4rem", borderRadius: "6px", cursor: "pointer", color: "#dc2626" }}
                                                     onClick={() => triggerDelete(item)}
                                                     title="Hapus"
                                                 >
                                                     <Trash2 size={16} />
                                                 </button>
                                             </div>
                                         </div>
                                     ))}
                                 </div>

                                {/* Pagination Controls for Data Alumni Terbaru */}
                                <div style={{ padding: "1rem 1.5rem", background: "#f9fafb", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e5e7eb" }}>
                                    <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                                        {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} data
                                        {selectedArchiveType && <span style={{ color: "#15803d", fontWeight: "600" }}> ({selectedArchiveType})</span>}
                                    </span>
                                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                        <button onClick={handlePrevious} disabled={currentPage === 1} style={{ padding: "0.4rem 0.8rem", border: "1px solid #e5e7eb", borderRadius: "6px", background: currentPage === 1 ? "#f3f4f6" : "white", cursor: currentPage === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", color: currentPage === 1 ? "#9ca3af" : "inherit" }}>
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button style={{ padding: "0.4rem 0.8rem", border: "none", borderRadius: "6px", background: "#15803d", color: "white", cursor: "default", fontWeight: "600" }}>{currentPage}</button>
                                        <button onClick={handleNext} disabled={currentPage === totalFilteredPages} style={{ padding: "0.4rem 0.8rem", border: "1px solid #e5e7eb", borderRadius: "6px", background: currentPage === totalFilteredPages ? "#f3f4f6" : "white", cursor: currentPage === totalFilteredPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", color: currentPage === totalFilteredPages ? "#9ca3af" : "inherit" }}>
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {/* Footer */}
                <footer style={{ textAlign: "center", paddingTop: "2rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    © 2026 <strong>SAADA (Sistem Arsip Alumni ASSA'ADAH)</strong> | Prototipe Penelitian Skripsi MTS
                </footer>

            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* EDIT ALUMNI MODAL */}
            {/* ═══════════════════════════════════════════ */}
            {(editingRecord || isLoadingDetail) && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 9999, padding: "1rem"
                }}>
                    <div style={{
                        background: "white", borderRadius: "16px", width: "100%",
                        maxWidth: "650px", maxHeight: "90vh", overflow: "hidden",
                        boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
                        animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                        display: "flex", flexDirection: "column"
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            background: "linear-gradient(135deg, #14532d 0%, #15803d 100%)",
                            padding: "1.5rem 2rem", color: "white",
                            display: "flex", alignItems: "center", justifyContent: "space-between"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Edit2 size={20} color="white" />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: "1.15rem", fontWeight: "700", margin: 0 }}>Edit Data Alumni</h2>
                                    <p style={{ fontSize: "0.8rem", opacity: 0.8, margin: 0 }}>Perbarui informasi data alumni</p>
                                </div>
                            </div>
                            <button onClick={() => setEditingRecord(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "8px", padding: "0.5rem", cursor: "pointer", color: "white", display: "flex", alignItems: "center" }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div style={{ overflowY: "auto", padding: "1.5rem 2rem", flex: 1 }}>
                            {isLoadingDetail ? (
                                <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
                                    <div style={{ width: "40px", height: "40px", border: "3px solid #e5e7eb", borderTopColor: "#15803d", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }}></div>
                                    <p>Memuat data alumni...</p>
                                </div>
                            ) : (
                                <form id="editAlumniForm" onSubmit={handleUpdate}>
                                    {/* Identitas */}
                                    <div style={{ marginBottom: "1.5rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #dcfce7" }}>
                                            <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#15803d", background: "#dcfce7", padding: "0.2rem 0.6rem", borderRadius: "4px" }}>1</span>
                                            <span style={{ fontWeight: "700", color: "#14532d" }}>Identitas Siswa</span>
                                        </div>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Nama Lengkap *</label>
                                                <input type="text" required value={formData.namaLengkap} onChange={e => setFormData({...formData, namaLengkap: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Jenis Kelamin *</label>
                                                <select value={formData.jenisKelamin} onChange={e => setFormData({...formData, jenisKelamin: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none" }}>
                                                    <option value="L">Laki-laki</option>
                                                    <option value="P">Perempuan</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>NIS *</label>
                                                <input type="text" required value={formData.nis} onChange={e => setFormData({...formData, nis: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>NISN</label>
                                                <input type="text" value={formData.nisn} onChange={e => setFormData({...formData, nisn: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Tempat Lahir</label>
                                                <input type="text" value={formData.tempatLahir} onChange={e => setFormData({...formData, tempatLahir: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Tanggal Lahir</label>
                                                <input type="date" value={formData.tanggalLahir} onChange={e => setFormData({...formData, tanggalLahir: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Agama</label>
                                                <select value={formData.agama} onChange={e => setFormData({...formData, agama: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none" }}>
                                                    <option value="Islam">Islam</option>
                                                    <option value="Kristen">Kristen</option>
                                                    <option value="Katolik">Katolik</option>
                                                    <option value="Hindu">Hindu</option>
                                                    <option value="Buddha">Buddha</option>
                                                    <option value="Konghucu">Konghucu</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Kewarganegaraan</label>
                                                <input type="text" value={formData.kewarganegaraan} onChange={e => setFormData({...formData, kewarganegaraan: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Data Keluarga */}
                                    <div style={{ marginBottom: "1.5rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #dcfce7" }}>
                                            <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#15803d", background: "#dcfce7", padding: "0.2rem 0.6rem", borderRadius: "4px" }}>2</span>
                                            <span style={{ fontWeight: "700", color: "#14532d" }}>Data Keluarga</span>
                                        </div>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Nama Ayah</label>
                                                <input type="text" value={formData.namaAyah} onChange={e => setFormData({...formData, namaAyah: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Nama Ibu</label>
                                                <input type="text" value={formData.namaIbu} onChange={e => setFormData({...formData, namaIbu: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Pekerjaan Ayah</label>
                                                <input type="text" value={formData.pekerjaanAyah} onChange={e => setFormData({...formData, pekerjaanAyah: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Pekerjaan Ibu</label>
                                                <input type="text" value={formData.pekerjaanIbu} onChange={e => setFormData({...formData, pekerjaanIbu: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                            </div>
                                            <div style={{ gridColumn: "span 2" }}>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Alamat Orang Tua</label>
                                                <input type="text" value={formData.alamatOrangTua} onChange={e => setFormData({...formData, alamatOrangTua: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>No. HP Wali</label>
                                                <input type="text" value={formData.noHpWali} onChange={e => setFormData({...formData, noHpWali: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pendidikan & Kelulusan */}
                                    <div style={{ marginBottom: "1rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #dcfce7" }}>
                                            <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#15803d", background: "#dcfce7", padding: "0.2rem 0.6rem", borderRadius: "4px" }}>3</span>
                                            <span style={{ fontWeight: "700", color: "#14532d" }}>Pendidikan & Kelulusan</span>
                                        </div>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Asal Sekolah</label>
                                                <input type="text" value={formData.asalSekolah} onChange={e => setFormData({...formData, asalSekolah: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Kelas Masuk</label>
                                                <input type="text" value={formData.kelasMasuk} onChange={e => setFormData({...formData, kelasMasuk: e.target.value})} placeholder="Contoh: 7A" style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Tahun Masuk</label>
                                                <select value={formData.tahunMasuk} onChange={e => setFormData({...formData, tahunMasuk: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none" }}>
                                                    <option value="">-- Pilih Tahun --</option>
                                                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Tahun Lulus</label>
                                                <select value={formData.tahunLulus} onChange={e => setFormData({...formData, tahunLulus: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none" }}>
                                                    <option value="">-- Pilih Tahun --</option>
                                                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Nomor Ijazah</label>
                                                <input type="text" value={formData.nomorIjazah} onChange={e => setFormData({...formData, nomorIjazah: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Nomor SKHUN</label>
                                                <input type="text" value={formData.nomorSkhun} onChange={e => setFormData({...formData, nomorSkhun: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Status Siswa</label>
                                                <select value={formData.statusSiswa} onChange={e => setFormData({...formData, statusSiswa: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none" }}>
                                                    <option value="Lulus">Lulus</option>
                                                    <option value="Aktif">Aktif</option>
                                                    <option value="Tidak Lulus">Tidak Lulus</option>
                                                    <option value="Mutasi Masuk">Mutasi Masuk</option>
                                                    <option value="Mutasi Keluar">Mutasi Keluar</option>
                                                    <option value="Drop Out">Drop Out</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Status Arsip</label>
                                                <select value={formData.statusArsip} onChange={e => setFormData({...formData, statusArsip: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none" }}>
                                                    <option value="Lengkap">Lengkap</option>
                                                    <option value="Belum Lengkap">Belum Lengkap</option>
                                                    <option value="Arsip Hilang">Arsip Hilang</option>
                                                    <option value="Rusak">Rusak</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {!isLoadingDetail && (
                            <div style={{ padding: "1rem 2rem", borderTop: "1px solid #e5e7eb", display: "flex", gap: "0.75rem", justifyContent: "flex-end", background: "#f9fafb" }}>
                                <button type="button" onClick={() => setEditingRecord(null)} style={{ padding: "0.7rem 1.5rem", border: "1px solid #d1d5db", borderRadius: "10px", background: "white", color: "#374151", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" }}>
                                    Batal
                                </button>
                                <button type="submit" form="editAlumniForm" disabled={isSaving} style={{ padding: "0.7rem 1.8rem", border: "none", borderRadius: "10px", background: isSaving ? "#86efac" : "linear-gradient(135deg, #15803d, #16a34a)", color: "white", cursor: isSaving ? "not-allowed" : "pointer", fontWeight: "700", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    {isSaving ? (
                                        <><span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></span> Menyimpan...</>
                                    ) : (
                                        <><CheckCircle size={16} /> Simpan Perubahan</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* DELETE CONFIRMATION MODAL */}
            {/* ═══════════════════════════════════════════ */}
            {deletingRecord && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 9999, padding: "1rem"
                }}>
                    <div style={{
                        background: "white", borderRadius: "16px", width: "100%",
                        maxWidth: "460px", padding: "0",
                        boxShadow: "0 25px 80px rgba(220,38,38,0.25)",
                        animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                        overflow: "hidden"
                    }}>
                        {/* Red top accent */}
                        <div style={{ height: "6px", background: "linear-gradient(90deg, #dc2626, #ef4444, #f87171)" }}></div>
                        <div style={{ padding: "2rem" }}>
                            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                                <div style={{ width: "72px", height: "72px", background: "linear-gradient(135deg, #fee2e2, #fecaca)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                                    <AlertCircle size={36} color="#dc2626" />
                                </div>
                                <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#111827", marginBottom: "0.6rem" }}>Hapus Data Alumni?</h3>
                                <p style={{ color: "#6b7280", fontSize: "0.95rem", lineHeight: "1.6" }}>
                                    Anda akan menghapus data alumni <strong style={{ color: "#111827" }}>{deletingRecord.name}</strong> secara permanen beserta seluruh dokumen terkait (Buku Induk, Ijazah, SKL, dll).
                                </p>
                                <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.5rem", textAlign: "left" }}>
                                    <span style={{ fontSize: "1rem" }}>⚠️</span>
                                    <span style={{ fontSize: "0.85rem", color: "#991b1b", fontWeight: "600" }}>Tindakan ini tidak dapat dibatalkan!</span>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.75rem" }}>
                                <button onClick={() => setDeletingRecord(null)} disabled={isDeleting} style={{ flex: 1, padding: "0.8rem", border: "1px solid #e5e7eb", borderRadius: "10px", background: "white", color: "#374151", cursor: "pointer", fontWeight: "700", fontSize: "0.9rem" }}>
                                    Batal
                                </button>
                                <button onClick={handleConfirmDelete} disabled={isDeleting} style={{ flex: 1, padding: "0.8rem", border: "none", borderRadius: "10px", background: isDeleting ? "#fca5a5" : "linear-gradient(135deg, #dc2626, #ef4444)", color: "white", cursor: isDeleting ? "not-allowed" : "pointer", fontWeight: "700", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                                    {isDeleting ? (
                                        <><span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></span> Menghapus...</>
                                    ) : (
                                        <><Trash2 size={16} /> Ya, Hapus Permanen</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* TOAST NOTIFICATION */}
            {/* ═══════════════════════════════════════════ */}
            {showToast && (
                <div style={{
                    position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 10000,
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "1rem 1.5rem", borderRadius: "12px",
                    background: toastType === "success" ? "#f0fdf4" : toastType === "error" ? "#fef2f2" : "#eff6ff",
                    color: toastType === "success" ? "#15803d" : toastType === "error" ? "#dc2626" : "#1d4ed8",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                    border: `1px solid ${toastType === "success" ? "#bbf7d0" : toastType === "error" ? "#fecaca" : "#bfdbfe"}`,
                    animation: "slideUp 0.3s ease",
                    minWidth: "280px",
                    fontWeight: "600"
                }}>
                    <CheckCircle size={20} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Animation Keyframes */}
            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </AdminLayout>
    );
}
