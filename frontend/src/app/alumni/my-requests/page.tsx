"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../components/AdminLayout";
import { ClipboardList, Plus, Clock, CheckCircle2, AlertCircle, FileText, Send, Building } from "lucide-react";
import { getAlumniPortalRequests, createAlumniDocumentRequest } from "../../../../services/api";

export default function MyRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formMsg, setFormMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [formData, setFormData] = useState({
        jenisDokumen: "Ijazah",
        tujuanPermohonan: "Melamar Kerja",
        jumlahCopy: 2,
        keterangan: ""
    });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await getAlumniPortalRequests();
            if (res.success && res.data) {
                setRequests(res.data);
            }
        } catch (err) {
            console.error("Gagal memuat permohonan alumni:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormMsg(null);
        setSubmitting(true);
        try {
            const res = await createAlumniDocumentRequest(formData);
            if (res.success) {
                setFormMsg({ type: "success", text: "Permohonan dokumen berhasil diajukan!" });
                setShowModal(false);
                setFormData({ jenisDokumen: "Ijazah", tujuanPermohonan: "Melamar Kerja", jumlahCopy: 2, keterangan: "" });
                fetchRequests();
            }
        } catch (err: any) {
            setFormMsg({ type: "error", text: err.message || "Gagal mengajukan permohonan" });
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Selesai":
                return <span style={{ background: "#dcfce7", color: "#15803d", padding: "4px 12px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: "700" }}>Selesai ✓</span>;
            case "Diproses":
                return <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 12px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: "700" }}>Diproses ⏳</span>;
            case "Ditolak":
                return <span style={{ background: "#fee2e2", color: "#b91c1c", padding: "4px 12px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: "700" }}>Ditolak ✕</span>;
            default:
                return <span style={{ background: "#fef3c7", color: "#b45309", padding: "4px 12px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: "700" }}>Menunggu Verifikasi</span>;
        }
    };

    return (
        <AdminLayout>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1rem" }}>
                {/* Top Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ background: "#d97706", color: "white", padding: "8px", borderRadius: "12px", display: "flex" }}>
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>Permohonan Legalisir & Dokumen</h2>
                            <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0 }}>Pengajuan resmi salinan legalisir ijazah dan SKL untuk alumni</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="btn"
                        style={{ background: "#15803d", color: "white", padding: "0.75rem 1.25rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "700", border: "none", cursor: "pointer" }}
                    >
                        <Plus size={18} /> Ajukan Legalisir Baru
                    </button>
                </div>

                {formMsg && (
                    <div style={{
                        padding: "1rem 1.25rem",
                        borderRadius: "12px",
                        marginBottom: "1.5rem",
                        background: formMsg.type === "success" ? "#f0fdf4" : "#fef2f2",
                        border: `1px solid ${formMsg.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                        color: formMsg.type === "success" ? "#14532d" : "#991b1b"
                    }}>
                        {formMsg.text}
                    </div>
                )}

                {/* List Permohonan */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b" }}>
                        <Clock size={32} style={{ animation: "spin 1s linear infinite", marginBottom: "0.5rem" }} />
                        <p>Memuat daftar permohonan Anda...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "4rem 2rem", textAlign: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                        <FileText size={56} color="#94a3b8" style={{ marginBottom: "1rem" }} />
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#334155", marginBottom: "0.5rem" }}>Belum Ada Pengajuan Legalisir</h3>
                        <p style={{ fontSize: "0.88rem", color: "#64748b", maxWidth: "450px", margin: "0 auto 1.5rem auto" }}>
                            Anda belum memiliki riwayat pengajuan legalisir. Klik tombol di atas untuk membuat permohonan baru.
                        </p>
                        <button onClick={() => setShowModal(true)} className="btn" style={{ background: "#15803d", color: "white" }}>Ajukan Sekarang</button>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {requests.map((req) => (
                            <div key={req.id} style={{
                                background: "white",
                                borderRadius: "16px",
                                border: "1px solid #e2e8f0",
                                padding: "1.25rem 1.5rem",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "1rem"
                            }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
                                        <h4 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>
                                            Legalisir Dokumen {req.jenisDokumen}
                                        </h4>
                                        {getStatusBadge(req.statusPermohonan)}
                                    </div>
                                    <p style={{ fontSize: "0.85rem", color: "#475569", margin: "0 0 0.25rem 0" }}>
                                        Keperluan: <strong>{req.tujuanPermohonan}</strong> ({req.jumlahCopy} Salinan)
                                    </p>
                                    {req.keterangan && (
                                        <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0, fontStyle: "italic" }}>
                                            &quot;{req.keterangan}&quot;
                                        </p>
                                    )}
                                </div>

                                <div style={{ textAlign: "right" }}>
                                    <span style={{ fontSize: "0.78rem", color: "#94a3b8", display: "block" }}>Tanggal Pengajuan:</span>
                                    <strong style={{ fontSize: "0.85rem", color: "#334155" }}>
                                        {new Date(req.tanggalPengajuan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                    </strong>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal Form Pengajuan */}
                {showModal && (
                    <div style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.6)",
                        zIndex: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1rem"
                    }} onClick={() => setShowModal(false)}>
                        <div style={{
                            background: "white",
                            borderRadius: "20px",
                            maxWidth: "550px",
                            width: "100%",
                            padding: "1.75rem"
                        }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                                <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#1e293b", fontWeight: "800" }}>Form Permohonan Legalisir</h3>
                                <button onClick={() => setShowModal(false)} style={{ border: "none", background: "none", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#334155", marginBottom: "0.35rem" }}>Jenis Dokumen</label>
                                    <select 
                                        value={formData.jenisDokumen} 
                                        onChange={(e) => setFormData({ ...formData, jenisDokumen: e.target.value })}
                                        style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #cbd5e1" }}
                                    >
                                        <option value="Ijazah">Ijazah</option>
                                        <option value="SKHUN / SKL">SKHUN / Surat Keterangan Lulus (SKL)</option>
                                        <option value="Transkrip Nilai">Transkrip Nilai</option>
                                        <option value="Rapor">Rekapitulasi Rapor</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#334155", marginBottom: "0.35rem" }}>Tujuan & Keperluan Permohonan</label>
                                    <input 
                                        type="text" 
                                        placeholder="Contoh: Melamar Pekerjaan / Lanjut Kuliah di PTN" 
                                        value={formData.tujuanPermohonan}
                                        onChange={(e) => setFormData({ ...formData, tujuanPermohonan: e.target.value })}
                                        required
                                        style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #cbd5e1" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#334155", marginBottom: "0.35rem" }}>Jumlah Salinan Legalisir (Copy)</label>
                                    <input 
                                        type="number" 
                                        min={1} 
                                        max={10} 
                                        value={formData.jumlahCopy}
                                        onChange={(e) => setFormData({ ...formData, jumlahCopy: parseInt(e.target.value) || 1 })}
                                        required
                                        style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #cbd5e1" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#334155", marginBottom: "0.35rem" }}>Catatan Tambahan (Opsional)</label>
                                    <textarea 
                                        rows={3} 
                                        placeholder="Catatan untuk petugas administrasi..."
                                        value={formData.keterangan}
                                        onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                                        style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #cbd5e1" }}
                                    />
                                </div>

                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                                    <button type="button" onClick={() => setShowModal(false)} className="btn" style={{ background: "#e2e8f0", color: "#334155" }}>Batal</button>
                                    <button type="submit" disabled={submitting} className="btn" style={{ background: "#15803d", color: "white", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <Send size={16} /> {submitting ? "Mengirim..." : "Kirim Permohonan"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
