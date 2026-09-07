"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import {
    FileText, Plus, Search, Eye, Trash2, Loader2, CheckCircle2, Filter, ChevronRight, ArrowLeft, Sparkles, X, Download, Settings, BookOpen, AlertCircle, Calendar
} from "lucide-react";
import Link from "next/link";
import * as api from "../../../services/api";
import * as XLSX from "xlsx";

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => (1980 + i).toString()).reverse();

const dummyLeggerData = [
    {
        bukuIndukId: 1,
        namaAlumni: "Ahmad Faisal Ramadhan",
        nisn: "0021001234",
        nis: "21001",
        semesterId: -1,
        semester: "1",
        rataRata: 85.5,
        kehadiranSakit: 2,
        kehadiranIzin: 1,
        kehadiranAlfa: 0,
        sikapSpiritual: "Sangat Baik",
        sikapSosial: "Baik",
        catatanWaliKelas: "Ahmad adalah siswa yang rajin dan berprestasi. Terus tingkatkan belajar!",
        nilaiMataPelajaran: [
            { nama: "Al-Qur'an Hadis", nilai: 88 },
            { nama: "Bahasa Indonesia", nilai: 87 },
            { nama: "Matematika", nilai: 80 },
            { nama: "Ilmu Pengetahuan Alam", nilai: 87 }
        ]
    },
    {
        bukuIndukId: 2,
        namaAlumni: "Siti Aminah Putri",
        nisn: "0021002345",
        nis: "21002",
        semesterId: -2,
        semester: "2",
        rataRata: 83.25,
        kehadiranSakit: 1,
        kehadiranIzin: 0,
        kehadiranAlfa: 0,
        sikapSpiritual: "Baik",
        sikapSosial: "Sangat Baik",
        catatanWaliKelas: "Siti sangat aktif dalam diskusi kelas. Pertahankan keaktifannya!",
        nilaiMataPelajaran: [
            { nama: "Al-Qur'an Hadis", nilai: 85 },
            { nama: "Bahasa Indonesia", nilai: 86 },
            { nama: "Matematika", nilai: 78 },
            { nama: "Ilmu Pengetahuan Alam", nilai: 84 }
        ]
    }
];

