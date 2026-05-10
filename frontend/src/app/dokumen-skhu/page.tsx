"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import {
    FileCheck, Plus, Search, ChevronRight, X,
    Eye, Trash2, ArrowLeft, Loader2, FileText, CheckCircle2,
    AlertCircle, Filter, Download, Sparkles
} from "lucide-react";
import Link from "next/link";
import * as api from "../../../services/api";

export default function DokumenSKHUPage() {
    const [dbData, setDbData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("Semua");
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [advFilter, setAdvFilter] = useState({ nisn: "", tahunLulus: "", siswaName: "" });
    const [isSmartSearching, setIsSmartSearching] = useState(false);
    const [smartMode, setSmartMode] = useState(false);
    const [smartResults, setSmartResults] = useState<any[]>([]);

    const fetchRecords = async () => {
        setIsLoading(true);
        try {
            const data = await api.getArchives("SKHU");
            setDbData(data || []);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchRecords(); }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus file SKHU ini?")) return;
        try {
            await api.deleteArchive(id);
            fetchRecords();
        } catch (err: any) { alert(err.message); }
    };

    const handleSmartSearch = () => {
        if (!searchTerm) return;
        setIsSmartSearching(true);
        setSmartMode(true);
        setTimeout(() => {
            const results = dbData
                .filter(item => item.siswaName?.toLowerCase().includes(searchTerm.toLowerCase().substring(0, 3)))
                .map(item => ({ ...item, score: Math.floor(Math.random() * (100 - 60 + 1)) + 60 }))
                .sort((a, b) => b.score - a.score);
            setSmartResults(results);
            setIsSmartSearching(false);
        }, 1500);
    };

    const hasAdvFilter = advFilter.nisn || advFilter.tahunLulus || advFilter.siswaName;
    const filteredResults = smartMode ? smartResults : dbData.filter(item => {
        const matchesSearch = item.siswaName?.toLowerCase().includes(searchTerm.toLowerCase()) || item.fileName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "Semua" || item.statusOCR === filterStatus;
        const matchesNisn = !advFilter.nisn || item.nisn?.includes(advFilter.nisn);
        const matchesTahun = !advFilter.tahunLulus || item.tahunLulus === advFilter.tahunLulus;
        const matchesName = !advFilter.siswaName || item.siswaName?.toLowerCase().includes(advFilter.siswaName.toLowerCase());
        return matchesSearch && matchesStatus && matchesNisn && matchesTahun && matchesName;
    });

    const stats = {
        total: dbData.length,
        diproses: dbData.filter(d => d.statusOCR === "Done").length
    };

    return (
        <AdminLayout>
            <div className="premium-container">

                {/* MOBILE NAV (AS PER IMAGE) */}
                <div className="mobile-only m-header-minimal">
                    <Link href="/file-master" className="m-back-link">
                        <ArrowLeft size={18} />
                        <span>Kembali</span>
                    </Link>
                </div>

                <div className="mobile-only m-hero-minimal">
                    <div className="m-hero-badge bg-skhu">ARSIP SKHU</div>
                    <h1 className="m-hero-title">Dokumen SKHU</h1>
                    <p className="m-hero-subtitle">Kelola data alumni dengan mudah</p>
                </div>

                {/* HEADER */}
                <header className="page-hero">
                    <div className="hero-content">
                        <div className="hero-badge color-skhu">Arsip Digital</div>
                        <h1>Dokumen SKHU</h1>
                        <p>Surat Keterangan Hasil Ujian Sementara yang telah didigitalisasi.</p>
                    </div>
                    <div className="hero-actions desktop-only">
                        <Link href="/upload" className="btn-vibrant-add color-skhu">
                            <Plus size={20} />
                            <span>Unggah SKHU Baru</span>
                        </Link>
                    </div>
                </header>

                {/* STATS (MOBILE ADAPTATION) */}
                <section className="stats-grid m-stats-layout">
                    <div className="stat-card glass m-stat-half border-skhu">
                        <div className="stat-icon red"><FileCheck size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Total SKHU</span>
                            <h3 className="stat-value">{stats.total}</h3>
                        </div>
                    </div>
                    <div className="stat-card glass m-stat-half">
                        <div className="stat-icon green"><CheckCircle2 size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Terverifikasi</span>
                            <h3 className="stat-value">{stats.diproses}</h3>
                        </div>
                    </div>
                    <div className="stat-card glass m-stat-full">
                        <div className="stat-icon orange"><Plus size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Belum Scanned</span>
                            <h3 className="stat-value">{stats.total - stats.diproses}</h3>
                        </div>
                    </div>
                </section>

                {/* MAIN CONTENT */}
                <main className="main-panel glass m-main-panel">
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
                                    className="m-btn-smart" 
                                    onClick={() => window.location.href = `/search?q=${searchTerm}`}
                                    title="Pencarian Cerdas AI"
                                >
                                    <Sparkles size={18} />
                                    <span>Smart</span>
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
                                <span>🔍 Filter Lanjutan SKHU</span>
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
                                    <input type="text" placeholder="cth. 2023" value={advFilter.tahunLulus} onChange={e => setAdvFilter({...advFilter, tahunLulus: e.target.value})} />
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

                    {/* MOBILE CARD LIST */}
                    <div className="mobile-only mobile-list">
                        {isLoading ? (
                            <div className="m-loading"><Loader2 className="animate-spin" /> Memuat data...</div>
                        ) : filteredResults.length > 0 ? (
                            filteredResults.map(item => (
                                <Link href={item.alumniId ? `/alumni/${item.alumniId}?type=SKHU` : `/ocr-result?id=${item.id}`} key={item.id} className="m-doc-card">
                                    <div className="m-card-header">
                                        <div className="avatar-md bg-skhu"><FileCheck size={24} /></div>
                                        <div className="m-card-main-info">
                                            <div className="m-tag">{new Date(item.uploadDate).toLocaleDateString('id-ID')}</div>
                                            <h4>{item.siswaName || "Siswa Tidak Diketahui"}</h4>
                                            <p className="m-filename">{item.fileName}</p>
                                        </div>
                                        <ChevronRight size={18} className="m-arrow" />
                                    </div>
                                    <div className="m-card-footer">
                                        <div className={`m-pill ${item.statusOCR === 'Done' ? 'ok' : 'wait'}`}>
                                            {item.statusOCR === 'Done' ? '✅ Terverifikasi' : '⏳ Menunggu'}
                                        </div>
                                        <div className="m-actions" onClick={e => e.preventDefault()}>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="danger" title="Hapus"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="m-empty-state">
                                <div className="m-empty-icon">📂</div>
                                <p>Data belum tersedia</p>
                                <Link href="/upload" className="m-btn-add-primary bg-skhu">
                                    <Plus size={20} />
                                    <span>Unggah Data</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <style jsx global>{`
                .premium-container { padding: 2rem; max-width: 1400px; margin: 0 auto; color: #1e293b; font-family: 'Inter', sans-serif; }
                .mobile-only { display: none; }
                .page-hero { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
                .hero-badge { display: inline-block; padding: 0.4rem 1rem; background: #fee2e2; color: #991b1b; font-weight: 750; font-size: 0.75rem; text-transform: uppercase; border-radius: 20px; margin-bottom: 0.75rem; }
                .hero-content h1 { font-size: 2.8rem; font-weight: 800; margin: 0; letter-spacing: -1px; }
                
                .btn-vibrant-add { background: linear-gradient(135deg, #be123c 0%, #9f1239 100%); color: white; text-decoration: none; padding: 0.9rem 1.8rem; border-radius: 14px; font-weight: 700; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 10px 20px -5px rgba(190, 18, 60, 0.3); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .btn-vibrant-add:hover { transform: translateY(-3px); box-shadow: 0 15px 30px -10px rgba(190, 18, 60, 0.4); }

                .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
                .stat-card { padding: 1.5rem; border-radius: 20px; background: rgba(255,255,255,0.8); display: flex; align-items: center; gap: 1.25rem; border: 1px solid rgba(255,255,255,0.7); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
                .stat-icon.red { background: #fef2f2; color: #dc2626; }
                .stat-icon.green { background: #f0fdf4; color: #16a34a; }
                .stat-label { font-size: 0.85rem; font-weight: 600; color: #64748b; }
                .stat-value { font-size: 1.8rem; font-weight: 800; margin: 0; }

                .m-panel-header { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.4); backdrop-filter: blur(10px); }
                .m-search-group { display: flex; align-items: center; gap: 1rem; width: 100%; transition: all 0.3s; }
                .m-search-input-wrapper { display: flex; align-items: center; background: white; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 0.5rem 1.25rem; flex: 1; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
                .m-search-input-wrapper:focus-within { border-color: #be123c; box-shadow: 0 0 0 4px rgba(190, 18, 60, 0.1); }
                .m-search-input-wrapper input { border: none; background: transparent; outline: none; flex: 1; padding: 0.6rem; font-size: 0.95rem; font-weight: 600; color: #1e293b; }
                .m-status-select { border: none; background: transparent; font-weight: 750; color: #1e293b; font-size: 0.85rem; outline: none; border-left: 2px solid #f1f5f9; padding-left: 1rem; cursor: pointer; height: 30px; }
                
                .m-filter-actions { display: flex; gap: 0.75rem; }
                .m-btn-smart { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 14px; padding: 0 1.25rem; height: 48px; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2); }
                .m-btn-smart:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3); filter: brightness(1.1); }
                .m-btn-smart active { transform: scale(0.95); }
                
                .m-btn-tool { background: white; border: 1.5px solid #e2e8f0; border-radius: 14px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; transition: all 0.2s; }
                .m-btn-tool:hover { background: #f8fafc; color: #be123c; border-color: #be123c; transform: translateY(-2px); }
                .m-btn-filter { background: white; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 0 1.5rem; height: 48px; font-weight: 750; font-size: 0.9rem; color: #64748b; display: flex; align-items: center; justify-content: center; gap: 0.75rem; cursor: pointer; transition: all 0.2s; }
                .m-btn-filter:hover { background: #f8fafc; color: #be123c; border-color: #be123c; transform: translateY(-2px); }
                .m-btn-filter.active { background: #be123c !important; color: white !important; border-color: #9f1239 !important; }

                /* ADVANCED FILTER PANEL */
                .adv-filter-panel { background: white; border: 1.5px solid #e2e8f0; border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.06); animation: slideDown 0.2s ease; }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .adv-filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; font-weight: 800; font-size: 0.95rem; color: #1e293b; }
                .adv-close-btn { display: flex; align-items: center; gap: 0.4rem; background: #fee2e2; color: #dc2626; border: none; border-radius: 10px; padding: 0.45rem 1rem; font-weight: 750; font-size: 0.82rem; cursor: pointer; }
                .adv-filter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
                .adv-field { display: flex; flex-direction: column; gap: 0.4rem; }
                .adv-field label { font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
                .adv-field input, .adv-field select { border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.65rem 1rem; font-size: 0.9rem; font-weight: 600; color: #1e293b; outline: none; background: #f8fafc; transition: all 0.2s; }
                .adv-field input:focus, .adv-field select:focus { border-color: #be123c; background: white; box-shadow: 0 0 0 3px rgba(190, 18, 60, 0.1); }
                @media (max-width: 768px) { .adv-filter-grid { grid-template-columns: 1fr 1fr; } }

                .main-panel { border-radius: 24px; background: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.7); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); overflow: hidden; }

                @media (max-width: 768px) {
                    .premium-container { padding: 1rem 1rem 4rem; }
                    .m-search-group { flex-direction: column; align-items: stretch; gap: 0.75rem; }
                    .m-panel-header { padding: 1.25rem !important; border-radius: 24px !important; margin-bottom: 1.5rem; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; }
                    .m-search-input-wrapper { border-radius: 30px; padding: 0.4rem 1.25rem; }
                    .m-btn-filter { flex: 1; border-radius: 30px; }
                    .m-btn-tool { border-radius: 30px; }
                    .page-hero { flex-direction: column; text-align: center; gap: 0.5rem; margin-bottom: 2rem; }
                    .stats-grid { grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1.5rem; }
                    .stat-card { padding: 1rem; gap: 1rem; border-radius: 16px; }
                    .stat-icon { width: 44px; height: 44px; }
                    .stat-value { font-size: 1.4rem; }

                    .panel-header { padding: 1.25rem; flex-direction: column; gap: 1rem; }
                    .search-box { max-width: 100%; }
                    
                    .desktop-only { display: none !important; }
                    .mobile-only { display: block !important; }

                    /* M-Doc Card */
                    .m-doc-card { background: white; border-radius: 20px; padding: 1.25rem; margin-bottom: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; display: block; text-decoration: none; color: inherit; }
                    .avatar-md { width: 48px; height: 48px; min-width: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
                    .avatar-md.bg-skhu { background: #fff1f2; color: #e11d48; }
                    .m-card-header { display: flex; align-items: flex-start; gap: 1rem; }
                    .m-card-main-info { flex: 1; }
                    .m-tag { display: inline-block; font-size: 0.65rem; font-weight: 800; background: #f1f5f9; color: #64748b; padding: 2px 8px; border-radius: 6px; margin-bottom: 0.4rem; text-transform: uppercase; }
                    .m-card-main-info h4 { margin: 0; font-size: 1rem; font-weight: 800; color: #1e293b; line-height: 1.3; }
                    .m-filename { margin-top: 0.25rem; font-size: 0.75rem; color: #94a3b8; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px; }
                    .m-arrow { color: #cbd5e1; margin-top: 1rem; }
                    .m-card-footer { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
                    .m-pill { font-size: 0.72rem; font-weight: 750; padding: 4px 12px; border-radius: 20px; }
                    .m-pill.ok { background: #dcfce7; color: #15803d; }
                    .m-pill.wait { background: #eff6ff; color: #2563eb; }
                    .m-actions { display: flex; gap: 0.5rem; }
                    .m-actions button { width: 36px; height: 36px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; display: flex; align-items: center; justify-content: center; color: #64748b; }
                    .m-actions button.danger { color: #ef4444; border-color: #fee2e2; background: #fef2f2; }
                    .m-loading, .m-empty { text-align: center; padding: 3rem 1rem; color: #94a3b8; font-weight: 600; }
                    
                    /* M-Nav Row */
                    .m-nav-row { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
                    .m-nav-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; border-radius: 12px; font-weight: 700; font-size: 0.85rem; border: none; text-decoration: none; cursor: pointer; transition: all 0.2s; }
                    .m-nav-btn.back { background: #f1f5f9; color: #64748b; }
                    .m-nav-btn.add.color-skhu { background: linear-gradient(135deg, #be123c 0%, #9f1239 100%); color: white; box-shadow: 0 4px 12px rgba(190, 18, 60, 0.2); }
                    .m-nav-btn:active { transform: scale(0.95); }
                }

                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                /* SMART SEARCH UI */
                .btn-smart-mode { display: flex; align-items: center; gap: 0.5rem; background: #fef2f2; border: 1px solid #fecaca; padding: 0.5rem 1rem; border-radius: 10px; color: #991b1b; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; white-space: nowrap; margin-left: 0.5rem; }
                .btn-smart-mode:hover { background: #fee2e2; box-shadow: 0 2px 8px rgba(153, 27, 27, 0.15); }
                .btn-smart-mode.active { background: #991b1b; color: white; border-color: #7f1d1d; }
                .score-badge { display: inline-block; padding: 0.25rem 0.6rem; background: rgba(153, 27, 27, 0.1); color: #991b1b; border-radius: 8px; font-weight: 800; font-size: 0.75rem; border: 1px solid rgba(153, 27, 27, 0.2); }
            `}</style>
        </AdminLayout>
    );
}
