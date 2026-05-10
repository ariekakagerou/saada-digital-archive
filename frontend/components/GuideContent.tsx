"use client";

import Link from "next/link";
import { User, Upload, Camera, FileText, Search, Mail, MessageCircle, ArrowRight, XCircle, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function GuideContent() {
    const [showContactModal, setShowContactModal] = useState(false);
    const [showFAQModal, setShowFAQModal] = useState(false);

    return (
        <>
            {/* Hero Section */}
            <section style={{
                background: "linear-gradient(180deg, #dcfce7 0%, var(--bg-main) 100%)",
                padding: "3rem 5%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                borderRadius: "0 0 40px 40px" // Rounded bottom for modern look
            }}>
                {/* Decorative Blob */}
                <div style={{ position: "absolute", right: "-5%", top: "-20%", width: "40%", height: "120%", background: "#bbf7d0", borderRadius: "50%", filter: "blur(60px)", zIndex: 0, opacity: 0.5 }}></div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", maxWidth: "1200px", zIndex: 1, alignItems: "center", width: "100%" }}>
                    <div>
                        <h2 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#064e3b", marginBottom: "1rem" }}>
                            Panduan Sistem
                        </h2>
                        <p style={{ fontSize: "1.1rem", color: "var(--text-body)", lineHeight: "1.6" }}>
                            Cara menggunakan sistem SAADA (Sistem Arsip Alumni ASSA'ADAH) untuk digitalisasi dan pencarian arsip alumni madrasah secara efisien.
                        </p>
                    </div>
                    {/* Reusing the CSS Composition Laptop */}
                    <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                        <div style={{ width: "100%", maxWidth: "400px", aspectRatio: "16/10", background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", border: "6px solid white" }}>
                            <div style={{ width: "90%", height: "85%", background: "white", borderRadius: "8px", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.5rem", padding: "0.75rem" }}>
                                <div style={{ background: "#f0fdf4", borderRadius: "4px" }}></div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    <div style={{ height: "15px", width: "100%", background: "#dcfce7", borderRadius: "4px" }}></div>
                                    <div style={{ height: "60px", width: "100%", background: "#f3f4f6", borderRadius: "4px" }}></div>
                                </div>
                            </div>
                            <div style={{ position: "absolute", bottom: "-20px", right: "-20px", padding: "1rem", background: "#047857", borderRadius: "12px", color: "white", boxShadow: "0 10px 20px rgba(4, 120, 87, 0.3)" }}>
                                <div style={{ fontWeight: "bold", fontSize: "0.8rem" }}>GUIDE</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <main style={{ padding: "2rem 5%", maxWidth: "1200px", margin: "0 auto", width: "100%", flex: 1 }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>

                    {/* Left Column: Steps Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>

                        {/* Step 1 */}
                        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{ width: "32px", height: "32px", background: "#047857", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>1</div>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-heading)" }}>Login Sebagai Petugas</h3>
                            </div>
                            <div style={{ height: "100px", background: "#f0fdf4", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <User size={40} color="#166534" opacity={0.5} />
                            </div>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.5" }}>Masuk menggunakan username dan password petugas yang telah terdaftar untuk mengakses dashboard.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{ width: "32px", height: "32px", background: "#047857", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>2</div>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-heading)" }}>Unggah / Scan Arsip</h3>
                            </div>
                            <div style={{ height: "100px", background: "#f0fdf4", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ display: "flex", gap: "1rem" }}>
                                    <Upload size={32} color="#166534" opacity={0.5} />
                                    <Camera size={32} color="#166534" opacity={0.5} />
                                </div>
                            </div>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.5" }}>Unggah hasil scan buku induk atau pindai langsung menggunakan kamera perangkat.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{ width: "32px", height: "32px", background: "#047857", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>3</div>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-heading)" }}>Pemindaian Teks (OCR)</h3>
                            </div>
                            <div style={{ height: "100px", background: "#f0fdf4", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FileText size={40} color="#166534" opacity={0.5} />
                            </div>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.5" }}>Sistem akan mengenali teks dari dokumen secara otomatis menggunakan teknologi OCR.</p>
                        </div>

                        {/* Step 4 */}
                        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{ width: "32px", height: "32px", background: "#047857", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>4</div>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-heading)" }}>Cari Arsip Alumni</h3>
                            </div>
                            <div style={{ height: "100px", background: "#f0fdf4", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Search size={40} color="#166534" opacity={0.5} />
                            </div>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.5" }}>Cari data alumni berdasarkan Nama, NISN, atau Tahun Lulus dengan toleransi typo.</p>
                        </div>

                    </div>

                    {/* Right Column: Help */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                        {/* Contact Support */}
                        <div className="glass-panel" style={{ padding: "1.5rem", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#14532d", marginBottom: "0.5rem" }}>Butuh Bantuan?</h3>
                            <p style={{ fontSize: "0.9rem", color: "#166534", marginBottom: "1.5rem" }}>Hubungi kami untuk bantuan teknis lebih lanjut.</p>

                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", color: "#15803d", fontWeight: "500", fontSize: "0.9rem" }}>
                                <Mail size={18} /> admin@mts.sch.id
                            </div>

                            <button onClick={() => setShowContactModal(true)} className="btn" style={{ width: "100%", background: "#15803d", color: "white", justifyContent: "center", border: "none", cursor: "pointer" }}>
                                <MessageCircle size={18} /> Hubungi Kami
                            </button>
                        </div>

                        {/* FAQ Link */}
                        <div onClick={() => setShowFAQModal(true)} className="glass-panel" style={{ padding: "1.5rem", cursor: "pointer", transition: "all 0.2s" }}>
                            <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-heading)", marginBottom: "0.5rem" }}>Pertanyaan Umum (FAQ)</h3>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>Jawaban untuk pertanyaan yang sering diajukan.</p>
                            <div style={{ fontSize: "0.9rem", color: "#15803d", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                Lihat FAQ <ArrowRight size={14} />
                            </div>
                        </div>

                    </div>

                </div>
            </main>

            {/* Contact Modal */}
            {showContactModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 3000, padding: "1rem"
                }}>
                    <div style={{ background: "white", borderRadius: "16px", maxWidth: "420px", width: "100%", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
                        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f0fdf4" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><MessageCircle size={20} color="#15803d" /><h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#166534", margin: 0 }}>Hubungi Tim Dukungan</h3></div>
                            <button onClick={() => setShowContactModal(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "#9ca3af" }}><XCircle size={24} /></button>
                        </div>
                        <div style={{ padding: "1.5rem" }}>
                            <div style={{ marginBottom: "1rem" }}>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.9rem" }}>Nama Anda</label>
                                <input type="text" placeholder="Masukkan nama..." style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "0.95rem", outline: "none" }} />
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.9rem" }}>Pesan/Kendala</label>
                                <textarea placeholder="Tuliskan kendala Anda di sini..." rows={4} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "0.95rem", resize: "none", outline: "none" }}></textarea>
                            </div>
                            <button onClick={() => {
                                alert("Pesan telah terkirim ke admin@mts.sch.id!");
                                setShowContactModal(false);
                            }} style={{ width: "100%", padding: "0.75rem", background: "#15803d", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Kirim Pesan</button>
                        </div>
                    </div>
                </div>
            )}

            {/* FAQ Modal */}
            {showFAQModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 3000, padding: "1rem"
                }}>
                    <div style={{ background: "white", borderRadius: "16px", maxWidth: "600px", width: "100%", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
                        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f0fdf4" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><HelpCircle size={20} color="#15803d" /><h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#166534", margin: 0 }}>Pertanyaan Umum (FAQ)</h3></div>
                            <button onClick={() => setShowFAQModal(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "#9ca3af" }}><XCircle size={24} /></button>
                        </div>
                        <div style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{ background: "#f9fafb", padding: "1rem", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                                <div style={{ fontWeight: "600", color: "#15803d", marginBottom: "0.25rem" }}>Bagaimana cara unggah/scan dokumen?</div>
                                <div style={{ fontSize: "0.9rem", color: "#4b5563" }}>Pilih menu &quot;Unggah Arsip&quot; pada dashboard, lalu Anda bisa memilih file dari komputer atau menggunakan fitur &quot;Scan Kamera&quot; untuk memindai dokumen fisik langsung dengan kamera perangkat Anda.</div>
                            </div>
                            <div style={{ background: "#f9fafb", padding: "1rem", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                                <div style={{ fontWeight: "600", color: "#15803d", marginBottom: "0.25rem" }}>Kenapa sebagian teks OCR tidak terbaca benar?</div>
                                <div style={{ fontSize: "0.9rem", color: "#4b5563" }}>Kualitas scan, pencahayaan, dan tingkat kejelasan tulisan pada dokumen asli sangat berpengaruh. Kami menyarankan untuk memastikan dokumen terang dan tegak lurus saat difoto. Jika OCR salah, Anda dapat melakukan koreksi/edit teks secara manual.</div>
                            </div>
                            <div style={{ background: "#f9fafb", padding: "1rem", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                                <div style={{ fontWeight: "600", color: "#15803d", marginBottom: "0.25rem" }}>Siapa yang berhak melihat data arsip ini?</div>
                                <div style={{ fontSize: "0.9rem", color: "#4b5563" }}>Sistem keamanan bersifat tertutup. Data pada arsip ini eksklusif dan hanya dapat diakses oleh Admin TU, Kepala Sekolah, dan Petugas berwenang dari MTs Assa&apos;adah.</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
