"use client";

import AdminLayout from "../../../components/AdminLayout";
import { Camera, Image as ImageIcon, Zap, RotateCcw, X, CheckCircle, RefreshCw, Smartphone, Monitor, XCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";

export default function CameraScanPage() {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
    const [isProcessing, setIsProcessing] = useState(false);
    const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape");
    const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({
        show: false,
        msg: "",
        type: 'success'
    });

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: "", type: 'success' }), 3000);
    };

    // Start camera on mount
    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [facingMode]);

    const startCamera = async () => {
        try {
            setCameraError(null);

            // Stop existing stream if any
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });

            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err: any) {
            console.error("Camera Error:", err);
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                setCameraError("Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.");
            } else if (err.name === "NotFoundError") {
                setCameraError("Kamera tidak ditemukan. Pastikan perangkat memiliki kamera.");
            } else {
                setCameraError("Gagal mengakses kamera. Pastikan tidak ada aplikasi lain yang menggunakan kamera.");
            }
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            if (context) {
                // Set canvas size to video size
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Draw video frame to canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert to base64 image
                const imageData = canvas.toDataURL("image/jpeg", 0.9);
                setCapturedImage(imageData);

                // Stop camera after capture
                stopCamera();
                showToast("Gambar berhasil ditangkap!", "success");
            }
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        startCamera();
    };

    const switchCamera = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user");
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCapturedImage(event.target?.result as string);
                stopCamera();
                showToast("File gambar berhasil dimuat!", "success");
            };
            reader.readAsDataURL(file);
        }
    };

    const processImage = async () => {
        if (!capturedImage) return;

        setIsProcessing(true);
        showToast("Memproses gambar (OCR)...", "success");

        try {
            // 1. Convert Base64 to Blob
            const responseV = await fetch(capturedImage);
            const blob = await responseV.blob();
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });

            // 2. Prepare FormData
            const formData = new FormData();
            formData.append("file", file);

            // 3. Send to Backend - REAL API CALL
            const { uploadArchive } = await import("../../../services/api");
            
            // Assume "Ijazah" for camera scan by default since no selector exists yet
            const response = await uploadArchive(file, "Ijazah");

            showToast("OCR Selesai! Mengalihkan...", "success");

            const archiveId = response?.data?.id || response?.ocr?.ArchiveId || "";

            // Redirect with Result Data (Pass ID and Type)
            setTimeout(() => {
                router.push(`/ocr-result?type=Ijazah&id=${archiveId}&action=review`);
            }, 1000);

        } catch (error: any) {
            console.error("Upload Error:", error);
            showToast(error.message || "Terjadi kesalahan saat memproses gambar", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AdminLayout>
            {/* Toast Notification */}
            {toast.show && (
                <div className="toast-notification" style={{
                    position: "fixed", top: "2rem", right: "2rem",
                    background: toast.type === 'success' ? "#dcfce7" : "#fee2e2",
                    color: toast.type === 'success' ? "#166534" : "#991b1b",
                    padding: "1rem 1.5rem", borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    zIndex: 4000, display: "flex", alignItems: "center", gap: "0.75rem",
                    border: `1px solid ${toast.type === 'success' ? "#bbf7d0" : "#fecaca"}`,
                    animation: "slideIn 0.3s ease-out"
                }}>
                    {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span style={{ fontWeight: "600" }}>{toast.msg}</span>
                </div>
            )}
            <div style={{ maxWidth: "1200px", margin: "0 auto" }} suppressHydrationWarning={true}>

                {/* Header */}
                <header style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem", color: "var(--text-heading)", fontWeight: "700", marginBottom: "0.5rem" }}>Scan Arsip Kamera</h1>
                    <p style={{ color: "var(--text-muted)", paddingBottom: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>Pindai dokumen arsip alumni menggunakan kamera perangkat Anda.</p>
                </header>

                <div className="camera-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>

                    {/* Left Column: Camera UI */}
                    <div className="camera-card" style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                        <div className="camera-header-text" style={{ padding: "1rem 1.5rem", background: "#f0fdf4", borderBottom: "1px solid #dcfce7", color: "#166534", fontWeight: "700", fontSize: "1.1rem" }}>
                            Area Pemindaian
                        </div>
                        <div className="camera-body" style={{ padding: "1.5rem" }}>

                            {/* Camera Viewport */}
                            <div className="camera-viewport" style={{
                                position: "relative", width: "100%", aspectRatio: orientation === "landscape" ? "16/9" : "9/16", background: "#000", borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                {/* Video Feed */}
                                {!capturedImage && !cameraError && (
                                    <>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                        {/* Overlay Guide */}
                                        <div style={{
                                            position: "absolute", top: "10%", left: "10%", right: "10%", bottom: "10%",
                                            border: "2px dashed rgba(255,255,255,0.6)", borderRadius: "8px", pointerEvents: "none"
                                        }}>
                                            {/* Corner Markers */}
                                            <div style={{ position: "absolute", top: "-2px", left: "-2px", width: "20px", height: "20px", borderTop: "4px solid white", borderLeft: "4px solid white", borderTopLeftRadius: "4px" }}></div>
                                            <div style={{ position: "absolute", top: "-2px", right: "-2px", width: "20px", height: "20px", borderTop: "4px solid white", borderRight: "4px solid white", borderTopRightRadius: "4px" }}></div>
                                            <div style={{ position: "absolute", bottom: "-2px", left: "-2px", width: "20px", height: "20px", borderBottom: "4px solid white", borderLeft: "4px solid white", borderBottomLeftRadius: "4px" }}></div>
                                            <div style={{ position: "absolute", bottom: "-2px", right: "-2px", width: "20px", height: "20px", borderBottom: "4px solid white", borderRight: "4px solid white", borderBottomRightRadius: "4px" }}></div>
                                        </div>
                                    </>
                                )}

                                {/* Captured Image Preview */}
                                {capturedImage && (
                                    <img src={capturedImage} alt="Captured" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                )}

                                {/* Error State */}
                                {cameraError && (
                                    <div style={{ textAlign: "center", color: "white", padding: "2rem" }}>
                                        <X size={48} style={{ marginBottom: "1rem", opacity: 0.7 }} />
                                        <p style={{ marginBottom: "1rem" }}>{cameraError}</p>
                                        <button onClick={startCamera} className="btn" style={{ background: "#15803d", color: "white", padding: "0.6rem 1.5rem" }}>
                                            Coba Lagi
                                        </button>
                                    </div>
                                )}

                                {/* Hidden Canvas for Processing */}
                                <canvas ref={canvasRef} style={{ display: "none" }} />
                            </div>

                            {/* Camera Controls Toolbar */}
                            {!capturedImage && !cameraError && (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", padding: "0 1rem" }}>
                                    <div style={{ display: "flex", gap: "1rem" }}>
                                        <button className="icon-btn-light" title="Flash" disabled>
                                            <Zap size={20} />
                                        </button>
                                        <button className="icon-btn-light" title="Switch Camera" onClick={switchCamera}>
                                            <RotateCcw size={20} />
                                        </button>
                                        <button
                                            className="icon-btn-light"
                                            title={orientation === "landscape" ? "Switch to Portrait" : "Switch to Landscape"}
                                            onClick={() => setOrientation(prev => prev === "landscape" ? "portrait" : "landscape")}
                                        >
                                            {orientation === "landscape" ? <Smartphone size={20} /> : <Monitor size={20} />}
                                        </button>
                                    </div>

                                    <button
                                        onClick={capturePhoto}
                                        style={{
                                            width: "64px", height: "64px", borderRadius: "50%", background: "#ef4444", border: "4px solid #fecaca",
                                            display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", cursor: "pointer", transition: "transform 0.1s"
                                        }}
                                        className="active:scale-95"
                                    >
                                        <Camera size={28} />
                                    </button>

                                    <div style={{ display: "flex", gap: "1rem" }}>
                                        <button className="icon-btn-light" title="Gallery" onClick={() => fileInputRef.current?.click()}>
                                            <ImageIcon size={20} />
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={handleFileUpload}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="camera-actions" style={{ display: "flex", gap: "1rem" }}>
                                {capturedImage ? (
                                    <>
                                        <button
                                            onClick={retakePhoto}
                                            className="btn"
                                            style={{
                                                background: "#f0fdf4", color: "#15803d", border: "1px solid #15803d", flex: 1, padding: "0.85rem", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
                                            }}
                                        >
                                            <RefreshCw size={20} /> Ambil Ulang
                                        </button>
                                        <button
                                            onClick={processImage}
                                            disabled={isProcessing}
                                            className="btn"
                                            style={{
                                                background: "#15803d", color: "white", flex: 1, padding: "0.85rem", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                                                opacity: isProcessing ? 0.7 : 1
                                            }}
                                        >
                                            {isProcessing ? (
                                                <>Memproses...</>
                                            ) : (
                                                <><CheckCircle size={20} /> Proses Gambar</>
                                            )}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={capturePhoto}
                                            disabled={!!cameraError}
                                            className="btn"
                                            style={{
                                                background: "#15803d", color: "white", flex: 1, padding: "0.85rem", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                                                opacity: cameraError ? 0.5 : 1
                                            }}
                                        >
                                            <Camera size={20} /> Ambil Foto Arsip
                                        </button>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="btn"
                                            style={{
                                                background: "#f0fdf4", color: "#15803d", border: "1px solid #15803d", flex: 1, padding: "0.85rem", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
                                            }}
                                        >
                                            <ImageIcon size={20} /> Unggah Dari File
                                        </button>
                                    </>
                                )}
                            </div>

                            <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                {capturedImage
                                    ? "Gambar siap diproses. Klik 'Proses Gambar' untuk melanjutkan ke OCR."
                                    : "Posisikan dokumen di dalam area yang ditandai untuk hasil terbaik."
                                }
                            </p>

                        </div>
                    </div>

                    {/* Right Column: System/Options */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                            <div style={{ padding: "1rem 1.5rem", background: "#f0fdf4", borderBottom: "1px solid #dcfce7", color: "#166534", fontWeight: "700", fontSize: "1.1rem" }}>
                                Status Kamera
                            </div>
                            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                                <div style={{ padding: "1rem", background: stream ? "#f0fdf4" : "#fef2f2", borderRadius: "8px", border: `1px solid ${stream ? "#dcfce7" : "#fecaca"}` }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: stream ? "#10b981" : "#ef4444" }}></div>
                                        <span style={{ fontWeight: "600", color: stream ? "#166534" : "#991b1b", fontSize: "0.9rem" }}>
                                            {stream ? "Kamera Aktif" : "Kamera Tidak Aktif"}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: "0.8rem", color: stream ? "#166534" : "#991b1b", opacity: 0.8 }}>
                                        {stream ? "Siap untuk mengambil foto" : "Klik tombol untuk mengaktifkan"}
                                    </p>
                                </div>

                                <div>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-heading)", fontWeight: "600" }}>Mode Kamera</label>
                                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                        {facingMode === "environment" ? "📷 Kamera Belakang" : "🤳 Kamera Depan"}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-heading)", fontWeight: "600" }}>Orientasi</label>
                                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        {orientation === "landscape" ? (
                                            <><Monitor size={16} /> Landscape (16:9)</>
                                        ) : (
                                            <><Smartphone size={16} /> Portrait (9:16)</>
                                        )}
                                    </div>
                                </div>

                                {capturedImage && (
                                    <div style={{ padding: "1rem", background: "#eff6ff", borderRadius: "8px", border: "1px solid #dbeafe" }}>
                                        <div style={{ fontWeight: "600", color: "#1e40af", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                                            ✓ Gambar Tertangkap
                                        </div>
                                        <p style={{ fontSize: "0.8rem", color: "#1e40af", opacity: 0.8 }}>
                                            Siap untuk diproses dengan OCR
                                        </p>
                                    </div>
                                )}

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
                .icon-btn-light {
                    background: #f3f4f6;
                    border: 1px solid #e5e7eb;
                    color: #4b5563;
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .icon-btn-light:hover:not(:disabled) {
                    background: #e5e7eb;
                    color: #1f2937;
                }
                .icon-btn-light:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                /* Mobile Optimization */
                @media (max-width: 768px) {
                    .camera-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1rem !important;
                    }
                    .camera-actions {
                        flex-direction: column !important;
                    }
                    
                    /* Expand Camera View on Mobile */
                    .camera-body {
                        padding: 0.75rem !important;
                    }
                    
                    /* Taller default aspect ratio for mobile to fix "too small" issue */
                    .camera-viewport {
                        border-radius: 8px !important;
                        aspect-ratio: 4/5 !important;
                        min-height: 400px;
                    }
                    /* Ensure video fills the new aspect ratio */
                    .camera-viewport video {
                        width: 100% !important;
                        height: 100% !important;
                        object-fit: cover !important;
                    }
                }
            `}</style>
        </AdminLayout>
    );
}
