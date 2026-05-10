"use client";

import { useState, useEffect, Suspense } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { Save, RefreshCw, Type, AlertTriangle, ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function OcrResultContent() {
    const searchParams = useSearchParams();
    const archiveId = searchParams.get("id");
    const archiveType = searchParams.get("type") || "Arsip";

    const [isLoading, setIsLoading] = useState(true);
    const [extractedWords, setExtractedWords] = useState<{ text: string; confidence: number }[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [rawText, setRawText] = useState("");
    const [confidence, setConfidence] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({ show: false, msg: "", type: "success" });

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: "", type: 'success' }), 3000);
    };

    useEffect(() => {
        if (!archiveId || isNaN(Number(archiveId))) {
            // Fallback demo data when no real ID
            setRawText("NAMA: AHMAD DAHLAN\nNISN: 0012345678\nTEMPAT LAHIR: YOGYAKARTA\nTANGGAL LAHIR: 01-08-2005\nTAHUN LULUS: 2024");
            setExtractedWords([
                { text: "NAMA:", confidence: 100 }, { text: "AHMAD", confidence: 98 }, { text: "DAHLAN", confidence: 95 },
                { text: "NISN:", confidence: 100 }, { text: "0012345678", confidence: 65 },
                { text: "TEMPAT", confidence: 100 }, { text: "LAHIR:", confidence: 100 }, { text: "YOGYAKARTA", confidence: 92 },
            ]);
            setConfidence(88);
            setIsLoading(false);
            return;
        }

        import("../../../services/api").then(api => {
            api.getArchiveDetail(Number(archiveId))
                .then((data: any) => {
                    if (data.ocr) {
                        const text: string = data.ocr.extractedText || "";
                        const conf: number = Math.round(data.ocr.confidenceScore * 100);
                        setRawText(text);
                        setConfidence(conf);
                        // Split text into words with uniform confidence for visualization
                        const words = text.split(/\s+/).filter(Boolean).map((w: string) => ({
                            text: w,
                            confidence: conf
                        }));
                        setExtractedWords(words);
                    } else {
                        setRawText("Tidak ada hasil OCR untuk arsip ini.");
                        setConfidence(0);
                    }
                })
                .catch((err: any) => {
                    console.error("Fetch OCR error:", err);
                    showToast("Gagal memuat hasil OCR dari server", "error");
                    setRawText("Gagal memuat hasil OCR.");
                })
                .finally(() => setIsLoading(false));
        });
    }, [archiveId]);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            showToast("✅ Data berhasil disimpan ke Database Alumni!");
        }, 1500);
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
                    <Loader2 className="animate-spin" size={40} style={{ margin: "0 auto 1rem auto", color: "#15803d" }} />
                    <p>Memuat hasil OCR...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* Toast Notification */}
            {toast.show && (
                <div style={{
                    position: "fixed", top: "2rem", right: "2rem",
                    background: toast.type === 'success' ? "#dcfce7" : "#fee2e2",
                    color: toast.type === 'success' ? "#166534" : "#991b1b",
                    padding: "1rem 1.5rem", borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    zIndex: 1000, display: "flex", alignItems: "center", gap: "0.75rem",
                    border: `1px solid ${toast.type === 'success' ? "#bbf7d0" : "#fecaca"}`
                }}>
                    {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span style={{ fontWeight: "600" }}>{toast.msg}</span>
                </div>
            )}
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <header style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Link href="/upload" className="btn btn-secondary" style={{ padding: "0.5rem" }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: "2rem", color: "var(--text-heading)", fontWeight: "700" }}>Hasil Ekstraksi OCR</h1>
                        <p style={{ color: "var(--text-muted)" }}>Periksa dan koreksi teks sebelum disimpan.</p>
                    </div>
                </header>

                <div className="ocr-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2rem" }}>

                    {/* Left: Image / Original Document with Zoom Simulation */}
                    <div className="glass-panel" style={{ padding: "1rem", height: "fit-content" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h3 style={{ fontSize: "1.1rem", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "700" }}>
                                <Type size={18} /> Dokumen Asli
                            </h3>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button className="btn-icon" style={{ padding: "4px", borderRadius: "4px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer" }}>🔍+</button>
                                <button className="btn-icon" style={{ padding: "4px", borderRadius: "4px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer" }}>🔍-</button>
                            </div>
                        </div>
                        <div style={{
                            position: "relative",
                            width: "100%",
                            height: "400px",
                            background: "#334155",
                            borderRadius: "var(--radius-md)",
                            overflow: "hidden",
                            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                            cursor: "crosshair"
                        }}>
                            {/* Simulated Zoomed Document */}
                            <div style={{
                                width: "100%", height: "100%",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                color: "white", padding: "1rem", textAlign: "center",
                                background: "linear-gradient(45deg, #1e293b 25%, #334155 25%, #334155 50%, #1e293b 50%, #1e293b 75%, #334155 75%, #334155 100%)",
                                backgroundSize: "40px 40px",
                                opacity: 0.8
                            }}>
                                <div style={{ background: "white", color: "#1e293b", padding: "1.5rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)", borderRadius: "4px", width: "90%" }}>
                                    <div style={{ height: "15px", width: "60%", background: "#e2e8f0", marginBottom: "0.75rem" }}></div>
                                    <div style={{ height: "30px", width: "90%", background: "#cbd5e1", marginBottom: "1.5rem" }}></div>
                                    <div style={{ height: "10px", width: "100%", background: "#f1f5f9", marginBottom: "0.4rem" }}></div>
                                    <div style={{ height: "10px", width: "100%", background: "#f1f5f9", marginBottom: "0.4rem" }}></div>
                                    <div style={{ height: "10px", width: "40%", background: "#f1f5f9" }}></div>
                                </div>
                                <p style={{ marginTop: "1.5rem", fontSize: "0.8rem", opacity: 0.7 }}>Simulasi Preview Dokumen</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Extracted Text Editor */}
                    <div className="glass-panel" style={{ padding: "1.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                            <h3 style={{ fontSize: "1.1rem", color: "var(--text-heading)", fontWeight: "700" }}>Teks Hasil Ekstraksi</h3>

                            {/* Confidence Score Indicator */}
                            <div style={{
                                padding: "0.25rem 0.75rem",
                                borderRadius: "20px",
                                background: confidence > 80 ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                                color: confidence > 80 ? "var(--success)" : "var(--warning)",
                                fontSize: "0.85rem", fontWeight: "600",
                                display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid var(--border)"
                            }}>
                                {confidence > 80 ? "Akurasi Tinggi" : "Perlu Koreksi"} ({confidence}%)
                            </div>
                        </div>

                        {confidence < 80 && (
                            <div style={{
                                marginBottom: "1rem", padding: "0.75rem",
                                background: "rgba(245, 158, 11, 0.1)", color: "#92400e",
                                borderRadius: "var(--radius-sm)", fontSize: "0.9rem", display: "flex", gap: "0.5rem"
                            }}>
                                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                                <span>Kualitas scan mungkin rendah. Mohon periksa ejaan dengan teliti.</span>
                            </div>
                        )}

                        <div style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem"
                        }}>
                            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                {isEditing ? "Mode Edit Manual" : "Mode Visualisasi Akurasi"}
                            </span>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                style={{ background: "none", border: "none", color: "#15803d", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}
                            >
                                {isEditing ? "Lihat Visualisasi" : "Edit Teks Mentah"}
                            </button>
                        </div>

                        {isEditing ? (
                            <textarea
                                value={rawText}
                                onChange={(e) => setRawText(e.target.value)}
                                style={{
                                    width: "100%", height: "300px",
                                    padding: "1rem",
                                    borderRadius: "var(--radius-md)",
                                    border: "1px solid var(--border)",
                                    fontFamily: "monospace",
                                    fontSize: "1rem",
                                    lineHeight: "1.6",
                                    resize: "vertical",
                                    outline: "none",
                                    color: "var(--text-heading)",
                                    background: "#f9fafb"
                                }}
                            />
                        ) : (
                            <div style={{
                                width: "100%", height: "300px",
                                padding: "1.2rem",
                                borderRadius: "var(--radius-md)",
                                border: "1px solid var(--border)",
                                background: "#f8fafc",
                                overflowY: "auto",
                                lineHeight: "2",
                                fontSize: "1rem"
                            }}>
                                {extractedWords.map((word, idx) => (
                                    <span
                                        key={idx}
                                        style={{
                                            marginRight: "0.5rem",
                                            padding: "0.1rem 0.3rem",
                                            borderRadius: "4px",
                                            background: word.confidence < 80 ? "#fef3c7" : "transparent",
                                            borderBottom: word.confidence < 80 ? "2px solid #f59e0b" : "none",
                                            color: word.confidence < 80 ? "#92400e" : "inherit",
                                            cursor: word.confidence < 80 ? "help" : "default"
                                        }}
                                        title={word.confidence < 80 ? `Confidence: ${word.confidence}% - Mohon verifikasi` : ""}
                                    >
                                        {word.text}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                            <button className="btn" style={{ flex: 1, border: "1px solid var(--border)", background: "white" }}>
                                <RefreshCw size={18} /> Scan Ulang
                            </button>
                            <button
                                className="btn"
                                style={{ flex: 1, background: "var(--btn-dark-green)", color: "white" }}
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? "Menyimpan..." : <><Save size={18} /> Simpan Data</>}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            <style jsx>{`
                @media (max-width: 768px) {
                    .ocr-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </AdminLayout>
    );
}

export default function OcrResultPage() {
    return (
        <Suspense fallback={
            <AdminLayout>
                <div style={{ textAlign: "center", padding: "4rem" }}>
                    <Loader2 className="animate-spin" size={40} style={{ margin: "0 auto", color: "#15803d" }} />
                </div>
            </AdminLayout>
        }>
            <OcrResultContent />
        </Suspense>
    );
}
