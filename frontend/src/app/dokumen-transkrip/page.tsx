"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import {
    BarChart, Plus, Search, Eye, Trash2, Loader2, FileText, CheckCircle2, Filter, ChevronRight, ArrowLeft, Sparkles, X, Download, AlertCircle, Settings, BookOpen
} from "lucide-react";
import Link from "next/link";
import * as api from "../../../services/api";
import * as XLSX from "xlsx";

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => (1980 + i).toString()).reverse();

const dummyTranskripData = [
    {
        id: 1,
        namaLengkap: "Ahmad Faisal Ramadhan",
        nisn: "0021001234",
        nis: "21001",
        tahunLulus: "2024",
        rataRata: 85.5,
        nilaiSemesterFull: [
            {
                id: -1,
                semester: "1",
                rata: 84.0,
                mataPelajaran: [
                    { nama: "Al-Qur'an Hadis", nilai: 86 },
                    { nama: "Bahasa Indonesia", nilai: 85 },
                    { nama: "Matematika", nilai: 80 },
                    { nama: "Ilmu Pengetahuan Alam", nilai: 85 }
                ]
            },
            {
                id: -2,
                semester: "2",
                rata: 87.0,
                mataPelajaran: [
                    { nama: "Al-Qur'an Hadis", nilai: 90 },
                    { nama: "Bahasa Indonesia", nilai: 89 },
                    { nama: "Matematika", nilai: 80 },
                    { nama: "Ilmu Pengetahuan Alam", nilai: 89 }
                ]
            }
        ]
    },
    {
        id: 2,
        namaLengkap: "Siti Aminah Putri",
        nisn: "0021002345",
        nis: "21002",
        tahunLulus: "2023",
        rataRata: 83.25,
        nilaiSemesterFull: [
            {
                id: -3,
                semester: "1",
                rata: 82.5,
                mataPelajaran: [
                    { nama: "Al-Qur'an Hadis", nilai: 84 },
                    { nama: "Bahasa Indonesia", nilai: 84 },
                    { nama: "Matematika", nilai: 78 },
                    { nama: "Ilmu Pengetahuan Alam", nilai: 84 }
                ]
            },
            {
                id: -4,
                semester: "2",
                rata: 84.0,
                mataPelajaran: [
                    { nama: "Al-Qur'an Hadis", nilai: 86 },
                    { nama: "Bahasa Indonesia", nilai: 88 },
                    { nama: "Matematika", nilai: 78 },
                    { nama: "Ilmu Pengetahuan Alam", nilai: 84 }
                ]
            }
        ]
    }
];

