"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../components/AdminLayout";
import { GraduationCap, FileText, Download, Eye, CheckCircle, Clock, Search, ExternalLink, ShieldCheck } from "lucide-react";
import { getAlumniPortalDocuments } from "../../../../services/api";

export default function MyDocumentsPage() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const res = await getAlumniPortalDocuments();
            if (res.success && res.data) {
                setDocuments(res.data);
            }
        } catch (err) {
            console.error("Gagal memuat dokumen alumni:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1rem" }}>
                {/* Header */}
                <div style={{ marginBottom: "2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                        <div style={{ background: "#15803d", color: "white", padding: "8px", borderRadius: "12px", display: "flex" }}>
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>Dokumen Digital Saya</h2>
                            <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0 }}>Arsip ijazah, SKL, transkrip nilai, dan rekapitulasi nilai resmi sekolah</p>
                        </div>
                    </div>
                </div>

                {/* Banner Status */}
                <div style={{
                    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                    border: "1px solid #bbf7d0",
                    borderRadius: "16px",
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "2rem"
                }}>
                    <ShieldCheck size={28} color="#15803d" />
                    <div>
                        <strong style={{ color: "#14532d", fontSize: "0.95rem", display: "block" }}>Verifikasi Digital Sekolah Active</strong>
                        <span style={{ color: "#166534", fontSize: "0.82rem" }}>
                            Semua dokumen di bawah ini telah dipindai dan divalidasi oleh Tim Arsip MTs Assa&apos;adah.
                        </span>
                    </div>
                </div>

                {/* Documents Grid */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b" }}>
                        <Clock size={32} style={{ animation: "spin 1s linear infinite", marginBottom: "0.5rem" }} />
                        <p>Memuat berkas digital Anda...</p>
                    </div>
                ) : documents.length === 0 ? (
                    <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "4rem 2rem", textAlign: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                        <GraduationCap size={56} color="#94a3b8" style={{ marginBottom: "1rem" }} />
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#334155", marginBottom: "0.5rem" }}>Belum Ada Dokumen Digital</h3>
                        <p style={{ fontSize: "0.88rem", color: "#64748b", maxWidth: "450px", margin: "0 auto 1.5rem auto" }}>
                            Berkas fisik Anda belum selesai dipindai oleh Petugas Admin. Silakan hubungi Tata Usaha sekolah jika membutuhkan digitalisasi mendesak.
                        </p>
                    </div>
                ) : (
                    <div className="responsive-grid-4">
                        {documents.map((doc) => (
                            <div key={doc.id} style={{
                                background: "white",
                                borderRadius: "16px",
                                border: "1px solid #e2e8f0",
                                padding: "1.25rem",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                gap: "1rem"
                            }}>
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                                        <div style={{ background: "#f0fdf4", padding: "10px", borderRadius: "12px", color: "#15803d" }}>
                                            <FileText size={24} />
                                        </div>
                                        <span style={{
                                            background: doc.statusArsip === "Lengkap" ? "#dcfce7" : "#fef3c7",
                                            color: doc.statusArsip === "Lengkap" ? "#15803d" : "#b45309",
                                            fontSize: "0.72rem",
                                            fontWeight: "700",
                                            padding: "3px 10px",
                                            borderRadius: "20px"
                                        }}>
                                            {doc.statusArsip || "Tersedia"}
                                        </span>
                                    </div>
                                    <h4 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.25rem" }}>
                                        Dokumen {doc.jenisArsip}
                                    </h4>
                                    <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>
                                        Diunggah: {new Date(doc.uploadedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                    </p>
                                    {doc.ocrConfidence && (
                                        <span style={{ fontSize: "0.72rem", color: "#0284c7", fontWeight: "600", marginTop: "4px", display: "inline-block" }}>
                                            Akurasi OCR: {Math.round(doc.ocrConfidence * 100)}%
                                        </span>
                                    )}
                                </div>

                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button 
                                        onClick={() => setSelectedDoc(doc)}
                                        className="btn" 
                                        style={{ flex: 1, background: "#15803d", color: "white", padding: "0.6rem", fontSize: "0.82rem", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
                                    >
                                        <Eye size={16} /> Pratinjau
                                    </button>
                                    {doc.filePath && (
                                        <a 
                                            href={`http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5084/${doc.filePath}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="btn"
                                            style={{ background: "#f1f5f9", color: "#334155", padding: "0.6rem", fontSize: "0.82rem", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                        >
                                            <Download size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal Preview Dokumen */}
                {selectedDoc && (
                    <div style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.6)",
                        zIndex: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1rem"
                    }} onClick={() => setSelectedDoc(null)}>
                        <div style={{
                            background: "white",
                            borderRadius: "20px",
                            maxWidth: "700px",
                            width: "100%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            padding: "1.5rem"
                        }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#1e293b" }}>Preview Dokumen {selectedDoc.jenisArsip}</h3>
                                <button onClick={() => setSelectedDoc(null)} style={{ border: "none", background: "none", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
                            </div>
                            <div style={{ textAlign: "center", background: "#f8fafc", borderRadius: "12px", padding: "1rem", marginBottom: "1rem" }}>
                                <img 
                                    src={`http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5084/${selectedDoc.filePath}`} 
                                    alt={`Dokumen ${selectedDoc.jenisArsip}`} 
                                    style={{ maxWidth: "100%", maxHeight: "60vh", objectFit: "contain", borderRadius: "8px" }}
                                    onError={(e: any) => { e.target.src = "/logo-assaadah.jpg"; }}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                                <button onClick={() => setSelectedDoc(null)} className="btn" style={{ background: "#e2e8f0", color: "#334155" }}>Tutup</button>
                                <a 
                                    href={`http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5084/${selectedDoc.filePath}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="btn"
                                    style={{ background: "#15803d", color: "white", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}
                                >
                                    <Download size={16} /> Unduh Berkas Original
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