export default function DokumenRaporPage() {
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
    const [academicSmartMode, setAcademicSmartMode] = useState(false);
    const [isAcademicSmartSearching, setIsAcademicSmartSearching] = useState(false);
    const [academicSmartResults, setAcademicSmartResults] = useState<any[]>([]);

    // Detail Modal States
    const [selectedDetailItem, setSelectedDetailItem] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;

    // ── Academic Tab States (Legger Kelas) ──
    const [activeTab, setActiveTab] = useState<"file" | "data">("file");
    const [academicData, setAcademicData] = useState<any[]>([]);
    const [isAcademicLoading, setIsAcademicLoading] = useState(false);
    const [showAcademicModal, setShowAcademicModal] = useState(false);
    const [isEditingAcademic, setIsEditingAcademic] = useState(false);
    const [academicForm, setAcademicForm] = useState<any>({
        bukuIndukId: "",
        semester: "1",
        kehadiranSakit: 0,
        kehadiranIzin: 0,
        kehadiranAlfa: 0,
        sikapSpiritual: "Baik",
        sikapSosial: "Baik",
        catatanWaliKelas: "",
        nilaiMataPelajaran: []
    });
    const [alumniOptions, setAlumniOptions] = useState<any[]>([]);
    const [mapelOptions, setMapelOptions] = useState<any[]>([]);
    const [academicSearch, setAcademicSearch] = useState("");
    const [academicPage, setAcademicPage] = useState(1);

    const fetchRecords = async () => {
        setIsLoading(true);
        try {
            const data = await api.getArchives("Rapor");
            setDbData(data || []);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    const fetchAcademicRecords = async () => {
        setIsAcademicLoading(true);
        try {
            const response = await api.getBukuIndukList();
            setAcademicData(response.data || []);
        } catch (err) { console.error(err); }
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

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus rekap rapor ini?")) return;
        try {
            await api.deleteArchive(id);
            fetchRecords();
        } catch (err: any) { alert(err.message); }
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
                    const matchedDbItems = displayAcademicData.filter(dbItem => {
                        const dbName = (dbItem.namaAlumni || "").toLowerCase();
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
                        if (!matchedResults.some(r => r.bukuIndukId === dbItem.bukuIndukId && r.semester === dbItem.semester)) {
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

    // Flatten semesters from Buku Induk for academic tab
    const flattenedAcademicData = academicData.flatMap(student => {
        const semesters = student.nilaiSemesterFull || [];
        return semesters.map((sem: any) => ({
            bukuIndukId: student.id,
            namaAlumni: student.namaLengkap,
            nisn: student.nisn,
            nis: student.nis,
            semesterId: sem.id,
            semester: sem.semester,
            rataRata: sem.rata,
            kehadiranSakit: sem.leggerTambahan?.kehadiranSakit ?? 0,
            kehadiranIzin: sem.leggerTambahan?.kehadiranIzin ?? 0,
            kehadiranAlfa: sem.leggerTambahan?.kehadiranAlfa ?? 0,
            sikapSpiritual: sem.leggerTambahan?.sikapSpiritual ?? "Baik",
            sikapSosial: sem.leggerTambahan?.sikapSosial ?? "Baik",
            catatanWaliKelas: sem.leggerTambahan?.catatanWaliKelas ?? "",
            nilaiMataPelajaran: sem.mataPelajaran || [],
            studentRaw: student
        }));
    });

    const displayAcademicData = flattenedAcademicData;

    const hasAdvFilter = advFilter.nisn || advFilter.tahunLulus || advFilter.siswaName;
    const filteredResults = smartMode ? smartResults : dbData.filter(item => {
        const matchesSearch = item.siswaName?.toLowerCase().includes(searchTerm.toLowerCase()) || item.fileName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "Semua" || item.statusOCR === filterStatus;
        const matchesNisn = !advFilter.nisn || item.nisn?.includes(advFilter.nisn);
        const matchesTahun = !advFilter.tahunLulus || item.tahunLulus === advFilter.tahunLulus;
        const matchesName = !advFilter.siswaName || item.siswaName?.toLowerCase().includes(advFilter.siswaName.toLowerCase());
        return matchesSearch && matchesStatus && matchesNisn && matchesTahun && matchesName;
    });

    const filteredAcademicResults = academicSmartMode ? academicSmartResults : displayAcademicData.filter(item => {
        const q = academicSearch.toLowerCase();
        return item.namaAlumni.toLowerCase().includes(q) || item.nisn.includes(q) || item.nis.includes(q) || `semester ${item.semester}`.toLowerCase().includes(q);
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

    // Reset pages on filters
    useEffect(() => { setCurrentPage(1); }, [searchTerm, filterStatus, advFilter, smartMode]);
    useEffect(() => { setAcademicPage(1); }, [academicSearch]);

    const openCreateAcademicModal = () => {
        setIsEditingAcademic(false);
        setAcademicForm({
            bukuIndukId: "",
            semester: "1",
            kehadiranSakit: 0,
            kehadiranIzin: 0,
            kehadiranAlfa: 0,
            sikapSpiritual: "Baik",
            sikapSosial: "Baik",
            catatanWaliKelas: "",
            nilaiMataPelajaran: mapelOptions.map(m => ({
                mataPelajaranId: m.id,
                namaMapel: m.namaMapel,
                nilai: 0
            }))
        });
        setShowAcademicModal(true);
    };

    const openEditAcademicModal = (item: any) => {
        setIsEditingAcademic(true);
        setAcademicForm({
            bukuIndukId: item.bukuIndukId,
            semester: item.semester,
            kehadiranSakit: item.kehadiranSakit,
            kehadiranIzin: item.kehadiranIzin,
            kehadiranAlfa: item.kehadiranAlfa,
            sikapSpiritual: item.sikapSpiritual,
            sikapSosial: item.sikapSosial,
            catatanWaliKelas: item.catatanWaliKelas,
            nilaiMataPelajaran: mapelOptions.map(m => {
                const existingNilai = item.nilaiMataPelajaran?.find((nu: any) => nu.nama === m.namaMapel || nu.namaMapel === m.namaMapel);
                return {
                    mataPelajaranId: m.id,
                    namaMapel: m.namaMapel,
                    nilai: existingNilai ? existingNilai.nilai : 0
                };
            })
        });
        setShowAcademicModal(true);
    };

    const handleSaveAcademic = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const studentId = Number(academicForm.bukuIndukId);
            if (!studentId) {
                alert("Pilih alumni terlebih dahulu!");
                return;
            }

            setIsAcademicLoading(true);

            // 1. Fetch detailed student record
            const studentDetail = await api.getBukuIndukDetail(studentId);

            // 2. Prepare current semesters
            const currentSemesters = studentDetail.nilaiSemester || [];
            const mappedSemesters = currentSemesters.map((s: any) => ({
                semester: s.semester,
                rata: s.rata,
                mataPelajaran: (s.mataPelajaran || []).map((m: any) => ({
                    nama: m.nama,
                    nilai: Number(m.nilai)
                }))
            }));

            // Calculate new average
            const avg = Number((academicForm.nilaiMataPelajaran.reduce((acc: number, curr: any) => acc + Number(curr.nilai || 0), 0) / (academicForm.nilaiMataPelajaran.length || 1)).toFixed(2));
            const newSemData = {
                semester: academicForm.semester,
                rata: avg,
                mataPelajaran: academicForm.nilaiMataPelajaran.map((m: any) => ({
                    nama: m.namaMapel,
                    nilai: Number(m.nilai)
                }))
            };

            const idx = mappedSemesters.findIndex((s: any) => s.semester === academicForm.semester);
            if (idx >= 0) {
                mappedSemesters[idx] = newSemData;
            } else {
                mappedSemesters.push(newSemData);
            }

            // 3. Update Buku Induk
            const updatePayload = {
                ...studentDetail,
                nilaiSemester: mappedSemesters,
                rataRata: Number((mappedSemesters.reduce((acc: number, curr: any) => acc + curr.rata, 0) / (mappedSemesters.length || 1)).toFixed(2))
            };

            await api.updateBukuInduk(studentId, updatePayload);

            // 4. Retrieve new semester ID
            const updatedDetail = await api.getBukuIndukDetail(studentId);
            const newSemester = updatedDetail.nilaiSemesterFull?.find((s: any) => s.semester === academicForm.semester);

            if (newSemester && newSemester.id) {
                // 5. Upsert Legger Tambahan
                const leggerPayload = {
                    nilaiSemesterId: newSemester.id,
                    kehadiranSakit: Number(academicForm.kehadiranSakit || 0),
                    kehadiranIzin: Number(academicForm.kehadiranIzin || 0),
                    kehadiranAlfa: Number(academicForm.kehadiranAlfa || 0),
                    sikapSpiritual: academicForm.sikapSpiritual,
                    sikapSosial: academicForm.sikapSosial,
                    catatanWaliKelas: academicForm.catatanWaliKelas
                };
                await api.upsertLeggerTambahan(leggerPayload);
            }

            showToast("Data Legger Kelas berhasil disimpan!", "success");
            setShowAcademicModal(false);
            fetchAcademicRecords();
        } catch (err: any) {
            alert(err.message || "Gagal menyimpan data");
        } finally {
            setIsAcademicLoading(false);
        }
    };

    const handleDeleteAcademic = async (studentId: number, semester: string) => {
        if (!confirm(`Hapus data Legger Kelas Semester ${semester} untuk siswa ini?`)) return;
        setIsAcademicLoading(true);
        try {
            const studentDetail = await api.getBukuIndukDetail(studentId);
            const currentSemesters = studentDetail.nilaiSemester || [];
            
            const updatedSemesters = currentSemesters
                .filter((s: any) => s.semester !== semester)
                .map((s: any) => ({
                    semester: s.semester,
                    rata: s.rata,
                    mataPelajaran: (s.mataPelajaran || []).map((m: any) => ({
                        nama: m.nama,
                        nilai: Number(m.nilai)
                    }))
                }));
                
            const newRata = updatedSemesters.length > 0 
                ? Number((updatedSemesters.reduce((acc: number, curr: any) => acc + curr.rata, 0) / updatedSemesters.length).toFixed(2))
                : 0;

            const updatePayload = {
                ...studentDetail,
                nilaiSemester: updatedSemesters,
                rataRata: newRata
            };

            await api.updateBukuInduk(studentId, updatePayload);
            alert("Data Legger Kelas berhasil dihapus!");
            fetchAcademicRecords();
        } catch (err: any) {
            alert(err.message || "Gagal menghapus data");
        } finally {
            setIsAcademicLoading(false);
        }
    };

    const exportToExcel = () => {
        if (filteredResults.length === 0) {
            alert("Peringatan: Tidak ada data rapor/legger yang dapat diekspor.");
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Rapor");
        XLSX.writeFile(workbook, `Backup_Rapor_${new Date().toISOString().slice(0,10)}.xlsx`);
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
                    <div className="m-hero-badge bg-rapor">ARSIP LEGGER KELAS</div>
                    <h1 className="m-hero-title">{activeTab === "file" ? "Dokumen Legger Kelas" : "Data Rekap Legger"}</h1>
                    <p className="m-hero-subtitle">Kelola data alumni dengan mudah</p>
                </div>

                {/* HEADER */}
                <header className="page-hero">
                    <div className="hero-content">
                        <div className="hero-badge color-rapor">Arsip Nilai</div>
                        <h1>{activeTab === "file" ? "Rekap Legger Kelas" : "Data Rekap Legger"}</h1>
                        <p>{activeTab === "file" 
                            ? "Kumpulan nilai per semester alumni dalam format digital yang terorganisir."
                            : "Data nilai akademik per semester beserta kehadiran dan sikap alumni."}</p>
                    </div>
                    <div className="hero-actions desktop-only">
                        {activeTab === "file" ? (
                            <>
                                <button className="btn-vibrant-outline color-rapor-outline" onClick={exportToExcel} title="Export ke Excel">
                                    <Download size={20} />
                                    <span>Export Excel</span>
                                </button>
                                <Link href="/upload" className="btn-vibrant-add color-rapor">
                                    <Plus size={20} />
                                    <span>Unggah Legger Kelas</span>
                                </Link>
                            </>
                        ) : (
                            <button className="btn-vibrant-add color-rapor" onClick={openCreateAcademicModal}>
                                <Plus size={20} />
                                <span>Tambah Legger Kelas</span>
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
                            background: activeTab === "file" ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" : "white",
                            color: activeTab === "file" ? "white" : "#64748b",
                            boxShadow: activeTab === "file" ? "0 4px 12px rgba(124, 58, 237, 0.2)" : "0 2px 4px rgba(0,0,0,0.02)",
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
                            background: activeTab === "data" ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" : "white",
                            color: activeTab === "data" ? "white" : "#64748b",
                            boxShadow: activeTab === "data" ? "0 4px 12px rgba(124, 58, 237, 0.2)" : "0 2px 4px rgba(0,0,0,0.02)",
                            border: activeTab === "data" ? "none" : "1px solid #e2e8f0",
                            transition: "all 0.2s"
                        }}
                    >
                        📚 Data Legger Kelas
                    </button>
                </div>

                {/* STATS */}
                {activeTab === "file" && (
                    <section className="stats-grid m-stats-layout">
                        <div className="stat-card glass">
                            <div className="stat-icon purple"><FileText size={20} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Total File Legger</span>
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
                                            placeholder="Cari nama alumni..." 
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
                                        <span>🔍 Filter Lanjutan Legger Kelas</span>
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
                                                            <span className={`m-pill ${item.statusOCR === 'Done' ? 'ok' : 'wait'}`}>
                                                                {item.statusOCR === 'Done' ? '✅ Aman' : '⏳ Proses'}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "1rem", textAlign: "right" }}>
                                                            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                                                                <Link href={item.alumniId ? `/dokumen-rapor/${item.alumniId}` : `/ocr-result?id=${item.id}`} className="m-btn-tool" style={{ width: "32px", height: "32px" }}><Eye size={16} /></Link>
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
                                    <div className="m-empty-state"><p>Data rekap file scan kosong</p></div>
                                )}
                            </div>
                        </>
                    )}

                    {/* TAB 2: DATA LEGER KELAS */}
                    {activeTab === "data" && (
                        <>
                            <div className="panel-header m-panel-header">
                                <div className="m-search-group">
                                    <div className="m-search-input-wrapper">
                                        <Search size={18} color="#94a3b8" />
                                        <input 
                                            type="text" 
                                            placeholder="Cari nama alumni, NISN atau Semester..." 
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
                                    <div className="m-loading"><Loader2 className="animate-spin" /> Memuat data rekap akademik...</div>
                                ) : paginatedAcademicData.length > 0 ? (
                                    <>
                                        <div className="desktop-only" style={{ overflowX: "auto" }}>
                                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                                <thead>
                                                    <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b", fontWeight: "750", fontSize: "0.85rem" }}>
                                                        <th style={{ padding: "1rem" }}>NAMA ALUMNI</th>
                                                        <th style={{ padding: "1rem" }}>NISN / NIS</th>
                                                        <th style={{ padding: "1rem" }}>SEMESTER</th>
                                                        <th style={{ padding: "1rem", textAlign: "center" }}>SICK / PERMIT / ALFA</th>
                                                        <th style={{ padding: "1rem", textAlign: "center" }}>SPIRTUAL & SOSIAL</th>
                                                        {academicSmartMode && <th style={{ padding: "1rem", textAlign: "center" }}>KEMIRIPAN</th>}
                                                        <th style={{ padding: "1rem", textAlign: "center" }}>RATA-RATA</th>
                                                        <th style={{ padding: "1rem", textAlign: "right" }}>AKSI</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paginatedAcademicData.map((item, idx) => (
                                                        <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9", fontSize: "0.95rem" }}>
                                                            <td style={{ padding: "1rem", fontWeight: "700" }}>
                                                                <Link href={`/dokumen-rapor/${item.bukuIndukId}`} style={{ color: "#7c3aed", textDecoration: "none" }}>
                                                                    {item.namaAlumni}
                                                                </Link>
                                                            </td>
                                                            <td style={{ padding: "1rem", color: "#64748b" }}>{item.nisn || "-"} / {item.nis}</td>
                                                            <td style={{ padding: "1rem", fontWeight: "600" }}>Semester {item.semester}</td>
                                                            <td style={{ padding: "1rem", textAlign: "center", fontSize: "0.85rem" }}>
                                                                <span style={{ color: "#dc2626", background: "#fee2e2", padding: "2px 6px", borderRadius: "4px" }}>S:{item.kehadiranSakit}</span>{" "}
                                                                <span style={{ color: "#ca8a04", background: "#fef9c3", padding: "2px 6px", borderRadius: "4px" }}>I:{item.kehadiranIzin}</span>{" "}
                                                                <span style={{ color: "#374151", background: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" }}>A:{item.kehadiranAlfa}</span>
                                                            </td>
                                                            <td style={{ padding: "1rem", textAlign: "center", fontSize: "0.82rem" }}>
                                                                Spiritual: <strong>{item.sikapSpiritual}</strong> | Sosial: <strong>{item.sikapSosial}</strong>
                                                            </td>
                                                            {academicSmartMode && (
                                                                <td style={{ padding: "1rem", textAlign: "center" }}>
                                                                    <div className="score-badge">{item.score}% Match</div>
                                                                </td>
                                                            )}
                                                            <td style={{ padding: "1rem", textAlign: "center" }}>
                                                                <span style={{ background: "#ede9fe", color: "#6d28d9", padding: "0.25rem 0.75rem", borderRadius: "10px", fontWeight: "800" }}>
                                                                    {item.rataRata?.toFixed(2)}
                                                                </span>
                                                            </td>
                                                            <td style={{ padding: "1rem", textAlign: "right" }}>
                                                                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                                                                    <Link 
                                                                         href={`/dokumen-rapor/${item.bukuIndukId}`}
                                                                         className="m-btn-tool" style={{ width: "32px", height: "32px", color: "#64748b", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                                                         title="Lihat Detail"
                                                                     >
                                                                         <Eye size={16} />
                                                                     </Link>
                                                                    <button 
                                                                        onClick={() => openEditAcademicModal(item)} 
                                                                        className="m-btn-tool" style={{ width: "32px", height: "32px", color: "#16a34a" }}
                                                                    >
                                                                        <Settings size={16} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteAcademic(item.bukuIndukId, item.semester)} 
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
                                        <div className="m-empty-icon" style={{ fontSize: "3.5rem" }}>📚</div>
                                        <p style={{ color: "#64748b", fontWeight: "650", margin: "1rem 0" }}>Belum ada data nilai akademik Legger Kelas.</p>
                                        <button onClick={openCreateAcademicModal} className="m-btn-add-primary bg-purple" style={{ border: "none", cursor: "pointer" }}>
                                            <Plus size={20} />
                                            <span>Tambah Legger Kelas</span>
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
                                    {isEditingAcademic ? "✏️ Edit Legger Kelas" : "📚 Input Legger Kelas"}
                                </h3>
                                <button onClick={() => setShowAcademicModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveAcademic}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
                                    <div className="grid-responsive-15">
                                        <div>
                                            <label style={{ fontSize: "0.72rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                                                Alumni / Siswa
                                            </label>
                                            <select
                                                value={academicForm.bukuIndukId}
                                                onChange={e => setAcademicForm({...academicForm, bukuIndukId: e.target.value})}
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
                                        <div>
                                            <label style={{ fontSize: "0.72rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                                                Semester Rapor
                                            </label>
                                            <select
                                                value={academicForm.semester}
                                                onChange={e => setAcademicForm({...academicForm, semester: e.target.value})}
                                                disabled={isEditingAcademic}
                                                style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1.5px solid #e2e8f0", fontSize: "0.95rem", outline: "none", background: isEditingAcademic ? "#f8fafc" : "white" }}
                                                required
                                            >
                                                <option value="1">Semester 1 (Kls VII)</option>
                                                <option value="2">Semester 2 (Kls VII)</option>
                                                <option value="3">Semester 3 (Kls VIII)</option>
                                                <option value="4">Semester 4 (Kls VIII)</option>
                                                <option value="5">Semester 5 (Kls IX)</option>
                                                <option value="6">Semester 6 (Kls IX)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Kehadiran & Sikap */}
                                    <div className="grid-responsive-2" style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "1rem" }}>
                                        <div>
                                            <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "#475569", display: "block", marginBottom: "0.75rem" }}>📅 REKAP KEHADIRAN</span>
                                            <div className="grid-responsive-3">
                                                <div>
                                                    <label style={{ fontSize: "0.68rem", fontWeight: "750", color: "#64748b", display: "block", marginBottom: "2px" }}>Sakit</label>
                                                    <input type="number" min="0" value={academicForm.kehadiranSakit} onChange={e => setAcademicForm({...academicForm, kehadiranSakit: e.target.value})} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.9rem", textAlign: "center" }} />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: "0.68rem", fontWeight: "750", color: "#64748b", display: "block", marginBottom: "2px" }}>Izin</label>
                                                    <input type="number" min="0" value={academicForm.kehadiranIzin} onChange={e => setAcademicForm({...academicForm, kehadiranIzin: e.target.value})} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.9rem", textAlign: "center" }} />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: "0.68rem", fontWeight: "750", color: "#64748b", display: "block", marginBottom: "2px" }}>Alfa</label>
                                                    <input type="number" min="0" value={academicForm.kehadiranAlfa} onChange={e => setAcademicForm({...academicForm, kehadiranAlfa: e.target.value})} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.9rem", textAlign: "center" }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "#475569", display: "block", marginBottom: "0.75rem" }}>⭐ PENILAIAN SIKAP</span>
                                            <div className="grid-responsive-2">
                                                <div>
                                                    <label style={{ fontSize: "0.68rem", fontWeight: "750", color: "#64748b", display: "block", marginBottom: "2px" }}>Spiritual</label>
                                                    <select value={academicForm.sikapSpiritual} onChange={e => setAcademicForm({...academicForm, sikapSpiritual: e.target.value})} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.85rem" }}>
                                                        <option value="Sangat Baik">Sangat Baik</option>
                                                        <option value="Baik">Baik</option>
                                                        <option value="Cukup">Cukup</option>
                                                        <option value="Kurang">Kurang</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: "0.68rem", fontWeight: "750", color: "#64748b", display: "block", marginBottom: "2px" }}>Sosial</label>
                                                    <select value={academicForm.sikapSosial} onChange={e => setAcademicForm({...academicForm, sikapSosial: e.target.value})} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.85rem" }}>
                                                        <option value="Sangat Baik">Sangat Baik</option>
                                                        <option value="Baik">Baik</option>
                                                        <option value="Cukup">Cukup</option>
                                                        <option value="Kurang">Kurang</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Catatan Wali Kelas */}
                                    <div>
                                        <label style={{ fontSize: "0.72rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                                            Catatan Wali Kelas
                                        </label>
                                        <textarea
                                            placeholder="Tuliskan catatan kemajuan belajar atau pesan wali kelas..."
                                            value={academicForm.catatanWaliKelas}
                                            onChange={e => setAcademicForm({...academicForm, catatanWaliKelas: e.target.value})}
                                            style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1.5px solid #e2e8f0", fontSize: "0.95rem", outline: "none", minHeight: "60px", resize: "vertical" }}
                                        />
                                    </div>

                                    {/* Nilai Rapor Per Mapel */}
                                    <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "1rem" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                            <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "#475569" }}>📖 DAFTAR NILAI AKADEMIK MAPEL</span>
                                            <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "#6d28d9", background: "#f5f3ff", padding: "2px 8px", borderRadius: "6px" }}>
                                                RATA-RATA: {(academicForm.nilaiMataPelajaran.reduce((acc: number, curr: any) => acc + Number(curr.nilai || 0), 0) / (academicForm.nilaiMataPelajaran.length || 1)).toFixed(2)}
                                            </span>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxHeight: "250px", overflowY: "auto", paddingRight: "0.5rem" }}>
                                            {academicForm.nilaiMataPelajaran.map((n: any, idx: number) => (
                                                <div key={n.mataPelajaranId} style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: "1rem", alignItems: "center" }}>
                                                    <span style={{ fontSize: "0.9rem", color: "#334155" }}>{n.namaMapel}</span>
                                                    <input 
                                                        type="number" min="0" max="100"
                                                        value={n.nilai || ""}
                                                        onChange={e => {
                                                            const updated = [...academicForm.nilaiMataPelajaran];
                                                            updated[idx].nilai = Number(e.target.value);
                                                            setAcademicForm({...academicForm, nilaiMataPelajaran: updated});
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
                                    <button type="submit" style={{ padding: "0.75rem 1.5rem", borderRadius: "12px", fontWeight: "700", background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", color: "white", border: "none", cursor: "pointer" }}>Simpan Data</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>

            <style jsx global>{`
                .premium-container { padding: 2rem; max-width: 1400px; margin: 0 auto; color: #1e293b; font-family: 'Inter', sans-serif; }
                .mobile-only { display: none; }
                .page-hero { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
                .hero-badge { display: inline-block; padding: 0.4rem 1rem; background: #f5f3ff; color: #7c3aed; font-weight: 750; font-size: 0.75rem; text-transform: uppercase; border-radius: 20px; margin-bottom: 0.75rem; }
                .hero-content h1 { font-size: 2.8rem; font-weight: 800; margin: 0; }
                
                .btn-vibrant-add { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; text-decoration: none; padding: 0.9rem 1.8rem; border-radius: 14px; font-weight: 700; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 10px 20px -5px rgba(124, 58, 237, 0.3); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .btn-vibrant-add:hover { transform: translateY(-3px); }

                .btn-vibrant-outline { background: white; border: 2px solid #7c3aed; color: #7c3aed; padding: 0.8rem 1.5rem; border-radius: 14px; font-weight: 700; display: flex; align-items: center; gap: 0.75rem; cursor: pointer; transition: all 0.3s; }
                .btn-vibrant-outline:hover { background: #f5f3ff; transform: translateY(-3px); }
                .hero-actions { display: flex; gap: 1rem; align-items: center; }

                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
                .stat-card { padding: 1.5rem; border-radius: 20px; background: rgba(255,255,255,0.8); display: flex; align-items: center; gap: 1.25rem; border: 1px solid rgba(255,255,255,0.7); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
                @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } }
                .stat-icon.purple { background: #f5f3ff; color: #7c3aed; }
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
                .m-btn-filter.active { background: #7c3aed !important; color: white !important; }

                .adv-filter-panel { background: white; border: 1.5px solid #e2e8f0; border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
                .adv-filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; font-weight: 800; font-size: 0.95rem; }
                .adv-close-btn { display: flex; align-items: center; gap: 0.4rem; background: #fee2e2; color: #dc2626; border: none; border-radius: 10px; padding: 0.45rem 1rem; font-weight: 750; cursor: pointer; }
                .adv-filter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
                .adv-field { display: flex; flex-direction: column; gap: 0.4rem; }
                .adv-field label { font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase; }
                .adv-field input, .adv-field select { border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.65rem 1rem; font-size: 0.9rem; font-weight: 600; outline: none; background: #f8fafc; }

                .m-btn-tool { background: white; border: 1.5px solid #e2e8f0; border-radius: 14px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; }
                .m-btn-tool:hover { background: #f8fafc; border-color: #7c3aed; color: #7c3aed; }

                @media (max-width: 768px) {
                    .premium-container { padding: 0.75rem; background: #f8fafc; min-height: 100vh; }
                    .desktop-only { display: none !important; }
                    .mobile-only { display: block !important; }

                    .m-header-minimal { margin-bottom: 1rem; }
                    .m-back-link { display: inline-flex; align-items: center; gap: 0.5rem; background: #f1f5f9; padding: 0.6rem 1rem; border-radius: 12px; color: #475569; text-decoration: none; font-weight: 700; }

                    .m-hero-minimal { text-align: center; margin-bottom: 1.5rem; }
                    .m-hero-badge { display: inline-block; background: #f5f3ff; color: #7c3aed; font-size: 0.7rem; font-weight: 800; padding: 0.4rem 1.25rem; border-radius: 20px; text-transform: uppercase; margin-bottom: 0.5rem; }
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
                .m-btn-add-primary.bg-purple { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); }

                .m-doc-card { background: white; border-radius: 20px; padding: 1.25rem; margin-bottom: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; display: block; text-decoration: none; color: inherit; }
                .avatar-md { width: 48px; height: 48px; min-width: 48px; background: #f5f3ff; color: #7c3aed; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
                .m-tag { display: inline-block; font-size: 0.65rem; font-weight: 800; background: #f1f5f9; color: #64748b; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; }
                
                .m-pill { font-size: 0.72rem; font-weight: 750; padding: 4px 12px; border-radius: 20px; }
                .m-pill.ok { background: #dcfce7; color: #15803d; }
                .m-pill.wait { background: #fef3c7; color: #92400e; }
                
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        {/* ─── Premium Detail Academic Modal ─── */}
        {showDetailModal && selectedDetailItem && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
                <div style={{ background: "white", borderRadius: "24px", width: "100%", maxWidth: "550px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
                    <div style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", padding: "1.25rem 1.5rem", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ margin: 0, fontWeight: "800", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>📚 Detail Legger Kelas (Semester {selectedDetailItem.semester})</h3>
                        <button onClick={() => setShowDetailModal(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><X size={22} /></button>
                    </div>
                    <div style={{ padding: "1.5rem", maxHeight: "75vh", overflowY: "auto" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
                            <div>
                                <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Nama Alumni</span>
                                <h4 style={{ margin: "2px 0 0 0", color: "#1e293b", fontWeight: "800" }}>{selectedDetailItem.namaAlumni}</h4>
                            </div>
                            <div>
                                <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>NISN / NIS</span>
                                <h4 style={{ margin: "2px 0 0 0", color: "#1e293b", fontFamily: "monospace" }}>{selectedDetailItem.nisn || "-"} / {selectedDetailItem.nis || "-"}</h4>
                            </div>
                            <div>
                                <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Sikap Spiritual</span>
                                <h4 style={{ margin: "2px 0 0 0", color: "#1e293b" }}>{selectedDetailItem.sikapSpiritual || "-"}</h4>
                            </div>
                            <div>
                                <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Sikap Sosial</span>
                                <h4 style={{ margin: "2px 0 0 0", color: "#1e293b" }}>{selectedDetailItem.sikapSosial || "-"}</h4>
                            </div>
                        </div>

                        {/* Kehadiran */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", background: "#f8fafc", padding: "0.75rem", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "1.25rem" }}>
                            <div style={{ textAlign: "center" }}>
                                <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "700", display: "block" }}>SAKIT</span>
                                <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#dc2626" }}>{selectedDetailItem.kehadiranSakit} hari</span>
                            </div>
                            <div style={{ textAlign: "center", borderLeft: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0" }}>
                                <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "700", display: "block" }}>IZIN</span>
                                <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#ca8a04" }}>{selectedDetailItem.kehadiranIzin} hari</span>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "700", display: "block" }}>ALFA</span>
                                <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#374151" }}>{selectedDetailItem.kehadiranAlfa} hari</span>
                            </div>
                        </div>

                        {/* Catatan Wali Kelas */}
                        <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", padding: "0.75rem 1rem", borderRadius: "12px", marginBottom: "1.25rem" }}>
                            <span style={{ fontSize: "0.7rem", color: "#7c3aed", fontWeight: "800", display: "block", marginBottom: "3px" }}>📝 CATATAN WALI KELAS</span>
                            <p style={{ margin: 0, fontSize: "0.88rem", color: "#4c1d95", lineHeight: 1.5, fontWeight: "600" }}>
                                {selectedDetailItem.catatanWaliKelas || "Tidak ada catatan."}
                            </p>
                        </div>

                        <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "#475569", display: "block", marginBottom: "0.75rem" }}>📖 DAFTAR NILAI AKADEMIK MAPEL</span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {selectedDetailItem.nilaiMataPelajaran?.map((n: any, idx: number) => (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0.75rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                                    <span style={{ fontSize: "0.9rem", color: "#334155", fontWeight: "600" }}>{n.nama || n.namaMapel}</span>
                                    <span style={{ fontSize: "0.9rem", fontWeight: "800", color: "#7c3aed" }}>{n.nilai}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f5f3ff", padding: "0.75rem 1.25rem", borderRadius: "12px", border: "1px solid #ddd6fe" }}>
                            <span style={{ fontWeight: "800", color: "#6d28d9", fontSize: "0.9rem" }}>RATA-RATA NILAI:</span>
                            <span style={{ fontWeight: "900", color: "#6d28d9", fontSize: "1.15rem" }}>{selectedDetailItem.rataRata?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
        
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
