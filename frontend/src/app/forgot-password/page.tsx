"use client";

import { useState } from "react";
import { ArrowLeft, Mail, ShieldCheck, Key, ArrowRight, Book, FileText, ClipboardList, BarChart3, Search, Shield, Zap, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../login/login.css";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
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

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSuccess(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-light-wrapper" suppressHydrationWarning={true}>
            
            {/* Ambient Background */}
            <div className="ambient-bg">
                <div className="circle-bg bg-1"></div>
                <div className="circle-bg bg-2"></div>
            </div>

            {/* Success Overlay */}
            {success && (
                <div className="success-overlay">
                    <div className="success-popup scale-in">
                        <div className="success-icon" style={{ background: '#3b82f6' }}><Key size={40} /></div>
                        <h2>Email Terkirim</h2>
                        <p>Tautan pemulihan katasandi telah dikirim ke: <strong>{email}</strong></p>
                        <Link href="/login" className="login-action-btn" style={{ marginTop: '1.5rem', textDecoration: 'none' }}>
                            Kembali ke Menu Login
                        </Link>
                    </div>
                </div>
            )}

            <main className="login-container">
                <div className="login-glass-card">
                    
                    {/* Branding Banner */}
                    <div className={`branding-banner ${showFeatures ? 'mobile-visible' : ''}`}>
                        <div className="banner-content">
                            <button className="mobile-close-btn" onClick={() => setShowFeatures(false)}>×</button>
                            <div className="logo-box">
                                <img src="/logo-assaadah.jpg" alt="Logo" />
                            </div>
                            <div className="brand-text">
                                <h2>SAADA</h2>
                                <p>Pemulihan Akses Akun</p>
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
                            <Link href="/login" className="back-link-small" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1B5E20', fontWeight: '800', fontSize: '0.85rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
                                <ArrowLeft size={16} /> Kembali
                            </Link>
                            <h3>Lupa Katasandi?</h3>
                            <p>Masukkan email terdaftar Anda untuk menerima tautan pemulihan.</p>
                        </div>

                        <form className="login-form-box" onSubmit={handleResetRequest}>
                            <div className="form-item">
                                <label htmlFor="email">Email Terdaftar</label>
                                <div className="input-wrap">
                                    <span className="icon-l">
                                        <Mail size={20} />
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="contoh@mts.sch.id"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="login-action-btn" style={{ marginTop: '1rem' }} disabled={loading}>
                                {loading ? (
                                    <span className="animate-spin">◌</span>
                                ) : (
                                    <>
                                        Kirim Tautan Pemulihan <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            <div className="help-section" style={{ textAlign: 'center' }}>
                                <p>Masih mengalami kendala? <Link href="/contact-it">Hubungi Admin IT</Link></p>
                            </div>
                        </form>

                        {/* Floating Mobile Trigger */}
                        <div className="mobile-feature-trigger">
                            <button type="button" onClick={() => setShowFeatures(true)}>
                                Keamanan Data SAADA <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="login-footer-info">
                        <p>© 2026 SAADA • Account Recovery</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