export default function DokumenTranskripPage() {
    const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "error" }>({
        show: false,
        msg: "",
        type: "success"
    });

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
    };

    const [dbData, setDbData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("Semua");
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [advFilter, setAdvFilter] = useState({ nisn: "", tahunLulus: "", siswaName: "" });
    const [isSmartSearching, setIsSmartSearching] = useState(false);
    const [smartMode, setSmartMode] = useState(false);
    const [smartResults, setSmartResults] = useState<any[]>([]);

    // Detail Modal States
    const [selectedDetailItem, setSelectedDetailItem] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;
    const [deletePendingId, setDeletePendingId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // ── Academic Tab States (Transkrip Nilai) ──
    const [activeTab, setActiveTab] = useState<"file" | "data">("file");
    const [academicData, setAcademicData] = useState<any[]>([]);
    const [isAcademicLoading, setIsAcademicLoading] = useState(false);
    const [showAcademicModal, setShowAcademicModal] = useState(false);
    const [isEditingAcademic, setIsEditingAcademic] = useState(false);
    
    // In transkrip edit modal, we manage all 6 semesters grades.
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [activeFormSemester, setActiveFormSemester] = useState("1"); // Active semester being edited in form (1 to 6)
    const [semestersGrades, setSemestersGrades] = useState<Record<string, Array<{ mataPelajaranId: number; namaMapel: string; nilai: number }>>>({
        "1": [], "2": [], "3": [], "4": [], "5": [], "6": []
    });

    const [alumniOptions, setAlumniOptions] = useState<any[]>([]);
    const [mapelOptions, setMapelOptions] = useState<any[]>([]);
    const [academicSearch, setAcademicSearch] = useState("");
    const [academicPage, setAcademicPage] = useState(1);
    const [academicSmartMode, setAcademicSmartMode] = useState(false);
    const [isAcademicSmartSearching, setIsAcademicSmartSearching] = useState(false);
    const [academicSmartResults, setAcademicSmartResults] = useState<any[]>([]);

    const fetchRecords = async () => {
        setIsLoading(true);
        try {
            const data = await api.getArchives("Transkrip");
            setDbData(data || []);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    const fetchAcademicRecords = async () => {
        setIsAcademicLoading(true);
        try {
            const response = await api.getBukuIndukList();
            setAcademicData(response.data || []);
        } catch (err) { 
            console.error(err); 
            setAcademicData([]);
        }
        finally { setIsAcademicLoading(false); }
    };

    const loadAcademicOptions = async () => {
        try {
            const mapels = await api.getMataPelajaran();
            setMapelOptions(mapels || []);
            const response = await api.getBukuIndukList(1000);
            if (response && response.data) {
                setAlumniOptions(response.data);
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchRecords();
        loadAcademicOptions();
    }, []);

    useEffect(() => {
        if (activeTab === "data") {
            fetchAcademicRecords();
        }
    }, [activeTab]);

    const handleDelete = (id: number) => {
        setDeletePendingId(id);
    };

    const confirmDelete = async () => {
        if (deletePendingId === null) return;
        setIsDeleting(true);
        try {
            await api.deleteArchive(deletePendingId);
            setDeletePendingId(null);
            fetchRecords();
        } catch (err: any) { alert(err.message); }
        finally { setIsDeleting(false); }
    };

    const handleSmartSearch = async () => {
        if (smartMode) {
            setSmartMode(false);
            return;
        }
        if (!searchTerm) {
            showToast("Ketik nama atau file terlebih dahulu untuk melakukan Pencarian Cerdas!", "error");
            return;
        }
        setIsSmartSearching(true);
        setSmartMode(true);
        try {
            const res = await api.searchAlumni(searchTerm);
            if (res.data) {
                const matchedResults: any[] = [];
                res.data.forEach((resItem: any) => {
                    const matchedDbItems = dbData.filter(dbItem => {
                        const dbName = (dbItem.siswaName || dbItem.namaLengkap || "").toLowerCase();
                        const resName = (resItem.namaLengkap || resItem.fullName || "").toLowerCase();
                        const dbNis = dbItem.nis || "";
                        const resNis = resItem.nis || "";
                        const dbNisn = dbItem.nisn || "";
                        const resNisn = resItem.nisn || "";
                        
                        return (resNis && dbNis === resNis) || 
                               (resNisn && dbNisn === resNisn) || 
                               (dbName === resName);
                    });
                    
                    matchedDbItems.forEach((dbItem: any) => {
                        if (!matchedResults.some(r => r.id === dbItem.id)) {
                            matchedResults.push({
                                ...dbItem,
                                score: resItem.matchScore || 100
                            });
                        }
                    });
                });
                matchedResults.sort((a, b) => b.score - a.score);
                setSmartResults(matchedResults);
            } else {
                setSmartResults([]);
            }
        } catch (err) {
            console.error("Smart search failed:", err);
            setSmartResults([]);
        } finally {
            setIsSmartSearching(false);
        }
    };
    const handleAcademicSmartSearch = async () => {
        if (academicSmartMode) {
            setAcademicSmartMode(false);
            return;
        }
        if (!academicSearch) {
            showToast("Ketik nama atau NISN terlebih dahulu untuk melakukan Pencarian Cerdas!", "error");
            return;
        }
        setIsAcademicSmartSearching(true);
        setAcademicSmartMode(true);
        try {
            const res = await api.searchAlumni(academicSearch);
            if (res.data) {
                const matchedResults: any[] = [];
                res.data.forEach((resItem: any) => {
                    const matchedDbItems = academicData.filter(dbItem => {
                        const dbName = (dbItem.namaLengkap || "").toLowerCase();
                        const resName = (resItem.namaLengkap || resItem.fullName || "").toLowerCase();
                        const dbNis = dbItem.nis || "";
                        const resNis = resItem.nis || "";
                        const dbNisn = dbItem.nisn || "";
                        const resNisn = resItem.nisn || "";
                        
                        return (resNis && dbNis === resNis) || 
                               (resNisn && dbNisn === resNisn) || 
                               (dbName === resName);
                    });
                    
                    matchedDbItems.forEach((dbItem: any) => {
                        if (!matchedResults.some(r => r.id === dbItem.id)) {
                            matchedResults.push({
                                ...dbItem,
                                score: resItem.matchScore || 100
                            });
                        }
                    });
                });
                matchedResults.sort((a, b) => (b.score || 0) - (a.score || 0));
                setAcademicSmartResults(matchedResults);
            } else {
                setAcademicSmartResults([]);
            }
        } catch (err) {
            console.error("Academic smart search failed:", err);
            setAcademicSmartResults([]);
        } finally {
            setIsAcademicSmartSearching(false);
        }
    };

    const hasAdvFilter = advFilter.nisn || advFilter.tahunLulus || advFilter.siswaName;
    const filteredResults = smartMode ? smartResults : dbData.filter(item => {
        const matchesSearch = item.siswaName?.toLowerCase().includes(searchTerm.toLowerCase()) || item.fileName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "Semua" || item.statusOCR === filterStatus;
        const matchesNisn = !advFilter.nisn || item.nisn?.includes(advFilter.nisn);
        const matchesTahun = !advFilter.tahunLulus || item.tahunLulus === advFilter.tahunLulus;
        const matchesName = !advFilter.siswaName || item.siswaName?.toLowerCase().includes(advFilter.siswaName.toLowerCase());
        return matchesSearch && matchesStatus && matchesNisn && matchesTahun && matchesName;
    });

    // Filtering for Academic List
    const filteredAcademicResults = academicSmartMode ? academicSmartResults : academicData.filter(item => {
        const q = academicSearch.toLowerCase();
        return item.namaLengkap.toLowerCase().includes(q) || item.nisn.includes(q) || item.nis.includes(q);
    });

    // Pagination File Tab
    const totalPages = Math.max(1, Math.ceil(filteredResults.length / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedResults = filteredResults.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
    const handlePageChange = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

    // Pagination Academic Tab
    const totalAcadPages = Math.max(1, Math.ceil(filteredAcademicResults.length / PAGE_SIZE));
    const safeAcadPage = Math.min(academicPage, totalAcadPages);
    const paginatedAcademicData = filteredAcademicResults.slice((safeAcadPage - 1) * PAGE_SIZE, safeAcadPage * PAGE_SIZE);
    const handleAcadPageChange = (page: number) => setAcademicPage(Math.max(1, Math.min(page, totalAcadPages)));

    const countTotal = dbData.length;
    const countLengkap = dbData.filter(d => d.statusOCR === "Done" && d.confidence >= 75 && d.siswaName && d.siswaName !== "Siswa Tidak Diketahui").length;
    const countPerluKoreksi = dbData.filter(d => d.statusOCR === "Processing" || (d.statusOCR === "Done" && (d.confidence < 75 || !d.siswaName || d.siswaName === "Siswa Tidak Diketahui"))).length;
    const countGagal = dbData.filter(d => d.statusOCR === "Failed").length;

    const percentLengkap = countTotal > 0 ? Math.round((countLengkap / countTotal) * 100) : 0;
    const percentPerluKoreksi = countTotal > 0 ? Math.round((countPerluKoreksi / countTotal) * 100) : 0;
    const percentGagal = countTotal > 0 ? Math.round((countGagal / countTotal) * 100) : 0;

    const stats = {
        total: countTotal,
        lengkap: countLengkap,
        percentLengkap,
        perluKoreksi: countPerluKoreksi,
        percentPerluKoreksi,
        gagal: countGagal,
        percentGagal
    };

    // Reset page on filter changes
    useEffect(() => { setCurrentPage(1); }, [searchTerm, filterStatus, advFilter, smartMode]);
    useEffect(() => { setAcademicPage(1); }, [academicSearch]);

    // Open Modal for Creating/Editing Transkrip
    const openCreateAcademicModal = () => {
        setIsEditingAcademic(false);
        setSelectedStudentId("");
        setActiveFormSemester("1");
        
        // Pre-fill empty grades for semesters 1 to 6
        const initialGrades: Record<string, any[]> = {};
        ["1", "2", "3", "4", "5", "6"].forEach(sem => {
            initialGrades[sem] = mapelOptions.map(m => ({
                mataPelajaranId: m.id,
                namaMapel: m.namaMapel,
                nilai: 0
            }));
        });
        setSemestersGrades(initialGrades);
        setShowAcademicModal(true);
    };

    const openEditAcademicModal = (item: any) => {
        setIsEditingAcademic(true);
        setSelectedStudentId(String(item.id));
        setActiveFormSemester("1");

        const updatedGrades: Record<string, any[]> = {};
        ["1", "2", "3", "4", "5", "6"].forEach(sem => {
            const existingSemester = item.nilaiSemesterFull?.find((s: any) => s.semester === sem);
            updatedGrades[sem] = mapelOptions.map(m => {
                const existingNilai = existingSemester?.mataPelajaran?.find((mp: any) => mp.nama === m.namaMapel || mp.namaMapel === m.namaMapel);
                return {
                    mataPelajaranId: m.id,
                    namaMapel: m.namaMapel,
                    nilai: existingNilai ? existingNilai.nilai : 0
                };
            });
        });
        setSemestersGrades(updatedGrades);
        setShowAcademicModal(true);
    };

    const handleSaveAcademic = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const studentId = Number(selectedStudentId);
            if (!studentId) {
                alert("Pilih alumni terlebih dahulu!");
                return;
            }

            setIsAcademicLoading(true);

            // 1. Fetch detailed student record
            const studentDetail = await api.getBukuIndukDetail(studentId);

            // 2. Map semesters list from form
            const mappedSemesters = ["1", "2", "3", "4", "5", "6"].map(sem => {
                const grades = semestersGrades[sem];
                const validGrades = grades.filter(g => g.nilai > 0);
                const avg = validGrades.length > 0
                    ? Number((validGrades.reduce((acc, curr) => acc + Number(curr.nilai || 0), 0) / validGrades.length).toFixed(2))
                    : 0;

                // Let's check if there are any grades filled for this semester
                if (validGrades.length === 0) return null;

                return {
                    semester: sem,
                    rata: avg,
                    mataPelajaran: validGrades.map(g => ({
                        nama: g.namaMapel,
                        nilai: Number(g.nilai)
                    }))
                };
            }).filter(Boolean); // Filter out empty semesters

            // 3. Prepare the full update request payload for Buku Induk
            const updatePayload = {
                ...studentDetail,
                nilaiSemester: mappedSemesters,
                rataRata: Number((mappedSemesters.reduce((acc: number, curr: any) => acc + curr.rata, 0) / (mappedSemesters.length || 1)).toFixed(2))
            };

            await api.updateBukuInduk(studentId, updatePayload);
            showToast("Data Transkrip Nilai berhasil disimpan!", "success");
            setShowAcademicModal(false);
            fetchAcademicRecords();
        } catch (err: any) {
            alert(err.message || "Gagal menyimpan data transkrip");
        } finally {
            setIsAcademicLoading(false);
        }
    };

    const handleDeleteAcademic = async (studentId: number) => {
        if (!confirm("Hapus seluruh rekap nilai transkrip untuk alumni ini? (Ini akan menghapus seluruh data semester)")) return;
        setIsAcademicLoading(true);
        try {
            const studentDetail = await api.getBukuIndukDetail(studentId);
            const updatePayload = {
                ...studentDetail,
                nilaiSemester: [],
                rataRata: 0
            };
            await api.updateBukuInduk(studentId, updatePayload);
            alert("Data transkrip akademik berhasil dihapus!");
            fetchAcademicRecords();
        } catch (err: any) {
            alert(err.message || "Gagal menghapus data");
        } finally {
            setIsAcademicLoading(false);
        }
    };

    const exportToExcel = () => {
        if (filteredResults.length === 0) {
            alert("Peringatan: Tidak ada data transkrip yang dapat diekspor.");
            return;
        }
        const dataForExcel = filteredResults.map(item => ({
            "Nama File": item.fileName || '',
            "Nama Siswa": item.siswaName || '',
            "NISN": item.nisn || '',
            "Tahun Lulus": item.tahunLulus || '',
            "Status OCR": item.statusOCR || '',
            "Tanggal Unggah": new Date(item.uploadDate).toLocaleDateString('id-ID')
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transkrip");
        XLSX.writeFile(workbook, `Backup_Transkrip_${new Date().toISOString().slice(0,10)}.xlsx`);
    };

    return (
        <AdminLayout>
            <div className="premium-container" suppressHydrationWarning={true}>

                {/* MOBILE NAV */}
                <div className="mobile-only m-header-minimal">
                    <Link href="/file-master" className="m-back-link">
                        <ArrowLeft size={18} />
                        <span>Kembali</span>
                    </Link>
                </div>

                <div className="mobile-only m-hero-minimal">
                    <div className="m-hero-badge bg-transkrip">TRANSKRIP NILAI</div>
                    <h1 className="m-hero-title">{activeTab === "file" ? "Dokumen Transkrip" : "Data Transkrip Akademik"}</h1>
                    <p className="m-hero-subtitle">Kelola data alumni dengan mudah</p>
                </div>

                {/* HEADER */}
                <header className="page-hero">
                    <div className="hero-content">
                        <div className="hero-badge color-transkrip">Data Akademik</div>
                        <h1>{activeTab === "file" ? "Transkrip Nilai" : "Data Transkrip Akademik"}</h1>
                        <p>{activeTab === "file" 
                            ? "Kumpulan nilai akhir siswa yang telah terverifikasi secara digital."
                            : "Data transkrip nilai terstruktur siswa (Semester 1 s/d 6)."}</p>
                    </div>
                    <div className="hero-actions desktop-only">
                        {activeTab === "file" ? (
                            <>
                                <button className="btn-vibrant-outline color-transkrip-outline" onClick={exportToExcel} title="Export ke Excel">
                                    <Download size={20} />
                                    <span>Export Excel</span>
                                </button>
                                <Link href="/upload" className="btn-vibrant-add color-transkrip">
                                    <Plus size={20} />
                                    <span>Unggah Transkrip</span>
                                </Link>
                            </>
                        ) : (
                            <button className="btn-vibrant-add color-transkrip" onClick={openCreateAcademicModal}>
                                <Plus size={20} />
                                <span>Tambah Transkrip</span>
                            </button>
                        )}
                    </div>
                </header>

                {/* Tab Switcher */}
                <div className="tab-switcher" style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                    <button 
                        onClick={() => setActiveTab("file")} 
                        style={{
                            padding: "0.75rem 1.5rem",
                            borderRadius: "12px",
                            fontWeight: "750",
                            fontSize: "0.95rem",
                            cursor: "pointer",
                            background: activeTab === "file" ? "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)" : "white",
                            color: activeTab === "file" ? "white" : "#64748b",
                            boxShadow: activeTab === "file" ? "0 4px 12px rgba(30, 64, 175, 0.2)" : "0 2px 4px rgba(0,0,0,0.02)",
                            border: activeTab === "file" ? "none" : "1px solid #e2e8f0",
                            transition: "all 0.2s"
                        }}
                    >
                        📂 Arsip Scan & OCR
                    </button>
                    <button 
                        onClick={() => setActiveTab("data")} 
                        style={{
                            padding: "0.75rem 1.5rem",
                            borderRadius: "12px",
                            fontWeight: "750",
                            fontSize: "0.95rem",
                            cursor: "pointer",
                            background: activeTab === "data" ? "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)" : "white",
                            color: activeTab === "data" ? "white" : "#64748b",
                            boxShadow: activeTab === "data" ? "0 4px 12px rgba(30, 64, 175, 0.2)" : "0 2px 4px rgba(0,0,0,0.02)",
                            border: activeTab === "data" ? "none" : "1px solid #e2e8f0",
                            transition: "all 0.2s"
                        }}
                    >
                        📊 Data Transkrip Akademik
                    </button>
                </div>

                {/* STATS */}
                {activeTab === "file" && (
                    <section className="stats-grid m-stats-layout">
                        <div className="stat-card glass">
                            <div className="stat-icon blue"><FileText size={20} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Total Transkrip</span>
                                <h3 className="stat-value">{stats.total}</h3>
                            </div>
                        </div>
                        <div className="stat-card glass">
                            <div className="stat-icon green"><CheckCircle2 size={20} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Data Lengkap</span>
                                <h3 className="stat-value" style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                                    {stats.lengkap}
                                    <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#16a34a" }}>({stats.percentLengkap}%)</span>
                                </h3>
                            </div>
                        </div>
                        <div className="stat-card glass">
                            <div className="stat-icon orange" style={{ background: "#fff7ed", color: "#ea580c" }}><AlertCircle size={20} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Perlu Diperbaiki</span>
                                <h3 className="stat-value" style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                                    {stats.perluKoreksi}
                                    <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#ea580c" }}>({stats.percentPerluKoreksi}%)</span>
                                </h3>
                            </div>
                        </div>
                        <div className="stat-card glass">
                            <div className="stat-icon red"><AlertCircle size={20} style={{ color: "#dc2626" }} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Gagal / Error</span>
                                <h3 className="stat-value" style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                                    {stats.gagal}
                                    <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#dc2626" }}>({stats.percentGagal}%)</span>
                                </h3>
                            </div>
                        </div>
                    </section>
                )}

                {/* MAIN CONTENT */}
                <main className="main-panel glass m-main-panel">
                    
                    {/* TAB 1: FILE SCAN & OCR */}
                    {activeTab === "file" && (
                        <>
                            <div className="panel-header m-panel-header">
                                <div className="m-search-group">
                                    <div className="m-search-input-wrapper">
                                        <Search size={18} color="#94a3b8" />
                                        <input 
                                            type="text" 
                                            placeholder="Cari nama atau file..." 
                                            value={searchTerm} 
                                            onChange={e => {
                                                setSearchTerm(e.target.value);
                                                if (smartMode) setSmartMode(false);
                                            }} 
                                        />
                                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="m-status-select">
                                            <option value="Semua">Semua Status</option>
                                            <option value="Done">Terverifikasi ✅</option>
                                            <option value="Processing">Proses ⏳</option>
                                            <option value="Failed">Gagal ❌</option>
                                        </select>
                                    </div>
                                    <div className="m-filter-actions">
                                        <button 
                                            type="button"
                                            className={`m-btn-smart ${smartMode ? 'active' : ''}`}
                                            onClick={handleSmartSearch}
                                            title="Pencarian Cerdas AI"
                                            disabled={isSmartSearching}
                                        >
                                            {isSmartSearching ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                            <span>{smartMode ? "Normal" : "Smart"}</span>
                                        </button>
                                        <button className={`m-btn-filter ${hasAdvFilter ? 'active' : ''}`} onClick={() => setShowFilterPanel(!showFilterPanel)}>
                                            <Filter size={16} />
                                            <span>Filter{hasAdvFilter ? ` (•)` : ''}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ADVANCED FILTER PANEL */}
                            {showFilterPanel && (
                                <div className="adv-filter-panel">
                                    <div className="adv-filter-header">
                                        <span>🔍 Filter Lanjutan Transkrip</span>
                                        <button className="adv-close-btn" onClick={() => { setAdvFilter({ nisn: "", tahunLulus: "", siswaName: "" }); setFilterStatus("Semua"); setShowFilterPanel(false); }}><X size={16} /> Reset</button>
                                    </div>
                                    <div className="adv-filter-grid">
                                        <div className="adv-field">
                                            <label>NISN</label>
                                            <input type="text" placeholder="Cari NISN..." value={advFilter.nisn} onChange={e => setAdvFilter({...advFilter, nisn: e.target.value})} />
                                        </div>
                                        <div className="adv-field">
                                            <label>Nama Siswa</label>
                                            <input type="text" placeholder="Cari nama..." value={advFilter.siswaName} onChange={e => setAdvFilter({...advFilter, siswaName: e.target.value})} />
                                        </div>
                                        <div className="adv-field">
                                            <label>Tahun Lulus</label>
                                            <select value={advFilter.tahunLulus} onChange={e => setAdvFilter({...advFilter, tahunLulus: e.target.value})}>
                                                <option value="">Semua</option>
                                                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* DESKTOP VIEW TABLE */}
                            <div className="table-responsive desktop-only" style={{ padding: "0 1.5rem 1.5rem" }}>
                                {isLoading ? (
                                    <div className="m-loading"><Loader2 className="animate-spin" /> Memuat data...</div>
                                ) : filteredResults.length > 0 ? (
                                    <>
                                        <table className="premium-table" style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
                                            <thead>
                                                <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left", fontSize: "0.85rem", color: "#64748b" }}>
                                                    <th style={{ padding: "1rem" }}>Tanggal Upload</th>
                                                    <th style={{ padding: "1rem" }}>Nama Siswa</th>
                                                    <th style={{ padding: "1rem" }}>Nama File</th>
                                                    <th style={{ padding: "1rem" }}>Status OCR</th>
                                                    <th style={{ padding: "1rem", textAlign: "right" }}>Opsi Kelola</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedResults.map(item => (
                                                    <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                                        <td style={{ padding: "1rem" }} suppressHydrationWarning={true}>{new Date(item.uploadDate).toLocaleDateString('id-ID')}</td>
                                                        <td style={{ padding: "1rem", fontWeight: "700" }}>{item.siswaName || "Siswa Tidak Diketahui"}</td>
                                                        <td style={{ padding: "1rem", fontFamily: "monospace", fontSize: "0.8rem", color: "#64748b" }}>{item.fileName}</td>
                                                        <td style={{ padding: "1rem" }}>
                                                            <span className={`m-pill ok`}>
                                                                {item.statusOCR === 'Done' ? '✅ Valid' : '⏳ Proses'}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "1rem", textAlign: "right" }}>
                                                            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                                                                <Link href={item.alumniId ? `/dokumen-transkrip/${item.alumniId}` : `/ocr-result?id=${item.id}`} className="m-btn-tool" style={{ width: "32px", height: "32px" }}><Eye size={16} /></Link>
                                                                <button onClick={() => handleDelete(item.id)} className="m-btn-tool" style={{ width: "32px", height: "32px", color: "#dc2626" }}><Trash2 size={16} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {/* Pagination */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0 0.5rem' }}>
                                            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Menampilkan <strong>{(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredResults.length)}</strong> dari <strong>{filteredResults.length}</strong> data</span>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => handlePageChange(safePage - 1)} disabled={safePage === 1} className="btn-vibrant-outline" style={{ padding: "0.4rem 1rem", borderRadius: "8px" }}>Sebelumnya</button>
                                                <button onClick={() => handlePageChange(safePage + 1)} disabled={safePage === totalPages} className="btn-vibrant-outline" style={{ padding: "0.4rem 1rem", borderRadius: "8px" }}>Berikutnya</button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="m-empty-state"><p>Data rekap transkrip file scan kosong</p></div>
                                )}
                            </div>
                        </>
                    )}

                    {/* TAB 2: DATA TRANSKRIP AKADEMIK */}
                    {activeTab === "data" && (
                        <>
                            <div className="panel-header m-panel-header">
                                <div className="m-search-group">
                                    <div className="m-search-input-wrapper">
                                        <Search size={18} color="#94a3b8" />
                                        <input 
                                            type="text" 
                                            placeholder="Cari nama alumni atau NISN..." 
                                            value={academicSearch} 
                                            onChange={e => {
                                                setAcademicSearch(e.target.value);
                                                if (academicSmartMode) setAcademicSmartMode(false);
                                            }} 
                                        />
                                    </div>
                                    <div className="m-filter-actions">
                                        <button 
                                            type="button"
                                            className={`m-btn-smart ${academicSmartMode ? 'active' : ''}`}
                                            onClick={handleAcademicSmartSearch}
                                            title="Pencarian Cerdas AI"
                                            disabled={isAcademicSmartSearching}
                                        >
                                            {isAcademicSmartSearching ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                            <span>Smart</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="academic-list-container" style={{ padding: "1.5rem" }}>
                                {isAcademicLoading ? (
                                    <div className="m-loading"><Loader2 className="animate-spin" /> Memuat data akademik...</div>
                                ) : paginatedAcademicData.length > 0 ? (
                                    <>
                                        <div className="desktop-only" style={{ overflowX: "auto" }}>
                                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                                <thead>
                                                    <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b", fontWeight: "750", fontSize: "0.85rem" }}>
                                                        <th style={{ padding: "1rem" }}>NAMA ALUMNI</th>
                                                        <th style={{ padding: "1rem" }}>NISN / NIS</th>
                                                        <th style={{ padding: "1rem" }}>TAHUN LULUS</th>
                                                        <th style={{ padding: "1rem", textAlign: "center" }}>SEMESTER</th>
                                                        {academicSmartMode && <th style={{ padding: "1rem", textAlign: "center" }}>KEMIRIPAN</th>}
                                                        <th style={{ padding: "1rem", textAlign: "center" }}>RATA-RATA UMUM</th>
                                                        <th style={{ padding: "1rem", textAlign: "right" }}>AKSI</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paginatedAcademicData.map((item) => (
                                                        <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9", fontSize: "0.95rem" }}>
                                                            <td style={{ padding: "1rem", fontWeight: "700" }}>
                                                                <Link href={`/dokumen-transkrip/${item.id}`} style={{ color: "#1e40af", textDecoration: "none" }}>
                                                                    {item.namaLengkap}
                                                                </Link>
                                                            </td>
                                                            <td style={{ padding: "1rem", color: "#64748b" }}>{item.nisn} / {item.nis}</td>
                                                            <td style={{ padding: "1rem" }}>{item.tahunLulus}</td>
                                                            <td style={{ padding: "1rem", textAlign: "center", fontWeight: "700" }}>
                                                                {item.nilaiSemesterFull?.length ? (item.nilaiSemesterFull.length % 2 === 1 ? "Semester Ganjil" : "Semester Genap") : "-"}
                                                            </td>
                                                            {academicSmartMode && (
                                                                <td style={{ padding: "1rem", textAlign: "center" }}>
                                                                    <div className="score-badge">{item.score}% Match</div>
                                                                </td>
                                                            )}
                                                            <td style={{ padding: "1rem", textAlign: "center" }}>
                                                                <span style={{ background: "#dbeafe", color: "#1e40af", padding: "0.25rem 0.75rem", borderRadius: "10px", fontWeight: "800" }}>
                                                                    {item.rataRata?.toFixed(2)}
                                                                </span>
                                                            </td>
                                                            <td style={{ padding: "1rem", textAlign: "right" }}>
                                                                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                                                                    <button 
                                                                        onClick={() => openEditAcademicModal(item)} 
                                                                        className="m-btn-tool" style={{ width: "32px", height: "32px", color: "#16a34a" }}
                                                                    >
                                                                        <Settings size={16} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteAcademic(item.id)} 
                                                                        className="m-btn-tool" style={{ width: "32px", height: "32px", color: "#dc2626" }}
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0 0.5rem' }}>
                                            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Menampilkan <strong>{(safeAcadPage - 1) * PAGE_SIZE + 1}–{Math.min(safeAcadPage * PAGE_SIZE, filteredAcademicResults.length)}</strong> dari <strong>{filteredAcademicResults.length}</strong> data</span>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => handleAcadPageChange(safeAcadPage - 1)} disabled={safeAcadPage === 1} className="btn-vibrant-outline" style={{ padding: "0.4rem 1rem", borderRadius: "8px" }}>Sebelumnya</button>
                                                <button onClick={() => handleAcadPageChange(safeAcadPage + 1)} disabled={safeAcadPage === totalAcadPages} className="btn-vibrant-outline" style={{ padding: "0.4rem 1rem", borderRadius: "8px" }}>Berikutnya</button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="m-empty-state" style={{ padding: "3rem 1rem", textAlign: "center" }}>
                                        <div className="m-empty-icon" style={{ fontSize: "3.5rem" }}>📊</div>
                                        <p style={{ color: "#64748b", fontWeight: "650", margin: "1rem 0" }}>Belum ada data nilai transkrip akademik.</p>
                                        <button onClick={openCreateAcademicModal} className="m-btn-add-primary bg-transkrip" style={{ border: "none", cursor: "pointer" }}>
                                            <Plus size={20} />
                                            <span>Tambah Transkrip</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>

                {/* Academic Modal Form */}
                {showAcademicModal && (
                    <div style={{
                        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(8px)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 9999, padding: "1rem"
                    }}>
                        <div style={{
                            background: "white", borderRadius: "24px", width: "100%", maxWidth: "650px",
                            maxHeight: "90vh", overflowY: "auto", padding: "2rem",
                            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: "850", color: "#1e293b" }}>
                                    {isEditingAcademic ? "✏️ Edit Transkrip Nilai" : "📊 Input Transkrip Nilai"}
                                </h3>
                                <button onClick={() => setShowAcademicModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveAcademic}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
                                    
                                    {/* Student Selection */}
                                    <div>
                                        <label style={{ fontSize: "0.72rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                                            Alumni / Siswa
                                        </label>
                                        <select
                                            value={selectedStudentId}
                                            onChange={e => setSelectedStudentId(e.target.value)}
                                            disabled={isEditingAcademic}
                                            style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1.5px solid #e2e8f0", fontSize: "0.95rem", outline: "none", background: isEditingAcademic ? "#f8fafc" : "white" }}
                                            required
                                        >
                                            <option value="">-- Pilih Alumni --</option>
                                            {alumniOptions.map(a => (
                                                <option key={a.id} value={a.id}>
                                                    {a.namaLengkap} ({a.nisn || a.nis})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Semester Sub-tabs inside the Modal */}
                                    <div>
                                        <label style={{ fontSize: "0.72rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                                            Pilih Semester Input Nilai
                                        </label>
                                        <div className="grid-responsive-6-to-3">
                                            {["1", "2", "3", "4", "5", "6"].map(sem => (
                                                <button
                                                    key={sem}
                                                    type="button"
                                                    onClick={() => setActiveFormSemester(sem)}
                                                    style={{
                                                        padding: "0.5rem 0",
                                                        borderRadius: "8px",
                                                        border: activeFormSemester === sem ? "none" : "1.5px solid #e2e8f0",
                                                        background: activeFormSemester === sem ? "#1e40af" : "white",
                                                        color: activeFormSemester === sem ? "white" : "#64748b",
                                                        fontWeight: "800",
                                                        fontSize: "0.85rem",
                                                        cursor: "pointer",
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    Sem {sem}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Nilai Rapor Per Mapel for the Active Form Semester */}
                                    <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "1rem" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                            <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "#475569" }}>
                                                📖 NILAI AKADEMIK MAPEL (SEMESTER {activeFormSemester})
                                            </span>
                                            <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "#1e40af", background: "#dbeafe", padding: "2px 8px", borderRadius: "6px" }}>
                                                RATA: {((semestersGrades[activeFormSemester] || []).reduce((acc, curr) => acc + Number(curr.nilai || 0), 0) / ((semestersGrades[activeFormSemester] || []).length || 1)).toFixed(2)}
                                            </span>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxHeight: "250px", overflowY: "auto", paddingRight: "0.5rem" }}>
                                            {(semestersGrades[activeFormSemester] || []).map((n, idx) => (
                                                <div key={n.mataPelajaranId} style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: "1rem", alignItems: "center" }}>
                                                    <span style={{ fontSize: "0.9rem", color: "#334155" }}>{n.namaMapel}</span>
                                                    <input 
                                                        type="number" min="0" max="100"
                                                        value={n.nilai || ""}
                                                        onChange={e => {
                                                            const allGrades = { ...semestersGrades };
                                                            allGrades[activeFormSemester][idx].nilai = Number(e.target.value);
                                                            setSemestersGrades(allGrades);
                                                        }}
                                                        style={{ padding: "0.4rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.9rem", textAlign: "center", outline: "none" }}
                                                        required
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                                    <button type="button" onClick={() => setShowAcademicModal(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "12px", fontWeight: "700", background: "#f1f5f9", color: "#64748b", border: "none", cursor: "pointer" }}>Batal</button>
                                    <button type="submit" style={{ padding: "0.75rem 1.5rem", borderRadius: "12px", fontWeight: "700", background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)", color: "white", border: "none", cursor: "pointer" }}>Simpan Data</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal for File scan */}
                {deletePendingId !== null && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
                        <div style={{ background: "white", borderRadius: "16px", width: "100%", maxWidth: "440px", overflow: "hidden", boxShadow: "0 25px 80px rgba(220,38,38,0.28)", animation: "deleteModalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
                            <div style={{ height: "5px", background: "linear-gradient(90deg, #7f1d1d, #dc2626, #f87171)" }} />
                            <div style={{ padding: "2rem" }}>
                                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                                    <div style={{ width: "72px", height: "72px", background: "linear-gradient(135deg,#fee2e2,#fecaca)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", boxShadow: "0 6px 20px rgba(220,38,38,0.2)" }}>
                                        <AlertCircle size={36} color="#dc2626" />
                                    </div>
                                    <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#111827", marginBottom: "0.5rem" }}>Hapus Dokumen Transkrip?</h3>
                                    <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.6 }}>File transkrip ini akan dihapus secara permanen dari sistem.</p>
                                    <div style={{ marginTop: "1rem", padding: "0.65rem 0.9rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.4rem", textAlign: "left" }}>
                                        <span>⚠️</span>
                                        <span style={{ fontSize: "0.8rem", color: "#991b1b", fontWeight: "700" }}>Tindakan ini tidak dapat dibatalkan!</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: "0.75rem" }}>
                                    <button onClick={() => setDeletePendingId(null)} disabled={isDeleting} style={{ flex: 1, padding: "0.75rem", border: "1.5px solid #e5e7eb", borderRadius: "10px", background: "white", color: "#374151", cursor: "pointer", fontWeight: "700" }}>Batal</button>
                                    <button onClick={confirmDelete} disabled={isDeleting} style={{ flex: 1, padding: "0.75rem", border: "none", borderRadius: "10px", background: isDeleting ? "#fca5a5" : "linear-gradient(135deg,#dc2626,#ef4444)", color: "white", cursor: isDeleting ? "not-allowed" : "pointer", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: isDeleting ? "none" : "0 4px 12px rgba(220,38,38,0.35)" }}>
                                        {isDeleting ? (<><span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin2 0.8s linear infinite" }} /> Menghapus...</>) : (<><Trash2 size={15} /> Ya, Hapus</>)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <style jsx global>{`
                .premium-container { padding: 2rem; max-width: 1400px; margin: 0 auto; color: #1e293b; font-family: 'Inter', sans-serif; }
                .mobile-only { display: none; }
                .page-hero { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
                .hero-badge { display: inline-block; padding: 0.4rem 1rem; background: #e0f2fe; color: #075985; font-weight: 750; font-size: 0.75rem; text-transform: uppercase; border-radius: 20px; margin-bottom: 0.75rem; }
                .hero-content h1 { font-size: 2.8rem; font-weight: 800; margin: 0; }
                
                .btn-vibrant-add { background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%); color: white; text-decoration: none; padding: 0.9rem 1.8rem; border-radius: 14px; font-weight: 700; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 10px 20px -5px rgba(30, 64, 175, 0.3); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .btn-vibrant-add:hover { transform: translateY(-3px); }

                .btn-vibrant-outline { background: white; border: 2px solid #1e40af; color: #1e40af; padding: 0.8rem 1.5rem; border-radius: 14px; font-weight: 700; display: flex; align-items: center; gap: 0.75rem; cursor: pointer; transition: all 0.3s; }
                .btn-vibrant-outline:hover { background: #eff6ff; transform: translateY(-3px); }
                .hero-actions { display: flex; gap: 1rem; align-items: center; }

                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
                .stat-card { padding: 1.5rem; border-radius: 20px; background: rgba(255,255,255,0.8); display: flex; align-items: center; gap: 1.25rem; border: 1px solid rgba(255,255,255,0.7); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
                @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } }
                .stat-icon.blue { background: #eff6ff; color: #1e40af; }
                .stat-icon.green { background: #f0fdf4; color: #16a34a; }
                .stat-icon.orange { background: #fff7ed; color: #ea580c; }
                .stat-label { font-size: 0.85rem; font-weight: 600; color: #64748b; }
                .stat-value { font-size: 1.8rem; font-weight: 800; margin: 0; }

                .main-panel { border-radius: 24px; background: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.7); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); overflow: hidden; }
                
                .m-panel-header { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.4); }
                .m-search-group { display: flex; align-items: center; gap: 1rem; width: 100%; }
                .m-search-input-wrapper { display: flex; align-items: center; background: white; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 0.5rem 1.25rem; flex: 1; }
                .m-search-input-wrapper input { border: none; background: transparent; outline: none; flex: 1; padding: 0.6rem; font-size: 0.95rem; font-weight: 600; color: #1e293b; }
                .m-status-select { border: none; background: transparent; font-weight: 750; color: #1e293b; font-size: 0.85rem; outline: none; border-left: 2px solid #f1f5f9; padding-left: 1rem; cursor: pointer; height: 30px; }
                
                .m-filter-actions { display: flex; gap: 0.75rem; }
                .m-btn-smart { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 14px; padding: 0 1.25rem; height: 48px; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; }
                .m-btn-filter { background: white; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 0 1.5rem; height: 48px; font-weight: 750; font-size: 0.9rem; color: #64748b; display: flex; align-items: center; justify-content: center; gap: 0.75rem; cursor: pointer; }
                .m-btn-filter.active { background: #1e40af !important; color: white !important; }

                .adv-filter-panel { background: white; border: 1.5px solid #e2e8f0; border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
                .adv-filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; font-weight: 800; font-size: 0.95rem; }
                .adv-close-btn { display: flex; align-items: center; gap: 0.4rem; background: #fee2e2; color: #dc2626; border: none; border-radius: 10px; padding: 0.45rem 1rem; font-weight: 750; cursor: pointer; }
                .adv-filter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
                .adv-field { display: flex; flex-direction: column; gap: 0.4rem; }
                .adv-field label { font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase; }
                .adv-field input, .adv-field select { border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.65rem 1rem; font-size: 0.9rem; font-weight: 600; outline: none; background: #f8fafc; }

                .m-btn-tool { background: white; border: 1.5px solid #e2e8f0; border-radius: 14px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; }
                .m-btn-tool:hover { background: #f8fafc; border-color: #1e40af; color: #1e40af; }

                @media (max-width: 768px) {
                    .premium-container { padding: 0.75rem; background: #f8fafc; min-height: 100vh; }
                    .desktop-only { display: none !important; }
                    .mobile-only { display: block !important; }

                    .m-header-minimal { margin-bottom: 1rem; }
                    .m-back-link { display: inline-flex; align-items: center; gap: 0.5rem; background: #f1f5f9; padding: 0.6rem 1rem; border-radius: 12px; color: #475569; text-decoration: none; font-weight: 700; }

                    .m-hero-minimal { text-align: center; margin-bottom: 1.5rem; }
                    .m-hero-badge { display: inline-block; background: #e0f2fe; color: #1e40af; font-size: 0.7rem; font-weight: 800; padding: 0.4rem 1.25rem; border-radius: 20px; text-transform: uppercase; margin-bottom: 0.5rem; }
                    .m-hero-title { font-size: 1.6rem; font-weight: 850; color: #1e293b; margin: 0 0 0.25rem; }
                    .m-hero-subtitle { font-size: 0.85rem; color: #64748b; }

                    .m-stats-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
                    .m-stat-half { grid-column: span 1; }
                    .m-stat-full { grid-column: span 2; }
                    .m-main-panel { background: transparent !important; box-shadow: none !important; border: none !important; }
                }
                
                .m-empty-state { text-align: center; background: white; padding: 3rem 2rem; border-radius: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
                .m-empty-icon { font-size: 4rem; opacity: 0.2; margin-bottom: 1rem; }
                .m-empty-state p { color: #64748b; font-weight: 600; }
                .m-btn-add-primary { color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 30px; font-weight: 750; display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; }
                .m-btn-add-primary.bg-transkrip { background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%); }

                .m-doc-card { background: white; border-radius: 20px; padding: 1.25rem; margin-bottom: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; display: block; text-decoration: none; color: inherit; }
                .avatar-md { width: 48px; height: 48px; min-width: 48px; background: #eff6ff; color: #1e40af; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
                .m-tag { display: inline-block; font-size: 0.65rem; font-weight: 800; background: #f1f5f9; color: #64748b; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; }
                
                .m-pill { font-size: 0.72rem; font-weight: 750; padding: 4px 12px; border-radius: 20px; }
                .m-pill.ok { background: #dcfce7; color: #15803d; }
                .m-pill.wait { background: #fef3c7; color: #92400e; }
                
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        
            {/* Toast Notification */}
            {toast.show && (
                <div className="toast-notification" style={{
                    position: "fixed",
                    top: "24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: toast.type === "success" ? "#dcfce7" : "#fee2e2",
                    color: toast.type === "success" ? "#166534" : "#991b1b",
                    padding: "1rem 1.5rem",
                    borderRadius: "16px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    zIndex: 10000,
                    animation: "toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}>
                    <AlertCircle size={18} color={toast.type === "success" ? "#166534" : "#991b1b"} />
                    <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>{toast.msg}</span>
                </div>
            )}
        </AdminLayout>
    );
}
