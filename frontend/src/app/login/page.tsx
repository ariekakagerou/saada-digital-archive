"use client";

import { useState, useEffect, Suspense } from "react";
import { User, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles, Book, FileText, ClipboardList, BarChart3, Search, Shield, Zap, AlertCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import "./login.css";

/**
 * LoginPageContent - Konten Utama Login
 */
function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [sessionMessage, setSessionMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginFailure, setLoginFailure] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [shake, setShake] = useState(false);
    const [showFeatures, setShowFeatures] = useState(false);

    useEffect(() => {
        const errType = searchParams.get("error");
        if (errType === "session_expired") {
            setSessionMessage("Sesi Anda telah berakhir. Silakan login kembali untuk melanjutkan.");
        }
    }, [searchParams]);

    const features = [
        { icon: <Book size={28} />, label: "Buku Induk Digital" },
        { icon: <FileText size={28} />, label: "Arsip Ijazah" },
        { icon: <ClipboardList size={28} />, label: "Transkrip Nilai" },
        { icon: <BarChart3 size={28} />, label: "Laporan Legger Kelas" },
        { icon: <Search size={28} />, label: "Pencarian Cepat" },
        { icon: <Shield size={28} />, label: "Keamanan Data" },
        { icon: <Zap size={28} />, label: "Akses Prioritas" },
        { icon: <Sparkles size={28} />, label: "Fitur Cerdas" },
    ];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await fetchApi("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });

            localStorage.setItem("user", JSON.stringify({
                username: data.username,
                fullName: data.fullName,
                role: data.role,
                token: data.token
            }));

            document.cookie = `saada_token=${data.token}; path=/; max-age=${8 * 3600}; SameSite=Strict`;

            setLoginSuccess(true);
            setLoginAttempts(0);
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
        } catch (err: any) {
            const newAttempts = loginAttempts + 1;
            setLoginAttempts(newAttempts);
            setError("Kredensial salah. Silakan coba lagi.");
            setShake(true);
            setLoginFailure(true);
            
            // Bersihkan field agar menulis dari awal lagi sesuai permintaan user
            setUsername("");
            setPassword("");
            
            setTimeout(() => setShake(false), 500);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true);
        setError("");
        
        try {
            const data = await fetchApi("/api/auth/google-login", {
                method: "POST",
                body: JSON.stringify({ idToken: credentialResponse.credential }),
            });

            localStorage.setItem("user", JSON.stringify({
                username: data.username,
                fullName: data.fullName,
                role: data.role,
                token: data.token
            }));

            document.cookie = `saada_token=${data.token}; path=/; max-age=${8 * 3600}; SameSite=Strict`;

            setLoginSuccess(true);
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan saat login Google");
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="login-light-wrapper" suppressHydrationWarning>
            {/* Ambient Background */}
            <div className="ambient-bg">
                <div className="circle-bg bg-1"></div>
                <div className="circle-bg bg-2"></div>
            </div>

            {/* Success Overlay */}
            {loginSuccess && (
                <div className="success-overlay">
                    <div className="splash-card success-card">
                        <div className="splash-icon success-icon-bg">
                            <ShieldCheck size={50} strokeWidth={2.5} />
                        </div>
                        <h2>Berhasil Masuk</h2>
                        <p>Selamat Datang Kembali ke Sistem Arsip Alumni (SAADA)</p>
                        <div className="loading-bar-wrap">
                            <div className="loading-bar-fill"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Failure Overlay */}
            {loginFailure && (
                <div className="failure-overlay">
                    <div className="splash-card failure-card">
                        <div className="splash-icon failure-icon-bg">
                            <Lock size={50} strokeWidth={2.5} />
                        </div>
                        <h2>Akses Ditolak</h2>
                        {loginAttempts >= 3 ? (
                            <p style={{ color: '#dc2626' }}>
                                <strong>Peringatan!</strong> Anda salah password sebanyak {loginAttempts} kali.
                            </p>
                        ) : (
                            <p>Username atau Password tidak sesuai.</p>
                        )}
                        <button className="retry-btn" onClick={() => setLoginFailure(false)}>Coba Lagi</button>
                    </div>
                </div>
            )}

            <main className="login-container">
                <div className={`login-glass-card ${shake ? 'shake-me' : ''}`}>

                    {/* Branding Banner */}
                    <div className={`branding-banner ${showFeatures ? 'mobile-visible' : ''}`}>
                        <div className="banner-content">
                            <button className="mobile-close-btn" onClick={() => setShowFeatures(false)}>×</button>
                            <div className="logo-box">
                                <img src="/logo-assaadah.jpg" alt="Logo" />
                            </div>
                            <div className="brand-text">
                                <h2>SAADA</h2>
                                <p>Sistem Arsip Alumni Digital</p>
                                <span className="school-tag">MTs Assa'adah Sukaraja Bogor</span>
                            </div>
                            <div className="feature-grid">
                                {features.map((f, i) => (
                                    <div key={i} className="feature-item">
                                        <div className="f-icon">{f.icon}</div>
                                        <span>{f.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="login-form-area">
                        <div className="form-header">
                            <h3>Masuk Petugas</h3>
                            <p>Gunakan akun resmi untuk mengakses data alumni.</p>
                        </div>

                        <form className="login-form-box" onSubmit={handleLogin}>
                            {error && <div className="alert-error">{error}</div>}
                            {sessionMessage && (
                                <div className="alert-info" style={{
                                    background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", padding: "1rem",
                                    borderRadius: "8px", marginBottom: "1.5rem", display: "flex",
                                    alignItems: "center", gap: "0.75rem", fontSize: "0.9rem",
                                    border: "1px solid rgba(59, 130, 246, 0.3)"
                                }}>
                                    <AlertCircle size={20} />
                                    {sessionMessage}
                                </div>
                            )}

                            <div className="form-item">
                                <label htmlFor="username">Username / NIP</label>
                                <div className="input-wrap">
                                    <span className="icon-l"><User size={20} /></span>
                                    <input id="username" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                </div>
                            </div>

                            <div className="form-item">
                                <label htmlFor="password">Password Akun</label>
                                <div className="input-wrap">
                                    <span className="icon-l"><Lock size={20} /></span>
                                    <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    <button type="button" className="toggle-view" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-options">
                                <Link href="/forgot-password" className="forgot-link">Lupa Password?</Link>
                            </div>

                            <button type="submit" className="login-action-btn" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} style={{ marginRight: '8px' }} />
                                        Memproses...
                                    </>
                                ) : (
                                    <>Masuk Sekarang <ArrowRight size={20} /></>
                                )}
                            </button>

                            <div className="login-divider"><span>ATAU</span></div>

                            <div className="google-login-wrapper">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError("Gagal login dengan Google")}
                                    theme="outline"
                                    size="large"
                                    text="continue_with"
                                    shape="pill"
                                />
                            </div>

                            <div className="help-section"><p>Butuh bantuan? <Link href="/contact-it">Hubungi IT</Link></p></div>
                            <div className="register-refer"><p>Belum punya akun? <Link href="/register">Daftar Petugas</Link></p></div>
                        </form>

                        <div className="mobile-feature-trigger">
                            <button type="button" onClick={() => setShowFeatures(true)}>Fitur SAADA <ArrowRight size={16} /></button>
                        </div>
                    </div>

                    <div className="login-footer-info">
                        <p>© 2026 SAADA • Digital Archive System</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

/**
 * Main Export - LoginPage
 */
export default function LoginPage() {
    return (
        <Suspense fallback={<div className="loading-screen">Memuat...</div>}>
            <div suppressHydrationWarning>
                <LoginPageContent />
            </div>
        </Suspense>
    );
}
