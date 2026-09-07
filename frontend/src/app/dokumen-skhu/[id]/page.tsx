"use client";

import { useState, useRef, useEffect } from "react";
import AdminLayout from "../../../../components/AdminLayout";
import { ArrowLeft, Download, MoreVertical, Edit, CheckCircle, ChevronLeft, ChevronRight, User, AlertCircle, Trash2, Share2, Printer, History } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DocumentPreview from "../../../components/DocumentPreview";
import DokumenDetail from "../../../components/DokumenDetail";

export default function DetailSkhuPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);
    const focusedType = "SKL";

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
                        const targetArsip = db.arsipDokumen?.find((a: any) => a.jenisDokumen === "SKHU" || a.jenisDokumen === "SKL" || a.jenisDokumen === "SKL (Surat Keterangan Lulus)") || db.arsipDokumen?.[0];

                        // Map C# backend DTO format to Frontend format for the UI
                        const alumniData = {
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
                            type: "SKL",
                            nomorIjazah: db.nomorIjazah || "-",
                            nomorSkl: db.nomorSkl || "-",
                            // Meta for UI
                            status: db.statusArsip || "Lengkap",
                            statusColor: db.statusArsip === 'Lengkap' ? "#15803d" : "#92400e",
                            statusBg: db.statusArsip === 'Lengkap' ? "#dcfce7" : "#fef3c7",
                            detailIjazah: null,
                            detailSkl: null
                        };
                        setAlumni(alumniData);

                        // Also fetch academic detail data (nilai ujian)
                        Promise.allSettled([
                            api.getDetailIjazahByAlumni(db.id),
                            api.getDetailSklByAlumni(db.id)
                        ]).then(([ijazahResult, sklResult]) => {
                            setAlumni((prev: any) => ({
                                ...prev,
                                detailIjazah: ijazahResult.status === "fulfilled" ? ijazahResult.value : null,
                                detailSkl: sklResult.status === "fulfilled" ? sklResult.value : null,
                            }));
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
        alert(`📄 Mengunduh PDF untuk SKL - ${alumni?.name}\n\nDalam implementasi penuh, ini akan:\n1. Generate PDF dengan jsPDF atau react-pdf\n2. Include data alumni lengkap\n3. Include gambar dokumen\n4. Auto-download ke komputer`);
    };

    // Handler for dropdown actions
    const handleEdit = () => {
        setShowDropdown(false);
        setEditFormData({ ...alumni });
        setIsEditingData(true);
        showToastNotification("📝 Mode Edit diaktifkan", "info");
    };

    const handleSaveData = async () => {
        try {
            showToastNotification("⏳ Menyimpan perubahan...", "info");
            const api = await import("../../../../services/api");
            const payload = {
                namaLengkap: editFormData.name ?? alumni.name,
                nis: editFormData.nis ?? alumni.nis,
                nisn: editFormData.nisn ?? alumni.nisn,
                tempatLahir: editFormData.tempatLahir ?? alumni.tempatLahir,
                tanggalLahir: editFormData.tanggalLahir ?? alumni.tanggalLahir,
                asalSekolah: editFormData.namaMadrasah ?? alumni.asalSekolah,
                kelasMasuk: editFormData.class ?? alumni.kelasMasuk,
                tahunMasuk: editFormData.tahunMasuk ?? alumni.tahunMasuk,
                tahunLulus: editFormData.year ?? alumni.tahunLulus,
                nomorIjazah: editFormData.nomorIjazah ?? alumni.nomorIjazah,
                nomorSkhun: editFormData.nomorSkl ?? alumni.nomorSkhun,
                statusArsip: editFormData.status ?? alumni.statusArsip,
                statusSiswa: alumni.statusSiswa ?? "Lulus",
                jenisKelamin: alumni.jenisKelamin ?? "L",
                agama: alumni.agama ?? "Islam",
                kewarganegaraan: alumni.kewarganegaraan ?? "WNI",
            };
            await api.updateAlumni(id, payload);
            setAlumni({ ...alumni, ...editFormData });
            setIsEditingData(false);
            showToastNotification("✅ Data berhasil diperbarui!", "success");
        } catch (err) {
            console.error("Failed to update alumni:", err);
            showToastNotification("❌ Gagal menyimpan perubahan. Coba lagi.", "error");
        }
    };

    const handleCancelEdit = () => {
        setIsEditingData(false);
    };

    const handleDelete = () => {
        setShowDropdown(false);
        setShowDeleteModal(true);
    };

    const [isDeletingAlumni, setIsDeletingAlumni] = useState(false);

    const confirmDelete = async () => {
        setIsDeletingAlumni(true);
        try {
            const api = await import("../../../../services/api");
            await api.deleteAlumni(id);
            setShowDeleteModal(false);
            showToastNotification("✅ Arsip berhasil dihapus!", "success");
            setTimeout(() => router.push("/dokumen-skhu"), 1200);
        } catch (err) {
            console.error("Failed to delete alumni:", err);
            showToastNotification("❌ Gagal menghapus arsip. Coba lagi.", "error");
            setIsDeletingAlumni(false);
            setShowDeleteModal(false);
        }
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
        const shareUrl = `${window.location.origin}/dokumen-skhu/${id}`;
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

    const handlePreviousAlumni = () => {
        alert("📍 Silakan kembali ke daftar untuk memilih data lain.");
    };

    const handleNextAlumni = () => {
        alert("📍 Silakan kembali ke daftar untuk memilih data lain.");
    };

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
                    <Link href="/dokumen-skhu">
                        <button className="btn" style={{ marginTop: "1.5rem", background: "#15803d", color: "white" }}>Kembali ke Daftar</button>
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* Header Section */}
            <div className="alumni-detail-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                    <h1 style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--text-heading)", marginBottom: "0.25rem" }}>Detail Arsip SKL</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                        <Link href="/dokumen-skhu" style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}>Dokumen SKL</Link>
                        <span>/</span>
                        <span style={{ color: "var(--text-heading)", fontWeight: "500" }}>{alumni.name}</span>
                    </div>
                </div>
                
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", position: "relative" }}>
                    <button
                        onClick={handleDownloadPDF}
                        className="btn"
                        style={{ background: "#15803d", color: "white", padding: "0.5rem 1rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
                    >
                        <Download size={16} /> Unduh PDF
                    </button>

                    {/* Dropdown Container */}
                    <div style={{ position: "relative" }} ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="btn"
                            style={{ background: "white", border: "1px solid var(--border)", color: "var(--text-body)", padding: "0.5rem 1rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
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
                                    <Share2 size={16} color="#0891b2" />
                                    Bagikan Link
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

                    <Link href="/dokumen-skhu">
                        <button className="btn" style={{ background: "white", border: "1px solid var(--border)", color: "var(--text-body)" }}>
                            <ChevronLeft size={18} /> Kembali
                        </button>
                    </Link>
                </div>
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
                            <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #dcfce7" }}>
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

                    {/* Informasi SKL Card */}
                    <div className="glass-panel" style={{ padding: "1.5rem" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-heading)", marginBottom: "1.5rem" }}>
                            Informasi SKL (Surat Keterangan Lulus)
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", alignItems: "start" }}>
                                <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Jenis Arsip</div>
                                <div style={{ fontWeight: "600", color: "#92400e", background: "#fffbeb", padding: "0.25rem 0.75rem", borderRadius: "6px", width: "fit-content" }}>
                                    📋 SKL (Surat Keterangan Lulus)
                                </div>
                            </div>

                            {alumni.nomorSkl && alumni.nomorSkl !== "-" && (
                                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
                                    <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Nomor SKL</div>
                                    <div style={{ fontWeight: "600", color: "var(--text-heading)" }}>{alumni.nomorSkl}</div>
                                </div>
                            )}

                            {alumni.detailSkl?.nomorPeserta && (
                                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
                                    <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Nomor Peserta</div>
                                    <div style={{ fontWeight: "500", color: "var(--text-heading)" }}>{alumni.detailSkl.nomorPeserta}</div>
                                </div>
                            )}

                            {alumni.detailSkl?.rataRataNilai && (
                                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
                                    <div style={{ color: "var(--text-muted)", minWidth: "120px" }}>Nilai Rata-rata</div>
                                    <div style={{ fontWeight: "600", color: "#92400e", fontSize: "1.1rem" }}>{alumni.detailSkl.rataRataNilai.toFixed(2)}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Data Lengkap per Jenis Dokumen */}
                    <DokumenDetail alumni={alumni} />

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
                                            <Share2 size={16} color="#0891b2" />
                                            Bagikan Link
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
                                    title="Sebelumnya"
                                >
                                    <ChevronLeft size={18} color="var(--text-muted)" />
                                </button>
                                <button
                                    onClick={handleNextAlumni}
                                    style={{ border: "none", background: "none", cursor: "pointer", padding: "0.25rem", display: "flex", alignItems: "center" }}
                                    title="Berikutnya"
                                >
                                    <ChevronRight size={18} color="var(--text-muted)" />
                                </button>
                            </div>
                        </div>

                        {/* Image Canvas */}
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
                            <textarea
                                value={editedOCRText}
                                onChange={e => setEditedOCRText(e.target.value)}
                                style={{
                                    width: "100%",
                                    height: "150px",
                                    padding: "0.75rem",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                    fontFamily: "monospace",
                                    fontSize: "0.9rem",
                                    outline: "none",
                                    resize: "none"
                                }}
                            />
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            padding: "1rem 1.5rem",
                            borderTop: "1px solid var(--border)",
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "0.75rem"
                        }}>
                            <button
                                onClick={handleCancelOCR}
                                style={{
                                    background: "white",
                                    border: "1px solid var(--border)",
                                    color: "var(--text-body)",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "0.9rem"
                                }}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveOCR}
                                style={{
                                    background: "#15803d",
                                    border: "none",
                                    color: "white",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "0.9rem"
                                }}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
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
                        borderRadius: "16px",
                        maxWidth: "400px",
                        width: "100%",
                        overflow: "hidden",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
                    }}>
                        <div style={{ height: "4px", background: "#dc2626" }} />
                        <div style={{ padding: "2rem" }}>
                            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                                <div style={{ width: "56px", height: "56px", background: "#fee2e2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto" }}>
                                    <AlertCircle size={28} color="#dc2626" />
                                </div>
                                <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>Hapus Arsip SKL?</h3>
                                <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.5 }}>Apakah Anda yakin ingin menghapus arsip data siswa ini? Tindakan ini tidak dapat dibatalkan.</p>
                            </div>
                            <div style={{ display: "flex", gap: "0.75rem" }}>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeletingAlumni}
                                    style={{
                                        flex: 1,
                                        padding: "0.6rem",
                                        background: "white",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        color: "#374151",
                                        fontWeight: "600",
                                        cursor: "pointer"
                                    }}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeletingAlumni}
                                    style={{
                                        flex: 1,
                                        padding: "0.6rem",
                                        background: "#dc2626",
                                        border: "none",
                                        borderRadius: "8px",
                                        color: "white",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    {isDeletingAlumni ? "Menghapus..." : "Ya, Hapus"}
                                </button>
                            </div>
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
                        borderRadius: "16px",
                        maxWidth: "500px",
                        width: "100%",
                        maxHeight: "85vh",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
                    }}>
                        <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-heading)", margin: 0 }}>Riwayat Perubahan Arsip</h3>
                            <button onClick={() => setShowHistoryModal(false)} style={{ border: "none", background: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}>×</button>
                        </div>
                        <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "relative" }}>
                                {/* Timeline line */}
                                <div style={{ position: "absolute", left: "15px", top: "10px", bottom: "10px", width: "2px", background: "#e2e8f0" }} />
                                
                                <div style={{ display: "flex", gap: "1rem", position: "relative" }}>
                                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, border: "2px solid white" }}>
                                        <CheckCircle size={16} color="#15803d" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: "700", color: "var(--text-heading)", fontSize: "0.95rem" }}>Arsip Terverifikasi (OCR)</div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>21 April 2026, 10:18 WIB • Oleh: Admin MTS</div>
                                        <div style={{ fontSize: "0.85rem", color: "var(--text-body)", marginTop: "6px" }}>Teks berhasil dicocokkan dengan database sekolah dengan skor kepercayaan 87.2%.</div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "1rem", position: "relative" }}>
                                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, border: "2px solid white" }}>
                                        <History size={16} color="#2563eb" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: "700", color: "var(--text-heading)", fontSize: "0.95rem" }}>Unggah Dokumen Sukses</div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>21 April 2026, 10:15 WIB • Oleh: Operator MTS</div>
                                        <div style={{ fontSize: "0.85rem", color: "var(--text-body)", marginTop: "6px" }}>File SKL fisik berhasil diunggah dengan format PNG (2.1 MB).</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div style={{
                    position: "fixed",
                    bottom: "2rem",
                    right: "2rem",
                    background: toastType === "success" ? "#92400e" : toastType === "error" ? "#dc2626" : "#2563eb",
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    zIndex: 10000,
                    fontWeight: "600",
                    animation: "slideIn 0.2s ease"
                }}>
                    {toastMessage}
                </div>
            )}

            {/* Toast CSS */}
            <style jsx global>{`
                @keyframes slideIn {
                    from { transform: translateY(1rem); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
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
                .section-divider span { font-size: 0.8rem; font-weight: 800; color: #92400e; letter-spacing: 0.05em; }

                @media (max-width: 640px) {
                    .detail-grid-modern { grid-template-columns: 1fr; }
                }
            `}</style>
        </AdminLayout>
    );
}
