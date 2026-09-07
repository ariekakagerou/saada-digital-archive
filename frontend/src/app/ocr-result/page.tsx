"use client";

import { useState, useEffect, Suspense } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { Save, RefreshCw, Type, AlertTriangle, ArrowLeft, Loader2, CheckCircle, XCircle, FileText, User, Hash, MapPin, Calendar, School, Layers, Sparkles, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// ── Tipe data terstruktur hasil ekstraksi ────────────────────────────────────
interface ExtractedFields {
    namaLengkap?: string;
    nisn?: string;
    nis?: string;
    tempatLahir?: string;
    tanggalLahir?: string;
    tahunLulus?: number;
    nomorIjazah?: string;
    namaSekolah?: string;
    npsn?: string;
}

function OcrResultContent() {
    const searchParams = useSearchParams();
    const archiveId = searchParams.get("id");

    const [isLoading, setIsLoading] = useState(true);
    const [rawText, setRawText] = useState("");
    const [unnormalizedRawText, setUnnormalizedRawText] = useState("");
    const [viewTab, setViewTab] = useState<"normalized" | "raw" | "comparison">("normalized");
    const [isEditing, setIsEditing] = useState(false);
    const [confidence, setConfidence] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isRescanning, setIsRescanning] = useState(false);
    const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "error" }>({ show: false, msg: "", type: "success" });
    const [filePath, setFilePath] = useState("");
    const [zoom, setZoom] = useState(1);
    const [ocrId, setOcrId] = useState<number | null>(null);
    const [extractedFields, setExtractedFields] = useState<ExtractedFields>({});
    const [rawExtractedFields, setRawExtractedFields] = useState<ExtractedFields>({});
    const [archiveType, setArchiveType] = useState("Arsip");

    const isTextEmpty = !rawText.trim();

    const getFileUrl = (path: string) => {
        if (!path) return "";
        if (typeof window !== "undefined") {
            return `http://${window.location.hostname}:5084/api/archives/file/${path}`;
        }
        return `http://localhost:5084/api/archives/file/${path}`;
    };

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 4500);
    };

    const applyOcrData = (text: string, conf: number, fields?: any, rawTxt?: string, rawFields?: any) => {
        setRawText(text);
        setConfidence(conf);
        if (rawTxt) setUnnormalizedRawText(rawTxt);
        else setUnnormalizedRawText(text);

        if (fields && typeof fields === "object" && Object.keys(fields).length > 0) {
            setExtractedFields(fields);
        }

        if (rawFields && typeof rawFields === "object" && Object.keys(rawFields).length > 0) {
            setRawExtractedFields(rawFields);
        }
    };

    const loadArchiveData = (api: any) => {
        return api.getArchiveDetail(Number(archiveId))
            .then((data: any) => {
                if (data.filePath) setFilePath(data.filePath);
                if (data.jenisArsip) setArchiveType(data.jenisArsip);

                // Pre-populate fields from matched alumni or dynamic parsed data
                const preFields: any = {};
                if (data.siswaName && data.siswaName !== "Siswa Tidak Diketahui") {
                    preFields.namaLengkap = data.siswaName;
                }
                if (data.nisn) preFields.nisn = data.nisn;
                if (data.nis) preFields.nis = data.nis;
                if (data.tahunLulus) preFields.tahunLulus = data.tahunLulus;

                let rawFields: any = {};
                if (data.ocr && data.ocr.extractedData) {
                    Object.assign(preFields, data.ocr.extractedData);
                }
                if (data.ocr && data.ocr.rawExtractedData) {
                    rawFields = data.ocr.rawExtractedData;
                }

                if (Object.keys(preFields).length > 0) {
                    setExtractedFields(preFields);
                }
                if (Object.keys(rawFields).length > 0) {
                    setRawExtractedFields(rawFields);
                }

                if (data.ocr) {
                    const text: string = data.ocr.extractedText || "";
                    const rawTxt: string = data.ocr.rawText || text;
                    const conf: number = Math.round(data.ocr.confidenceScore ?? 0);
                    setOcrId(data.ocr.id ?? null);
                    applyOcrData(text, conf, preFields, rawTxt, rawFields);
                }
            });
    };

    useEffect(() => {
        if (!archiveId || isNaN(Number(archiveId))) {
            setIsLoading(false);
            return;
        }
        import("../../../services/api").then(api => {
            loadArchiveData(api)
                .catch(() => showToast("Gagal memuat hasil OCR dari server", "error"))
                .finally(() => setIsLoading(false));
        });
    }, [archiveId]);

    // ── Scan Ulang ──────────────────────────────────────────────────────────
    const handleRescan = async () => {
        if (!archiveId || isNaN(Number(archiveId))) return;
        setIsRescanning(true);
        try {
            const api = await import("../../../services/api");
            const result = await api.rescanArchive(Number(archiveId));
            if (result?.ocr) {
                const text: string = result.ocr.extractedText || "";
                const rawTxt: string = result.ocr.rawText || text;
                const conf: number = Math.round(result.ocr.confidenceScore ?? 0);
                setOcrId(result.ocr.id ?? null);
                applyOcrData(text, conf, result.ocr.extractedData, rawTxt, result.ocr.rawExtractedData);
                showToast("✅ Scan ulang berhasil! Teks diperbarui.", "success");
            }
        } catch (err: any) {
            showToast(err.message || "Gagal scan ulang. Pastikan AI Service berjalan.", "error");
        } finally {
            setIsRescanning(false);
        }
    };

    // ── Simpan Data ─────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!ocrId) { showToast("Lakukan Scan Ulang terlebih dahulu.", "error"); return; }
        if (!rawText.trim()) { showToast("Teks tidak boleh kosong.", "error"); return; }
        setIsSaving(true);
        try {
            const api = await import("../../../services/api");
            await api.updateOcrText(ocrId, rawText);
            showToast("✅ Data OCR berhasil disimpan!", "success");
            await loadArchiveData(api);
        } catch (err: any) {
            showToast(err.message || "Gagal menyimpan. Coba lagi.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    // ── Loading state ───────────────────────────────────────────────────────
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

    // ── Confidence label ────────────────────────────────────────────────────
    const confColor = isTextEmpty ? "#64748b" : confidence > 75 ? "#16a34a" : confidence > 50 ? "#d97706" : "#dc2626";
    const confLabel = isTextEmpty ? "Belum Dipindai" : confidence > 75 ? "Akurasi Baik" : confidence > 50 ? "Perlu Koreksi" : "Akurasi Rendah";

    // ── Data terstruktur ────────────────────────────────────────────────────
    const structuredFields = [
        { icon: <User size={14} />, label: "Nama Lengkap", key: "namaLengkap", db: "alumni.nama_lengkap" },
        { icon: <Hash size={14} />, label: "NISN", key: "nisn", db: "alumni.nisn" },
        { icon: <Hash size={14} />, label: "NIS", key: "nis", db: "alumni.nis" },
        { icon: <MapPin size={14} />, label: "Tempat Lahir", key: "tempatLahir", db: "alumni.tempat_lahir" },
        { icon: <Calendar size={14} />, label: "Tanggal Lahir", key: "tanggalLahir", db: "alumni.tanggal_lahir" },
        { icon: <Calendar size={14} />, label: "Tahun Lulus", key: "tahunLulus", db: "alumni.tahun_lulus" },
        { icon: <Hash size={14} />, label: "Nomor Ijazah", key: "nomorIjazah", db: "detail_ijazah" },
        { icon: <School size={14} />, label: "Nama Sekolah", key: "namaSekolah", db: "referensi" },
        { icon: <Hash size={14} />, label: "NPSN", key: "npsn", db: "referensi" },
    ] as const;

    const detectedCount = structuredFields.filter(f => (extractedFields as any)[f.key]).length;

    return (
        <AdminLayout>
            {/* Toast notification */}
            {toast.show && (
                <div style={{
                    position: "fixed", top: "1.5rem", right: "1.5rem",
                    background: toast.type === "success" ? "#dcfce7" : "#fee2e2",
                    color: toast.type === "success" ? "#166534" : "#991b1b",
                    padding: "0.875rem 1.25rem", borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)", zIndex: 1000,
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                    maxWidth: "400px", animation: "slideIn 0.2s ease"
                }}>
                    {toast.type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>{toast.msg}</span>
                </div>
            )}

            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                {/* Header */}
                <header style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Link href="/upload" className="btn btn-secondary" style={{ padding: "0.5rem" }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: "1.75rem", color: "var(--text-heading)", fontWeight: "700", margin: 0 }}>
                            Hasil Ekstraksi OCR & Komparasi Homoglyph
                        </h1>
                        <p style={{ color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
                            {archiveType} • {archiveId ? `ID Arsip #${archiveId}` : "Preview"}
                        </p>
                    </div>
                </header>

                {/* Main 3-column grid */}
                <div className="ocr-grid">

                    {/* ── Kolom 1: Gambar dokumen ── */}
                    <div className="glass-panel" style={{ padding: "1.25rem", height: "fit-content" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
                            <h3 style={{ fontSize: "1rem", color: "var(--text-heading)", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
                                <Type size={16} /> Dokumen Asli
                            </h3>
                            <div style={{ display: "flex", gap: "0.4rem" }}>
                                <button onClick={() => setZoom(z => Math.min(z + 0.25, 3))} style={{ padding: "3px 8px", borderRadius: "4px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold" }}>+</button>
                                <button onClick={() => setZoom(1)} style={{ padding: "3px 8px", borderRadius: "4px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: "0.75rem" }}>Reset</button>
                                <button onClick={() => setZoom(z => Math.max(z - 0.25, 0.3))} style={{ padding: "3px 8px", borderRadius: "4px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold" }}>-</button>
                            </div>
                        </div>
                        <div style={{ width: "100%", height: "480px", background: "#1e293b", borderRadius: "8px", overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {filePath ? (
                                <img
                                    src={getFileUrl(filePath)}
                                    alt="Dokumen Scan"
                                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", transform: `scale(${zoom})`, transition: "transform 0.2s ease", transformOrigin: "center center" }}
                                />
                            ) : (
                                <div style={{ color: "#64748b", textAlign: "center", fontSize: "0.85rem", padding: "2rem" }}>
                                    <FileText size={40} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
                                    <p>Tidak ada file gambar</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Kolom 2: Teks OCR & Komparasi ── */}
                    <div className="glass-panel" style={{ padding: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem", flexWrap: "wrap", gap: "0.5rem" }}>
                            <h3 style={{ fontSize: "1rem", color: "var(--text-heading)", fontWeight: "700", margin: 0 }}>Teks Hasil Ekstraksi</h3>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <span style={{
                                    padding: "0.2rem 0.65rem", borderRadius: "20px", fontSize: "0.78rem", fontWeight: "600",
                                    background: isTextEmpty ? "rgba(100,116,139,0.1)" : `rgba(${confColor === "#16a34a" ? "22,163,74" : confColor === "#d97706" ? "217,119,6" : "220,38,38"},0.1)`,
                                    color: confColor, border: "1px solid currentColor"
                                }}>
                                    {confLabel} {!isTextEmpty && `(${confidence}%)`}
                                </span>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    style={{ background: "none", border: "none", color: "#15803d", fontWeight: "600", fontSize: "0.82rem", cursor: "pointer", padding: "0.2rem 0.4rem" }}
                                >
                                    {isEditing ? "Lihat Teks" : "✏️ Edit"}
                                </button>
                            </div>
                        </div>

                        {/* ── Mode Switcher Tab (Sebelum & Sesudah) ── */}
                        {!isEditing && !isTextEmpty && (
                            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.875rem", background: "#e2e8f0", padding: "3px", borderRadius: "8px" }}>
                                <button
                                    onClick={() => setViewTab("normalized")}
                                    style={{
                                        flex: 1, padding: "6px 10px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: "600",
                                        border: "none", cursor: "pointer", transition: "all 0.2s",
                                        background: viewTab === "normalized" ? "#15803d" : "transparent",
                                        color: viewTab === "normalized" ? "white" : "#475569",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem"
                                    }}
                                >
                                    <Sparkles size={13} /> Sesudah Perbaikan
                                </button>
                                <button
                                    onClick={() => setViewTab("raw")}
                                    style={{
                                        flex: 1, padding: "6px 10px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: "600",
                                        border: "none", cursor: "pointer", transition: "all 0.2s",
                                        background: viewTab === "raw" ? "#475569" : "transparent",
                                        color: viewTab === "raw" ? "white" : "#475569",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem"
                                    }}
                                >
                                    <FileText size={13} /> Teks Mentah (Sebelum)
                                </button>
                                <button
                                    onClick={() => setViewTab("comparison")}
                                    style={{
                                        flex: 1, padding: "6px 10px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: "600",
                                        border: "none", cursor: "pointer", transition: "all 0.2s",
                                        background: viewTab === "comparison" ? "#2563eb" : "transparent",
                                        color: viewTab === "comparison" ? "white" : "#475569",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem"
                                    }}
                                >
                                    <Layers size={13} /> Komparasi Side-by-Side
                                </button>
                            </div>
                        )}

                        {/* Warning / empty state */}
                        {isTextEmpty ? (
                            <div style={{ marginBottom: "0.75rem", padding: "0.875rem", background: "rgba(59,130,246,0.08)", color: "#1e40af", borderRadius: "8px", fontSize: "0.875rem", display: "flex", gap: "0.75rem", border: "1px solid rgba(59,130,246,0.2)" }}>
                                <FileText size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                                <span>Belum dipindai. Klik <strong>Scan Ulang</strong> untuk memproses dokumen, atau klik <strong>Edit</strong> untuk mengisi teks manual.</span>
                            </div>
                        ) : confidence < 60 && (
                            <div style={{ marginBottom: "0.75rem", padding: "0.625rem", background: "rgba(245,158,11,0.1)", color: "#92400e", borderRadius: "8px", fontSize: "0.8rem", display: "flex", gap: "0.5rem" }}>
                                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: "1px" }} />
                                <span>Akurasi rendah — mohon periksa dan koreksi teks secara manual.</span>
                            </div>
                        )}

                        {/* Text display / edit / comparison */}
                        {isEditing ? (
                            <textarea
                                value={rawText}
                                onChange={e => setRawText(e.target.value)}
                                placeholder="Ketik atau tempel teks hasil OCR di sini..."
                                style={{
                                    width: "100%", height: "360px", padding: "1rem",
                                    borderRadius: "8px", border: "1px solid var(--border)",
                                    fontFamily: "monospace", fontSize: "0.9rem", lineHeight: "1.7",
                                    resize: "vertical", outline: "none",
                                    color: "var(--text-heading)", background: "#f9fafb",
                                    boxSizing: "border-box", whiteSpace: "pre-wrap"
                                }}
                            />
                        ) : viewTab === "comparison" ? (
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", minHeight: "360px" }}>
                                <div style={{ background: "#f1f5f9", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                                    <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "#475569", textTransform: "uppercase", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                        <FileText size={12} /> Teks Mentah (Sebelum OCR Fix)
                                    </div>
                                    <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "0.78rem", color: "#334155", lineHeight: "1.6" }}>
                                        {unnormalizedRawText || rawText}
                                    </pre>
                                </div>
                                <div style={{ background: "#f0fdf4", padding: "0.75rem", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                                    <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "#166534", textTransform: "uppercase", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                        <Sparkles size={12} /> Sesudah Perbaikan Homoglyph
                                    </div>
                                    <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "0.78rem", color: "#14532d", lineHeight: "1.6" }}>
                                        {rawText}
                                    </pre>
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                width: "100%", minHeight: "360px", padding: "1rem",
                                borderRadius: "8px", border: "1px solid var(--border)",
                                background: viewTab === "normalized" ? "#f8fafc" : "#f1f5f9", overflowY: "auto", maxHeight: "400px",
                                fontFamily: "'Courier New', monospace", fontSize: "0.875rem",
                                lineHeight: "1.8", color: "var(--text-heading)",
                                whiteSpace: "pre-wrap", wordBreak: "break-word"
                            }}>
                                {isTextEmpty ? (
                                    <p style={{ color: "#94a3b8", fontStyle: "italic", textAlign: "center", marginTop: "5rem", fontFamily: "inherit" }}>
                                        Belum ada teks. Klik "Scan Ulang" untuk memindai dokumen.
                                    </p>
                                ) : (viewTab === "raw" ? (unnormalizedRawText || rawText) : rawText)}
                            </div>
                        )}

                        {/* Action buttons */}
                        <div style={{ display: "flex", gap: "0.875rem", marginTop: "1.25rem" }}>
                            <button
                                className="btn"
                                style={{ flex: 1, border: "1px solid var(--border)", background: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "0.9rem" }}
                                onClick={handleRescan}
                                disabled={isRescanning || isSaving || !archiveId}
                                title="OCR pada CPU memerlukan 1-3 menit"
                            >
                                {isRescanning
                                    ? <><Loader2 size={15} className="animate-spin" /> Memindai...</>
                                    : <><RefreshCw size={16} /> Scan Ulang</>
                                }
                            </button>
                            <button
                                className="btn"
                                style={{ flex: 1, background: "var(--btn-dark-green)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "0.9rem", opacity: isTextEmpty ? 0.6 : 1 }}
                                onClick={handleSave}
                                disabled={isSaving || isRescanning || isTextEmpty}
                            >
                                {isSaving
                                    ? <><Loader2 size={15} className="animate-spin" /> Menyimpan...</>
                                    : <><Save size={16} /> Simpan Teks</>
                                }
                            </button>
                        </div>

                    </div>

                    {/* ── Kolom 3: Data Terstruktur & Visual Diff Badges ── */}
                    <div className="glass-panel" style={{ padding: "1.25rem", height: "fit-content" }}>
                        <div style={{ marginBottom: "1rem" }}>
                            <h3 style={{ fontSize: "1rem", color: "var(--text-heading)", fontWeight: "700", margin: "0 0 0.25rem" }}>
                                Data Terstruktur & Koreksi
                            </h3>
                            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                                {detectedCount > 0
                                    ? `${detectedCount} field terdeteksi dengan perbaikan angka/huruf`
                                    : "Belum ada data terdeteksi — lakukan Scan Ulang"}
                            </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {structuredFields.map(field => {
                                const value = (extractedFields as any)[field.key];
                                const rawValue = (rawExtractedFields as any)[field.key];
                                const isCorrected = value && rawValue && String(value).toLowerCase() !== String(rawValue).toLowerCase();

                                return (
                                    <div key={field.key} style={{
                                        padding: "0.625rem 0.875rem",
                                        borderRadius: "8px",
                                        background: value ? (isCorrected ? "rgba(37,99,235,0.06)" : "rgba(21,128,61,0.05)") : "#f8fafc",
                                        border: `1px solid ${value ? (isCorrected ? "rgba(37,99,235,0.3)" : "rgba(21,128,61,0.2)") : "#e2e8f0"}`,
                                        transition: "all 0.2s"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                                <span style={{ color: value ? (isCorrected ? "#2563eb" : "#15803d") : "#94a3b8" }}>{field.icon}</span>
                                                <span style={{ fontSize: "0.72rem", fontWeight: "600", color: value ? (isCorrected ? "#1e40af" : "#15803d") : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                    {field.label}
                                                </span>
                                            </div>
                                            {isCorrected && (
                                                <span style={{ fontSize: "0.65rem", fontWeight: "700", padding: "1px 6px", borderRadius: "10px", background: "#dbeafe", color: "#1e40af", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", gap: "2px" }}>
                                                    <Sparkles size={10} /> Koreksi OCR
                                                </span>
                                            )}
                                        </div>

                                        {value ? (
                                            <div>
                                                <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: "600", color: "var(--text-heading)", wordBreak: "break-all" }}>
                                                    {String(value)}
                                                </p>
                                                {isCorrected && (
                                                    <div style={{ marginTop: "3px", fontSize: "0.73rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                                                        <span style={{ textDecoration: "line-through", color: "#ef4444" }}>{String(rawValue)}</span>
                                                        <ArrowRight size={10} style={{ color: "#2563eb" }} />
                                                        <span style={{ fontWeight: "700", color: "#166534" }}>{String(value)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p style={{ margin: 0, fontSize: "0.8rem", color: "#cbd5e1", fontStyle: "italic" }}>
                                                Tidak terdeteksi
                                            </p>
                                        )}

                                    </div>
                                );
                            })}
                        </div>

                        {detectedCount > 0 && (
                            <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(21,128,61,0.06)", borderRadius: "8px", border: "1px solid rgba(21,128,61,0.15)", fontSize: "0.78rem", color: "#166534", textAlign: "center" }}>
                                ✅ Perbaikan homoglyph aktif — data siap digunakan untuk form alumni
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <style jsx>{`
                .ocr-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.3fr 1fr;
                    gap: 1.5rem;
                }
                @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
                @media (max-width: 1024px) { .ocr-grid { grid-template-columns: 1fr 1fr !important; } }
                @media (max-width: 768px) { .ocr-grid { grid-template-columns: 1fr !important; } }
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
