"use client";

import { useState } from "react";
import { User, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Mail, Briefcase, Sparkles, Book, FileText, ClipboardList, BarChart3, Search, Shield, Zap, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./register.css";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nama: "",
        nip: "",
        email: "",
        role: "Operator",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState(false);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Katasandi dan Konfirmasi Katasandi tidak sama.");
            setLoading(false);
            return;
        }

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setRegisterSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Gagal menghubungi server pendaftaran.");
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

            {/* Success Overlay */}
            {registerSuccess && (
                <div className="success-overlay">
                    <div className="success-popup scale-in">
                        <div className="success-icon" style={{ background: '#10b981' }}><ShieldCheck size={40} /></div>
                        <h2>Pendaftaran Berhasil</h2>
                        <p>Akun Anda sedang diproses. Mengalihkan ke halaman login...</p>
                    </div>
                </div>
            )}

            <main className="login-container" style={{ maxWidth: '1140px' }}>
                <div className="login-glass-card">
                    
                    {/* Branding Banner */}
                    <div className={`branding-banner reg-variant ${showFeatures ? 'mobile-visible' : ''}`}>
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

                    <div className="reg-form-area">
                        <div className="form-header" style={{ marginBottom: '2.5rem' }}>
                            <h3>Daftar Baru</h3>
                            <p>Lengkapi formulir untuk mendaftarkan akun petugas.</p>
                        </div>

                        <form className="login-form-box" onSubmit={handleRegister}>
                            {error && <div className="alert-error" style={{ background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '14px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid #fee2e2' }}>{error}</div>}

                            <div className="form-grid-2">
                                <div className="form-item">
                                    <label>Nama Lengkap</label>
                                    <div className="input-wrap">
                                        <span className="icon-l"><User size={20} /></span>
                                        <input type="text" name="nama" placeholder="Ahmad Fikri" value={formData.nama} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-item">
                                    <label>NIP / ID Petugas</label>
                                    <div className="input-wrap">
                                        <span className="icon-l"><Briefcase size={20} /></span>
                                        <input type="text" name="nip" placeholder="19820..." value={formData.nip} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-grid-2">
                                <div className="form-item">
                                    <label>Email Madrasah</label>
                                    <div className="input-wrap">
                                        <span className="icon-l"><Mail size={20} /></span>
                                        <input type="email" name="email" placeholder="staff@mts.sch.id" value={formData.email} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-item">
                                    <label>Peran Petugas</label>
                                    <div className="select-wrap">
                                        <span className="icon-l"><Shield size={20} /></span>
                                        <select name="role" value={formData.role} onChange={handleChange}>
                                            <option value="Operator">Operator</option>
                                            <option value="Penulis">Penulis</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-grid-2">
                                <div className="form-item">
                                    <label>Password</label>
                                    <div className="input-wrap">
                                        <span className="icon-l"><Lock size={20} /></span>
                                        <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-item">
                                    <label>Konfirmasi</label>
                                    <div className="input-wrap">
                                        <span className="icon-l"><Lock size={20} /></span>
                                        <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
                                        <button type="button" className="toggle-view" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="login-action-btn" style={{ marginTop: '1rem' }} disabled={loading}>
                                {loading ? (
                                    <span className="animate-spin">◌</span>
                                ) : (
                                    <>
                                        Daftar Sekarang <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            <div className="register-refer" style={{ textAlign: 'center' }}>
                                <p>Sudah punya akun? <Link href="/login">Masuk Kembali</Link></p>
                            </div>

                            <div className="agreement-text">
                                <p>Dengan mendaftar, Anda menyetujui <Link href="/terms">Syarat & Ketentuan</Link> serta <Link href="/privacy">Kebijakan Privasi SAADA</Link></p>
                            </div>
                        </form>

                        {/* Floating Mobile Trigger */}
                        <div className="mobile-feature-trigger">
                            <button type="button" onClick={() => setShowFeatures(true)}>
                                Lihat Manfaat SAADA <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="login-footer-info" style={{ color: '#cbd5e1' }}>
                        <p>© 2026 SAADA • Registration Gate</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
