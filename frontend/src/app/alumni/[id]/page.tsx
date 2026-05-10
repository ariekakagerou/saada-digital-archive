"use client";

import { useState, useRef, useEffect } from "react";
import AdminLayout from "../../../../components/AdminLayout";
import { ArrowLeft, Download, MoreVertical, Edit, CheckCircle, ChevronLeft, ChevronRight, User, AlertCircle, Trash2, Share2, Printer, History } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import DocumentPreview from "../../../components/DocumentPreview";
import DokumenDetail from "../../../components/DokumenDetail";

export default function DetailArchivePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = Number(params.id);
    const focusedType = searchParams.get("type");

    // State for tab switching
    const [activeTab, setActiveTab] = useState<"before" | "after">("before");

    // State for dropdown menu
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // State for OCR edit modal
    const [showOCRModal, setShowOCRModal] = useState(false);
    const [editedOCRText, setEditedOCRText] = useState("");

    // State for Data Edit
    const [isEditingData, setIsEditingData] = useState(false);
    const [editFormData, setEditFormData] = useState<any>({});

    // State for toast notifications and modals
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error" | "info">("success");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    const [alumni, setAlumni] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        import("../../../../services/api").then(api => {
            api.getAlumniDetail(id)
                .then(res => {
                    const db = res.data;
                    
                    if (db) {
                        const targetArsip = focusedType 
                            ? (db.arsipDokumen?.find((a: any) => a.jenisDokumen === focusedType) || db.arsipDokumen?.[0])
                            : db.arsipDokumen?.[0];

                        // Map C# backend DTO format to Frontend format for the UI
                        setAlumni({
                            ...db, // Spread all database fields
                            id: db.id,
                            name: db.namaLengkap,
                            nis: db.nis,
                            nisn: db.nisn,
                            tempatLahir: db.tempatLahir,
                            tanggalLahir: db.tanggalLahir,
                            namaMadrasah: db.asalSekolah || "MTs Assa'adah Sukaraja Bogor",
                            year: db.tahunLulus || "2024",
                            class: db.kelasMasuk || "9A",
                            type: targetArsip ? targetArsip.jenisDokumen : "Buku Induk",
                            nomorIjazah: db.nomorIjazah || "-",
                            nomorSKHU: db.nomorSkhun || "-",
                            // Meta for UI
                            status: db.statusArsip || "Lengkap",
                            statusColor: db.statusArsip === 'Lengkap' ? "#15803d" : "#92400e",
                            statusBg: db.statusArsip === 'Lengkap' ? "#dcfce7" : "#fef3c7"
                        });
                    }
                })
                .catch(err => {
                    console.error("Error fetching detail:", err);
                    setAlumni(null);
                })
                .finally(() => setIsLoading(false));
         });
    }, [id]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    // Helper function to show toast
    const showToastNotification = (message: string, type: "success" | "error" | "info" = "success") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Handler for PDF download
    const handleDownloadPDF = () => {
        // Simulate PDF generation and download
        alert(`📄 Mengunduh PDF untuk ${alumni?.type} - ${alumni?.name}\n\nDalam implementasi penuh, ini akan:\n1. Generate PDF dengan jsPDF atau react-pdf\n2. Include data alumni lengkap\n3. Include gambar dokumen\n4. Auto-download ke komputer`);

        // In real implementation, you would use jsPDF or similar library:
        // const doc = new jsPDF();
        // doc.text(`Arsip ${alumni.type}`, 10, 10);
        // doc.save(`${alumni.name}_${alumni.type}.pdf`);
    };

    // Handler for dropdown actions
    const handleEdit = () => {
        setShowDropdown(false);
        setEditFormData({ ...alumni });
        setIsEditingData(true);
        showToastNotification("📝 Mode Edit diaktifkan", "info");
    };

    const handleSaveData = () => {
        setAlumni({ ...alumni, ...editFormData });
        setIsEditingData(false);
        showToastNotification("✅ Data berhasil diperbarui!", "success");
    };

    const handleCancelEdit = () => {
        setIsEditingData(false);
    };

    const handleDelete = () => {
        setShowDropdown(false);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setShowDeleteModal(false);
        showToastNotification("🗑️ Menghapus arsip...", "info");

        setTimeout(() => {
            showToastNotification("✅ Arsip berhasil dihapus!", "success");
            setTimeout(() => {
                router.push("/alumni");
            }, 1000);
        }, 1000);
    };

    const handlePrint = () => {
        setShowDropdown(false);
        showToastNotification("🖨️ Membuka dialog cetak...", "info");

        setTimeout(() => {
            window.print();
        }, 500);
    };

    const handleShare = () => {
        setShowDropdown(false);
        const shareUrl = `${window.location.origin}/alumni/${id}`;

        navigator.clipboard.writeText(shareUrl).then(() => {
            showToastNotification("🔗 Link berhasil disalin ke clipboard!", "success");
        }).catch(() => {
            showToastNotification("❌ Gagal menyalin link", "error");
        });
    };

    const handleHistory = () => {
        setShowDropdown(false);
        setShowHistoryModal(true);
    };

    // Handler for navigation (chevron buttons)
    const handlePreviousAlumni = () => {
        alert("📍 Silakan kembali ke daftar alumni untuk memilih data lain.");
    };

    const handleNextAlumni = () => {
        alert("📍 Silakan kembali ke daftar alumni untuk memilih data lain.");
    };

    // Handler for OCR edit modal
    const handleOpenOCREdit = () => {
        if (alumni) {
            const initialText = `Nama Peserta Didik: ${alumni.name}\nNIS : ${alumni.nis}\nTahun Lulus : ${alumni.year}`;
            setEditedOCRText(initialText);
            setShowOCRModal(true);
        }
    };

    const handleSaveOCR = () => {
        alert(`✅ Perubahan OCR berhasil disimpan!\n\nTeks yang disimpan:\n${editedOCRText}`);
        setShowOCRModal(false);
    };

    const handleCancelOCR = () => {
        setShowOCRModal(false);
        setEditedOCRText("");
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
                    <div className="spinner" style={{ border: "3px solid #f3f3f3", borderTop: "3px solid #15803d", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto 1rem auto" }}></div>
                    <p>Memuat profil alumni...</p>
                </div>
            </AdminLayout>
        );
    }

    if (!alumni) {
        return (
            <AdminLayout>
                <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
                    <AlertCircle size={48} style={{ margin: "0 auto 1rem auto", opacity: 0.5 }} />
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>Data Tidak Ditemukan</h2>
                    <p>Maaf, data alumni dengan ID tersebut tidak ditemukan.</p>
                    <Link href="/alumni">
                        <button className="btn" style={{ marginTop: "1.5rem", background: "#15803d", color: "white" }}>Kembali ke Pencarian</button>
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* Header Section */}
            <div className="alumni-detail-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", gap: "1rem" }}>
                <div>
                    <h1 style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--text-heading)", marginBottom: "0.25rem" }}>Detail Arsip Alumni</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                        <Link href="/alumni" style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}>Cari Alumni</Link>
                        <span>/</span>
                        <span style={{ color: "var(--text-heading)", fontWeight: "500" }}>{alumni.type} {alumni.name}</span>
                    </div>
                </div>
                <Link href="/alumni">
                    <button className="btn" style={{ background: "white", border: "1px solid var(--border)", color: "var(--text-body)" }}>
                        <ChevronLeft size={18} /> Kembali
                    </button>
                </Link>
            </div>

            {/* Content Grid */}
            <div className="alumni-detail-grid">

                {/* Left Column: Data & Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem", width: "100%" }}>

                    {/* Data Alumni Card */}
                    <div className="glass-panel" style={{ padding: "1.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-heading)", margin: "0" }}>Data Alumni</h3>
                            {isEditingData && (
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button onClick={handleCancelEdit} style={{ background: "#f1f5f9", border: "none", padding: "0.4rem 0.75rem", borderRadius: "6px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "500", color: "#64748b" }}>Batal</button>
                                    <button onClick={handleSaveData} style={{ background: "#15803d", color: "white", border: "none", padding: "0.4rem 0.75rem", borderRadius: "6px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "500" }}>Simpan</button>
                                </div>
                            )}
                        </div>

                        {/* Profile Summary */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", padding: "1rem", background: "#f0fdf4", borderRadius: "12px", border: "1px solid #bbf7d0" }}>
                            <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyItems: "center", border: "1px solid #dcfce7" }}>
                                <User size={24} color="#15803d" />
                            </div>
                            <div>
                                <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "#14532d" }}>{isEditingData ? editFormData.name : alumni.name}</h4>
                                <div style={{ fontSize: "0.8rem", color: "#166534", letterSpacing: "1px" }}>SISWA KELAS {isEditingData ? editFormData.class || alumni.class : alumni.class}</div>
                            </div>
                        </div>

                        {/* Details List */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.95rem" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1.5rem 1fr", gap: "0.5rem" }}>
                                <div style={{ color: "#15803d", marginTop: isEditingData ? "0.5rem" : "0" }}>●</div>
                                <div>
                                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: isEditingData ? "0.25rem" : "0" }}>Nama Lengkap</div>
                                    {isEditingData ? (
                                        <input type="text" value={editFormData.name || ''} onChange={e => setEditFormData({...editFormData, name: e.target.value})} style={{ width: "100%", padding: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.9rem" }} />
                                    ) : (
                                        <div style={{ fontWeight: "600", color: "var(--text-heading)" }}>{alumni.name}</div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1.5rem 1fr", gap: "0.5rem" }}>
                                <div style={{ color: "#15803d", marginTop: isEditingData ? "0.5rem" : "0" }}>🔢</div>
                                <div>
                                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: isEditingData ? "0.25rem" : "0" }}>NIS / NISN</div>
                                    {isEditingData ? (
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <input type="text" value={editFormData.nis || ''} onChange={e => setEditFormData({...editFormData, nis: e.target.value})} placeholder="NIS" style={{ width: "50%", padding: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.9rem" }} />
                                            <input type="text" value={editFormData.nisn || ''} onChange={e => setEditFormData({...editFormData, nisn: e.target.value})} placeholder="NISN" style={{ width: "50%", padding: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.9rem" }} />
                                        </div>
                                    ) : (
                                        <div style={{ fontWeight: "600", color: "var(--text-heading)" }}>{alumni.nis} / {alumni.nisn || '-'}</div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1.5rem 1fr", gap: "0.5rem" }}>
                                <div style={{ color: "#15803d", marginTop: isEditingData ? "0.5rem" : "0" }}>📍</div>
                                <div>
                                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: isEditingData ? "0.25rem" : "0" }}>Tempat, Tanggal Lahir</div>
                                    {isEditingData ? (
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <input type="text" value={editFormData.tempatLahir || ''} onChange={e => setEditFormData({...editFormData, tempatLahir: e.target.value})} placeholder="Kota" style={{ width: "40%", padding: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.9rem" }} />
                                            <input type="text" value={editFormData.tanggalLahir || ''} onChange={e => setEditFormData({...editFormData, tanggalLahir: e.target.value})} placeholder="Tanggal" style={{ width: "60%", padding: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.9rem" }} />
                                        </div>
                                    ) : (
                                        <div style={{ fontWeight: "600", color: "var(--text-heading)" }}>{alumni.tempatLahir || 'Bogor'}, {alumni.tanggalLahir || '10 Februari 2005'}</div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1.5rem 1fr", gap: "0.5rem" }}>
                                <div style={{ color: "#15803d", marginTop: isEditingData ? "0.5rem" : "0" }}>🏫</div>
                                <div>
                                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: isEditingData ? "0.25rem" : "0" }}>Nama Madrasah</div>
                                    {isEditingData ? (
                                        <input type="text" value={editFormData.namaMadrasah || ''} onChange={e => setEditFormData({...editFormData, namaMadrasah: e.target.value})} style={{ width: "100%", padding: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.9rem" }} />
                                    ) : (
                                        <div style={{ fontWeight: "600", color: "var(--text-heading)" }}>{alumni.namaMadrasah || "MTs Assa'adah Sukaraja Bogor"}</div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1.5rem 1fr", gap: "0.5rem" }}>
                                <div style={{ color: "#15803d", marginTop: isEditingData ? "0.5rem" : "0" }}>🎓</div>
                                <div>
                                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: isEditingData ? "0.25rem" : "0" }}>Kelas / Tahun Lulus</div>
                                    {isEditingData ? (
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <input type="text" value={editFormData.class || ''} onChange={e => setEditFormData({...editFormData, class: e.target.value})} placeholder="Kelas" style={{ width: "40%", padding: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.9rem" }} />
                                            <input type="text" value={editFormData.year || ''} onChange={e => setEditFormData({...editFormData, year: e.target.value})} placeholder="Tahun" style={{ width: "60%", padding: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.9rem" }} />
                                        </div>
                                    ) : (
                                        <div style={{ fontWeight: "600", color: "var(--text-heading)" }}>{alumni.class} / {alumni.year}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informasi Arsip Card - Dynamic based on type */}
                    <div className="glass-panel" style={{ padding: "1.5rem" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-heading)", marginBottom: "1.5rem" }}>
                            Informasi {alumni.type}
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem" }}>
                            {/* Common Fields */}
                            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", alignItems: "start" }}>
                                <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Jenis Arsip</div>
                                <div style={{ fontWeight: "600", color: "#15803d", background: "#dcfce7", padding: "0.25rem 0.75rem", borderRadius: "6px", width: "fit-content" }}>
                                    {alumni.type === 'Ijazah' && '📜 Ijazah'}
                                    {alumni.type === 'SKHU' && '📋 SKHU'}
                                    {alumni.type === 'Transkrip' && '📊 Transkrip Nilai'}
                                    {alumni.type === 'Rapor' && '📚 Rapor'}
                                    {alumni.type === 'Buku Induk' && '📖 Buku Induk'}
                                </div>
                            </div>

                            {/* Ijazah Specific Fields */}
                            {alumni.type === 'Ijazah' && alumni.nomorIjazah && (
                                <>
                                    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
                                        <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Nomor Ijazah</div>
                                        <div style={{ fontWeight: "600", color: "var(--text-heading)" }}>{alumni.nomorIjazah}</div>
                                    </div>
                                    {alumni.tanggalPenerbitan && (
                                        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
                                            <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Tanggal Penerbitan</div>
                                            <div style={{ fontWeight: "500", color: "var(--text-heading)" }}>{alumni.tanggalPenerbitan}</div>
                                        </div>
                                    )}
                                    {alumni.kepalaSekolah && (
                                        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
                                            <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Kepala Madrasah</div>
                                            <div style={{ fontWeight: "500", color: "var(--text-heading)" }}>{alumni.kepalaSekolah}</div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* SKHU Specific Fields */}
                            {alumni.type === 'SKHU' && (
                                <>
                                    {alumni.nomorSKHU && (
                                        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
                                            <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Nomor SKHU</div>
                                            <div style={{ fontWeight: "600", color: "var(--text-heading)" }}>{alumni.nomorSKHU}</div>
                                        </div>
                                    )}
                                    {alumni.nomorPeserta && (
                                        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
                                            <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Nomor Peserta</div>
                                            <div style={{ fontWeight: "500", color: "var(--text-heading)" }}>{alumni.nomorPeserta}</div>
                                        </div>
                                    )}
                                    {alumni.nilaiRataRata && (
                                        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
                                            <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Nilai Rata-rata</div>
                                            <div style={{ fontWeight: "600", color: "#15803d", fontSize: "1.1rem" }}>{alumni.nilaiRataRata}</div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Transkrip Specific Fields */}
                            {alumni.type === 'Transkrip' && (
                                <>
                                    {alumni.nilaiRataRata && (
                                        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
                                            <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Nilai Rata-rata</div>
                                            <div style={{ fontWeight: "600", color: "#15803d", fontSize: "1.1rem" }}>{alumni.nilaiRataRata}</div>
                                        </div>
                                    )}
                                    {alumni.keteranganLulus && (
                                        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
                                            <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Keterangan</div>
                                            <div style={{ fontWeight: "500", color: "var(--text-heading)" }}>{alumni.keteranganLulus}</div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Rapor Specific Fields */}
                            {alumni.type === 'Rapor' && alumni.nilaiRataRata && (
                                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
                                    <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Nilai Rata-rata</div>
                                    <div style={{ fontWeight: "600", color: "#15803d", fontSize: "1.1rem" }}>{alumni.nilaiRataRata}</div>
                                </div>
                            )}

                            {/* Buku Induk Specific Fields */}
                            {alumni.type === 'Buku Induk' && (
                                <>
                                    {/* ── 1. IDENTITAS SISWA ── */}
                                    <div className="detail-section">
                                        <div className="section-divider"><span>IDENTITAS SISWA</span></div>
                                        <div className="detail-grid-modern">
                                            <div className="dg-item"><span>Agama</span><strong>{alumni.agama || 'Islam'}</strong></div>
                                            <div className="dg-item"><span>Kewarganegaraan</span><strong>{alumni.kewarganegaraan || 'WNI'}</strong></div>
                                            <div className="dg-item"><span>Jenis Kelamin</span><strong>{alumni.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</strong></div>
                                            <div className="dg-item"><span>Alamat Siswa</span><strong>{alumni.alamatSekarang || '-'}</strong></div>
                                        </div>
                                    </div>

                                    {/* ── 2. DATA KELUARGA ── */}
                                    <div className="detail-section">
                                        <div className="section-divider"><span>ORANG TUA / WALI</span></div>
                                        <div className="detail-grid-modern">
                                            <div className="dg-item"><span>Nama Ayah</span><strong>{alumni.namaAyah || '-'}</strong></div>
                                            <div className="dg-item"><span>Pekerjaan Ayah</span><strong>{alumni.pekerjaanAyah || '-'}</strong></div>
                                            <div className="dg-item"><span>Pendidikan Ayah</span><strong>{alumni.pendidikanAyah || '-'}</strong></div>
                                            <div className="dg-item"><span>Nama Ibu</span><strong>{alumni.namaIbu || '-'}</strong></div>
                                            <div className="dg-item"><span>Pekerjaan Ibu</span><strong>{alumni.pekerjaanIbu || '-'}</strong></div>
                                            <div className="dg-item"><span>Pendidikan Ibu</span><strong>{alumni.pendidikanIbu || '-'}</strong></div>
                                            <div className="dg-item full-width"><span>Alamat Orang Tua</span><strong>{alumni.alamatOrangTua || '-'}</strong></div>
                                            <div className="dg-item"><span>No. HP Wali</span><strong>{alumni.noHpWali || '-'}</strong></div>
                                        </div>
                                    </div>

                                    {/* ── 3. DATA SEKOLAH & KELULUSAN ── */}
                                    <div className="detail-section">
                                        <div className="section-divider"><span>RIWAYAT SEKOLAH</span></div>
                                        <div className="detail-grid-modern">
                                            <div className="dg-item"><span>Tahun Masuk</span><strong>{alumni.tahunMasuk || '-'}</strong></div>
                                            <div className="dg-item"><span>Asal Sekolah</span><strong>{alumni.asalSekolah || '-'}</strong></div>
                                            <div className="dg-item"><span>Kelas Masuk</span><strong>{alumni.kelasMasuk || '-'}</strong></div>
                                            <div className="dg-item"><span>Tahun Lulus</span><strong>{alumni.tahunLulus || '-'}</strong></div>
                                            <div className="dg-item"><span>No. Ijazah</span><strong>{alumni.nomorIjazah || '-'}</strong></div>
                                            <div className="dg-item"><span>No. SKHUN</span><strong>{alumni.nomorSkhun || '-'}</strong></div>
                                            <div className="dg-item"><span>Status Lulus</span><strong>{alumni.statusKelulusan || 'Lulus'}</strong></div>
                                        </div>
                                    </div>

                                    {/* ── 4. DATA ALUMNI (TRACER STUDY) ── */}
                                    {(alumni.emailAlumni || alumni.pekerjaanSekarang || alumni.perguruanTinggi) && (
                                        <div className="detail-section">
                                            <div className="section-divider"><span>TRACER STUDY (PASCA LULUS)</span></div>
                                            <div className="detail-grid-modern">
                                                <div className="dg-item"><span>Email</span><strong>{alumni.emailAlumni || '-'}</strong></div>
                                                <div className="dg-item"><span>No. HP Alumni</span><strong>{alumni.nomorHpAlumni || '-'}</strong></div>
                                                <div className="dg-item"><span>Pekerjaan</span><strong>{alumni.pekerjaanSekarang || '-'}</strong></div>
                                                <div className="dg-item"><span>Perguruan Tinggi</span><strong>{alumni.perguruanTinggi || '-'}</strong></div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Status & Metadata */}
                            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1rem", marginTop: "0.5rem" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", marginBottom: "0.75rem" }}>
                                    <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Status Arsip</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: "600", color: alumni.statusColor }}>
                                        <CheckCircle size={14} fill={alumni.statusColor} color="white" /> {alumni.status}
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", marginBottom: "0.75rem" }}>
                                    <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Tanggal Pemindaian</div>
                                    <div style={{ fontWeight: "500", color: "var(--text-heading)" }}>21 April {alumni.year}, 10:15 WIB</div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
                                    <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Petugas</div>
                                    <div style={{ fontWeight: "500", color: "var(--text-heading)" }}>Admin MTS</div>
                                </div>
                            </div>

                            {/* Technical Metadata Section */}
                            <div style={{ borderTop: "1px dashed #e5e7eb", paddingTop: "1rem", marginTop: "0.5rem" }}>
                                <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                                    Metadata Teknis (AI)
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
                                    <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>OCR Engine</div>
                                    <div style={{ fontFamily: "monospace", color: "#15803d" }}>Tesseract-v5 + CER-Model</div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
                                    <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Confidence</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <div style={{ width: "60px", height: "6px", background: "#e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
                                            <div style={{ width: "94%", height: "100%", background: "#15803d" }}></div>
                                        </div>
                                        <span style={{ fontWeight: "600", color: "#15803d" }}>94.2%</span>
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", fontSize: "0.85rem" }}>
                                    <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Ukuran File</div>
                                    <div style={{ color: "var(--text-heading)" }}>2.4 MB (Lossless PNG)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Lengkap per Jenis Dokumen */}
                    {['Ijazah','SKHU','Transkrip','Rapor'].includes(alumni.type) && (
                        <DokumenDetail alumni={alumni} />
                    )}

                </div>

                {/* Right Column: Preview & OCR */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                    {/* Header Actions */}
                    <div className="file-preview-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-heading)" }}>Pratinjau Arsip</h3>
                        <div style={{ display: "flex", gap: "0.75rem", position: "relative", flexWrap: "wrap" }}>
                            <button
                                onClick={handleDownloadPDF}
                                className="btn"
                                style={{ background: "#15803d", color: "white", padding: "0.5rem 1rem", fontSize: "0.9rem" }}
                            >
                                <Download size={16} /> Unduh PDF
                            </button>

                            {/* Dropdown Container */}
                            <div style={{ position: "relative" }} ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="btn"
                                    style={{ background: "white", border: "1px solid var(--border)", color: "var(--text-body)", padding: "0.5rem 1rem", fontSize: "0.9rem" }}
                                >
                                    Aksi Lainnya <MoreVertical size={16} />
                                </button>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div style={{
                                        position: "absolute",
                                        top: "calc(100% + 0.5rem)",
                                        right: "0",
                                        background: "white",
                                        border: "1px solid var(--border)",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        minWidth: "200px",
                                        zIndex: 1000,
                                        overflow: "hidden"
                                    }}>
                                        <button
                                            onClick={handleEdit}
                                            style={{
                                                width: "100%",
                                                padding: "0.75rem 1rem",
                                                border: "none",
                                                background: "white",
                                                textAlign: "left",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.75rem",
                                                fontSize: "0.9rem",
                                                color: "var(--text-body)",
                                                transition: "background 0.2s"
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                                        >
                                            <Edit size={16} color="#15803d" />
                                            Edit Data
                                        </button>

                                        <button
                                            onClick={handlePrint}
                                            style={{
                                                width: "100%",
                                                padding: "0.75rem 1rem",
                                                border: "none",
                                                background: "white",
                                                textAlign: "left",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.75rem",
                                                fontSize: "0.9rem",
                                                color: "var(--text-body)",
                                                transition: "background 0.2s"
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                                        >
                                            <Printer size={16} color="#2563eb" />
                                            Cetak
                                        </button>

                                        <button
                                            onClick={handleShare}
                                            style={{
                                                width: "100%",
                                                padding: "0.75rem 1rem",
                                                border: "none",
                                                background: "white",
                                                textAlign: "left",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.75rem",
                                                fontSize: "0.9rem",
                                                color: "var(--text-body)",
                                                transition: "background 0.2s"
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                                        >
                                            <Share2 size={16} color="#7c3aed" />
                                            Bagikan
                                        </button>

                                        <button
                                            onClick={handleHistory}
                                            style={{
                                                width: "100%",
                                                padding: "0.75rem 1rem",
                                                border: "none",
                                                background: "white",
                                                textAlign: "left",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.75rem",
                                                fontSize: "0.9rem",
                                                color: "var(--text-body)",
                                                transition: "background 0.2s",
                                                borderTop: "1px solid var(--border)"
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                                        >
                                            <History size={16} color="#64748b" />
                                            Riwayat Perubahan
                                        </button>

                                        <button
                                            onClick={handleDelete}
                                            style={{
                                                width: "100%",
                                                padding: "0.75rem 1rem",
                                                border: "none",
                                                background: "white",
                                                textAlign: "left",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.75rem",
                                                fontSize: "0.9rem",
                                                color: "#dc2626",
                                                transition: "background 0.2s",
                                                borderTop: "1px solid var(--border)"
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                                        >
                                            <Trash2 size={16} color="#dc2626" />
                                            Hapus Arsip
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Preview Tabs */}
                    <div id="printable-document" className="glass-panel" style={{ padding: "0", overflow: "hidden", minHeight: "300px" }}>
                        <div className="hide-print" style={{ display: "flex", borderBottom: "1px solid var(--border)", padding: "0.5rem 1rem", background: "#f9fafb" }}>
                            <div
                                onClick={() => setActiveTab("before")}
                                style={{
                                    padding: "0.75rem 1.5rem",
                                    borderBottom: activeTab === "before" ? "2px solid #15803d" : "2px solid transparent",
                                    color: activeTab === "before" ? "#15803d" : "var(--text-muted)",
                                    fontWeight: activeTab === "before" ? "600" : "400",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                Sebelum
                            </div>
                            <div
                                onClick={() => setActiveTab("after")}
                                style={{
                                    padding: "0.75rem 1.5rem",
                                    borderBottom: activeTab === "after" ? "2px solid #15803d" : "2px solid transparent",
                                    color: activeTab === "after" ? "#15803d" : "var(--text-muted)",
                                    fontWeight: activeTab === "after" ? "600" : "400",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                Hasil Pemindaian
                            </div>
                            <div className="hide-print" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <button
                                    onClick={handlePreviousAlumni}
                                    style={{ border: "none", background: "none", cursor: "pointer", padding: "0.25rem", display: "flex", alignItems: "center" }}
                                    title="Alumni Sebelumnya"
                                >
                                    <ChevronLeft size={18} color="var(--text-muted)" />
                                </button>
                                <button
                                    onClick={handleNextAlumni}
                                    style={{ border: "none", background: "none", cursor: "pointer", padding: "0.25rem", display: "flex", alignItems: "center" }}
                                    title="Alumni Berikutnya"
                                >
                                    <ChevronRight size={18} color="var(--text-muted)" />
                                </button>
                            </div>
                        </div>

                        {/* Image Placeholder - Dynamic based on active tab */}
                        <div id="print-canvas" style={{ padding: "2rem", background: "#e5e7eb", minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                            <DocumentPreview alumni={alumni} activeTab={activeTab} />
                        </div>

                        {/* OCR Accuracy & Edit */}
                        <div className="hide-print" style={{ padding: "1rem 1.5rem", background: "#f0fdf4", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #bbf7d0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#166534", fontWeight: "600", fontSize: "0.95rem" }}>
                                <span>OCR Akurasi:</span>
                                <CheckCircle size={16} fill="#15803d" color="white" />
                                <span>87% Akurat</span>
                            </div>
                            <button
                                onClick={handleOpenOCREdit}
                                className="btn hide-print"
                                style={{ background: "white", padding: "0.4rem 1rem", border: "1px solid #bbf7d0", color: "#15803d", fontSize: "0.85rem" }}
                            >
                                <Edit size={14} /> Edit Manual
                            </button>
                        </div>
                    </div>

                    {/* OCR Text Result */}
                    <div>
                        <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-heading)", marginBottom: "0.75rem" }}>Pemindaian OCR <span style={{ fontWeight: "400", color: "var(--text-muted)" }}>(Teks yang Terbaca)</span></h4>
                        <div className="glass-panel" style={{ padding: "1.5rem", fontFamily: "monospace", fontSize: "0.9rem", color: "var(--text-body)", lineHeight: "1.6" }}>
                            <p>Nama Peserta Didik: <span style={{ background: "#fef3c7" }}>{alumni.name}</span></p>
                            <p>NIS : {alumni.nis}</p>
                            <p>Tahun Lulus : {alumni.year}</p>
                        </div>
                    </div>

                </div>

            </div>

            {/* OCR Edit Modal */}
            {showOCRModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    padding: "1rem"
                }}>
                    <div style={{
                        background: "white",
                        borderRadius: "12px",
                        maxWidth: "600px",
                        width: "100%",
                        maxHeight: "80vh",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: "1.5rem",
                            borderBottom: "1px solid var(--border)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-heading)", margin: 0 }}>Edit Hasil OCR</h3>
                            <button
                                onClick={handleCancelOCR}
                                style={{
                                    border: "none",
                                    background: "none",
                                    fontSize: "1.5rem",
                                    cursor: "pointer",
                                    color: "var(--text-muted)",
                                    padding: "0.25rem"
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: "1.5rem", flex: 1, overflow: "auto" }}>
                            <p style={{ color: "var(--text-muted)", marginBottom: "1rem", fontSize: "0.9rem" }}>
                                Perbaiki teks hasil OCR yang tidak terbaca dengan benar. Perubahan akan meningkatkan akurasi data.
                            </p>
                            <textarea
                                value={editedOCRText}
                                onChange={(e) => setEditedOCRText(e.target.value)}
                                style={{
                                    width: "100%",
                                    minHeight: "200px",
                                    padding: "1rem",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                    fontFamily: "monospace",
                                    fontSize: "0.9rem",
                                    lineHeight: "1.6",
                                    resize: "vertical"
                                }}
                                placeholder="Masukkan teks hasil OCR..."
                            />
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            padding: "1.5rem",
                            borderTop: "1px solid var(--border)",
                            display: "flex",
                            gap: "0.75rem",
                            justifyContent: "flex-end"
                        }}>
                            <button
                                onClick={handleCancelOCR}
                                className="btn"
                                style={{
                                    background: "white",
                                    border: "1px solid var(--border)",
                                    color: "var(--text-body)",
                                    padding: "0.6rem 1.5rem"
                                }}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveOCR}
                                className="btn"
                                style={{
                                    background: "#15803d",
                                    color: "white",
                                    padding: "0.6rem 1.5rem"
                                }}
                            >
                                <CheckCircle size={16} /> Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div style={{
                    position: "fixed",
                    top: "2rem",
                    right: "2rem",
                    background: toastType === "success" ? "#dcfce7" : toastType === "error" ? "#fee2e2" : "#dbeafe",
                    color: toastType === "success" ? "#166534" : toastType === "error" ? "#991b1b" : "#1e40af",
                    padding: "1rem 1.5rem",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 10000,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    minWidth: "300px",
                    animation: "slideIn 0.3s ease",
                    border: `1px solid ${toastType === "success" ? "#bbf7d0" : toastType === "error" ? "#fecaca" : "#bfdbfe"}`
                }}>
                    <CheckCircle size={20} />
                    <span style={{ fontWeight: "500" }}>{toastMessage}</span>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    padding: "1rem"
                }}>
                    <div style={{
                        background: "white",
                        borderRadius: "12px",
                        maxWidth: "500px",
                        width: "100%",
                        padding: "2rem",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
                    }}>
                        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                            <div style={{
                                width: "60px",
                                height: "60px",
                                background: "#fee2e2",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 1rem auto"
                            }}>
                                <AlertCircle size={32} color="#dc2626" />
                            </div>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: "700", color: "var(--text-heading)", marginBottom: "0.5rem" }}>
                                Hapus Arsip?
                            </h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                                Apakah Anda yakin ingin menghapus arsip <strong>{alumni?.type}</strong> milik <strong>{alumni?.name}</strong>?
                                <br /><br />
                                Tindakan ini tidak dapat dibatalkan!
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="btn"
                                style={{
                                    flex: 1,
                                    background: "white",
                                    border: "1px solid var(--border)",
                                    color: "var(--text-body)",
                                    padding: "0.75rem"
                                }}
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="btn"
                                style={{
                                    flex: 1,
                                    background: "#dc2626",
                                    color: "white",
                                    padding: "0.75rem"
                                }}
                            >
                                <Trash2 size={16} /> Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* History Modal */}
            {showHistoryModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    padding: "1rem"
                }}>
                    <div style={{
                        background: "white",
                        borderRadius: "12px",
                        maxWidth: "600px",
                        width: "100%",
                        maxHeight: "80vh",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: "1.5rem",
                            borderBottom: "1px solid var(--border)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-heading)", margin: 0 }}>
                                📜 Riwayat Perubahan
                            </h3>
                            <button
                                onClick={() => setShowHistoryModal(false)}
                                style={{
                                    border: "none",
                                    background: "none",
                                    fontSize: "1.5rem",
                                    cursor: "pointer",
                                    color: "var(--text-muted)",
                                    padding: "0.25rem"
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: "1.5rem", flex: 1, overflow: "auto" }}>
                            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                                Riwayat aktivitas untuk <strong>{alumni?.name}</strong>
                            </p>

                            {/* Timeline */}
                            <div style={{ position: "relative", paddingLeft: "2rem" }}>
                                {/* Timeline line */}
                                <div style={{
                                    position: "absolute",
                                    left: "0.5rem",
                                    top: "0.5rem",
                                    bottom: "0.5rem",
                                    width: "2px",
                                    background: "#e5e7eb"
                                }}></div>

                                {/* Timeline items */}
                                {[
                                    {
                                        time: `21 Apr ${alumni?.year} 10:25`,
                                        action: "Data Diverifikasi",
                                        desc: "Admin telah memverifikasi kesesuaian data OCR dengan dokumen fisik.",
                                        icon: "✅",
                                        color: "#15803d"
                                    },
                                    {
                                        time: `21 Apr ${alumni?.year} 10:20`,
                                        action: "Ekstraksi AI (OCR/CER)",
                                        desc: "Sistem berhasil mengekstraksi data teks dari gambar dengan akurasi 94.2%.",
                                        icon: "🔍",
                                        color: "#2563eb"
                                    },
                                    {
                                        time: `21 Apr ${alumni?.year} 10:17`,
                                        action: "Image Enhancement",
                                        desc: "Kualitas gambar ditingkatkan (denoising, contrast sharpening) untuk proses OCR.",
                                        icon: "✨",
                                        color: "#f59e0b"
                                    },
                                    {
                                        time: `21 Apr ${alumni?.year} 10:15`,
                                        action: "Dokumen Dipindai",
                                        desc: "Arsip fisik berhasil dipindai dan diunggah ke server database.",
                                        icon: "📄",
                                        color: "#7c3aed"
                                    }
                                ].map((item, index) => (
                                    <div key={index} style={{ position: "relative", marginBottom: "1.5rem" }}>
                                        <div style={{
                                            position: "absolute",
                                            left: "-1.5rem",
                                            width: "1rem",
                                            height: "1rem",
                                            background: item.color,
                                            borderRadius: "50%",
                                            border: "3px solid white",
                                            boxShadow: "0 0 0 2px " + item.color,
                                            zIndex: 1
                                        }}></div>
                                        <div style={{
                                            background: "white",
                                            padding: "1rem",
                                            borderRadius: "12px",
                                            border: "1px solid #e5e7eb",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                                            transition: "transform 0.2s ease"
                                        }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.25rem" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                    <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                                                    <strong style={{ color: "var(--text-heading)", fontWeight: "700" }}>{item.action}</strong>
                                                </div>
                                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "#f3f4f6", padding: "0.2rem 0.6rem", borderRadius: "10px" }}>{item.time}</div>
                                            </div>
                                            <div style={{ fontSize: "0.85rem", color: "#4b5563", lineHeight: "1.4" }}>
                                                {item.desc}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            padding: "1.5rem",
                            borderTop: "1px solid var(--border)",
                            display: "flex",
                            justifyContent: "flex-end"
                        }}>
                            <button
                                onClick={() => setShowHistoryModal(false)}
                                className="btn"
                                style={{
                                    background: "#15803d",
                                    color: "white",
                                    padding: "0.6rem 1.5rem"
                                }}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print-only CSS */}
            <style jsx global>{`
                @media print {
                    /* Hide everything except the printable document */
                    body * {
                        visibility: hidden;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    #printable-document,
                    #printable-document *,
                    #print-canvas,
                    #print-canvas * {
                        visibility: visible;
                    }
                    
                    #printable-document {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        max-width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                        background: white !important;
                    }
                    
                    #print-canvas {
                        padding: 0 !important;
                        margin: 0 !important;
                        background: transparent !important;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: flex-start;
                    }
                    
                    /* Remove shadows and effects for print */
                    #print-canvas > div {
                        box-shadow: none !important;
                        filter: none !important;
                        max-width: 100% !important;
                        width: 100% !important;
                        height: auto !important;
                        page-break-inside: avoid;
                    }
                    
                    /* Hide elements explicitly marked */
                    .hide-print,
                    #printable-document .hide-print {
                        display: none !important;
                    }
                    
                    /* Ensure good print quality */
                    @page {
                        size: auto;
                        margin: 0mm; /* Remove print margins to fill the page cleanly */
                    }
                }

                /* Mobile Responsiveness for Detail Page */
                .alumni-detail-grid {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 2rem;
                    width: 100%;
                }

                @media (max-width: 900px) {
                    .alumni-detail-grid {
                        grid-template-columns: 1fr;
                    }
                    .alumni-detail-header {
                        flex-direction: column !important;
                    }
                }
            `}</style>
            <style jsx>{`
                .dg-item { display: flex; flex-direction: column; gap: 0.25rem; }
                .dg-item span { font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.025em; }
                .dg-item strong { font-size: 0.95rem; color: #1e293b; font-weight: 600; }
                .dg-item.full-width { grid-column: 1 / -1; }
                
                .detail-grid-modern { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
                .detail-section { margin-bottom: 2rem; }
                
                .section-divider { display: flex; align-items: center; margin-bottom: 1.25rem; }
                .section-divider::after { content: ""; flex: 1; height: 1px; background: #e2e8f0; margin-left: 1rem; }
                .section-divider span { font-size: 0.8rem; font-weight: 800; color: #15803d; letter-spacing: 0.05em; }

                @media (max-width: 640px) {
                    .detail-grid-modern { grid-template-columns: 1fr; }
                }
            `}</style>
        </AdminLayout>
    );
}
