"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import {
    GraduationCap, Plus, Search, ChevronRight, X,
    Eye, Trash2, ArrowLeft, Loader2, FileText, CheckCircle2,
    AlertCircle, Filter, Download, Sparkles, Settings
} from "lucide-react";
import Link from "next/link";
import * as api from "../../../services/api";
import * as XLSX from "xlsx";

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => (1980 + i).toString()).reverse();

const dummyIjazahData = [
    {
        id: -1,
        alumniId: 1,
        namaAlumni: "Ahmad Faisal Ramadhan",
        nisn: "0021001234",
        namaKepalaMadrasah: "Drs. H. Ahmad Fauzi, M.Pd.I",
        tanggalPenerbitan: "2024-06-15T00:00:00.000Z",
        rataRataNilai: 86.25,
        nilaiUjian: [
            { mataPelajaranId: 1, namaMapel: "Al-Qur'an Hadis", nilai: 88 },
            { mataPelajaranId: 6, namaMapel: "Bahasa Indonesia", nilai: 87 },
            { mataPelajaranId: 8, namaMapel: "Matematika", nilai: 84 },
            { mataPelajaranId: 9, namaMapel: "Ilmu Pengetahuan Alam", nilai: 86 }
        ]
    },
    {
        id: -2,
        alumniId: 2,
        namaAlumni: "Siti Aminah Putri",
        nisn: "0021002345",
        namaKepalaMadrasah: "Drs. H. Ahmad Fauzi, M.Pd.I",
        tanggalPenerbitan: "2024-06-15T00:00:00.000Z",
        rataRataNilai: 84.75,
        nilaiUjian: [
            { mataPelajaranId: 1, namaMapel: "Al-Qur'an Hadis", nilai: 85 },
            { mataPelajaranId: 6, namaMapel: "Bahasa Indonesia", nilai: 86 },
            { mataPelajaranId: 8, namaMapel: "Matematika", nilai: 80 },
            { mataPelajaranId: 9, namaMapel: "Ilmu Pengetahuan Alam", nilai: 88 }
        ]
    }
];

