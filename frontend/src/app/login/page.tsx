"use client";

import { useState } from "react";
import { User, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles, Book, FileText, ClipboardList, BarChart3, Search, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./login.css";

/**
 * LoginPage Component
 * Handles user authentication for the SAADA system.
 * Refactored to address potential 404/rendering issues in dev server.
 */
export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginFailure, setLoginFailure] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [shake, setShake] = useState(false);
    const [showFeatures, setShowFeatures] = useState(false);

    const features = [
        { icon: <Book size={28} />, label: "Buku Induk Digital" },
        { icon: <FileText size={28} />, label: "Arsip Ijazah" },
        { icon: <ClipboardList size={28} />, label: "Transkrip Nilai" },
        { icon: <BarChart3 size={28} />, label: "Laporan Rapor" },
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
            // Panggil API Backend yang asli
            const response = await fetch("http://localhost:5084/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Kredensial salah");
            }

            const data = await response.json();
            
            // Simpan data user asli dari database ke localStorage
            localStorage.setItem("user", JSON.stringify({
                username: data.username,
                fullName: data.fullName,
                role: data.role,
                token: data.token
            }));

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
            setLoginFailure(true); // Show failure splash
            
            setTimeout(() => setShake(false), 500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-light-wrapper" suppressHydrationWarning={true}>
            
            {/* Soft Ambient Background */}
            <div className="ambient-bg">
                <div className="circle-bg bg-1"></div>
                <div className="circle-bg bg-2"></div>
            </div>

            {/* Success Overlay / Splash Screen */}
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

            {/* Failure Overlay / Splash Screen */}
            {loginFailure && (
                <div className="failure-overlay">
                    <div className="splash-card failure-card">
                        <div className="splash-icon failure-icon-bg">
                            <Lock size={50} strokeWidth={2.5} />
                        </div>
                        <h2>Akses Ditolak</h2>
                        {loginAttempts >= 3 ? (
                            <p style={{ color: '#dc2626' }}>
                                <strong>Peringatan!</strong> Anda telah salah memasukkan password sebanyak {loginAttempts} kali. Mohon periksa kembali kredensial Anda.
                            </p>
                        ) : (
                            <p>Username atau Password yang Anda masukkan tidak sesuai.</p>
                        )}
                        <button 
                            className="retry-btn"
                            onClick={() => setLoginFailure(false)}
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            )}

            <main className="login-container">
                <div className={`login-glass-card ${shake ? 'shake-me' : ''}`}>
                    
                    {/* Branding Banner / Features Section */}
                    <div className={`branding-banner ${showFeatures ? 'mobile-visible' : ''}`}>
                        <div className="banner-content">
                            {/* Close button for mobile feature view */}
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

                    <div className="login-form-area">
                        <div className="form-header">
                            <h3>Masuk Petugas</h3>
                            <p>Gunakan akun resmi untuk mengakses data alumni.</p>
                        </div>

                        <form className="login-form-box" onSubmit={handleLogin}>
                            {error && <div className="alert-error">{error}</div>}

                            <div className="form-item">
                                <label htmlFor="username">Username / NIP</label>
                                <div className="input-wrap">
                                    <span className="icon-l">
                                        <User size={20} />
                                    </span>
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-item">
                                <label htmlFor="password">Password Akun</label>
                                <div className="input-wrap">
                                    <span className="icon-l">
                                        <Lock size={20} />
                                    </span>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-view"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-options">
                                <Link href="/forgot-password" title="Lupa password?" className="forgot-link">
                                    Lupa Password?
                                </Link>
                            </div>

                            <button type="submit" className="login-action-btn" disabled={loading}>
                                {loading ? (
                                    <span className="animate-spin">◌</span>
                                ) : (
                                    <>
                                        Masuk Sekarang <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            <div className="login-divider">
                                <span>ATAU</span>
                            </div>

                            <button type="button" className="google-action-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Akun Madrasah
                            </button>

                            <div className="help-section">
                                <p>Butuh bantuan login? <Link href="/contact-it">Hubungi Admin IT</Link></p>
                            </div>

                            <div className="register-refer">
                                <p>Belum punya akun? <Link href="/register">Daftar Petugas</Link></p>
                            </div>

                            <div className="agreement-text">
                                <p>Dengan masuk, saya menyetujui <Link href="/terms">Syarat & Ketentuan</Link> serta <Link href="/privacy">Kebijakan Privasi SAADA</Link></p>
                            </div>
                        </form>

                        {/* Floating Mobile Trigger */}
                        <div className="mobile-feature-trigger">
                            <button type="button" onClick={() => setShowFeatures(true)}>
                                Lihat Fitur SAADA <ArrowRight size={16} />
                            </button>
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
