"use client";

import AdminLayout from "../../../components/AdminLayout";
import Link from "next/link";
import { Search, Filter, Eye, ChevronLeft, ChevronRight, FileText, X, Edit2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import "./alumni-responsive.css";

export default function AlumniPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedArchiveType, setSelectedArchiveType] = useState<string | null>(null);
    const itemsPerPage = 5;

    const [stats, setStats] = useState({
        ijazahCount: 0,
        skhuCount: 0,
        transkripCount: 0,
        raporCount: 0,
        bukuIndukDocCount: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { getDashboardStats } = await import("../../../services/api");
                const data = await getDashboardStats();
                setStats({
                    ijazahCount: data.ijazahCount || 0,
                    skhuCount: data.skhuCount || 0,
                    transkripCount: data.transkripCount || 0,
                    raporCount: data.raporCount || 0,
                    bukuIndukDocCount: data.bukuIndukDocCount || 0,
                });
            } catch (error) {
                console.error("Failed to fetch archive stats:", error);
            }
        };
        fetchStats();
    }, []);

    // Sample Data for Search Results (Alumni Entities) with Fuzzy Match Scores
    const results = [
        { id: 1, name: "Ahmad Faisal", nis: "12345678", year: "2024", class: "9A", type: "Ijazah", status: "Lengkap", statusColor: "#15803d", statusBg: "#dcfce7", matchScore: 100 },
        { id: 2, name: "Ahmad Syukri", nis: "12345679", year: "2023", class: "9B", type: "SKHU", status: "Lengkap", statusColor: "#15803d", statusBg: "#dcfce7", matchScore: 85 },
        { id: 3, name: "Muhammad Faisal", nis: "12345680", year: "2024", class: "9C", type: "Rapor", status: "Belum Lengkap", statusColor: "#ca8a04", statusBg: "#fef9c3", matchScore: 72 },
    ];

    // Extended Sample Data for Latest Alumni (Default View)
    const latestAlumniData = [
        { name: "Siti Aminah", nis: "21001", year: "2023", class: "9A", type: "Ijazah", status: "Lengkap", statusBg: "#dcfce7", statusColor: "#15803d" },
        { name: "Budi Santoso", nis: "21002", year: "2023", class: "9B", type: "SKHU", status: "Lengkap", statusBg: "#dcfce7", statusColor: "#15803d" },
        { name: "Dewi Lestari", nis: "21003", year: "2022", class: "9A", type: "Transkrip", status: "Belum Lengkap", statusBg: "#ffedd5", statusColor: "#9a3412" },
        { name: "Rizky Ramadhan", nis: "21004", year: "2024", class: "9C", type: "Rapor", status: "Lengkap", statusBg: "#dcfce7", statusColor: "#15803d" },
        { name: "Doni Kurniawan", nis: "21005", year: "2021", class: "9B", type: "Ijazah", status: "Arsip Hilang", statusBg: "#fee2e2", statusColor: "#991b1b" },
        { name: "Fajar Nugraha", nis: "21006", year: "2023", class: "9A", type: "SKHU", status: "Lengkap", statusBg: "#dcfce7", statusColor: "#15803d" },
        { name: "Gita Pertiwi", nis: "21007", year: "2022", class: "9C", type: "Transkrip", status: "Belum Lengkap", statusBg: "#ffedd5", statusColor: "#9a3412" },
        { name: "Hendra Wijaya", nis: "21008", year: "2024", class: "9B", type: "Rapor", status: "Lengkap", statusBg: "#dcfce7", statusColor: "#15803d" },
        { name: "Indah Sari", nis: "21009", year: "2021", class: "9A", type: "Ijazah", status: "Arsip Hilang", statusBg: "#fee2e2", statusColor: "#991b1b" },
        { name: "Joko Anwar", nis: "21010", year: "2023", class: "9B", type: "SKHU", status: "Lengkap", statusBg: "#dcfce7", statusColor: "#15803d" },
        { name: "Kartika Putri", nis: "21011", year: "2022", class: "9C", type: "Transkrip", status: "Lengkap", statusBg: "#dcfce7", statusColor: "#15803d" },
        { name: "Lukman Hakim", nis: "21012", year: "2024", class: "9A", type: "Rapor", status: "Belum Lengkap", statusBg: "#ffedd5", statusColor: "#9a3412" },
        { name: "Muhammad Zaki", nis: "21013", year: "2023", class: "9B", type: "Buku Induk", status: "Lengkap", statusBg: "#dcfce7", statusColor: "#15803d" },
    ];

    const totalPages = Math.ceil(latestAlumniData.length / itemsPerPage);

    // Filter data based on selected archive type
    const filteredData = selectedArchiveType
        ? latestAlumniData.filter(alumni => alumni.type === selectedArchiveType)
        : latestAlumniData;

    const totalFilteredPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalFilteredPages) setCurrentPage(currentPage + 1);
    };

    const handleSearch = () => {
        // In a real app, this would trigger an API call.
        // For now, we simulate finding results whenever something is typed.
        if (searchTerm.trim() !== "") {
            setHasSearched(true);
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
                            <select style={{ width: "100%", padding: "0.85rem", borderRadius: "8px", border: "1px solid #e5e7eb", outline: "none", background: "#f9fafb", appearance: "none", cursor: "pointer" }}>
                                <option>Semua Tahun</option>
                                <option>2024</option>
                                <option>2023</option>
                                <option>2022</option>
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
                                <span style={{ fontSize: "0.9rem", color: "#9a3412" }}>Menampilkan 1 - 3 dari 3 hasil</span>
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
                            {results.map((item) => (
                                <div key={item.id} className="alumni-table-row">
                                    <div style={{ flex: 1.5, fontWeight: "600", color: "var(--text-heading)" }} data-label="Nama Alumni">{item.name}</div>
                                    <div style={{ flex: 1, color: "var(--text-body)" }} data-label="NIS">{item.nis}</div>
                                    <div style={{ flex: 0.5, color: "var(--text-body)" }} data-label="Tahun Lulus">{item.year}</div>
                                    <div style={{ flex: 1 }} data-label="Fuzzy Score">
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", justifyContent: "flex-end" }}>
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
                                        <Link href={`/alumni/${item.id + 10}`} style={{ textDecoration: "none" }} title="Lihat">
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
                                            onClick={() => alert("Fitur Edit sedang disiapkan.")}
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            style={{ border: "1px solid #fee2e2", background: "white", padding: "0.4rem", borderRadius: "6px", cursor: "pointer", color: "#dc2626" }}
                                            onClick={() => alert("Fitur Hapus sedang disiapkan.")}
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
                                    { title: "SKHU", count: `${stats.skhuCount} Dokumen`, color: "#ca8a04", bg: "#fef9c3", icon: "📋" },
                                    { title: "Transkrip Nilai", count: `${stats.transkripCount} Dokumen`, color: "#2563eb", bg: "#dbeafe", icon: "📊" },
                                    { title: "Rapor", count: `${stats.raporCount} Dokumen`, color: "#9333ea", bg: "#f3e8ff", icon: "📚" },
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
                                    {currentData.map((item, index) => (
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
                                                <Link href={`/alumni/${index + 10}`} style={{ textDecoration: "none" }} title="Lihat">
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
                                                    onClick={() => alert("Fitur Edit sedang disiapkan.")}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    style={{ border: "1px solid #fee2e2", background: "white", padding: "0.4rem", borderRadius: "6px", cursor: "pointer", color: "#dc2626" }}
                                                    onClick={() => alert("Fitur Hapus sedang disiapkan.")}
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
        </AdminLayout>
    );
}
