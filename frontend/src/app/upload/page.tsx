"use client";

import React, { useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { 
    Upload, ChevronRight, FileText, CheckCircle2, XCircle, 
    Loader2, AlertCircle, RefreshCw, FileDown, Database, 
    Camera, Info, HelpCircle, Wifi, WifiOff 
} from "lucide-react";
import * as api from "../../../services/api";
import { useEffect } from "react";

export default function UploadCenterPage() {
    const [uploadMode, setUploadMode] = useState<"ocr" | "bulk">("ocr");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [category, setCategory] = useState("Ijazah");
    const [categories, setCategories] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
    const [progress, setProgress] = useState(0);
    const [progressStep, setProgressStep] = useState("");
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        setIsOnline(navigator.onLine);
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        const fetchCategories = async () => {
            try {
                const res = await api.getKategoriArsip();
                if (res.success && res.data.length > 0) {
                    setCategories(res.data);
                    setCategory(res.data[0].namaKategori);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setUploadStatus("idle");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !isOnline) return;
        setIsUploading(true);
        setUploadStatus("idle");
        
        // Detailed Progress Simulation
        setProgress(10);
        setProgressStep("Uploading file to server...");
        
        try {
            // Fake delay for better UX visibility of steps
            await new Promise(r => setTimeout(r, 800));
            setProgress(40);
            setProgressStep("AI Service: Preprocessing image...");
            
            await new Promise(r => setTimeout(r, 1200));
            setProgress(70);
            setProgressStep("AI Service: Extracting data with OCR...");

            await api.uploadArchive(selectedFile!, category);
            
            setProgress(100);
            setProgressStep("Finished!");
            setUploadStatus("success");
            setSelectedFile(null);
        } catch (err) {
            setUploadStatus("error");
            setProgressStep("Process failed.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="premium-container">
                
                {/* HERO */}
                <header className="page-hero">
                    <div className="hero-content">
                        <div className="hero-badge">Smart Archive System</div>
                        <h1>Pusat Unggah & Import</h1>
                        <p>Pilih metode pengisian data: AI Scanning Dokumen atau Import Masal Excel.</p>
                        
                        <div className={`network-badge ${isOnline ? 'online' : 'offline'}`}>
                            {isOnline ? <><Wifi size={14} /> Sistem Terhubung</> : <><WifiOff size={14} /> Mode Offline</>}
                        </div>
                    </div>
                </header>

                {/* TABS SYSTEM */}
                <div className="tab-switcher">
                    <button 
                        className={`tab-btn ${uploadMode === 'ocr' ? 'active' : ''}`} 
                        onClick={() => {setUploadMode('ocr'); setUploadStatus('idle');}}
                    >
                        <Camera size={20} />
                        <div className="tab-text">
                            <strong>Digitalkan Arsip (OCR)</strong>
                            <span>Scan Ijazah / SKHU Satuan</span>
                        </div>
                    </button>
                    <button 
                        className={`tab-btn ${uploadMode === 'bulk' ? 'active' : ''}`} 
                        onClick={() => {setUploadMode('bulk'); setUploadStatus('idle');}}
                    >
                        <Database size={20} />
                        <div className="tab-text">
                            <strong>Import Masal (Excel)</strong>
                            <span>Upload Ribuan Data Alumni</span>
                        </div>
                    </button>
                </div>

                <div className="upload-layout-grid">
                    
                    {/* LEFT: UPLOAD AREA */}
                    <div className="upload-main glass">
                        <div className="upload-zone-header">
                            <h3>Langkah {uploadStatus === 'success' ? 'Selesai' : 'Pengunggahan'}</h3>
                            <p>Silakan {uploadMode === 'ocr' ? 'pilih foto dokumen' : 'pilih file Excel/CSV'} Anda.</p>
                        </div>

                        {uploadStatus === 'success' ? (
                            <div className="success-state bounce-in">
                                <div className="success-icon"><CheckCircle2 size={60} color="#15803d" /></div>
                                <h2>Berhasil Terunggah!</h2>
                                <p>Dokumen sedang diproses oleh sistem AI. Silakan cek di menu kategori nanti.</p>
                                <button className="btn-reset" onClick={() => setUploadStatus('idle')}>
                                    <RefreshCw size={18} /> Unggah File Lainnya
                                </button>
                            </div>
                        ) : (
                            <div className="form-content">
                                {uploadMode === 'ocr' && (
                                    <div className="category-selector">
                                        <label>Kategori Dokumen:</label>
                                        <div className="cat-options">
                                            {categories.length > 0 ? categories.map(cat => (
                                                <button 
                                                    key={cat.id} 
                                                    className={`cat-btn ${category === cat.namaKategori ? 'active' : ''}`}
                                                    onClick={() => setCategory(cat.namaKategori)}
                                                >
                                                    {cat.namaKategori}
                                                </button>
                                            )) : ["Ijazah", "SKHU", "Transkrip", "Rapor"].map(cat => (
                                                <button 
                                                    key={cat} 
                                                    className={`cat-btn ${category === cat ? 'active' : ''}`}
                                                    onClick={() => setCategory(cat)}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className={`dropzone ${selectedFile ? 'has-file' : ''}`}>
                                    <input type="file" onChange={handleFileChange} id="file-upload" />
                                    <label htmlFor="file-upload">
                                        {selectedFile ? (
                                            <div className="file-info-box">
                                                <FileText size={40} color="#15803d" />
                                                <strong>{selectedFile.name}</strong>
                                                <span>{(selectedFile.size / 1024).toFixed(0)} KB ready to upload</span>
                                            </div>
                                        ) : (
                                            <div className="drop-prompt">
                                                <div className="icon-circle"><Upload size={32} /></div>
                                                <p>Klik untuk memilih file atau seret file ke sini</p>
                                                <small>{uploadMode === 'ocr' ? 'PNG, JPG, PDF (Maks 10MB)' : 'XLSX, CSV'}</small>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                {isUploading && (
                                    <div className="progress-container">
                                        <div className="progress-header">
                                            <span>{progressStep}</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="progress-bar-bg">
                                            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    </div>
                                )}

                                <button 
                                    className="btn-upload-vibrant" 
                                    disabled={!selectedFile || isUploading || !isOnline}
                                    onClick={handleUpload}
                                >
                                    {!isOnline ? (
                                        <><WifiOff size={20} /> Sambungkan Internet</>
                                    ) : isUploading ? (
                                        <><Loader2 className="animate-spin" size={20} /> Memproses...</>
                                    ) : (
                                        <><ChevronRight size={20} /> Mulai Proses Sekarang</>
                                    )}
                                </button>
                                
                                {!isOnline && (
                                    <div className="offline-notice">
                                        <AlertCircle size={16} />
                                        <span>Fitur OCR membutuhkan koneksi ke AI Service. Silakan periksa jaringan Anda.</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: TIPS & INFO */}
                    <aside className="upload-tips glass">
                        <div className="tips-header">
                            <HelpCircle size={24} color="#15803d" />
                            <h3>Panduan & Tips</h3>
                        </div>
                        
                        <div className="tips-list">
                            {uploadMode === 'ocr' ? (
                                <>
                                    <div className="tip-item">
                                        <div className="tip-num">1</div>
                                        <div>
                                            <strong>Pencahayaan Terang</strong>
                                            <p>Pastikan foto ijazah tidak gelap atau silau agar teks terbaca AI.</p>
                                        </div>
                                    </div>
                                    <div className="tip-item">
                                        <div className="tip-num">2</div>
                                        <div>
                                            <strong>Posisi Rata</strong>
                                            <p>Ambil foto tegak lurus (bird-eye view) dan jangan miring.</p>
                                        </div>
                                    </div>
                                    <div className="tip-item">
                                        <div className="tip-num">3</div>
                                        <div>
                                            <strong>Fokus Kamera</strong>
                                            <p>Pastikan tulisan nama dan NISN terlihat tajam/jelas.</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="tip-item">
                                        <div className="tip-num">!</div>
                                        <div className="important-box">
                                            <strong>Template Wajib</strong>
                                            <p>Gunakan template Excel yang tersedia. Jangan mengubah nama kolom.</p>
                                            <button className="btn-guide-dl"><FileDown size={14} /> Ambil Template</button>
                                        </div>
                                    </div>
                                    <div className="tip-item">
                                        <div className="tip-num">1</div>
                                        <div>
                                            <strong>Status Siswa</strong>
                                            <p>Isi status kelulusan dengan teks "Lulus" atau "Aktif".</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </aside>

                </div>

            </div>

            <style jsx global>{`
                .premium-container { padding: 2rem; max-width: 1400px; margin: 0 auto; color: #1e293b; font-family: 'Inter', sans-serif; }
                .page-hero { margin-bottom: 2.5rem; text-align: center; }
                .hero-badge { display: inline-block; padding: 0.5rem 1rem; background: #f0fdf4; color: #15803d; font-weight: 800; font-size: 0.75rem; border-radius: 20px; text-transform: uppercase; margin-bottom: 1rem; }
                .page-hero h1 { font-size: 3rem; font-weight: 900; margin: 0; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                
                .network-badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; border-radius: 30px; font-size: 0.75rem; font-weight: 700; margin-top: 1rem; }
                .network-badge.online { background: #f0fdf4; color: #15803d; border: 1px solid #dcfce7; }
                .network-badge.offline { background: #fef2f2; color: #b91c1c; border: 1px solid #fee2e2; animation: pulse 2s infinite; }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }

                /* PROGRESS BAR */
                .progress-container { margin-bottom: 1.5rem; }
                .progress-header { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; color: #64748b; margin-bottom: 0.5rem; }
                .progress-bar-bg { width: 100%; height: 8px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
                .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #15803d, #22c55e); transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                
                .offline-notice { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: #fff1f1; border: 1px solid #fee2e2; border-radius: 14px; margin-top: 1rem; color: #b91c1c; font-size: 0.85rem; font-weight: 600; }
                
                /* TABS */
                .tab-switcher { display: flex; gap: 1rem; margin-bottom: 2rem; background: rgba(241, 245, 249, 0.5); padding: 0.5rem; border-radius: 24px; max-width: 600px; margin-left: auto; margin-right: auto; }
                .tab-btn { flex: 1; border: none; background: transparent; padding: 1rem; border-radius: 20px; cursor: pointer; display: flex; align-items: center; gap: 1rem; transition: all 0.3s; text-align: left; }
                .tab-btn.active { background: white; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
                .tab-btn strong { display: block; font-size: 0.95rem; color: #1e293b; }
                .tab-btn span { font-size: 0.75rem; color: #94a3b8; font-weight: 500; }
                .tab-btn.active strong { color: #15803d; }

                /* GRID LAYOUT */
                .upload-layout-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 2rem; }
                @media (max-width: 1024px) { .upload-layout-grid { grid-template-columns: 1fr; } }

                .glass { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.7); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.03); border-radius: 28px; }
                .upload-main { padding: 3rem; }
                .upload-zone-header { margin-bottom: 2rem; }
                .upload-zone-header h3 { font-size: 1.5rem; font-weight: 850; margin: 0; }
                
                .category-selector { margin-bottom: 2rem; }
                .category-selector label { display: block; font-size: 0.85rem; font-weight: 750; color: #64748b; margin-bottom: 0.75rem; }
                .cat-options { display: flex; gap: 0.75rem; flex-wrap: wrap; }
                .cat-btn { border: 2px solid #f1f5f9; background: white; padding: 0.6rem 1.2rem; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
                .cat-btn.active { border-color: #15803d; background: #f0fdf4; color: #15803d; }
                
                .dropzone { border: 2px dashed #e2e8f0; border-radius: 24px; padding: 3rem 2rem; text-align: center; cursor: pointer; transition: all 0.2s; position: relative; margin-bottom: 2rem; }
                .dropzone:hover { border-color: #15803d; background: #f0fdf4; }
                .dropzone.has-file { border-color: #15803d; border-style: solid; background: #f0fdf4; }
                .dropzone input { display: none; }
                .icon-circle { width: 64px; height: 64px; background: #f8fafc; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: #94a3b8; }
                .drop-prompt p { font-weight: 700; margin: 0; font-size: 1.1rem; }
                .drop-prompt small { color: #94a3b8; display: block; margin-top: 0.5rem; }
                
                .btn-upload-vibrant { width: 100%; padding: 1.25rem; border: none; border-radius: 18px; background: linear-gradient(135deg, #15803d 0%, #166534 100%); color: white; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; cursor: pointer; transition: all 0.3s; box-shadow: 0 15px 25px -5px rgba(21, 128, 61, 0.4); }
                .btn-upload-vibrant:hover { transform: translateY(-3px); box-shadow: 0 20px 35px -10px rgba(21, 128, 61, 0.5); }
                .btn-upload-vibrant:disabled { opacity: 0.2; transform: none; box-shadow: none; cursor: not-allowed; }

                /* TIPS AREA */
                .upload-tips { padding: 2rem; }
                .tips-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
                .tips-header h3 { margin: 0; font-size: 1.25rem; font-weight: 800; }
                
                .tips-list { display: flex; flex-direction: column; gap: 2rem; }
                .tip-item { display: flex; gap: 1.25rem; }
                .tip-num { width: 32px; height: 32px; background: #15803d; color: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; flex-shrink: 0; }
                .tip-item strong { display: block; font-size: 1rem; margin-bottom: 0.25rem; }
                .tip-item p { margin: 0; font-size: 0.9rem; color: #64748b; line-height: 1.5; }
                
                .important-box { background: #fffbeb; border: 1px solid #fde68a; padding: 1.5rem; border-radius: 20px; }
                .btn-guide-dl { margin-top: 1rem; width: 100%; padding: 0.6rem; border: 1px solid #d97706; background: white; color: #d97706; border-radius: 10px; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; justify-content: center; cursor: pointer; }

                .success-state { text-align: center; padding: 2rem 0; }
                .success-icon { margin-bottom: 1.5rem; }
                .btn-reset { margin-top: 2rem; background: #f1f5f9; border: none; padding: 1rem 2rem; border-radius: 14px; font-weight: 700; color: #334155; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; margin-left: auto; margin-right: auto; }

                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .bounce-in { animation: bounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes bounce { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </AdminLayout>
    );
}
