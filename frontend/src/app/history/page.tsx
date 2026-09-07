"use client";

import AdminLayout from "../../../components/AdminLayout";
import { Search, Trash2, FolderOpen, ChevronRight, ChevronLeft, FileText, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function HistoryPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterType, setFilterType] = useState("Semua Arsip");
    const [showUploadHistoryModal, setShowUploadHistoryModal] = useState(false);
    const itemsPerPage = 3;

    // Mock audit log data
    const auditLogs = [
        { id: 1, user: "Admin TU", action: "Upload & OCR", target: "Ijazah_Ahmad_Faisal.pdf", status: "Sukses", statusColor: "#10b981", time: "21 April 2024, 10:15", ip: "192.168.1.12" },
        { id: 2, user: "Admin TU", action: "Koreksi Data", target: "Buku_Induk_2023_Hal12", status: "Update", statusColor: "#3b82f6", time: "21 April 2024, 11:20", ip: "192.168.1.12" },
        { id: 3, user: "Petugas 02", action: "Pencarian Fuzzy", target: "Citra Kirana", status: "Cari", statusColor: "#f59e0b", time: "21 April 2024, 14:32", ip: "192.168.1.45" },
        { id: 4, user: "Admin TU", action: "Hapus Arsip", target: "Temp_Scan_001.jpg", status: "Hapus", statusColor: "#ef4444", time: "20 April 2024, 09:05", ip: "192.168.1.12" },
        { id: 5, user: "Petugas 01", action: "Ekspor Data", target: "Rekap_Lulusan_2024.xlsx", status: "Ekspor", statusColor: "#8b5cf6", time: "19 April 2024, 16:45", ip: "192.168.1.22" },
        { id: 6, user: "Admin TU", action: "Login Sistem", target: "-", status: "Auth", statusColor: "#6366f1", time: "19 April 2024, 08:00", ip: "192.168.1.12" },
    ];

    const totalPages = Math.ceil(auditLogs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = auditLogs.slice(startIndex, startIndex + itemsPerPage);

    return (
        <AdminLayout>
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

                {/* Header */}
                <header style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem", color: "var(--text-heading)", fontWeight: "700", marginBottom: "0.5rem" }}>Audit Log Keamanan</h1>
                    <p style={{ color: "var(--text-muted)", paddingBottom: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>Pemantauan riwayat aktivitas pengguna dan perubahan data dalam sistem secara real-time.</p>
                </header>

                <div className="history-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>

                    {/* Left Column: Search History Table */}
                    <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                        <div style={{ padding: "1rem 1.5rem", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#1e293b", fontWeight: "700", fontSize: "1.1rem" }}>
                            Log Aktivitas Sistem
                        </div>

                        {/* Filter & Search Bar */}
                        <div style={{ padding: "1.5rem", display: "flex", gap: "1rem", borderBottom: "1px solid #f3f4f6" }}>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#f9fafb", outline: "none", fontSize: "0.9rem", minWidth: "150px" }}
                            >
                                <option>Semua Arsip</option>
                                <option>Transkrip Nilai</option>
                                <option>Ijazah</option>
                                <option>SKL (Surat Keterangan Lulus)</option>
                            </select>

                            <div style={{ flex: 1, position: "relative" }}>
                                <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                                <input
                                    type="text"
                                    placeholder="Masukkan nama / NISN..."
                                    style={{ width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem", borderRadius: "8px", border: "1px solid #e5e7eb", outline: "none", fontSize: "0.9rem" }}
                                />
                            </div>

                            <button className="btn" style={{ background: "#15803d", color: "white", padding: "0.6rem 1.5rem", fontSize: "0.9rem", whiteSpace: "nowrap" }}>
                                Cari
                            </button>
                        </div>

                        {/* Clear History Button */}
                        <div style={{ padding: "0.75rem 1.5rem", display: "flex", justifyContent: "flex-end", borderBottom: "1px solid #f3f4f6" }}>
                            <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ef4444", fontSize: "0.85rem", fontWeight: "600", background: "none", border: "none", cursor: "pointer" }}>
                                <Trash2 size={16} /> Bersihkan Riwayat
                            </button>
                        </div>

                        {/* Table Header */}
                        <div className="history-table-header" style={{ display: "flex", alignItems: "center", padding: "1rem 1.5rem", background: "#f9fafb", borderBottom: "1px solid #e5e7eb", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600" }}>
                            <div style={{ flex: 1 }}>Pengguna</div>
                            <div style={{ flex: 1.2 }}>Aksi / Kegiatan</div>
                            <div style={{ flex: 1.5 }}>Target Objek</div>
                            <div style={{ flex: 0.8 }}>Status</div>
                            <div style={{ flex: 1.2 }}>Waktu</div>
                            <div style={{ flex: 1 }}>IP Address</div>
                        </div>

                        {/* Table Data */}
                        <div>
                            {currentData.map((item) => (
                                <div key={item.id} className="history-table-row" style={{ display: "flex", alignItems: "center", padding: "1.2rem 1.5rem", borderBottom: "1px solid #f3f4f6", fontSize: "0.9rem" }}>
                                    <div style={{ flex: 1 }} data-label="Pengguna">
                                        <div style={{ fontWeight: "700", color: "#1e293b" }}>{item.user}</div>
                                    </div>
                                    <div style={{ flex: 1.2 }} data-label="Aksi">
                                        <span style={{ color: "#475569" }}>{item.action}</span>
                                    </div>
                                    <div style={{ flex: 1.5, color: "#64748b", fontSize: "0.85rem", wordBreak: "break-all" }} data-label="Target">
                                        {item.target}
                                    </div>
                                    <div style={{ flex: 0.8 }} data-label="Status">
                                        <span style={{
                                            padding: "0.25rem 0.6rem",
                                            borderRadius: "6px",
                                            background: `${item.statusColor}15`,
                                            color: item.statusColor,
                                            fontSize: "0.75rem",
                                            fontWeight: "700",
                                            border: `1px solid ${item.statusColor}30`
                                        }}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div style={{ flex: 1.2, color: "#94a3b8", fontSize: "0.8rem" }} data-label="Waktu">{item.time}</div>
                                    <div style={{ flex: 1, color: "#94a3b8", fontFamily: "monospace", fontSize: "0.8rem" }} data-label="IP Address">{item.ip}</div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f3f4f6" }}>
                            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                                {startIndex + 1} - {Math.min(startIndex + itemsPerPage, auditLogs.length)} dari {auditLogs.length} data
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    style={{ padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #e5e7eb", background: "white", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1 }}
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <div style={{ padding: "0.5rem 1rem", borderRadius: "6px", background: "#15803d", color: "white", fontWeight: "600" }}>
                                    {currentPage}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    style={{ padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #e5e7eb", background: "white", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1 }}
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                                {currentPage} dari {totalPages} data
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Upload History Preview */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", overflow: "hidden", height: "100%" }}>
                            <div style={{ padding: "1rem 1.5rem", background: "#f0fdf4", borderBottom: "1px solid #dcfce7", color: "#166534", fontWeight: "700", fontSize: "1.1rem" }}>
                                Histori Unggahan
                            </div>
                            <div style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100% - 60px)", textAlign: "center" }}>

                                {/* Illustration */}
                                <div style={{ position: "relative", width: "150px", height: "120px", marginBottom: "1.5rem" }}>
                                    <FolderOpen size={100} color="#dcfce7" fill="#f0fdf4" style={{ position: "absolute", top: "0", left: "25px" }} />
                                    <div style={{ position: "absolute", bottom: "10px", right: "30px", background: "#15803d", borderRadius: "50%", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#15803d" }}></div>
                                        </div>
                                    </div>
                                </div>

                                <p style={{ fontSize: "0.95rem", color: "var(--text-body)", lineHeight: "1.5", marginBottom: "1.5rem", maxWidth: "80%" }}>
                                    Pantau proses pengunggahan arsip Anda di sini.
                                </p>

                                <div onClick={() => setShowUploadHistoryModal(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "#15803d", fontWeight: "600", cursor: "pointer", width: "100%", padding: "1rem", borderTop: "1px solid #f3f4f6" }} className="hover:bg-gray-50">
                                    <ChevronRight size={18} /> Lihat Riwayat
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <footer style={{ textAlign: "center", paddingTop: "3rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    © 2026 <strong>SAADA (Sistem Arsip Alumni ASSA'ADAH)</strong> | Prototipe Penelitian Skripsi MTS
                </footer>

            </div>

            <style jsx global>{`
                @media (max-width: 768px) {
                    .history-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>

            {/* Upload History Modal */}
            {showUploadHistoryModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 3000, padding: "1rem", animation: "fadeIn 0.3s ease"
                }}>
                    <div style={{ background: "white", borderRadius: "16px", maxWidth: "480px", width: "100%", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
                        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f0fdf4" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><FolderOpen size={20} color="#15803d" /><h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#166534", margin: 0 }}>Histori Unggahan Terbaru</h3></div>
                            <button onClick={() => setShowUploadHistoryModal(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "#9ca3af" }}><XCircle size={24} /></button>
                        </div>
                        <div style={{ padding: "1.5rem", maxHeight: "400px", overflowY: "auto" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#f9fafb" }}>
                                    <FileText color="#3b82f6" size={24} style={{ marginTop: "4px" }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: "600", fontSize: "0.95rem", color: "var(--text-heading)", marginBottom: "0.2rem" }}>Ijazah_Ahmad_Faisal.pdf</div>
                                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Ukuran: 1.2 MB • Hari ini, 10:15</div>
                                        <div style={{ display: "inline-flex", padding: "0.2rem 0.6rem", borderRadius: "12px", background: "#dcfce7", color: "#166534", fontSize: "0.75rem", fontWeight: "600", marginTop: "0.5rem", alignItems: "center", gap: "0.3rem", width: "max-content" }}>
                                            <CheckCircle size={12} /> Selesai Diunggah
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#f9fafb" }}>
                                    <FileText color="#3b82f6" size={24} style={{ marginTop: "4px" }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: "600", fontSize: "0.95rem", color: "var(--text-heading)", marginBottom: "0.2rem" }}>Buku_Induk_2023_Hal12.jpg</div>
                                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Ukuran: 3.4 MB • Hari ini, 11:20</div>
                                        <div style={{ display: "inline-flex", padding: "0.2rem 0.6rem", borderRadius: "12px", background: "#dcfce7", color: "#166534", fontSize: "0.75rem", fontWeight: "600", marginTop: "0.5rem", alignItems: "center", gap: "0.3rem", width: "max-content" }}>
                                            <CheckCircle size={12} /> Selesai Diunggah
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#f9fafb" }}>
                                    <FileText color="#3b82f6" size={24} style={{ marginTop: "4px" }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: "600", fontSize: "0.95rem", color: "var(--text-heading)", marginBottom: "0.2rem" }}>Citra_Kirana_KTP.png</div>
                                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Ukuran: 800 KB • Kemarin, 14:32</div>
                                        <div style={{ display: "inline-flex", padding: "0.2rem 0.6rem", borderRadius: "12px", background: "#fee2e2", color: "#991b1b", fontSize: "0.75rem", fontWeight: "600", marginTop: "0.5rem", alignItems: "center", gap: "0.3rem", width: "max-content" }}>
                                            <XCircle size={12} /> Gagal (Format Tidak Sesuai)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