export default function DokumenIjazahPage() {
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

    // Detail Modal States
    const [selectedDetailItem, setSelectedDetailItem] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Pagination
    const [filePage, setFilePage] = useState(1);
    const [academicPage, setAcademicPage] = useState(1);
    const PAGE_SIZE = 10;

    // ── Academic Tab States ──
    const [activeTab, setActiveTab] = useState<"file" | "data">("file");
    const [academicData, setAcademicData] = useState<any[]>([]);
    const [isAcademicLoading, setIsAcademicLoading] = useState(false);
    const [showAcademicModal, setShowAcademicModal] = useState(false);
    const [isEditingAcademic, setIsEditingAcademic] = useState(false);
    const [academicForm, setAcademicForm] = useState<any>({
        id: null,
        alumniId: "",
        tanggalPenerbitan: "",
        namaKepalaMadrasah: "",
        nilaiUjian: []
    });
    const [alumniOptions, setAlumniOptions] = useState<any[]>([]);
    const [mapelOptions, setMapelOptions] = useState<any[]>([]);
    const [academicSearch, setAcademicSearch] = useState("");
    const [deletePendingId, setDeletePendingId] = useState<number | null>(null);
    const [deleteAcademicPendingId, setDeleteAcademicPendingId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchRecords = async () => {
        setIsLoading(true);
        try {
            const data = await api.getArchives("Ijazah");
            setDbData(data || []);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    const fetchAcademicRecords = async () => {
        setIsAcademicLoading(true);
        try {
            if (academicSmartMode && academicSearch.trim() !== "") {
                const allData = await api.getDetailIjazahList();
                const baseData = allData || [];

                const res = await api.searchAlumni(academicSearch);
                if (res.data) {
                    const matchedResults: any[] = [];
                    res.data.forEach((resItem: any) => {
                        const matchedDbItems = baseData.filter((dbItem: any) => {
                            const dbName = (dbItem.namaAlumni || dbItem.namaLengkap || "").toLowerCase();
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
                    setAcademicData(matchedResults);
                } else {
                    setAcademicData([]);
                }
            } else {
                const data = await api.getDetailIjazahList(academicSearch);
                setAcademicData(data || []);
            }
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
            const alumniList = await api.getBukuIndukList(1000);
            if (alumniList && alumniList.data) {
                setAlumniOptions(alumniList.data);
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
    }, [activeTab, academicSearch, academicSmartMode]);

    const handleSaveAcademic = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                alumniId: Number(academicForm.alumniId),
                tanggalPenerbitan: academicForm.tanggalPenerbitan ? new Date(academicForm.tanggalPenerbitan).toISOString() : null,
                namaKepalaMadrasah: academicForm.namaKepalaMadrasah,
                nilaiUjian: academicForm.nilaiUjian.map((n: any) => ({
                    mataPelajaranId: n.mataPelajaranId,
                    nilai: Number(n.nilai)
                }))
            };
            if (isEditingAcademic) {
                await api.updateDetailIjazah(academicForm.id, payload);
                showToast("Data Akademik Ijazah berhasil diperbarui!", "success");
            } else {
                await api.saveDetailIjazah(payload);
                showToast("Data Akademik Ijazah berhasil disimpan!", "success");
            }
            setShowAcademicModal(false);
            fetchAcademicRecords();
        } catch (err: any) {
            alert(err.message || "Gagal menyimpan data");
        }
    };

    const handleDeleteAcademic = (id: number) => {
        setDeleteAcademicPendingId(id);
    };

    const confirmDeleteAcademic = async () => {
        if (deleteAcademicPendingId === null) return;
        setIsDeleting(true);
        try {
            await api.deleteDetailIjazah(deleteAcademicPendingId);
            setDeleteAcademicPendingId(null);
            fetchAcademicRecords();
        } catch (err: any) { alert(err.message); }
        finally { setIsDeleting(false); }
    };

    const openCreateAcademicModal = () => {
        setIsEditingAcademic(false);
        setAcademicForm({
            id: null,
            alumniId: "",
            tanggalPenerbitan: new Date().toISOString().split("T")[0],
            namaKepalaMadrasah: "",
            nilaiUjian: mapelOptions.map(m => ({
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
            id: item.id,
            alumniId: item.alumniId,
            tanggalPenerbitan: item.tanggalPenerbitan ? item.tanggalPenerbitan.split("T")[0] : "",
            namaKepalaMadrasah: item.namaKepalaMadrasah,
            nilaiUjian: mapelOptions.map(m => {
                const existingNilai = item.nilaiUjian?.find((nu: any) => nu.mataPelajaranId === m.id);
                return {
                    mataPelajaranId: m.id,
                    namaMapel: m.namaMapel,
                    nilai: existingNilai ? existingNilai.nilai : 0
                };
            })
        });
        setShowAcademicModal(true);
    };

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

    const hasAdvFilter = advFilter.nisn || advFilter.tahunLulus || advFilter.siswaName;
    const filteredResults = smartMode ? smartResults : dbData.filter(item => {
        const matchesSearch = item.siswaName?.toLowerCase().includes(searchTerm.toLowerCase()) || item.fileName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "Semua" || item.statusOCR === filterStatus;
        const matchesNisn = !advFilter.nisn || item.nisn?.includes(advFilter.nisn);
        const matchesTahun = !advFilter.tahunLulus || item.tahunLulus === advFilter.tahunLulus;
        const matchesName = !advFilter.siswaName || item.siswaName?.toLowerCase().includes(advFilter.siswaName.toLowerCase());
        return matchesSearch && matchesStatus && matchesNisn && matchesTahun && matchesName;
    });

    // File tab pagination
    const fileTotalPages = Math.max(1, Math.ceil(filteredResults.length / PAGE_SIZE));
    const safeFilePage = Math.min(filePage, fileTotalPages);
    const paginatedResults = filteredResults.slice((safeFilePage - 1) * PAGE_SIZE, safeFilePage * PAGE_SIZE);
    const handleFilePageChange = (page: number) => setFilePage(Math.max(1, Math.min(page, fileTotalPages)));

    // Academic tab pagination
    const acadTotalPages = Math.max(1, Math.ceil(academicData.length / PAGE_SIZE));
    const safeAcadPage = Math.min(academicPage, acadTotalPages);
    const paginatedAcademicData = academicData.slice((safeAcadPage - 1) * PAGE_SIZE, safeAcadPage * PAGE_SIZE);
    const handleAcadPageChange = (page: number) => setAcademicPage(Math.max(1, Math.min(page, acadTotalPages)));

    // Reset pages on filter/search changes
    useEffect(() => { setFilePage(1); }, [searchTerm, filterStatus, advFilter, smartMode]);
    useEffect(() => { setAcademicPage(1); }, [academicSearch]);

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

    // ── PRINT SLIP NILAI IJAZAH ──
    const handlePrintSlip = (item: any) => {
        const printWindow = window.open('', '_blank', 'width=794,height=1123');
        if (!printWindow) { alert('Popup diblokir. Izinkan popup dari halaman ini.'); return; }
        const nilaiRows = (item.nilaiUjian || []).map((n: any) =>
            `<tr><td style="padding:6px 12px;border-bottom:1px solid #e2e8f0;">${n.namaMapel || '-'}</td><td style="padding:6px 12px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:700;">${n.nilai ?? '-'}</td></tr>`
        ).join('');
        const avg = item.rataRataNilai ? Number(item.rataRataNilai).toFixed(2) : '-';
        const issued = item.tanggalPenerbitan ? new Date(item.tanggalPenerbitan).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) : '-';
        printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Slip Nilai Ijazah - ${item.namaAlumni}</title><style>@page{size:A4;margin:2cm}body{font-family:'Times New Roman',serif;font-size:12pt;color:#1e293b;margin:0;padding:0}.header{text-align:center;border-bottom:3px double #1e293b;padding-bottom:12px;margin-bottom:20px}.header h2{margin:0;font-size:16pt;text-transform:uppercase;letter-spacing:1px}.header p{margin:4px 0;font-size:10pt;color:#475569}.title-section{text-align:center;margin-bottom:20px}.title-section h3{font-size:14pt;text-decoration:underline;margin:0;text-transform:uppercase}.identity-table{width:100%;margin-bottom:20px;border-collapse:collapse}.identity-table td{padding:4px 0;vertical-align:top;font-size:11pt}.identity-table td:first-child{width:180px;font-weight:600}.nilai-table{width:100%;border-collapse:collapse;margin-bottom:20px}.nilai-table th{background:#1e293b;color:white;padding:8px 12px;text-align:left;font-size:11pt}.nilai-table tr:nth-child(even){background:#f8fafc}.avg-row{background:#fef3c7!important}.avg-row td{font-weight:700;color:#b45309}.footer{margin-top:30px;display:flex;justify-content:flex-end}.sig-block{text-align:center;width:220px}.sig-block p{margin:0;font-size:11pt}.sig-block .sig-line{margin-top:60px;border-top:1px solid #1e293b;padding-top:4px;font-weight:700}.print-date{font-size:9pt;color:#64748b;margin-top:4px}</style></head><body><div class="header"><h2>MTs Assa'adah Sukabumi - Bogor</h2><p>Sistem Arsip Alumni Digital (SAADA)</p></div><div class="title-section"><h3>Slip Nilai Ijazah</h3></div><table class="identity-table"><tr><td>Nama Alumni</td><td>: <strong>${item.namaAlumni || '-'}</strong></td></tr><tr><td>NISN</td><td>: ${item.nisn || '-'}</td></tr><tr><td>Tanggal Penerbitan</td><td>: ${issued}</td></tr><tr><td>Kepala Madrasah</td><td>: ${item.namaKepalaMadrasah || '-'}</td></tr></table><table class="nilai-table"><thead><tr><th>Mata Pelajaran</th><th style="text-align:center;width:100px;">Nilai</th></tr></thead><tbody>${nilaiRows}<tr class="avg-row"><td style="padding:8px 12px;font-weight:700;">Rata-Rata Nilai</td><td style="padding:8px 12px;text-align:center;font-weight:800;">${avg}</td></tr></tbody></table><div class="footer"><div class="sig-block"><p>Sukabumi, ${issued}</p><div class="sig-line">${item.namaKepalaMadrasah || 'Kepala Madrasah'}</div><p class="print-date">Dicetak: ${new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</p></div></div></body></html>`);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); }, 400);
    };

    const exportToExcel = () => {
        if (filteredResults.length === 0) {
            alert("Peringatan: Tidak ada data ijazah yang dapat diekspor.");
            return;
        }
        // Prepare data for Excel
        const dataForExcel = filteredResults.map(item => ({
            "Nama File": item.fileName || '',
            "Nama Siswa": item.siswaName || '',
            "NISN": item.nisn || '',
            "Tahun Lulus": item.tahunLulus || '',
            "Status OCR": item.statusOCR || '',
            "Tanggal Unggah": new Date(item.uploadDate).toLocaleDateString('id-ID')
        }));

        // Create workbook and worksheet
        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ijazah");

        // Download file
        XLSX.writeFile(workbook, `Backup_Ijazah_${new Date().toISOString().slice(0,10)}.xlsx`);
    };

    return (
        <AdminLayout>
            <div className="premium-container" suppressHydrationWarning={true}>

                {/* MOBILE NAV (AS PER IMAGE) */}
                <div className="mobile-only m-header-minimal">
                    <Link href="/file-master" className="m-back-link">
                        <ArrowLeft size={18} />
                        <span>Kembali</span>
                    </Link>
                </div>

                <div className="mobile-only m-hero-minimal">
                    <div className="m-hero-badge bg-gold">ARSIP DIGITAL</div>
                    <h1 className="m-hero-title">Dokumen Ijazah</h1>
                    <p className="m-hero-subtitle">Kelola data alumni dengan mudah</p>
                </div>

                {/* HEADER */}
                <header className="page-hero">
                    <div className="hero-content">
                        <div className="hero-badge color-ijazah">Arsip Digital</div>
                        <h1>{activeTab === "file" ? "Dokumen Ijazah" : "Data Akademik Ijazah"}</h1>
                        <p>{activeTab === "file" 
                            ? "Daftar scan ijazah alumni yang telah didigitalisasi oleh sistem AI." 
                            : "Data nilai kelulusan dan ijazah alumni yang terintegrasi dengan Buku Induk."}</p>
                    </div>
                    <div className="hero-actions desktop-only">
                        {activeTab === "file" ? (
                            <>
                                <button className="btn-vibrant-outline color-ijazah-outline" onClick={exportToExcel} title="Export ke Excel (CSV)">
                                    <Download size={20} />
                                    <span>Export Excel</span>
                                </button>
                                <Link href="/upload" className="btn-vibrant-add color-ijazah">
                                    <Plus size={20} />
                                    <span>Unggah Ijazah Baru</span>
                                </Link>
                            </>
                        ) : (
                            <button className="btn-vibrant-add color-ijazah" onClick={openCreateAcademicModal}>
                                <Plus size={20} />
                                <span>Tambah Data Akademik</span>
                            </button>
                        )}
                    </div>
                </header>

                {/* STATS (MOBILE ADAPTATION) */}
                <section className="stats-grid m-stats-layout">
                    <div className="stat-card glass">
                        <div className="stat-icon yellow"><GraduationCap size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Total Ijazah</span>
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
                        <div className="stat-icon red"><AlertCircle size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Gagal / Error</span>
                            <h3 className="stat-value" style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                                {stats.gagal}
                                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#dc2626" }}>({stats.percentGagal}%)</span>
                            </h3>
                        </div>
                    </div>
                </section>                {/* Tab Switcher */}
                <div className="tab-switcher" style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                    <button 
                        onClick={() => setActiveTab("file")} 
                        className={`tab-btn ${activeTab === 'file' ? 'active' : ''}`}
                        style={{
                            padding: "0.75rem 1.5rem",
                            borderRadius: "12px",
                            fontWeight: "750",
                            fontSize: "0.95rem",
                            cursor: "pointer",
                            background: activeTab === "file" ? "linear-gradient(135deg, #d97706 0%, #b45309 100%)" : "white",
                            color: activeTab === "file" ? "white" : "#64748b",
                            boxShadow: activeTab === "file" ? "0 4px 12px rgba(217, 119, 6, 0.2)" : "0 2px 4px rgba(0,0,0,0.02)",
                            border: activeTab === "file" ? "none" : "1px solid #e2e8f0",
                            transition: "all 0.2s"
                        }}
                    >
                        📂 Arsip Scan & OCR
                    </button>
                    <button 
                        onClick={() => setActiveTab("data")} 
                        className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
                        style={{
                            padding: "0.75rem 1.5rem",
                            borderRadius: "12px",
                            fontWeight: "750",
                            fontSize: "0.95rem",
                            cursor: "pointer",
                            background: activeTab === "data" ? "linear-gradient(135deg, #d97706 0%, #b45309 100%)" : "white",
                            color: activeTab === "data" ? "white" : "#64748b",
                            boxShadow: activeTab === "data" ? "0 4px 12px rgba(217, 119, 6, 0.2)" : "0 2px 4px rgba(0,0,0,0.02)",
                            border: activeTab === "data" ? "none" : "1px solid #e2e8f0",
                            transition: "all 0.2s"
                        }}
                    >
                        🎓 Data Akademik Nilai
                    </button>
                </div>

                {/* MAIN CONTENT */}
                <main className="main-panel glass m-main-panel">
                    {/* TAB FILE SCAN & OCR */}
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
                                        <span>🔍 Filter Lanjutan Ijazah</span>
                                        <button className="adv-close-btn" onClick={() => { setAdvFilter({ nisn: "", tahunLulus: "", siswaName: "" }); setShowFilterPanel(false); }}><X size={16} /> Reset</button>
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
                                        <div className="adv-field">
                                            <label>Status OCR</label>
                                            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                                <option value="Semua">Semua Status</option>
                                                <option value="Done">Terverifikasi ✅</option>
                                                <option value="Processing">Proses ⏳</option>
                                                <option value="Failed">Gagal ❌</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* DESKTOP TABLE */}
                            <div className="table-responsive desktop-only" style={{ padding: "0 1.5rem 1.5rem" }}>
                                {isLoading ? (
                                    <table className="premium-table">
                                        <tbody>
                                            <tr><td colSpan={6} className="empty-state"><Loader2 className="animate-spin" /> Memasukkan data...</td></tr>
                                        </tbody>
                                    </table>
                                ) : isSmartSearching ? (
                                    <table className="premium-table">
                                        <tbody>
                                            <tr>
                                                <td colSpan={6} className="empty-state" style={{ padding: "4rem 2rem" }}>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                                                        <div className="scanner" style={{ width: "120px", height: "4px", background: "#e2e8f0", borderRadius: "4px", position: "relative", overflow: "hidden", marginBottom: "1.5rem" }}>
                                                            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "40px", background: "#d97706", borderRadius: "4px", animation: "scan-move 1.5s infinite linear" }}></div>
                                                        </div>
                                                        <p style={{ fontWeight: "700", color: "#64748b", margin: 0 }}>Sedang menganalisis kemiripan arsip...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : filteredResults.length > 0 ? (
                                    <>
                                        <table className="premium-table">
                                            <thead>
                                                <tr>
                                                    <th>Tanggal Upload</th>
                                                    <th>Nama Siswa</th>
                                                    <th>Nama File</th>
                                                    <th>Status OCR</th>
                                                    {smartMode && <th>Kemiripan</th>}
                                                    <th style={{ textAlign: "right" }}>Opsi Kelola</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedResults.map(item => (
                                                    <tr key={item.id} className="row-hover">
                                                        <td>
                                                            <div className="nis-cell" suppressHydrationWarning={true}>
                                                                <strong>{new Date(item.uploadDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="name-cell">
                                                                <strong>{item.siswaName || "Siswa Tidak Diketahui"}</strong>
                                                                {item.nisn && <span style={{ fontSize: "0.78rem", color: "#94a3b8", display: "block", marginTop: "2px" }}>{item.nisn}</span>}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#64748b", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                                                                {item.fileName}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`pill ${item.statusOCR === 'Done' ? 'pill-success' : item.statusOCR === 'Failed' ? 'pill-danger' : 'pill-info'}`}>
                                                                {item.statusOCR === 'Done' ? '✅ Selesai' : item.statusOCR === 'Failed' ? '❌ Gagal' : '⏳ Proses'}
                                                            </span>
                                                        </td>
                                                        {smartMode && (
                                                            <td>
                                                                <div className="score-badge">{item.score}% Match</div>
                                                            </td>
                                                        )}
                                                        <td style={{ textAlign: "right" }}>
                                                            <div className="action-buttons">
                                                                <Link
                                                                    href={item.alumniId ? `/dokumen-ijazah/${item.alumniId}` : `/ocr-result?id=${item.id}`}
                                                                    className="btn-icon view"
                                                                    title="Lihat Detail"
                                                                >
                                                                    <Eye size={18} />
                                                                </Link>
                                                                <button onClick={() => handleDelete(item.id)} className="btn-icon delete" title="Hapus">
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {/* Pagination Desktop */}
                                        {!isLoading && !isSmartSearching && filteredResults.length > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0 0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                                                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Menampilkan <strong style={{ color: '#1e293b' }}>{(safeFilePage - 1) * PAGE_SIZE + 1}–{Math.min(safeFilePage * PAGE_SIZE, filteredResults.length)}</strong> dari <strong style={{ color: '#1e293b' }}>{filteredResults.length}</strong> data</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <button onClick={() => handleFilePageChange(safeFilePage - 1)} disabled={safeFilePage === 1} style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #e2e8f0', background: safeFilePage === 1 ? '#f1f5f9' : '#fff', color: safeFilePage === 1 ? '#94a3b8' : '#475569', cursor: safeFilePage === 1 ? 'not-allowed' : 'pointer' }}>← Back</button>
                                                    {Array.from({ length: fileTotalPages }, (_, i) => i + 1).filter(p => p === 1 || p === fileTotalPages || Math.abs(p - safeFilePage) <= 1).reduce<(number|string)[]>((acc, p, idx, arr) => { if (idx > 0 && p - (arr[idx-1] as number) > 1) acc.push('...'); acc.push(p); return acc; }, []).map((p, idx) => p === '...' ? <span key={`e${idx}`} style={{ padding: '0 0.25rem', color: '#94a3b8', fontSize: '0.82rem' }}>…</span> : <button key={p} onClick={() => handleFilePageChange(p as number)} style={{ width: '36px', height: '36px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: safeFilePage === p ? 'none' : '1px solid #e2e8f0', background: safeFilePage === p ? '#d97706' : '#fff', color: safeFilePage === p ? '#fff' : '#475569', cursor: 'pointer', boxShadow: safeFilePage === p ? '0 4px 12px rgba(217,119,6,0.25)' : 'none' }}>{p}</button>)}
                                                    <button onClick={() => handleFilePageChange(safeFilePage + 1)} disabled={safeFilePage === fileTotalPages} style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #e2e8f0', background: safeFilePage === fileTotalPages ? '#f1f5f9' : '#d97706', color: safeFilePage === fileTotalPages ? '#94a3b8' : '#fff', cursor: safeFilePage === fileTotalPages ? 'not-allowed' : 'pointer', boxShadow: safeFilePage === fileTotalPages ? 'none' : '0 4px 12px rgba(217,119,6,0.2)' }}>Next →</button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <table className="premium-table">
                                        <tbody>
                                            <tr><td colSpan={6} className="empty-state">Data tidak ditemukan.</td></tr>
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* MOBILE CARD LIST */}
                            <div className="mobile-only mobile-list">
                                {isLoading ? (
                                    <div className="m-loading"><Loader2 className="animate-spin" /> Memasukkan data...</div>
                                ) : isSmartSearching ? (
                                    <div className="m-loading" style={{ padding: "4rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                        <div className="scanner" style={{ width: "100px", height: "4px", background: "#e2e8f0", borderRadius: "4px", position: "relative", overflow: "hidden", marginBottom: "1.25rem" }}>
                                            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "30px", background: "#d97706", borderRadius: "4px", animation: "scan-move 1.5s infinite linear" }}></div>
                                        </div>
                                        <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "#64748b" }}>Sedang menganalisis kemiripan arsip...</span>
                                    </div>
                                ) : filteredResults.length > 0 ? (
                                    <>
                                        {paginatedResults.map(item => (
                                            <Link href={item.alumniId ? `/dokumen-ijazah/${item.alumniId}` : `/ocr-result?id=${item.id}`} key={item.id} className="m-premium-card" style={{ textDecoration: 'none', display: 'block' }}>
                                                <div className="m-card-header">
                                                    <div className="m-card-main-info">
                                                        <div className="m-tag-row">
                                                            <div className="m-tag" suppressHydrationWarning={true}>{new Date(item.uploadDate).toLocaleDateString('id-ID')}</div>
                                                            <div className={`m-pill ${item.statusOCR === 'Done' ? 'ok' : item.statusOCR === 'Failed' ? 'error' : 'wait'}`} style={{ fontSize: '0.65rem' }}>
                                                                {item.statusOCR === 'Done' ? '✅ Selesai' : item.statusOCR === 'Failed' ? '❌ Gagal' : '⏳ Proses'}
                                                            </div>
                                                        </div>
                                                        <h4>{item.siswaName || "Siswa Tidak Diketahui"}</h4>
                                                        <div className="m-sub-info">
                                                            <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{item.fileName}</span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={18} className="m-arrow" />
                                                </div>
                                                <div className="m-card-footer">
                                                    {smartMode && (
                                                        <div className="score-badge" style={{ fontSize: '0.65rem' }}>{item.score}% Match</div>
                                                    )}
                                                    <div className="m-actions" onClick={e => e.preventDefault()}>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="danger" title="Hapus"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                        {/* Mobile Pagination */}
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem 0', flexWrap: 'wrap' }}>
                                            <button onClick={() => handleFilePageChange(safeFilePage - 1)} disabled={safeFilePage === 1} style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #e2e8f0', background: safeFilePage === 1 ? '#f1f5f9' : '#fff', color: safeFilePage === 1 ? '#94a3b8' : '#475569', cursor: safeFilePage === 1 ? 'not-allowed' : 'pointer' }}>← Back</button>
                                            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>{safeFilePage} / {fileTotalPages}</span>
                                            <button onClick={() => handleFilePageChange(safeFilePage + 1)} disabled={safeFilePage === fileTotalPages} style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #e2e8f0', background: safeFilePage === fileTotalPages ? '#f1f5f9' : '#d97706', color: safeFilePage === fileTotalPages ? '#94a3b8' : '#fff', cursor: safeFilePage === fileTotalPages ? 'not-allowed' : 'pointer' }}>Next →</button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="m-empty-state">
                                        <div className="m-empty-icon">📂</div>
                                        <p>Data belum tersedia</p>
                                        <Link href="/upload" className="m-btn-add-primary bg-gold">
                                            <Plus size={20} />
                                            <span>Unggah Data</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* TAB DATA AKADEMIK NILAI */}
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
                                            onClick={() => setAcademicSmartMode(!academicSmartMode)}
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
                                ) : academicData.length > 0 ? (
                                    <>
                                        {/* Desktop View Table */}
                                        <div className="desktop-only" style={{ overflowX: "auto" }}>
                                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                                <thead>
                                                    <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b", fontWeight: "750", fontSize: "0.85rem" }}>
                                                        <th style={{ padding: "1rem" }}>NAMA ALUMNI</th>
                                                        <th style={{ padding: "1rem" }}>NISN</th>
                                                        <th style={{ padding: "1rem" }}>KEPALA MADRASAH</th>
                                                        <th style={{ padding: "1rem" }}>TANGGAL PENERBITAN</th>
                                                        {academicSmartMode && <th style={{ padding: "1rem" }}>KEMIRIPAN</th>}
                                                        <th style={{ padding: "1rem", textAlign: "center" }}>RATA-RATA NILAI</th>
                                                        <th style={{ padding: "1rem", textAlign: "right" }}>AKSI</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                     {paginatedAcademicData.map(item => (
                                                        <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9", fontSize: "0.95rem" }}>
                                                            <td style={{ padding: "1rem", fontWeight: "700" }}>
                                                                <Link href={`/dokumen-ijazah/${item.alumniId}`} style={{ color: "#d97706", textDecoration: "none" }}>
                                                                    {item.namaAlumni}
                                                                </Link>
                                                            </td>
                                                            <td style={{ padding: "1rem", color: "#64748b" }}>{item.nisn}</td>
                                                            <td style={{ padding: "1rem" }}>{item.namaKepalaMadrasah || "-"}</td>
                                                            <td style={{ padding: "1rem", color: "#64748b" }} suppressHydrationWarning={true}>
                                                                {item.tanggalPenerbitan ? new Date(item.tanggalPenerbitan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
                                                            </td>
                                                            {academicSmartMode && (
                                                                <td style={{ padding: "1rem" }}>
                                                                    <div className="score-badge">{item.score}% Match</div>
                                                                </td>
                                                            )}
                                                            <td style={{ padding: "1rem", textAlign: "center" }}>
                                                                <span style={{ background: "#fef3c7", color: "#b45309", padding: "0.25rem 0.75rem", borderRadius: "10px", fontWeight: "800", fontSize: "0.9rem" }}>
                                                                    {item.rataRataNilai?.toFixed(2)}
                                                                </span>
                                                            </td>
                                                            <td style={{ padding: "1rem", textAlign: "right" }}>
                                                                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                                                                    <Link 
                                                                        href={`/dokumen-ijazah/${item.alumniId}`}
                                                                        style={{ background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", padding: "0.40rem", borderRadius: "8px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                                                        title="Lihat Detail"
                                                                    >
                                                                        <Eye size={16} />
                                                                    </Link>
                                                                    <button 
                                                                        onClick={() => handlePrintSlip(item)} 
                                                                        style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "0.40rem", borderRadius: "8px", cursor: "pointer" }}
                                                                        title="Cetak Slip Nilai"
                                                                    >
                                                                        <Download size={16} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => openEditAcademicModal(item)} 
                                                                        style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "0.40rem", borderRadius: "8px", cursor: "pointer" }}
                                                                        title="Edit Nilai"
                                                                    >
                                                                        <Settings size={16} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteAcademic(item.id)} 
                                                                        style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "0.40rem", borderRadius: "8px", cursor: "pointer" }}
                                                                        title="Hapus"
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

                                        {/* Academic Tab Pagination */}
                                        {!isAcademicLoading && academicData.length > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0 0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                                                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Menampilkan <strong style={{ color: '#1e293b' }}>{(safeAcadPage - 1) * PAGE_SIZE + 1}–{Math.min(safeAcadPage * PAGE_SIZE, academicData.length)}</strong> dari <strong style={{ color: '#1e293b' }}>{academicData.length}</strong> data</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <button onClick={() => handleAcadPageChange(safeAcadPage - 1)} disabled={safeAcadPage === 1} style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #e2e8f0', background: safeAcadPage === 1 ? '#f1f5f9' : '#fff', color: safeAcadPage === 1 ? '#94a3b8' : '#475569', cursor: safeAcadPage === 1 ? 'not-allowed' : 'pointer' }}>← Back</button>
                                                    {Array.from({ length: acadTotalPages }, (_, i) => i + 1).filter(p => p === 1 || p === acadTotalPages || Math.abs(p - safeAcadPage) <= 1).reduce<(number|string)[]>((acc, p, idx, arr) => { if (idx > 0 && p - (arr[idx-1] as number) > 1) acc.push('...'); acc.push(p); return acc; }, []).map((p, idx) => p === '...' ? <span key={`e${idx}`} style={{ padding: '0 0.25rem', color: '#94a3b8', fontSize: '0.82rem' }}>…</span> : <button key={p} onClick={() => handleAcadPageChange(p as number)} style={{ width: '36px', height: '36px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: safeAcadPage === p ? 'none' : '1px solid #e2e8f0', background: safeAcadPage === p ? '#d97706' : '#fff', color: safeAcadPage === p ? '#fff' : '#475569', cursor: 'pointer', boxShadow: safeAcadPage === p ? '0 4px 12px rgba(217,119,6,0.25)' : 'none' }}>{p}</button>)}
                                                    <button onClick={() => handleAcadPageChange(safeAcadPage + 1)} disabled={safeAcadPage === acadTotalPages} style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #e2e8f0', background: safeAcadPage === acadTotalPages ? '#f1f5f9' : '#d97706', color: safeAcadPage === acadTotalPages ? '#94a3b8' : '#fff', cursor: safeAcadPage === acadTotalPages ? 'not-allowed' : 'pointer', boxShadow: safeAcadPage === acadTotalPages ? 'none' : '0 4px 12px rgba(217,119,6,0.2)' }}>Next →</button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="m-empty-state" style={{ padding: "3rem 1rem", textAlign: "center" }}>
                                        <div className="m-empty-icon" style={{ fontSize: "3.5rem" }}>🎓</div>
                                        <p style={{ color: "#64748b", fontWeight: "650", margin: "1rem 0" }}>Belum ada data nilai akademik ijazah.</p>
                                        <button onClick={openCreateAcademicModal} className="m-btn-add-primary bg-gold" style={{ border: "none", cursor: "pointer" }}>
                                            <Plus size={20} />
                                            <span>Tambah Data Nilai</span>
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
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(15, 23, 42, 0.6)",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        padding: "1rem"
                    }}>
                        <div className="glass" style={{
                            background: "white",
                            borderRadius: "24px",
                            width: "100%",
                            maxWidth: "600px",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            padding: "2rem",
                            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b" }}>
                                    {isEditingAcademic ? "✏️ Edit Nilai Akademik Ijazah" : "🎓 Input Nilai Akademik Ijazah"}
                                </h3>
                                <button 
                                    onClick={() => setShowAcademicModal(false)}
                                    style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveAcademic}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
                                    <div>
                                        <label style={{ fontSize: "0.75rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                                            Alumni / Siswa
                                        </label>
                                        <select
                                            value={academicForm.alumniId}
                                            onChange={e => setAcademicForm({...academicForm, alumniId: e.target.value})}
                                            disabled={isEditingAcademic}
                                            style={{
                                                width: "100%",
                                                padding: "0.75rem 1rem",
                                                borderRadius: "12px",
                                                border: "1.5px solid #e2e8f0",
                                                fontSize: "0.95rem",
                                                outline: "none",
                                                background: isEditingAcademic ? "#f8fafc" : "white"
                                            }}
                                            required
                                        >
                                            <option value="">-- Pilih Alumni --</option>
                                            {alumniOptions.map(a => (
                                                <option key={a.alumniId || a.id} value={a.alumniId || a.id}>
                                                    {a.namaLengkap} ({a.nisn || a.nis})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid-responsive-2">
                                        <div>
                                            <label style={{ fontSize: "0.75rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                                                Tanggal Penerbitan
                                            </label>
                                            <input 
                                                type="date"
                                                value={academicForm.tanggalPenerbitan}
                                                onChange={e => setAcademicForm({...academicForm, tanggalPenerbitan: e.target.value})}
                                                style={{
                                                    width: "100%",
                                                    padding: "0.75rem 1rem",
                                                    borderRadius: "12px",
                                                    border: "1.5px solid #e2e8f0",
                                                    fontSize: "0.95rem",
                                                    outline: "none"
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: "0.75rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                                                Kepala Madrasah
                                            </label>
                                            <input 
                                                type="text"
                                                placeholder="Nama Kepala Madrasah..."
                                                value={academicForm.namaKepalaMadrasah}
                                                onChange={e => setAcademicForm({...academicForm, namaKepalaMadrasah: e.target.value})}
                                                style={{
                                                    width: "100%",
                                                    padding: "0.75rem 1rem",
                                                    borderRadius: "12px",
                                                    border: "1.5px solid #e2e8f0",
                                                    fontSize: "0.95rem",
                                                    outline: "none"
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "1rem" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                            <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "#475569" }}>📖 DAFTAR NILAI MATA PELAJARAN</span>
                                            <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "#d97706", background: "#fef3c7", padding: "2px 8px", borderRadius: "6px" }}>
                                                RATA-RATA: {(academicForm.nilaiUjian.reduce((acc: number, curr: any) => acc + Number(curr.nilai || 0), 0) / (academicForm.nilaiUjian.length || 1)).toFixed(2)}
                                            </span>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "300px", overflowY: "auto", paddingRight: "0.5rem" }}>
                                            {academicForm.nilaiUjian.map((n: any, idx: number) => (
                                                <div key={n.mataPelajaranId} style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: "1rem", alignItems: "center" }}>
                                                    <span style={{ fontSize: "0.9rem", color: "#334155" }}>{n.namaMapel}</span>
                                                    <input 
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        step="0.1"
                                                        value={n.nilai || ""}
                                                        onChange={e => {
                                                            const updatedNilai = [...academicForm.nilaiUjian];
                                                            updatedNilai[idx].nilai = e.target.value;
                                                            setAcademicForm({...academicForm, nilaiUjian: updatedNilai});
                                                        }}
                                                        style={{
                                                            padding: "0.5rem",
                                                            borderRadius: "8px",
                                                            border: "1.5px solid #e2e8f0",
                                                            fontSize: "0.9rem",
                                                            textAlign: "center",
                                                            outline: "none"
                                                        }}
                                                        required
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                                    <button 
                                        type="button"
                                        onClick={() => setShowAcademicModal(false)}
                                        style={{
                                            padding: "0.75rem 1.5rem",
                                            borderRadius: "12px",
                                            fontWeight: "700",
                                            background: "#f1f5f9",
                                            color: "#64748b",
                                            border: "none",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit"
                                        style={{
                                            padding: "0.75rem 1.5rem",
                                            borderRadius: "12px",
                                            fontWeight: "700",
                                            background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                                            color: "white",
                                            border: "none",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Simpan Data
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>

            <style jsx global>{`
                :root {
                    --primary: #15803d; --text-dark: #1e293b; --text-muted: #64748b; --glass: rgba(255, 255, 255, 0.85); --shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
                }
                .premium-container { padding: 2rem; max-width: 1400px; margin: 0 auto; color: var(--text-dark); font-family: 'Inter', system-ui, sans-serif; }
                .mobile-only { display: none; }
                .page-hero { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
                .hero-badge { display: inline-block; padding: 0.4rem 1rem; background: #fef3c7; color: #92400e; font-weight: 750; font-size: 0.75rem; text-transform: uppercase; border-radius: 20px; margin-bottom: 0.75rem; }
                .hero-content h1 { font-size: 2.8rem; font-weight: 800; margin: 0.25rem 0; letter-spacing: -1px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                
                .btn-vibrant-add { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: white; text-decoration: none; padding: 0.9rem 1.8rem; border-radius: 14px; font-weight: 700; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 10px 20px -5px rgba(217, 119, 6, 0.3); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .btn-vibrant-add:hover { transform: translateY(-3px); box-shadow: 0 15px 30px -10px rgba(217, 119, 6, 0.4); }
                
                .btn-vibrant-outline { background: white; border: 2px solid #d97706; color: #d97706; padding: 0.8rem 1.5rem; border-radius: 14px; font-weight: 700; display: flex; align-items: center; gap: 0.75rem; cursor: pointer; transition: all 0.3s; }
                .btn-vibrant-outline:hover { background: #fef3c7; transform: translateY(-3px); box-shadow: 0 10px 20px -5px rgba(217, 119, 6, 0.2); }
                .hero-actions { display: flex; gap: 1rem; align-items: center; }

                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
                .stat-card { padding: 1.5rem; border-radius: 20px; background: var(--glass); display: flex; align-items: center; gap: 1.25rem; border: 1px solid rgba(255,255,255,0.7); box-shadow: var(--shadow); }
                @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } }
                .stat-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
                .stat-icon.yellow { background: #fffbeb; color: #d97706; }
                .stat-icon.green { background: #f0fdf4; color: #16a34a; }
                .stat-icon.red { background: #fef2f2; color: #dc2626; }
                .stat-label { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); display: block; }
                .stat-value { font-size: 1.8rem; font-weight: 800; margin: 0; }

                .main-panel { border-radius: 24px; background: var(--glass); border: 1px solid rgba(255,255,255,0.7); box-shadow: var(--shadow); overflow: hidden; }

                /* PREMIUM TABLE */
                .table-responsive { overflow-x: auto; }
                .premium-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
                .premium-table thead tr { border-bottom: 2px solid #e2e8f0; }
                .premium-table th { padding: 1rem 1.25rem; font-size: 0.75rem; font-weight: 750; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
                .premium-table tbody tr { border-bottom: 1px solid #f1f5f9; transition: background 0.15s; }
                .premium-table tbody tr:last-child { border-bottom: none; }
                .premium-table td { padding: 1.1rem 1.25rem; vertical-align: middle; }
                .row-hover:hover { background: #fffbeb; }
                .nis-cell { display: flex; flex-direction: column; gap: 2px; }
                .nis-cell strong { font-size: 0.88rem; font-weight: 700; color: #1e293b; }
                .nis-cell span { font-size: 0.75rem; color: #94a3b8; }
                .name-cell { display: flex; flex-direction: column; gap: 2px; }
                .name-cell strong { font-weight: 700; color: #1e293b; }
                .empty-state { text-align: center; padding: 4rem; color: #94a3b8; font-weight: 600; }
                .action-buttons { display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem; }
                .btn-icon { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: white; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; transition: all 0.2s; text-decoration: none; }
                .btn-icon.view:hover { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
                .btn-icon.edit:hover { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
                .btn-icon.delete:hover { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
                .pill { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.3rem 0.85rem; border-radius: 20px; font-size: 0.78rem; font-weight: 750; white-space: nowrap; }
                .pill-success { background: #dcfce7; color: #15803d; }
                .pill-warning { background: #fef3c7; color: #b45309; }
                .pill-danger { background: #fee2e2; color: #dc2626; }
                .pill-info { background: #eff6ff; color: #2563eb; }
                .pill-small { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
                .ps-success { background: #dcfce7; color: #15803d; }
                .ps-active { background: #eff6ff; color: #2563eb; }
                .ps-other { background: #f1f5f9; color: #64748b; }
                .jk-badge { display: inline-block; width: 28px; height: 28px; border-radius: 8px; background: #f1f5f9; color: #475569; font-weight: 800; font-size: 0.8rem; text-align: center; line-height: 28px; }
                
                /* MODERN SEARCH & FILTER BAR (UNIFIED) */
                .m-panel-header { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.4); backdrop-filter: blur(10px); }
                .m-search-group { display: flex; align-items: center; gap: 1rem; width: 100%; transition: all 0.3s; }
                .m-search-input-wrapper { display: flex; align-items: center; background: white; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 0.5rem 1.25rem; flex: 1; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
                .m-search-input-wrapper:focus-within { border-color: #d97706; box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1); }
                .m-search-input-wrapper input { border: none; background: transparent; outline: none; flex: 1; padding: 0.6rem; font-size: 0.95rem; font-weight: 600; color: #1e293b; }
                .m-status-select { border: none; background: transparent; font-weight: 750; color: #1e293b; font-size: 0.85rem; outline: none; border-left: 2px solid #f1f5f9; padding-left: 1rem; cursor: pointer; height: 30px; }
                
                .m-filter-actions { display: flex; gap: 0.75rem; }
                .m-btn-smart { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 14px; padding: 0 1.25rem; height: 48px; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2); }
                .m-btn-smart:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3); filter: brightness(1.1); }
                .m-btn-smart active { transform: scale(0.95); }
                
                .m-btn-tool { background: white; border: 1.5px solid #e2e8f0; border-radius: 14px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; transition: all 0.2s; }
                .m-btn-tool:hover { background: #f8fafc; color: #d97706; border-color: #d97706; transform: translateY(-2px); }
                .m-btn-filter { background: white; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 0 1.5rem; height: 48px; font-weight: 750; font-size: 0.9rem; color: #64748b; display: flex; align-items: center; justify-content: center; gap: 0.75rem; cursor: pointer; transition: all 0.2s; }
                .m-btn-filter:hover { background: #f8fafc; color: #d97706; border-color: #d97706; transform: translateY(-2px); }
                .m-btn-filter.active { background: #d97706 !important; color: white !important; border-color: #b45309 !important; }

                /* ADVANCED FILTER PANEL */
                .adv-filter-panel { background: white; border: 1.5px solid #e2e8f0; border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.06); animation: slideDown 0.2s ease; }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .adv-filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; font-weight: 800; font-size: 0.95rem; color: #1e293b; }
                .adv-close-btn { display: flex; align-items: center; gap: 0.4rem; background: #fee2e2; color: #dc2626; border: none; border-radius: 10px; padding: 0.45rem 1rem; font-weight: 750; font-size: 0.82rem; cursor: pointer; }
                .adv-filter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
                .adv-field { display: flex; flex-direction: column; gap: 0.4rem; }
                .adv-field label { font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
                .adv-field input, .adv-field select { border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.65rem 1rem; font-size: 0.9rem; font-weight: 600; color: #1e293b; outline: none; background: #f8fafc; transition: all 0.2s; }
                .adv-field input:focus, .adv-field select:focus { border-color: #d97706; background: white; box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1); }
                @media (max-width: 768px) { .adv-filter-grid { grid-template-columns: 1fr 1fr; } }

                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes scan-move { 0% { left: -40px; } 100% { left: 100%; } }

                /* SMART SEARCH UI */
                .btn-smart-mode { display: flex; align-items: center; gap: 0.5rem; background: #fffbeb; border: 1px solid #fde68a; padding: 0.5rem 1rem; border-radius: 10px; color: #d97706; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; white-space: nowrap; margin-left: 0.5rem; }
                .btn-smart-mode:hover { background: #fef3c7; box-shadow: 0 2px 8px rgba(217, 119, 6, 0.15); }
                .btn-smart-mode.active { background: #fbbf24; color: #78350f; border-color: #d97706; }
                .score-badge { display: inline-block; padding: 0.25rem 0.6rem; background: rgba(217, 119, 6, 0.1); color: #d97706; border-radius: 8px; font-weight: 800; font-size: 0.75rem; border: 1px solid rgba(217, 119, 6, 0.2); }

                @media (max-width: 768px) {
                    .premium-container { padding: 0.75rem; background: #f8fafc; min-height: 100vh; }
                    .desktop-only { display: none !important; }
                    .mobile-only { display: block !important; }

                    /* HEADER MINIMAL */
                    .m-header-minimal { margin-bottom: 1rem; }
                    .m-back-link { display: inline-flex; align-items: center; gap: 0.5rem; background: #f1f5f9; padding: 0.6rem 1rem; border-radius: 12px; color: #475569; text-decoration: none; font-weight: 700; font-size: 0.9rem; }

                    .m-hero-minimal { text-align: center; margin-bottom: 1.5rem; }
                    .m-hero-badge { display: inline-block; background: #fef3c7; color: #92400e; font-size: 0.7rem; font-weight: 800; padding: 0.4rem 1.25rem; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem; }
                    .m-hero-title { font-size: 1.6rem; font-weight: 850; color: #1e293b; margin: 0 0 0.25rem; letter-spacing: -0.5px; }
                    .m-hero-subtitle { font-size: 0.85rem; color: #64748b; font-weight: 500; }

                    /* STATS MOBILE */
                    .m-stats-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem; }
                    .m-stat-half { grid-column: span 1; padding: 0.85rem !important; }
                    .m-stat-full { grid-column: span 2; padding: 0.85rem !important; }
                    .m-stat-half .stat-icon, .m-stat-full .stat-icon { width: 36px; height: 36px; border-radius: 10px; }
                    .m-stat-half .stat-value, .m-stat-full .stat-value { font-size: 1.2rem; }

                    /* PANEL HEADER MOBILE */
                    .m-search-group { flex-direction: column; align-items: stretch; gap: 0.75rem; }
                    .m-panel-header { padding: 1.25rem !important; border-radius: 24px !important; margin-bottom: 1.5rem; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; }
                    .m-search-input-wrapper { border-radius: 30px; padding: 0.4rem 1.25rem; }
                    .m-btn-filter { flex: 1; border-radius: 30px; }
                    .m-btn-tool { border-radius: 30px; }

                    .m-main-panel { background: transparent !important; box-shadow: none !important; border: none !important; }
                }
                
                /* EMPTY STATE */
                .m-empty-state { text-align: center; background: white; padding: 3rem 2rem; border-radius: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); margin-top: 1rem; }
                .m-empty-icon { font-size: 4rem; opacity: 0.2; margin-bottom: 1rem; }
                .m-empty-state p { color: #64748b; font-weight: 600; margin-bottom: 1.5rem; }
                .m-btn-add-primary { color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 30px; font-weight: 750; display: inline-flex; align-items: center; gap: 0.5rem; box-shadow: 0 8px 16px rgba(217, 119, 6, 0.2); text-decoration: none; }
                .m-btn-add-primary.bg-gold { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); }

                /* M-Doc Card */
                .m-doc-card { background: white; border-radius: 20px; padding: 1.25rem; margin-bottom: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; display: block; text-decoration: none; color: inherit; transition: all 0.2s; }
                .m-doc-card:active { transform: scale(0.98); background: #f8fafc; }

                /* M-Premium Card (mobile table-replacement card) */
                .m-premium-card { background: white; border-radius: 20px; padding: 1.25rem; margin-bottom: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; position: relative; transition: all 0.2s; }
                .m-premium-card:active { transform: scale(0.98); background: #f8fafc; }
                .m-tag-row { display: flex; gap: 0.5rem; margin-bottom: 0.4rem; align-items: center; flex-wrap: wrap; }
                .m-sub-info { margin-top: 0.25rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: #94a3b8; font-weight: 600; }
                .m-tag-jk { display: inline-block; font-size: 0.65rem; font-weight: 800; padding: 2px 8px; border-radius: 6px; }
                .m-tag-jk.l { background: #eff6ff; color: #2563eb; }
                .m-tag-jk.p { background: #fdf2f8; color: #db2777; }
                
                .m-card-header { display: flex; align-items: flex-start; gap: 1rem; }
                .avatar-md { width: 48px; height: 48px; min-width: 48px; background: #fef3c7; color: #d97706; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
                
                .m-card-main-info { flex: 1; }
                .m-tag { display: inline-block; font-size: 0.65rem; font-weight: 800; background: #f1f5f9; color: #64748b; padding: 2px 8px; border-radius: 6px; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.5px; }
                .m-card-main-info h4 { margin: 0; font-size: 1rem; font-weight: 800; color: #1e293b; line-height: 1.3; }
                .m-filename { margin-top: 0.25rem; font-size: 0.75rem; color: #94a3b8; font-weight: 500; font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; word-break: break-all; }
                
                .m-arrow { color: #cbd5e1; margin-top: 1rem; }
                
                .m-card-footer { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
                
                .m-pill { font-size: 0.72rem; font-weight: 750; padding: 4px 12px; border-radius: 20px; }
                .m-pill.ok { background: #dcfce7; color: #15803d; }
                .m-pill.wait { background: #eff6ff; color: #2563eb; }
                .m-pill.error { background: #fef2f2; color: #dc2626; }
                
                .m-actions { display: flex; gap: 0.5rem; }
                .m-actions button { width: 36px; height: 36px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; display: flex; align-items: center; justify-content: center; color: #64748b; }
                .m-actions button.danger { color: #ef4444; border-color: #fee2e2; background: #fef2f2; }
                
                .m-loading, .m-empty { text-align: center; padding: 3rem 1rem; color: #94a3b8; font-weight: 600; }
                @keyframes deleteModalIn { from { opacity: 0; transform: translateY(30px) scale(0.94); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes spin2 { to { transform: rotate(360deg); } }
            }
        `}</style>

        {/* ─── Premium Delete File Modal ─── */}
        {deletePendingId !== null && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
                <div style={{ background: "white", borderRadius: "16px", width: "100%", maxWidth: "440px", overflow: "hidden", boxShadow: "0 25px 80px rgba(220,38,38,0.28)", animation: "deleteModalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
                    <div style={{ height: "5px", background: "linear-gradient(90deg, #7f1d1d, #dc2626, #f87171)" }} />
                    <div style={{ padding: "2rem" }}>
                        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                            <div style={{ width: "72px", height: "72px", background: "linear-gradient(135deg,#fee2e2,#fecaca)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", boxShadow: "0 6px 20px rgba(220,38,38,0.2)" }}>
                                <AlertCircle size={36} color="#dc2626" />
                            </div>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#111827", marginBottom: "0.5rem" }}>Hapus File Ijazah?</h3>
                            <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.6 }}>File dokumen ijazah ini akan dihapus secara permanen dari sistem.</p>
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

        {/* ─── Premium Delete Academic Modal ─── */}
        {deleteAcademicPendingId !== null && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
                <div style={{ background: "white", borderRadius: "16px", width: "100%", maxWidth: "440px", overflow: "hidden", boxShadow: "0 25px 80px rgba(220,38,38,0.28)", animation: "deleteModalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
                    <div style={{ height: "5px", background: "linear-gradient(90deg, #7f1d1d, #dc2626, #f87171)" }} />
                    <div style={{ padding: "2rem" }}>
                        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                            <div style={{ width: "72px", height: "72px", background: "linear-gradient(135deg,#fee2e2,#fecaca)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", boxShadow: "0 6px 20px rgba(220,38,38,0.2)" }}>
                                <AlertCircle size={36} color="#dc2626" />
                            </div>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#111827", marginBottom: "0.5rem" }}>Hapus Data Akademik Ijazah?</h3>
                            <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.6 }}>Data nilai ujian dan seluruh rekap akademik ijazah ini akan dihapus permanen.</p>
                            <div style={{ marginTop: "1rem", padding: "0.65rem 0.9rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.4rem", textAlign: "left" }}>
                                <span>⚠️</span>
                                <span style={{ fontSize: "0.8rem", color: "#991b1b", fontWeight: "700" }}>Tindakan ini tidak dapat dibatalkan!</span>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button onClick={() => setDeleteAcademicPendingId(null)} disabled={isDeleting} style={{ flex: 1, padding: "0.75rem", border: "1.5px solid #e5e7eb", borderRadius: "10px", background: "white", color: "#374151", cursor: "pointer", fontWeight: "700" }}>Batal</button>
                            <button onClick={confirmDeleteAcademic} disabled={isDeleting} style={{ flex: 1, padding: "0.75rem", border: "none", borderRadius: "10px", background: isDeleting ? "#fca5a5" : "linear-gradient(135deg,#dc2626,#ef4444)", color: "white", cursor: isDeleting ? "not-allowed" : "pointer", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: isDeleting ? "none" : "0 4px 12px rgba(220,38,38,0.35)" }}>
                                {isDeleting ? (<><span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin2 0.8s linear infinite" }} /> Menghapus...</>) : (<><Trash2 size={15} /> Ya, Hapus</>)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ─── Premium Detail Academic Modal ─── */}
        {showDetailModal && selectedDetailItem && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
                <div style={{ background: "white", borderRadius: "24px", width: "100%", maxWidth: "550px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
                    <div style={{ background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", padding: "1.25rem 1.5rem", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ margin: 0, fontWeight: "800", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>📜 Detail Akademik Ijazah</h3>
                        <button onClick={() => setShowDetailModal(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><X size={22} /></button>
                    </div>
                    <div style={{ padding: "1.5rem", maxHeight: "75vh", overflowY: "auto" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
                            <div>
                                <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Nama Alumni</span>
                                <h4 style={{ margin: "2px 0 0 0", color: "#1e293b", fontWeight: "800" }}>{selectedDetailItem.namaAlumni}</h4>
                            </div>
                            <div>
                                <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>NISN</span>
                                <h4 style={{ margin: "2px 0 0 0", color: "#1e293b", fontFamily: "monospace" }}>{selectedDetailItem.nisn || "-"}</h4>
                            </div>
                            <div>
                                <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Kepala Madrasah</span>
                                <h4 style={{ margin: "2px 0 0 0", color: "#1e293b" }}>{selectedDetailItem.namaKepalaMadrasah || "-"}</h4>
                            </div>
                            <div>
                                <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Tanggal Penerbitan</span>
                                <h4 style={{ margin: "2px 0 0 0", color: "#1e293b" }}>
                                    {selectedDetailItem.tanggalPenerbitan ? new Date(selectedDetailItem.tanggalPenerbitan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
                                </h4>
                            </div>
                        </div>

                        <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "#475569", display: "block", marginBottom: "0.75rem" }}>📖 DAFTAR NILAI UJIAN</span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {selectedDetailItem.nilaiUjian?.map((n: any, idx: number) => (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0.75rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                                    <span style={{ fontSize: "0.9rem", color: "#334155", fontWeight: "600" }}>{n.namaMapel || n.nama}</span>
                                    <span style={{ fontSize: "0.9rem", fontWeight: "800", color: "#b45309" }}>{n.nilai}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fef3c7", padding: "0.75rem 1.25rem", borderRadius: "12px", border: "1px solid #fde68a" }}>
                            <span style={{ fontWeight: "800", color: "#b45309", fontSize: "0.9rem" }}>RATA-RATA NILAI:</span>
                            <span style={{ fontWeight: "900", color: "#b45309", fontSize: "1.15rem" }}>{selectedDetailItem.rataRataNilai?.toFixed(2)}</span>
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
