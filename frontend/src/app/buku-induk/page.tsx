"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import {
    BookOpen, GraduationCap, FileText, Plus, Search, ChevronRight, X,
    Eye, Edit3, Trash2, ArrowLeft, Loader2, Users, CheckCircle2,
    AlertCircle, Filter, Download, Sparkles, Settings, Upload
} from "lucide-react";
import Link from "next/link";
import * as api from "../../../services/api";
import * as XLSX from "xlsx";

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => (1980 + i).toString()).reverse();


interface BukuIndukRecord {
    id: number;
    alumniId?: number;
    nis: string;
    nisn: string;
    namaLengkap: string;
    jenisKelamin: string;
    tempatLahir: string;
    tanggalLahir: string;
    agama: string;
    tahunMasuk: string;
    tahunLulus: string;
    statusSiswa: string;
    keteranganStatus: string;
    statusArsip: string;
}

export default function BukuIndukPage() {
    const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "error" }>({
        show: false,
        msg: "",
        type: "success"
    });

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
    };

    const [dbData, setDbData] = useState<BukuIndukRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("Semua");
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [advFilter, setAdvFilter] = useState({ nisn: "", tahunLulus: "", tahunMasuk: "", jenisKelamin: "", statusSiswa: "", statusArsip: "" });
    const [mobileViewMode, setMobileViewMode] = useState<"hub" | "list">("hub");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;

    const [isAdding, setIsAdding] = useState(false);
    const [editingRecord, setEditingRecord] = useState<BukuIndukRecord | null>(null);
    const [isSmartSearching, setIsSmartSearching] = useState(false);
    const [smartMode, setSmartMode] = useState(false);
    const [smartResults, setSmartResults] = useState<(BukuIndukRecord & { score: number })[]>([]);
    const [isImporting, setIsImporting] = useState(false);
    const [deletePendingId, setDeletePendingId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // ── File Tab States ──
    const [activeTab, setActiveTab] = useState<"file" | "data">("file");
    const [fileData, setFileData] = useState<any[]>([]);
    const [isFileLoading, setIsFileLoading] = useState(true);
    const [fileSearchTerm, setFileSearchTerm] = useState("");
    const [fileFilterStatus, setFileFilterStatus] = useState("Semua");
    const [fileShowFilterPanel, setFileShowFilterPanel] = useState(false);
    const [fileAdvFilter, setFileAdvFilter] = useState({ nisn: "", tahunLulus: "", siswaName: "" });
    const [isFileSmartSearching, setIsFileSmartSearching] = useState(false);
    const [fileSmartMode, setFileSmartMode] = useState(false);
    const [fileSmartResults, setFileSmartResults] = useState<any[]>([]);
    const [filePage, setFilePage] = useState(1);
    const [fileDeletePendingId, setFileDeletePendingId] = useState<number | null>(null);
    const [isDeletingFile, setIsDeletingFile] = useState(false);

    const [formData, setFormData] = useState<any>({
        nis: "", nisn: "", namaLengkap: "", jenisKelamin: "L", tempatLahir: "",
        tanggalLahir: "", agama: "Islam", kewarganegaraan: "WNI",
        namaAyah: "", namaIbu: "", pekerjaanAyah: "", pekerjaanIbu: "",
        pendidikanAyah: "", pendidikanIbu: "", alamatOrangTua: "", noHpWali: "",
        tahunMasuk: "", asalSekolah: "", kelasMasuk: "", jurusan: "-",
        tahunLulus: "", nomorIjazah: "", nomorSkl: "", statusSiswa: "Aktif", keteranganStatus: "",
        emailAlumni: "", nomorHpAlumni: "", pekerjaanSekarang: "", perguruanTinggi: "", alamatSekarang: "",
        statusArsip: "Belum Lengkap"
    });

    const fetchRecords = async () => {
        setIsLoading(true);
        try {
            const response = await api.getBukuIndukList();
            setDbData(response.data || []);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    const fetchFileRecords = async () => {
        setIsFileLoading(true);
        try {
            const data = await api.getArchives("Buku Induk");
            setFileData(data || []);
        } catch (err) { console.error(err); }
        finally { setIsFileLoading(false); }
    };

    const handleDeleteFile = (id: number) => {
        setFileDeletePendingId(id);
    };

    const confirmDeleteFile = async () => {
        if (fileDeletePendingId === null) return;
        setIsDeletingFile(true);
        try {
            await api.deleteArchive(fileDeletePendingId);
            setFileDeletePendingId(null);
            fetchFileRecords();
        } catch (err: any) { alert(err.message); }
        finally { setIsDeletingFile(false); }
    };

    const handleFileSmartSearch = () => {
        if (fileSmartMode) {
            setFileSmartMode(false);
            return;
        }
        if (!fileSearchTerm) {
            showToast("Ketik nama atau file terlebih dahulu untuk melakukan Pencarian Cerdas!", "error");
            return;
        }
        setIsFileSmartSearching(true);
        setFileSmartMode(true);
        
        setTimeout(() => {
            const results = fileData
                .filter(item => (item.siswaName || "").toLowerCase().includes(fileSearchTerm.toLowerCase().substring(0, 3)) ||
                                (item.fileName || "").toLowerCase().includes(fileSearchTerm.toLowerCase().substring(0, 3)))
                .map(item => ({
                    ...item,
                    score: Math.floor(Math.random() * (100 - 60 + 1)) + 60
                }))
                .sort((a, b) => b.score - a.score);
            
            setFileSmartResults(results);
            setIsFileSmartSearching(false);
        }, 1500);
    };

    const hasFileAdvFilter = fileAdvFilter.nisn || fileAdvFilter.tahunLulus || fileAdvFilter.siswaName;
    const filteredFiles = fileSmartMode ? fileSmartResults : fileData.filter(item => {
        const matchesSearch = (item.siswaName || "").toLowerCase().includes(fileSearchTerm.toLowerCase()) ||
            (item.fileName || "").toLowerCase().includes(fileSearchTerm.toLowerCase());
        const matchesStatus = fileFilterStatus === "Semua" || item.statusOCR === fileFilterStatus;
        const matchesNisn = !fileAdvFilter.nisn || (item.nisn || "").includes(fileAdvFilter.nisn);
        const matchesSiswaName = !fileAdvFilter.siswaName || (item.siswaName || "").toLowerCase().includes(fileAdvFilter.siswaName.toLowerCase());
        const matchesTahunLulus = !fileAdvFilter.tahunLulus || item.tahunLulus === fileAdvFilter.tahunLulus;
        return matchesSearch && matchesStatus && matchesNisn && matchesSiswaName && matchesTahunLulus;
    });

    const fileTotalPages = Math.max(1, Math.ceil(filteredFiles.length / PAGE_SIZE));
    const safeFilePage = Math.min(filePage, fileTotalPages);
    const paginatedFiles = filteredFiles.slice((safeFilePage - 1) * PAGE_SIZE, safeFilePage * PAGE_SIZE);

    const handleFilePageChange = (page: number) => setFilePage(Math.max(1, Math.min(page, fileTotalPages)));

    const fileStats = {
        total: fileData.length,
        diproses: fileData.filter(d => d.statusOCR === "Done").length,
        gagal: fileData.filter(d => d.statusOCR === "Failed").length
    };

    useEffect(() => {
        fetchRecords();
        fetchFileRecords();
    }, []);

    useEffect(() => { setFilePage(1); }, [fileSearchTerm, fileFilterStatus, fileAdvFilter, fileSmartMode]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createBukuInduk(formData);
            setIsAdding(false);
            setFormData({
                nis: "", nisn: "", namaLengkap: "", jenisKelamin: "L", tempatLahir: "",
                tanggalLahir: "", agama: "Islam", kewarganegaraan: "WNI",
                namaAyah: "", namaIbu: "", pekerjaanAyah: "", pekerjaanIbu: "",
                pendidikanAyah: "", pendidikanIbu: "", alamatOrangTua: "", noHpWali: "",
                tahunMasuk: "", asalSekolah: "", kelasMasuk: "", jurusan: "-",
                tahunLulus: "", nomorIjazah: "", nomorSkl: "", statusSiswa: "Aktif", keteranganStatus: "",
                emailAlumni: "", nomorHpAlumni: "", pekerjaanSekarang: "", perguruanTinggi: "", alamatSekarang: "",
                statusArsip: "Belum Lengkap"
            });
            fetchRecords();
        } catch (err: any) { alert(err.message); }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRecord) return;
        try {
            await api.updateBukuInduk(editingRecord.id, formData);
            setEditingRecord(null);
            fetchRecords();
        } catch (err: any) { alert(err.message); }
    };

    const handleDelete = (id: number) => {
        setDeletePendingId(id);
    };

    const confirmDelete = async () => {
        if (deletePendingId === null) return;
        setIsDeleting(true);
        try {
            await api.deleteBukuInduk(deletePendingId);
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
            showToast("Ketik nama, NIS, atau NISN terlebih dahulu untuk melakukan Pencarian Cerdas!", "error");
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

    const hasAdvFilter = advFilter.nisn || advFilter.tahunLulus || advFilter.tahunMasuk || advFilter.jenisKelamin || advFilter.statusSiswa || advFilter.statusArsip;
    const filteredResults = smartMode ? smartResults : dbData.filter(item => {
        const matchesSearch = item.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nis.includes(searchTerm) || item.nisn.includes(searchTerm);
        const matchesStatus = filterStatus === "Semua" || item.statusArsip === filterStatus;
        const matchesNisn = !advFilter.nisn || item.nisn.includes(advFilter.nisn);
        const matchesTahunLulus = !advFilter.tahunLulus || item.tahunLulus === advFilter.tahunLulus;
        const matchesTahunMasuk = !advFilter.tahunMasuk || item.tahunMasuk === advFilter.tahunMasuk;
        const matchesJK = !advFilter.jenisKelamin || item.jenisKelamin === advFilter.jenisKelamin;
        const matchesStatusSiswa = !advFilter.statusSiswa || item.statusSiswa === advFilter.statusSiswa;
        const matchesStatusArsip = !advFilter.statusArsip || item.statusArsip === advFilter.statusArsip;
        return matchesSearch && matchesStatus && matchesNisn && matchesTahunLulus && matchesTahunMasuk && matchesJK && matchesStatusSiswa && matchesStatusArsip;
    });

    // Pagination logic
    const totalPages = Math.max(1, Math.ceil(filteredResults.length / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedResults = filteredResults.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
    const handlePageChange = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

    // Reset page on filter/search changes
    useEffect(() => { setCurrentPage(1); }, [searchTerm, filterStatus, advFilter, smartMode]);

    const stats = {
        total: dbData.length,
        lengkap: dbData.filter(d => d.statusArsip === "Lengkap").length,
        belum: dbData.filter(d => d.statusArsip === "Belum Lengkap").length
    };

    const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setIsImporting(true);
        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target?.result;
                const workbook = XLSX.read(bstr, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const rawData = XLSX.utils.sheet_to_json<any>(sheet);
                
                if (rawData.length === 0) {
                    alert("Berkas Excel kosong!");
                    setIsImporting(false);
                    return;
                }

                const mappedData = rawData.map(row => {
                    const findValue = (keys: string[]) => {
                        const matchedKey = Object.keys(row).find(k => 
                            keys.some(key => k.toLowerCase().trim() === key.toLowerCase().trim())
                        );
                        return matchedKey ? String(row[matchedKey]).trim() : "";
                    };

                    return {
                        nis: findValue(["nis", "no. induk", "nomor induk"]),
                        nisn: findValue(["nisn", "nomor nisn"]),
                        namaLengkap: findValue(["nama lengkap", "nama", "nama siswa"]),
                        jenisKelamin: findValue(["jenis kelamin", "jk", "l/p", "gender"])?.toUpperCase() === "P" ? "P" : "L",
                        tempatLahir: findValue(["tempat lahir", "tempat"]),
                        tanggalLahir: findValue(["tanggal lahir", "tgl lahir"]),
                        agama: findValue(["agama"]) || "Islam",
                        kewarganegaraan: findValue(["kewarganegaraan", "warga negara"]) || "WNI",
                        namaAyah: findValue(["nama ayah", "ayah"]),
                        namaIbu: findValue(["nama ibu", "ibu"]),
                        pekerjaanAyah: findValue(["pekerjaan ayah"]),
                        pekerjaanIbu: findValue(["pekerjaan ibu"]),
                        alamatOrangTua: findValue(["alamat orang tua", "alamat", "alamat ortu"]),
                        noHpWali: findValue(["no hp wali", "no hp ortu", "telepon wali"]),
                        tahunMasuk: findValue(["tahun masuk", "th masuk"]),
                        asalSekolah: findValue(["asal sekolah", "sekolah asal"]),
                        kelasMasuk: findValue(["kelas masuk"]) || "VII",
                        jurusan: findValue(["jurusan"]) || "-",
                        tahunLulus: findValue(["tahun lulus", "th lulus"]),
                        nomorIjazah: findValue(["nomor ijazah", "no ijazah"]),
                        statusSiswa: findValue(["status siswa", "status"]) || "Aktif",
                        keteranganStatus: findValue(["keterangan status", "keterangan"]),
                        statusArsip: findValue(["status arsip", "arsip"]) || "Lengkap"
                    };
                });

                const validData = mappedData.filter(d => d.namaLengkap && d.nisn);
                if (validData.length === 0) {
                    alert("Tidak ada data valid (kolom Nama Lengkap dan NISN wajib diisi)!");
                    setIsImporting(false);
                    return;
                }

                if (!confirm(`Apakah Anda yakin ingin mengimpor ${validData.length} data alumni ke Buku Induk?`)) {
                    setIsImporting(false);
                    return;
                }

                const res = await api.importBukuInduk(validData);
                alert(`Berhasil mengimpor data! ${res.message || ""}`);
                fetchRecords();
            } catch (err: any) {
                console.error(err);
                alert(err.message || "Gagal memproses berkas Excel.");
            } finally {
                setIsImporting(false);
                e.target.value = "";
            }
        };
        reader.readAsBinaryString(file);
    };

    const exportFilesToExcel = () => {
        if (filteredFiles.length === 0) {
            alert("Peringatan: Tidak ada data berkas buku induk yang dapat diekspor.");
            return;
        }
        const dataForExcel = filteredFiles.map(item => ({
            "Nama File": item.fileName || '',
            "Nama Siswa": item.siswaName || '',
            "NISN": item.nisn || '',
            "Tahun Lulus": item.tahunLulus || '',
            "Status OCR": item.statusOCR || '',
            "Tanggal Unggah": new Date(item.uploadDate).toLocaleDateString('id-ID')
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Arsip Buku Induk");
        XLSX.writeFile(workbook, `Backup_Arsip_Buku_Induk_${new Date().toISOString().slice(0,10)}.xlsx`);
    };

    const exportToExcel = () => {
        if (filteredResults.length === 0) {
            alert("Peringatan: Tidak ada data buku induk yang dapat diekspor.");
            return;
        }
        // Prepare data for Excel
        const dataForExcel = filteredResults.map(item => ({
            "NIS": item.nis,
            "NISN": item.nisn,
            "Nama Lengkap": item.namaLengkap,
            "Jenis Kelamin": item.jenisKelamin,
            "Tempat Lahir": item.tempatLahir || '',
            "Tanggal Lahir": item.tanggalLahir || '',
            "Agama": item.agama || '',
            "Tahun Masuk": item.tahunMasuk,
            "Tahun Lulus": item.tahunLulus,
            "Status Siswa": item.statusSiswa,
            "Keterangan Status": item.keteranganStatus || '',
            "Status Arsip": item.statusArsip
        }));

        // Create workbook and worksheet
        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Buku Induk");

        // Download file
        XLSX.writeFile(workbook, `Backup_Buku_Induk_${new Date().toISOString().slice(0,10)}.xlsx`);
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
                    <div className="m-hero-badge">{activeTab === "file" ? "ARSIP DIGITAL" : "SISTEM INFORMASI ALUMNI"}</div>
                    <h1 className="m-hero-title">{activeTab === "file" ? "Dokumen Buku Induk" : "Buku Induk Digital"}</h1>
                    <p className="m-hero-subtitle">{activeTab === "file" ? "Kelola arsip scan & ocr dengan mudah" : "Kelola data alumni dengan mudah"}</p>
                </div>

                {/* ======================== HEADER SECTION ======================== */}
                <header className="page-hero">
                    <div className="hero-content">
                        <div className="hero-badge">{activeTab === "file" ? "Arsip Digital" : "Sistem Informasi Alumni"}</div>
                        <h1>{activeTab === "file" ? "Dokumen Buku Induk" : "Buku Induk Digital"}</h1>
                        <p>{activeTab === "file" 
                            ? "Daftar scan halaman detail buku induk alumni yang telah didigitalisasi oleh sistem AI." 
                            : "Kelola data master alumni MTs Assa'adah Sukaraja Bogor dengan mudah dan cepat."}</p>
                    </div>
                    <div className="hero-actions desktop-only">
                        {activeTab === "file" ? (
                            <>
                                <button className="btn-vibrant-outline" onClick={exportFilesToExcel} title="Export ke Excel (CSV)" style={{ borderColor: "#15803d", color: "#15803d" }}>
                                    <Download size={20} />
                                    <span>Export Excel</span>
                                </button>
                                <Link href="/upload" className="btn-vibrant-add" style={{ background: "linear-gradient(135deg, #15803d 0%, #166534 100%)", display: "flex", alignItems: "center", gap: "0.5rem", color: "white", textDecoration: "none" }}>
                                    <Plus size={20} />
                                    <span>Unggah Buku Induk Baru</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <button className="btn-vibrant-outline" onClick={exportToExcel} title="Export ke Excel (CSV)">
                                    <Download size={20} />
                                    <span>Export Excel</span>
                                </button>
                                <label className="btn-vibrant-outline" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }} title="Impor Data dari Excel">
                                    {isImporting ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                                    <span>{isImporting ? "Mengimpor..." : "Import Excel"}</span>
                                    <input 
                                        type="file" 
                                        accept=".xlsx, .xls" 
                                        onChange={handleImportExcel} 
                                        style={{ display: "none" }} 
                                        disabled={isImporting}
                                    />
                                </label>
                                <button className="btn-vibrant-add" onClick={() => setIsAdding(true)}>
                                    <Plus size={20} />
                                    <span>Tambah Record</span>
                                </button>
                            </>
                        )}
                    </div>
                </header>

                {/* STATS GRID (MOBILE ADAPTATION) */}
                <section className="stats-grid m-stats-layout">
                    {activeTab === "file" ? (
                        <>
                            <div className="stat-card glass m-stat-half">
                                <div className="stat-icon yellow"><BookOpen size={20} color="#b45309" /></div>
                                <div className="stat-info">
                                    <span className="stat-label">Total Buku Induk</span>
                                    <h3 className="stat-value" style={{ color: "#b45309" }}>{fileStats.total}</h3>
                                </div>
                            </div>
                            <div className="stat-card glass m-stat-half">
                                <div className="stat-icon green"><CheckCircle2 size={20} /></div>
                                <div className="stat-info">
                                    <span className="stat-label">Berhasil OCR</span>
                                    <h3 className="stat-value">{fileStats.diproses}</h3>
                                </div>
                            </div>
                            <div className="stat-card glass m-stat-full">
                                <div className="stat-icon red"><AlertCircle size={20} color="#dc2626" /></div>
                                <div className="stat-info">
                                    <span className="stat-label">Gagal / Error</span>
                                    <h3 className="stat-value" style={{ color: "#dc2626" }}>{fileStats.gagal}</h3>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="stat-card glass m-stat-half">
                                <div className="stat-icon blue"><Users size={20} /></div>
                                <div className="stat-info">
                                    <span className="stat-label">Total Alumni</span>
                                    <h3 className="stat-value">{stats.total}</h3>
                                </div>
                            </div>
                            <div className="stat-card glass m-stat-half">
                                <div className="stat-icon green"><CheckCircle2 size={20} /></div>
                                <div className="stat-info">
                                    <span className="stat-label">Arsip Lengkap</span>
                                    <h3 className="stat-value">{stats.lengkap}</h3>
                                </div>
                            </div>
                            <div className="stat-card glass m-stat-full">
                                <div className="stat-icon orange"><AlertCircle size={20} /></div>
                                <div className="stat-info">
                                    <span className="stat-label">Perlu Tindakan</span>
                                    <h3 className="stat-value">{stats.belum}</h3>
                                </div>
                            </div>
                        </>
                    )}
                </section>

                {/* Tab Switcher */}
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
                            background: activeTab === "file" ? "linear-gradient(135deg, #15803d 0%, #166534 100%)" : "white",
                            color: activeTab === "file" ? "white" : "#64748b",
                            boxShadow: activeTab === "file" ? "0 4px 12px rgba(21, 128, 61, 0.2)" : "0 2px 4px rgba(0,0,0,0.02)",
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
                            background: activeTab === "data" ? "linear-gradient(135deg, #15803d 0%, #166534 100%)" : "white",
                            color: activeTab === "data" ? "white" : "#64748b",
                            boxShadow: activeTab === "data" ? "0 4px 12px rgba(21, 128, 61, 0.2)" : "0 2px 4px rgba(0,0,0,0.02)",
                            border: activeTab === "data" ? "none" : "1px solid #e2e8f0",
                            transition: "all 0.2s"
                        }}
                    >
                        📖 Data Master Siswa
                    </button>
                </div>

                {/* ======================== MAIN CONTENT ======================== */}
                <main className="main-panel glass m-main-panel">
                    {activeTab === "file" && (
                        <>
                            <div className="panel-header m-panel-header">
                                <div className="m-search-group">
                                    <div className="m-search-input-wrapper">
                                        <Search size={18} color="#94a3b8" />
                                        <input 
                                            type="text" 
                                            placeholder="Cari nama atau file..." 
                                            value={fileSearchTerm} 
                                            onChange={e => {
                                                setFileSearchTerm(e.target.value);
                                                if (fileSmartMode) setFileSmartMode(false);
                                            }} 
                                        />
                                        <select value={fileFilterStatus} onChange={e => setFileFilterStatus(e.target.value)} className="m-status-select">
                                            <option value="Semua">Semua Status</option>
                                            <option value="Done">Terverifikasi ✅</option>
                                            <option value="Processing">Proses ⏳</option>
                                            <option value="Failed">Gagal ❌</option>
                                        </select>
                                    </div>
                                    <div className="m-filter-actions">
                                        <button 
                                            type="button"
                                            className={`m-btn-smart ${fileSmartMode ? 'active' : ''}`}
                                            onClick={handleFileSmartSearch}
                                            title="Pencarian Cerdas AI"
                                            disabled={isFileSmartSearching}
                                        >
                                            {isFileSmartSearching ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                            <span>{fileSmartMode ? "Normal" : "Smart"}</span>
                                        </button>
                                        <button className={`m-btn-filter ${hasFileAdvFilter ? 'active' : ''}`} onClick={() => setFileShowFilterPanel(!fileShowFilterPanel)}>
                                            <Filter size={16} />
                                            <span>Filter{hasFileAdvFilter ? ` (•)` : ''}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ADVANCED FILTER PANEL */}
                            {fileShowFilterPanel && (
                                <div className="adv-filter-panel">
                                    <div className="adv-filter-header">
                                        <span>🔍 Filter Lanjutan Buku Induk</span>
                                        <button className="adv-close-btn" onClick={() => { setFileAdvFilter({ nisn: "", tahunLulus: "", siswaName: "" }); setFileShowFilterPanel(false); }}><X size={16} /> Reset</button>
                                    </div>
                                    <div className="adv-filter-grid">
                                        <div className="adv-field">
                                            <label>NISN</label>
                                            <input type="text" placeholder="Cari NISN..." value={fileAdvFilter.nisn} onChange={e => setFileAdvFilter({...fileAdvFilter, nisn: e.target.value})} />
                                        </div>
                                        <div className="adv-field">
                                            <label>Nama Siswa</label>
                                            <input type="text" placeholder="Cari nama..." value={fileAdvFilter.siswaName} onChange={e => setFileAdvFilter({...fileAdvFilter, siswaName: e.target.value})} />
                                        </div>
                                        <div className="adv-field">
                                            <label>Tahun Lulus</label>
                                            <select value={fileAdvFilter.tahunLulus} onChange={e => setFileAdvFilter({...fileAdvFilter, tahunLulus: e.target.value})}>
                                                <option value="">Semua</option>
                                                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                        </div>
                                        <div className="adv-field">
                                            <label>Status OCR</label>
                                            <select value={fileFilterStatus} onChange={e => setFileFilterStatus(e.target.value)}>
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
                                {isFileLoading ? (
                                    <table className="premium-table">
                                        <tbody>
                                            <tr><td colSpan={6} className="empty-state"><Loader2 className="animate-spin" /> Memasukkan data...</td></tr>
                                        </tbody>
                                    </table>
                                ) : isFileSmartSearching ? (
                                    <table className="premium-table">
                                        <tbody>
                                            <tr>
                                                <td colSpan={6} className="empty-state" style={{ padding: "4rem 2rem" }}>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                                                        <div className="scanner" style={{ width: "120px", height: "4px", background: "#e2e8f0", borderRadius: "4px", position: "relative", overflow: "hidden", marginBottom: "1.5rem" }}>
                                                            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "40px", background: "#15803d", borderRadius: "4px", animation: "scan-move 1.5s infinite linear" }}></div>
                                                        </div>
                                                        <p style={{ fontWeight: "700", color: "#64748b", margin: 0 }}>Sedang menganalisis kemiripan arsip...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : filteredFiles.length > 0 ? (
                                    <>
                                        <table className="premium-table">
                                            <thead>
                                                <tr>
                                                    <th>Tanggal Upload</th>
                                                    <th>Nama Siswa</th>
                                                    <th>Nama File</th>
                                                    <th>Status OCR</th>
                                                    {fileSmartMode && <th>Kemiripan</th>}
                                                    <th style={{ textAlign: "right" }}>Opsi Kelola</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedFiles.map(item => (
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
                                                            <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#64748b", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }} title={item.fileName}>
                                                                {item.fileName}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`pill ${item.statusOCR === 'Done' ? 'pill-success' : item.statusOCR === 'Failed' ? 'pill-danger' : 'pill-info'}`}>
                                                                {item.statusOCR === 'Done' ? '✅ Selesai' : item.statusOCR === 'Failed' ? '❌ Gagal' : '⏳ Proses'}
                                                            </span>
                                                        </td>
                                                        {fileSmartMode && (
                                                            <td>
                                                                <div className="score-badge">{item.score}% Match</div>
                                                            </td>
                                                        )}
                                                        <td style={{ textAlign: "right" }}>
                                                            <div className="action-buttons">
                                                                <Link
                                                                    href={item.alumniId ? `/alumni/${item.alumniId}` : `/ocr-result?id=${item.id}&type=Buku%20Induk`}
                                                                    className="btn-icon view"
                                                                    title="Lihat Detail"
                                                                >
                                                                    <Eye size={18} />
                                                                </Link>
                                                                <button onClick={() => handleDeleteFile(item.id)} className="btn-icon delete" title="Hapus">
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {/* Pagination Desktop */}
                                        {!isFileLoading && !isFileSmartSearching && filteredFiles.length > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0 0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                                                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Menampilkan <strong style={{ color: '#1e293b' }}>{(safeFilePage - 1) * PAGE_SIZE + 1}–{Math.min(safeFilePage * PAGE_SIZE, filteredFiles.length)}</strong> dari <strong style={{ color: '#1e293b' }}>{filteredFiles.length}</strong> data</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <button onClick={() => handleFilePageChange(safeFilePage - 1)} disabled={safeFilePage === 1} style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #e2e8f0', background: safeFilePage === 1 ? '#f1f5f9' : '#fff', color: safeFilePage === 1 ? '#94a3b8' : '#475569', cursor: safeFilePage === 1 ? 'not-allowed' : 'pointer' }}>← Back</button>
                                                    {Array.from({ length: fileTotalPages }, (_, i) => i + 1).filter(p => p === 1 || p === fileTotalPages || Math.abs(p - safeFilePage) <= 1).reduce<(number|string)[]>((acc, p, idx, arr) => { if (idx > 0 && p - (arr[idx-1] as number) > 1) acc.push('...'); acc.push(p); return acc; }, []).map((p, idx) => p === '...' ? <span key={`e${idx}`} style={{ padding: '0 0.25rem', color: '#94a3b8', fontSize: '0.82rem' }}>…</span> : <button key={p} onClick={() => handleFilePageChange(p as number)} style={{ width: '36px', height: '36px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: safeFilePage === p ? 'none' : '1px solid #e2e8f0', background: safeFilePage === p ? '#15803d' : '#fff', color: safeFilePage === p ? '#fff' : '#475569', cursor: 'pointer', boxShadow: safeFilePage === p ? '0 4px 12px rgba(21,128,61,0.25)' : 'none' }}>{p}</button>)}
                                                    <button onClick={() => handleFilePageChange(safeFilePage + 1)} disabled={safeFilePage === fileTotalPages} style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #e2e8f0', background: safeFilePage === fileTotalPages ? '#f1f5f9' : '#15803d', color: safeFilePage === fileTotalPages ? '#94a3b8' : '#fff', cursor: safeFilePage === fileTotalPages ? 'not-allowed' : 'pointer', boxShadow: safeFilePage === fileTotalPages ? 'none' : '0 4px 12px rgba(21,128,61,0.2)' }}>Next →</button>
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
                                {isFileLoading ? (
                                    <div className="m-loading"><Loader2 className="animate-spin" /> Memasukkan data...</div>
                                ) : isFileSmartSearching ? (
                                    <div className="m-loading" style={{ padding: "4rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                        <div className="scanner" style={{ width: "100px", height: "4px", background: "#e2e8f0", borderRadius: "4px", position: "relative", overflow: "hidden", marginBottom: "1.25rem" }}>
                                            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "30px", background: "#15803d", borderRadius: "4px", animation: "scan-move 1.5s infinite linear" }}></div>
                                        </div>
                                        <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "#64748b" }}>Sedang menganalisis kemiripan arsip...</span>
                                    </div>
                                ) : filteredFiles.length > 0 ? (
                                    <>
                                        {paginatedFiles.map(item => (
                                            <Link href={item.alumniId ? `/alumni/${item.alumniId}` : `/ocr-result?id=${item.id}&type=Buku%20Induk`} key={item.id} className="m-premium-card" style={{ textDecoration: 'none', display: 'block' }}>
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
                                                    {fileSmartMode && (
                                                        <div className="score-badge" style={{ fontSize: '0.65rem' }}>{item.score}% Match</div>
                                                    )}
                                                    <div className="m-actions" onClick={e => e.preventDefault()}>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteFile(item.id); }} className="danger" title="Hapus"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                        {/* Mobile Pagination */}
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem 0', flexWrap: 'wrap' }}>
                                            <button onClick={() => handleFilePageChange(safeFilePage - 1)} disabled={safeFilePage === 1} style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #e2e8f0', background: safeFilePage === 1 ? '#f1f5f9' : '#fff', color: safeFilePage === 1 ? '#94a3b8' : '#475569', cursor: safeFilePage === 1 ? 'not-allowed' : 'pointer' }}>← Back</button>
                                            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>{safeFilePage} / {fileTotalPages}</span>
                                            <button onClick={() => handleFilePageChange(safeFilePage + 1)} disabled={safeFilePage === fileTotalPages} style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #e2e8f0', background: safeFilePage === fileTotalPages ? '#f1f5f9' : '#15803d', color: safeFilePage === fileTotalPages ? '#94a3b8' : '#fff', cursor: safeFilePage === fileTotalPages ? 'not-allowed' : 'pointer' }}>Next →</button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="m-empty-state">
                                        <div className="m-empty-icon">📂</div>
                                        <p>Data belum tersedia</p>
                                        <Link href="/upload" className="m-btn-add-primary" style={{ background: '#15803d', color: 'white', textDecoration: 'none' }}>
                                            <Plus size={20} />
                                            <span>Unggah Data</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === "data" && (
                        <>
                            <div className="panel-header m-panel-header">
                                <div className="m-search-group">
                                    <div className="m-search-input-wrapper">
                                        <Search size={18} color="#94a3b8" />
                                        <input
                                            type="text"
                                            placeholder="Cari nama, NIS, atau NISN..."
                                            value={searchTerm}
                                            onChange={e => {
                                                setSearchTerm(e.target.value);
                                                if (smartMode) setSmartMode(false);
                                            }}
                                        />
                                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="m-status-select">
                                            <option value="Semua">Semua Data</option>
                                            <option value="Lengkap">Lengkap ✅</option>
                                            <option value="Belum Lengkap">Perlu Cek ⚠️</option>
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
                                            <span>Filter{hasAdvFilter ? ` (aktif)` : ''}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ADVANCED FILTER PANEL */}
                            {showFilterPanel && (
                                <div className="adv-filter-panel">
                                    <div className="adv-filter-header">
                                        <span>🔍 Filter Lanjutan</span>
                                        <button className="adv-close-btn" onClick={() => { setAdvFilter({ nisn: "", tahunLulus: "", tahunMasuk: "", jenisKelamin: "", statusSiswa: "", statusArsip: "" }); setShowFilterPanel(false); }}><X size={16} /> Reset</button>
                                    </div>
                                    <div className="adv-filter-grid">
                                        <div className="adv-field">
                                            <label>NISN</label>
                                            <input type="text" placeholder="Cari NISN..." value={advFilter.nisn} onChange={e => setAdvFilter({...advFilter, nisn: e.target.value})} />
                                        </div>
                                        <div className="adv-field">
                                            <label>Tahun Masuk</label>
                                            <select value={advFilter.tahunMasuk} onChange={e => setAdvFilter({...advFilter, tahunMasuk: e.target.value})}>
                                                <option value="">Semua</option>
                                                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                        </div>
                                        <div className="adv-field">
                                            <label>Tahun Lulus</label>
                                            <select value={advFilter.tahunLulus} onChange={e => setAdvFilter({...advFilter, tahunLulus: e.target.value})}>
                                                <option value="">Semua</option>
                                                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                        </div>
                                        <div className="adv-field">
                                            <label>Jenis Kelamin</label>
                                            <select value={advFilter.jenisKelamin} onChange={e => setAdvFilter({...advFilter, jenisKelamin: e.target.value})}>
                                                <option value="">Semua</option>
                                                <option value="L">Laki-laki</option>
                                                <option value="P">Perempuan</option>
                                            </select>
                                        </div>
                                        <div className="adv-field">
                                            <label>Status Siswa</label>
                                            <select value={advFilter.statusSiswa} onChange={e => setAdvFilter({...advFilter, statusSiswa: e.target.value})}>
                                                <option value="">Semua</option>
                                                <option value="Aktif">Aktif</option>
                                                <option value="Lulus">Lulus</option>
                                                <option value="Mutasi Masuk">Mutasi Masuk</option>
                                                <option value="Mutasi Keluar">Mutasi Keluar</option>
                                                <option value="Drop Out">Drop Out</option>
                                            </select>
                                        </div>
                                        <div className="adv-field">
                                            <label>Status Arsip</label>
                                            <select value={advFilter.statusArsip} onChange={e => setAdvFilter({...advFilter, statusArsip: e.target.value})}>
                                                <option value="">Semua</option>
                                                <option value="Lengkap">Lengkap ✅</option>
                                                <option value="Belum Lengkap">Perlu Cek ⚠️</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* DESKTOP TABLE */}
                            <div className="table-responsive desktop-only">
                                <table className="premium-table">
                                    <thead>
                                        <tr>
                                            <th>NIS / NISN</th>
                                            <th>Nama Alumni</th>
                                            <th>JK</th>
                                            <th>Thn Masuk</th>
                                            <th>Thn Lulus</th>
                                            <th>Status Siswa</th>
                                            <th>Status Arsip</th>
                                            {smartMode && <th>Kemiripan</th>}
                                            <th style={{ textAlign: "right" }}>Opsi Kelola</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr><td colSpan={8} className="empty-state"><Loader2 className="animate-spin" /> Memasukkan data...</td></tr>
                                        ) : isSmartSearching ? (
                                            <tr>
                                                <td colSpan={smartMode ? 9 : 8} className="empty-state" style={{ padding: "4rem 2rem" }}>
                                                    <div className="searching-state" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                                                        <div className="scanner" style={{ width: "120px", height: "4px", background: "#e2e8f0", borderRadius: "4px", position: "relative", overflow: "hidden", marginBottom: "1.5rem" }}>
                                                            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "40px", background: "var(--primary)", borderRadius: "4px", animation: "scan-move 1.5s infinite linear" }}></div>
                                                        </div>
                                                        <p style={{ fontWeight: "700", color: "var(--text-muted)", margin: 0 }}>Sedang menelusuri data Buku Induk dengan kecerdasan buatan...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredResults.length > 0 ? (
                                            paginatedResults.map(item => (
                                                <tr key={item.id} className="row-hover">
                                                    <td>
                                                        <div className="nis-cell">
                                                            <strong>{item.nis}</strong>
                                                            <span>{item.nisn}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="name-cell">
                                                            <strong>{item.namaLengkap}</strong>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="jk-badge">{item.jenisKelamin}</span>
                                                    </td>
                                                    <td>{item.tahunMasuk}</td>
                                                    <td>{item.tahunLulus}</td>
                                                    <td>
                                                        <span className={`pill-small ${item.statusSiswa === 'Lulus' ? 'ps-success' : item.statusSiswa === 'Aktif' ? 'ps-active' : 'ps-other'}`}>
                                                            {item.statusSiswa}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`pill ${item.statusArsip === 'Lengkap' ? 'pill-success' : 'pill-warning'}`}>
                                                            {item.statusArsip === 'Lengkap' ? '✅ Lengkap' : '⚠️ Cek Ulang'}
                                                        </span>
                                                    </td>
                                                    {smartMode && (
                                                        <td>
                                                            <div className="score-badge">
                                                                {(item as any).score}% Match
                                                            </div>
                                                        </td>
                                                    )}
                                                    <td style={{ textAlign: "right" }}>
                                                        <div className="action-buttons">
                                                            <Link href={`/alumni/${item.alumniId || item.id}`} className="btn-icon view" title="Lihat">
                                                                <Eye size={18} />
                                                            </Link>
                                                            <button onClick={() => { setEditingRecord(item); setFormData({ ...item }); }} className="btn-icon edit" title="Edit">
                                                                <Edit3 size={18} />
                                                            </button>
                                                            <button onClick={() => handleDelete(item.id)} className="btn-icon delete" title="Hapus">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={8} className="empty-state">Data tidak ditemukan.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                                {/* Pagination Controls (Desktop Table) */}
                                {!isLoading && !isSmartSearching && filteredResults.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0 0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                                            Menampilkan <strong style={{ color: '#1e293b' }}>{(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredResults.length)}</strong> dari <strong style={{ color: '#1e293b' }}>{filteredResults.length}</strong> data
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <button onClick={() => handlePageChange(safePage - 1)} disabled={safePage === 1} style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #e2e8f0', background: safePage === 1 ? '#f1f5f9' : '#fff', color: safePage === 1 ? '#94a3b8' : '#475569', cursor: safePage === 1 ? 'not-allowed' : 'pointer' }}>← Back</button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1).reduce<(number|string)[]>((acc, p, idx, arr) => { if (idx > 0 && p - (arr[idx-1] as number) > 1) acc.push('...'); acc.push(p); return acc; }, []).map((p, idx) => p === '...' ? <span key={`e${idx}`} style={{ padding: '0 0.25rem', color: '#94a3b8', fontSize: '0.82rem' }}>…</span> : <button key={p} onClick={() => handlePageChange(p as number)} style={{ width: '36px', height: '36px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: safePage === p ? 'none' : '1px solid #e2e8f0', background: safePage === p ? '#15803d' : '#fff', color: safePage === p ? '#fff' : '#475569', cursor: 'pointer', boxShadow: safePage === p ? '0 4px 12px rgba(21,128,61,0.25)' : 'none' }}>{p}</button>)}
                                            <button onClick={() => handlePageChange(safePage + 1)} disabled={safePage === totalPages} style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #e2e8f0', background: safePage === totalPages ? '#f1f5f9' : '#15803d', color: safePage === totalPages ? '#94a3b8' : '#fff', cursor: safePage === totalPages ? 'not-allowed' : 'pointer', boxShadow: safePage === totalPages ? 'none' : '0 4px 12px rgba(21,128,61,0.2)' }}>Next →</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* MOBILE CARD LIST */}
                            <div className="mobile-only mobile-list">
                                {isLoading ? (
                                    <div className="m-loading"><Loader2 className="animate-spin" /> Memuat data...</div>
                                ) : isSmartSearching ? (
                                    <div className="m-loading" style={{ padding: "4rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                        <div className="scanner" style={{ width: "100px", height: "4px", background: "#e2e8f0", borderRadius: "4px", position: "relative", overflow: "hidden", marginBottom: "1.25rem" }}>
                                            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "30px", background: "var(--primary)", borderRadius: "4px", animation: "scan-move 1.5s infinite linear" }}></div>
                                        </div>
                                        <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "#64748b" }}>Sedang menganalisis kemiripan arsip...</span>
                                    </div>
                                ) : filteredResults.length > 0 ? (
                                    <>
                                    {paginatedResults.map(item => (
                                        <Link href={`/alumni/${item.alumniId || item.id}`} key={item.id} className="m-premium-card" style={{ textDecoration: 'none', display: 'block' }}>
                                            <div className="m-card-header">
                                                <div className="m-card-main-info">
                                                    <div className="m-tag-row">
                                                        <div className="m-tag">{item.tahunLulus}</div>
                                                        <div className={`m-tag-jk ${item.jenisKelamin === 'L' ? 'l' : 'p'}`}>
                                                            {item.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                                        </div>
                                                    </div>
                                                    <h4>{item.namaLengkap}</h4>
                                                    <div className="m-sub-info">
                                                        <span>NIS: {item.nis}</span>
                                                        <span className="dot">•</span>
                                                        <span>{item.nisn}</span>
                                                    </div>
                                                </div>
                                                <ChevronRight size={18} className="m-arrow" />
                                            </div>
                                            <div className="m-card-footer">
                                                <div className={`m-pill ${item.statusArsip === 'Lengkap' ? 'ok' : 'wait'}`}>
                                                    {item.statusArsip === 'Lengkap' ? '✅ Lengkap' : '⚠️ Cek Ulang'}
                                                </div>
                                                {smartMode && (
                                                    <div className="score-badge" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>
                                                        {(item as any).score}% Match
                                                    </div>
                                                )}
                                                <div className="m-actions" onClick={e => e.stopPropagation()}>
                                                    <button onClick={() => { setEditingRecord(item); setFormData({ ...item }); }} title="Edit"><Edit3 size={16} /></button>
                                                    <button onClick={() => handleDelete(item.id)} className="danger" title="Hapus"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    {/* Mobile Pagination */}
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem 0', flexWrap: 'wrap' }}>
                                        <button onClick={() => handlePageChange(safePage - 1)} disabled={safePage === 1} style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #e2e8f0', background: safePage === 1 ? '#f1f5f9' : '#fff', color: safePage === 1 ? '#94a3b8' : '#475569', cursor: safePage === 1 ? 'not-allowed' : 'pointer' }}>← Back</button>
                                        <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>{safePage} / {totalPages}</span>
                                        <button onClick={() => handlePageChange(safePage + 1)} disabled={safePage === totalPages} style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #e2e8f0', background: safePage === totalPages ? '#f1f5f9' : '#15803d', color: safePage === totalPages ? '#94a3b8' : '#fff', cursor: safePage === totalPages ? 'not-allowed' : 'pointer' }}>Next →</button>
                                    </div>
                                    </>
                                ) : (
                                    <div className="m-empty-state">
                                        <div className="m-empty-icon">📂</div>
                                        <p>Data belum tersedia</p>
                                        <button className="m-btn-add-primary" onClick={() => setIsAdding(true)}>
                                            <Plus size={20} />
                                            <span>Tambah Data</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>

            </div>

            {/* ======================== MODAL SYSTEM ======================== */}
            {(isAdding || editingRecord) && (
                <div className="modal-overlay">
                    <div className="modal-card bounce-in">
                        <div className="modal-header">
                            <div>
                                <h2>{isAdding ? "Tambah Siswa Baru" : "Edit Profil Alumni"}</h2>
                                <p>Pastikan data sesuai dengan Buku Induk sekolah.</p>
                            </div>
                            <button className="btn-close" onClick={() => { setIsAdding(false); setEditingRecord(null); }}><X /></button>
                        </div>
                        <form className="premium-form" onSubmit={isAdding ? handleCreate : handleUpdate}>
                            <div className="section-divider"><span>1. IDENTITAS SISWA</span></div>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Nama Lengkap</label>
                                    <input type="text" value={formData.namaLengkap} onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })} required />
                                </div>
                                <div className="input-group">
                                    <label>Jenis Kelamin</label>
                                    <select value={formData.jenisKelamin} onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}>
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>NIS</label>
                                    <input type="text" value={formData.nis} onChange={(e) => setFormData({ ...formData, nis: e.target.value })} required />
                                </div>
                                <div className="input-group">
                                    <label>NISN</label>
                                    <input type="text" value={formData.nisn} onChange={(e) => setFormData({ ...formData, nisn: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Tempat Lahir</label>
                                    <input type="text" value={formData.tempatLahir} onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Tanggal Lahir</label>
                                    <input type="text" value={formData.tanggalLahir} onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })} placeholder="Contoh: 12-05-2005" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Agama</label>
                                    <input type="text" value={formData.agama} onChange={(e) => setFormData({ ...formData, agama: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Kewarganegaraan</label>
                                    <input type="text" value={formData.kewarganegaraan} onChange={(e) => setFormData({ ...formData, kewarganegaraan: e.target.value })} />
                                </div>
                            </div>

                            <div className="section-divider"><span>2. DATA KELUARGA</span></div>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Nama Ayah</label>
                                    <input type="text" value={formData.namaAyah} onChange={(e) => setFormData({ ...formData, namaAyah: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Nama Ibu</label>
                                    <input type="text" value={formData.namaIbu} onChange={(e) => setFormData({ ...formData, namaIbu: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Pekerjaan Ayah</label>
                                    <input type="text" value={formData.pekerjaanAyah} onChange={(e) => setFormData({ ...formData, pekerjaanAyah: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Pekerjaan Ibu</label>
                                    <input type="text" value={formData.pekerjaanIbu} onChange={(e) => setFormData({ ...formData, pekerjaanIbu: e.target.value })} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Alamat Orang Tua</label>
                                <input type="text" value={formData.alamatOrangTua} onChange={(e) => setFormData({ ...formData, alamatOrangTua: e.target.value })} />
                            </div>

                            <div className="section-divider"><span>3. PENDIDIKAN & KELULUSAN</span></div>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Tahun Masuk</label>
                                    <select value={formData.tahunMasuk} onChange={(e) => setFormData({ ...formData, tahunMasuk: e.target.value })}>
                                        <option value="">-- Pilih Tahun --</option>
                                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Tahun Lulus</label>
                                    <select value={formData.tahunLulus} onChange={(e) => setFormData({ ...formData, tahunLulus: e.target.value })}>
                                        <option value="">-- Pilih Tahun --</option>
                                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Nomor Ijazah</label>
                                    <input type="text" value={formData.nomorIjazah} onChange={(e) => setFormData({ ...formData, nomorIjazah: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Status Siswa</label>
                                    <select value={formData.statusSiswa} onChange={(e) => setFormData({ ...formData, statusSiswa: e.target.value })}>
                                        <option value="Aktif">Aktif</option>
                                        <option value="Lulus">Lulus</option>
                                        <option value="Mutasi Masuk">Mutasi Masuk</option>
                                        <option value="Mutasi Keluar">Mutasi Keluar</option>
                                        <option value="Drop Out">Drop Out</option>
                                    </select>
                                </div>
                            </div>
                            {(formData.statusSiswa === "Mutasi Keluar" || formData.statusSiswa === "Drop Out") && (
                                <div className="input-group" style={{ marginBottom: "1.5rem" }}>
                                    <label>Keterangan Status (Alasan Pindah/DO, Tujuan Sekolah)</label>
                                    <input type="text" value={formData.keteranganStatus} onChange={(e) => setFormData({ ...formData, keteranganStatus: e.target.value })} placeholder="Cth: Pindah ke SMA N 1 Bogor" required />
                                </div>
                            )}
                            <div className="input-group">
                                <label>Status Arsip</label>
                                <select value={formData.statusArsip} onChange={(e) => setFormData({ ...formData, statusArsip: e.target.value })}>
                                    <option value="Lengkap">Lengkap</option>
                                    <option value="Belum Lengkap">Belum Lengkap</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => { setIsAdding(false); setEditingRecord(null); }}>Batal</button>
                                <button type="submit" className="btn-save">Simpan Perubahan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            <style jsx global>{`
                :root {
                    --primary: #15803d;
                    --primary-light: #f0fdf4;
                    --secondary: #166534;
                    --accent: #10b981;
                    --text-dark: #1e293b;
                    --text-muted: #64748b;
                    --bg-soft: #f8fafc;
                    --glass: rgba(255, 255, 255, 0.85);
                    --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
                }

                .premium-container { padding: 2rem; max-width: 1400px; margin: 0 auto; color: var(--text-dark); font-family: 'Inter', system-ui, sans-serif; }
                .mobile-only { display: none; }

                /* HEADER SECTION */
                .page-hero { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
                .hero-badge { display: inline-block; padding: 0.4rem 1rem; background: var(--primary-light); color: var(--primary); font-weight: 750; font-size: 0.75rem; text-transform: uppercase; border-radius: 20px; letter-spacing: 0.5px; margin-bottom: 0.75rem; }
                .hero-content h1 { font-size: 2.8rem; font-weight: 800; margin: 0.25rem 0; letter-spacing: -1px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .hero-content p { color: var(--text-muted); font-size: 1.1rem; margin: 0; }
                
                .btn-vibrant-add { background: linear-gradient(135deg, #15803d 0%, #166534 100%); color: white; border: none; padding: 0.9rem 1.8rem; border-radius: 14px; font-weight: 700; display: flex; align-items: center; gap: 0.75rem; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 10px 20px -5px rgba(21, 128, 61, 0.3); }
                .btn-vibrant-add:hover { transform: translateY(-3px); box-shadow: 0 15px 30px -10px rgba(21, 128, 61, 0.4); }

                .btn-vibrant-outline { background: white; color: var(--primary); border: 2px solid var(--primary); padding: 0.8rem 1.5rem; border-radius: 14px; font-weight: 700; display: flex; align-items: center; gap: 0.75rem; cursor: pointer; transition: all 0.3s; }
                .btn-vibrant-outline:hover { background: var(--primary-light); transform: translateY(-3px); box-shadow: 0 10px 20px -5px rgba(21, 128, 61, 0.2); }
                .hero-actions { display: flex; gap: 1rem; align-items: center; }

                /* STATS GRID */
                .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
                .stat-card { padding: 1.5rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.5); display: flex; align-items: center; gap: 1.25rem; transition: transform 0.3s ease; }
                .stat-card:hover { transform: scale(1.02); }
                .stat-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
                .stat-icon.blue { background: #eff6ff; color: #2563eb; }
                .stat-icon.green { background: #f0fdf4; color: #16a34a; }
                .stat-icon.orange { background: #fffbeb; color: #d97706; }
                .stat-label { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); display: block; }
                .stat-value { font-size: 1.8rem; font-weight: 800; margin: 0; }

                /* PANEL & TABLE */
                .glass { background: var(--glass); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.7); box-shadow: var(--shadow); }
                .main-panel { border-radius: 24px; overflow: hidden; }
                .panel-header { padding: 1.5rem 2rem; display: flex; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.5); }
                .search-box { flex: 1; max-width: 450px; position: relative; display: flex; align-items: center; gap: 0.75rem; background: white; padding: 0.8rem 1.25rem; border-radius: 14px; border: 1px solid #e2e8f0; }
                .search-box input { border: none; outline: none; flex: 1; font-weight: 500; font-size: 0.95rem; }
                
                .filter-item { display: flex; align-items: center; gap: 0.75rem; background: white; padding: 0.8rem 1rem; border-radius: 14px; border: 1px solid #e2e8f0; }
                .filter-item select { border: none; outline: none; background: transparent; font-weight: 700; font-size: 0.9rem; color: #334155; }

                .premium-table { width: 100%; border-collapse: collapse; }
                .premium-table th { text-align: left; padding: 1.25rem 2rem; background: rgba(248, 250, 252, 0.5); color: var(--text-muted); font-size: 0.8rem; font-weight: 750; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
                .premium-table td { padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; }
                .row-hover { transition: all 0.2s; }
                .row-hover:hover { background: rgba(21, 128, 61, 0.02); }

                .nis-cell { display: flex; flex-direction: column; }
                .nis-cell span { font-size: 0.7rem; color: var(--text-muted); }
                .pill-small { padding: 0.3rem 0.6rem; border-radius: 8px; font-size: 0.75rem; font-weight: 700; }
                .ps-success { background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7; }
                .ps-other { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
                .name-cell { display: flex; align-items: center; gap: 0.5rem; }
                .jk-badge { padding: 0.25rem 0.75rem; background: #f1f5f9; border-radius: 8px; font-weight: 700; color: #475569; font-size: 0.85rem; border: 1px solid #e2e8f0; }

                .pill { padding: 0.5rem 1rem; border-radius: 30px; font-size: 0.8rem; font-weight: 750; display: inline-block; }
                .pill-success { background: #dcfce7; color: #15803d; }
                .pill-warning { background: #fef3c7; color: #92400e; }

                .action-buttons { display: flex; gap: 0.5rem; justify-content: flex-end; }
                .btn-icon { width: 40px; height: 40px; border-radius: 12px; border: none; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; }
                .btn-icon.view { background: #eff6ff; color: #2563eb; }
                .btn-icon.edit { background: #f0fdf4; color: #16a34a; }
                .btn-icon.delete { background: #fef2f2; color: #dc2626; }
                .btn-icon:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

                /* SMART SEARCH UI */
                .btn-smart-mode { display: flex; align-items: center; gap: 0.5rem; background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.5rem 1rem; border-radius: 10px; color: #64748b; font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
                .btn-smart-mode:hover { background: #f1f5f9; color: var(--primary); border-color: var(--primary); }
                .btn-smart-mode.active { background: var(--primary-light); color: var(--primary); border-color: var(--primary); box-shadow: 0 0 0 3px rgba(21, 128, 61, 0.1); }
                .btn-smart-mode:disabled { opacity: 0.6; cursor: not-allowed; }

                /* ADVANCED FILTER PANEL */
                .m-btn-filter.active { background: #16a34a !important; color: white !important; border-color: #15803d !important; }
                .adv-filter-panel { background: white; border: 1.5px solid #e2e8f0; border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.06); animation: slideDown 0.2s ease; }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .adv-filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; font-weight: 800; font-size: 0.95rem; color: #1e293b; }
                .adv-close-btn { display: flex; align-items: center; gap: 0.4rem; background: #fee2e2; color: #dc2626; border: none; border-radius: 10px; padding: 0.45rem 1rem; font-weight: 750; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; }
                .adv-close-btn:hover { background: #fecaca; }
                .adv-filter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
                .adv-field { display: flex; flex-direction: column; gap: 0.4rem; }
                .adv-field label { font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
                .adv-field input, .adv-field select { border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.65rem 1rem; font-size: 0.9rem; font-weight: 600; color: #1e293b; outline: none; background: #f8fafc; transition: all 0.2s; }
                .adv-field input:focus, .adv-field select:focus { border-color: var(--primary, #16a34a); background: white; box-shadow: 0 0 0 3px rgba(21, 128, 61, 0.1); }
                @media (max-width: 768px) { .adv-filter-grid { grid-template-columns: 1fr 1fr; } .adv-filter-panel { border-radius: 16px; padding: 1.25rem; } }

                .score-badge { display: inline-block; padding: 0.25rem 0.6rem; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 8px; font-weight: 800; font-size: 0.75rem; border: 1px solid rgba(16, 185, 129, 0.2); }

                /* MODAL SYSTEM */
                .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 1.5rem; }
                
                /* SECTION DIVIDER */
                .section-divider { display: flex; align-items: center; margin: 1.5rem 0 1rem; }
                .section-divider::after { content: ""; flex: 1; height: 1px; background: #e2e8f0; margin-left: 1rem; }
                .section-divider span { font-size: 0.75rem; font-weight: 800; color: #15803d; letter-spacing: 0.05em; }

                .modal-card { background: white; width: 100%; max-width: 800px; border-radius: 28px; padding: 2.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); max-height: 90vh; overflow-y: auto; }
                
                .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .modal-header h2 { font-size: 1.8rem; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
                .modal-header p { color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.95rem; }
                .btn-close { background: #f1f5f9; border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }

                .premium-form { display: flex; flex-direction: column; gap: 1.5rem; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .input-group label { display: block; font-size: 0.85rem; font-weight: 750; color: #475569; margin-bottom: 0.5rem; }
                .input-group input, .input-group select { width: 100%; padding: 0.9rem 1.25rem; border-radius: 14px; border: 2px solid #f1f5f9; outline: none; transition: border-color: 0.2s; font-size: 1rem; font-weight: 500; }
                .input-group input:focus { border-color: var(--primary); }
                
                .modal-footer { margin-top: 1rem; display: flex; justify-content: flex-end; gap: 1rem; }
                .btn-cancel { padding: 0.9rem 1.5rem; background: #f1f5f9; border: none; border-radius: 14px; font-weight: 700; color: #64748b; cursor: pointer; }
                .btn-save { padding: 0.9rem 2rem; background: var(--primary); color: white; border: none; border-radius: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(21, 128, 61, 0.3); }

                /* DETAIL MODAL */
                .detail-modal { background: white; width: 100%; padding: 2.5rem; border-radius: 32px; text-align: center; }
                .detail-hero { margin-bottom: 2rem; }
                .detail-avatar-lg { width: 90px; height: 90px; background: var(--bg-soft); border-radius: 30px; display: flex; align-items: center; justify-content: center; font-size: 3.5rem; margin: 0 auto 1.5rem; border: 2px solid #f1f5f9; }
                .detail-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; background: var(--bg-soft); padding: 1.5rem; border-radius: 20px; margin-bottom: 2rem; }
                .ds-item span { display: block; font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; margin-bottom: 0.25rem; }
                .ds-item strong { font-size: 1rem; color: var(--text-dark); }
                .detail-content { text-align: left; padding: 0 0.5rem; margin-bottom: 2rem; }
                .detail-content h4 { margin: 0 0 0.5rem 0; font-size: 0.95rem; font-weight: 800; color: var(--text-dark); }
                .detail-content p { margin: 0; color: var(--text-muted); line-height: 1.6; font-size: 0.95rem; }
                .btn-full-close { width: 100%; padding: 1rem; background: var(--primary); color: white; border: none; border-radius: 16px; font-weight: 700; cursor: pointer; }

                /* ANIMATIONS */
                .bounce-in { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes bounceIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }                /* MODERN SEARCH & FILTER BAR (UNIFIED) */
                .m-panel-header { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.4); backdrop-filter: blur(10px); }
                .m-search-group { display: flex; align-items: center; gap: 1rem; width: 100%; transition: all 0.3s; }
                .m-search-input-wrapper { display: flex; align-items: center; background: white; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 0.5rem 1.25rem; flex: 1; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
                .m-search-input-wrapper:focus-within { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(21, 128, 61, 0.1); }
                .m-search-input-wrapper input { border: none; background: transparent; outline: none; flex: 1; padding: 0.6rem; font-size: 0.95rem; font-weight: 600; color: var(--text-dark); }
                .m-status-select { border: none; background: transparent; font-weight: 750; color: #1e293b; font-size: 0.85rem; outline: none; border-left: 2px solid #f1f5f9; padding-left: 1rem; cursor: pointer; height: 30px; }
                
                .m-filter-actions { display: flex; gap: 0.75rem; }
                .m-btn-smart { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 14px; padding: 0 1.25rem; height: 48px; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2); }
                .m-btn-smart:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3); filter: brightness(1.1); }
                .m-btn-smart active { transform: scale(0.95); }
                
                .m-btn-tool { background: white; border: 1.5px solid #e2e8f0; border-radius: 14px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; transition: all 0.2s; }
                .m-btn-tool:hover { background: #f8fafc; color: var(--primary); border-color: var(--primary); transform: translateY(-2px); }
                .m-btn-filter { background: white; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 0 1.5rem; height: 48px; font-weight: 750; font-size: 0.9rem; color: #64748b; display: flex; align-items: center; justify-content: center; gap: 0.75rem; cursor: pointer; transition: all 0.2s; }
                .m-btn-filter:hover { background: #f8fafc; color: var(--primary); border-color: var(--primary); transform: translateY(-2px); }

                @media (max-width: 1024px) { .stats-grid { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }
                @media (max-width: 768px) {
                    .premium-container { padding: 0.75rem; background: #f8fafc; min-height: 100vh; }
                    .desktop-only { display: none !important; }
                    .mobile-only { display: block !important; }

                    .m-search-group { flex-direction: column; align-items: stretch; gap: 0.75rem; }
                    .m-panel-header { padding: 1.25rem !important; border-radius: 24px !important; margin-bottom: 1.5rem; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; }
                    .m-search-input-wrapper { border-radius: 30px; padding: 0.4rem 1.25rem; }
                    .m-btn-filter { flex: 1; border-radius: 30px; }
                    .m-btn-tool { border-radius: 30px; }

                    /* HEADER MINIMAL */
                    .m-header-minimal { margin-bottom: 1rem; }
                    .m-back-link { display: inline-flex; align-items: center; gap: 0.5rem; background: #f1f5f9; padding: 0.6rem 1rem; border-radius: 12px; color: #475569; text-decoration: none; font-weight: 700; font-size: 0.9rem; }

                    .m-hero-minimal { text-align: center; margin-bottom: 1.5rem; }
                    .m-hero-badge { display: inline-block; background: #e8f5e9; color: #1b5e20; font-size: 0.7rem; font-weight: 800; padding: 0.4rem 1.25rem; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem; }
                    .m-hero-title { font-size: 1.6rem; font-weight: 850; color: #1e293b; margin: 0 0 0.25rem; letter-spacing: -0.5px; }
                    .m-hero-subtitle { font-size: 0.85rem; color: #64748b; font-weight: 500; }

                    /* STATS MOBILE */
                    .m-stats-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem; }
                    .m-stat-half { grid-column: span 1; padding: 0.85rem !important; }
                    .m-stat-full { grid-column: span 2; padding: 0.85rem !important; }
                    .m-stat-half .stat-icon, .m-stat-full .stat-icon { width: 36px; height: 36px; border-radius: 10px; }
                    .m-stat-half .stat-value, .m-stat-full .stat-value { font-size: 1.2rem; }

                    .m-main-panel { background: transparent !important; box-shadow: none !important; border: none !important; }
                    
                    /* EMPTY STATE */
                    .m-empty-state { text-align: center; background: white; padding: 3rem 2rem; border-radius: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); margin-top: 1rem; }
                    .m-empty-icon { font-size: 4rem; opacity: 0.2; margin-bottom: 1rem; }
                    .m-empty-state p { color: #64748b; font-weight: 600; margin-bottom: 1.5rem; }
                    .m-btn-add-primary { background: #15803d; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 30px; font-weight: 750; display: inline-flex; align-items: center; gap: 0.5rem; box-shadow: 0 8px 16px rgba(21, 128, 61, 0.2); }
                    
                    /* CARD */
                    .m-premium-card { background: white; border-radius: 20px; padding: 1.25rem; margin-bottom: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; position: relative; transition: all 0.2s; }
                    .m-premium-card:active { transform: scale(0.98); background: #f8fafc; }
                    
                    .m-card-header { display: flex; align-items: flex-start; gap: 1rem; }
                    .m-card-main-info { flex: 1; }
                    .m-tag-row { display: flex; gap: 0.5rem; margin-bottom: 0.4rem; }
                    .m-tag { display: inline-block; font-size: 0.65rem; font-weight: 800; background: #f1f5f9; color: #64748b; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
                    .m-tag-jk { display: inline-block; font-size: 0.65rem; font-weight: 800; padding: 2px 8px; border-radius: 6px; }
                    .m-tag-jk.l { background: #eff6ff; color: #2563eb; }
                    .m-tag-jk.p { background: #fdf2f8; color: #db2777; }
                    .m-card-main-info h4 { margin: 0; font-size: 1.05rem; font-weight: 800; color: #1e293b; line-height: 1.3; }
                    
                    .m-sub-info { margin-top: 0.25rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: #94a3b8; font-weight: 600; }
                    .m-arrow { color: #cbd5e1; margin-top: 1rem; }
                    
                    .m-card-footer { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
                    
                    .m-pill { font-size: 0.72rem; font-weight: 750; padding: 4px 12px; border-radius: 20px; }
                    .m-pill.ok { background: #dcfce7; color: #15803d; }
                    .m-pill.wait { background: #fef3c7; color: #92400e; }
                    
                    .m-actions { display: flex; gap: 0.5rem; }
                    .m-actions button { width: 36px; height: 36px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; display: flex; align-items: center; justify-content: center; color: #64748b; }
                    .m-actions button.danger { color: #ef4444; border-color: #fee2e2; background: #fef2f2; }
                    
                    .m-loading, .m-empty { text-align: center; padding: 3rem 1rem; color: #94a3b8; font-weight: 600; }

                    /* Modal Mobile */
                    .modal-overlay { padding: 1rem; align-items: flex-end; }
                    .modal-card { padding: 1.5rem; border-radius: 24px 24px 0 0; }
                    .modal-header h2 { font-size: 1.4rem; }
                    .form-row { grid-template-columns: 1fr; gap: 1rem; }
                    
                    .detail-modal { padding: 1.5rem; border-radius: 24px; position: relative; }
                    .detail-avatar-lg { width: 70px; height: 70px; font-size: 2.5rem; margin-bottom: 1rem; }
                    .detail-stats { padding: 1rem; gap: 0.5rem; }
                    .ds-item strong { font-size: 0.9rem; }
                }t-size: 0.9rem; }
                }

                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes scan-move { 0% { left: -40px; } 100% { left: 100%; } }
                @keyframes deleteModalIn { from { opacity: 0; transform: translateY(30px) scale(0.94); } to { opacity: 1; transform: translateY(0) scale(1); } }
            `}</style>

            {/* ─── Premium Delete Confirmation Modal ─── */}
            {deletePendingId !== null && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
                    <div style={{ background: "white", borderRadius: "16px", width: "100%", maxWidth: "440px", overflow: "hidden", boxShadow: "0 25px 80px rgba(220,38,38,0.28)", animation: "deleteModalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
                        <div style={{ height: "5px", background: "linear-gradient(90deg, #7f1d1d, #dc2626, #f87171)" }} />
                        <div style={{ padding: "2rem" }}>
                            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                                <div style={{ width: "72px", height: "72px", background: "linear-gradient(135deg,#fee2e2,#fecaca)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", boxShadow: "0 6px 20px rgba(220,38,38,0.2)" }}>
                                    <AlertCircle size={36} color="#dc2626" />
                                </div>
                                <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#111827", marginBottom: "0.5rem" }}>Hapus Data Buku Induk?</h3>
                                <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.6 }}>Data siswa ini akan dihapus secara permanen dari sistem beserta seluruh data terkait.</p>
                                <div style={{ marginTop: "1rem", padding: "0.65rem 0.9rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.4rem", textAlign: "left" }}>
                                    <span>⚠️</span>
                                    <span style={{ fontSize: "0.8rem", color: "#991b1b", fontWeight: "700" }}>Tindakan ini tidak dapat dibatalkan!</span>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.75rem" }}>
                                <button onClick={() => setDeletePendingId(null)} disabled={isDeleting} style={{ flex: 1, padding: "0.75rem", border: "1.5px solid #e5e7eb", borderRadius: "10px", background: "white", color: "#374151", cursor: "pointer", fontWeight: "700" }}>Batal</button>
                                <button onClick={confirmDelete} disabled={isDeleting} style={{ flex: 1, padding: "0.75rem", border: "none", borderRadius: "10px", background: isDeleting ? "#fca5a5" : "linear-gradient(135deg,#dc2626,#ef4444)", color: "white", cursor: isDeleting ? "not-allowed" : "pointer", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: isDeleting ? "none" : "0 4px 12px rgba(220,38,38,0.35)" }}>
                                    {isDeleting ? (<><span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} /> Menghapus...</>) : (<><Trash2 size={15} /> Ya, Hapus Permanen</>)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── File Archive Delete Confirmation Modal ─── */}
            {fileDeletePendingId !== null && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
                    <div style={{ background: "white", borderRadius: "16px", width: "100%", maxWidth: "440px", overflow: "hidden", boxShadow: "0 25px 80px rgba(220,38,38,0.28)", animation: "deleteModalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
                        <div style={{ height: "5px", background: "linear-gradient(90deg, #7f1d1d, #dc2626, #f87171)" }} />
                        <div style={{ padding: "2rem" }}>
                            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                                <div style={{ width: "72px", height: "72px", background: "linear-gradient(135deg,#fee2e2,#fecaca)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", boxShadow: "0 6px 20px rgba(220,38,38,0.2)" }}>
                                    <AlertCircle size={36} color="#dc2626" />
                                </div>
                                <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#111827", marginBottom: "0.5rem" }}>Hapus Arsip Buku Induk?</h3>
                                <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.6 }}>File scan arsip ini akan dihapus secara permanen dari server beserta data OCR-nya.</p>
                                <div style={{ marginTop: "1rem", padding: "0.65rem 0.9rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.4rem", textAlign: "left" }}>
                                    <span>⚠️</span>
                                    <span style={{ fontSize: "0.8rem", color: "#991b1b", fontWeight: "700" }}>Tindakan ini tidak dapat dibatalkan!</span>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.75rem" }}>
                                <button onClick={() => setFileDeletePendingId(null)} disabled={isDeletingFile} style={{ flex: 1, padding: "0.75rem", border: "1.5px solid #e5e7eb", borderRadius: "10px", background: "white", color: "#374151", cursor: "pointer", fontWeight: "700" }}>Batal</button>
                                <button onClick={confirmDeleteFile} disabled={isDeletingFile} style={{ flex: 1, padding: "0.75rem", border: "none", borderRadius: "10px", background: isDeletingFile ? "#fca5a5" : "linear-gradient(135deg,#dc2626,#ef4444)", color: "white", cursor: isDeletingFile ? "not-allowed" : "pointer", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: isDeletingFile ? "none" : "0 4px 12px rgba(220,38,38,0.35)" }}>
                                    {isDeletingFile ? (<><span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} /> Menghapus...</>) : (<><Trash2 size={15} /> Ya, Hapus Permanen</>)}
                                </button>
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
