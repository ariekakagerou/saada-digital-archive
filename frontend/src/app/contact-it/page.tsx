"use client";

import { useState } from "react";
import { ArrowLeft, Mail, Phone, MessageSquare, Globe, ArrowRight, Book, FileText, ClipboardList, BarChart3, Search, Shield, Zap, Sparkles, Headphones } from "lucide-react";
import Link from "next/link";
import "../login/login.css";

export default function ContactITPage() {
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

    const contactMethods = [
        { 
            icon: <MessageSquare size={24} />, 
            title: "WhatsApp Support", 
            value: "+62 812-3456-7890", 
            link: "https://wa.me/6281234567890",
            color: "#25D366" 
        },
        { 
            icon: <Mail size={24} />, 
            title: "Email Helpdesk", 
            value: "it.support@mtsassaadah.sch.id", 
            link: "mailto:it.support@mtsassaadah.sch.id",
            color: "#EA4335" 
        },
        { 
            icon: <Headphones size={24} />, 
            title: "Internal Portal", 
            value: "helpdesk.mtsassaadah.sch.id", 
            link: "#",
            color: "#065f46" 
        }
    ];

    return (
        <div className="login-light-wrapper" suppressHydrationWarning={true}>
            
            <div className="ambient-bg">
                <div className="circle-bg bg-1"></div>
                <div className="circle-bg bg-2"></div>
            </div>

            <main className="login-container">
                <div className="login-glass-card">
                    
                    <div className={`branding-banner ${showFeatures ? 'mobile-visible' : ''}`}>
                        <div className="banner-content">
                            <button className="mobile-close-btn" onClick={() => setShowFeatures(false)}>×</button>
                            <div className="logo-box">
                                <img src="/logo-assaadah.jpg" alt="Logo" />
                            </div>
                            <div className="brand-text">
                                <h2>SUPPORT</h2>
                                <p>Pusat Bantuan IT SAADA</p>
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
                                <ArrowLeft size={16} /> Kembali ke Login
                            </Link>
                            <h3>Hubungi Admin IT</h3>
                            <p>Silakan hubungi tim teknis kami untuk kendala akses atau teknis lainnya.</p>
                        </div>

                        <div className="contact-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {contactMethods.map((method, idx) => (
                                <a 
                                    key={idx} 
                                    href={method.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="contact-card"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.25rem',
                                        padding: '1.25rem',
                                        background: '#f9fafb',
                                        borderRadius: '20px',
                                        border: '1px solid #f1f5f9',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ 
                                        width: '48px', 
                                        height: '48px', 
                                        borderRadius: '14px', 
                                        background: 'white', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        color: method.color,
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                                    }}>
                                        {method.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{method.title}</h4>
                                        <p style={{ margin: '2px 0 0 0', fontSize: '1rem', color: '#1e293b', fontWeight: '800' }}>{method.value}</p>
                                    </div>
                                    <ArrowRight size={18} color="#cbd5e1" />
                                </a>
                            ))}
                        </div>

                        <div className="info-box" style={{ marginTop: '2rem', padding: '1.25rem', background: '#ecfdf5', borderRadius: '18px', border: '1px solid #d1fae5' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#065f46', fontWeight: '600', lineHeight: '1.6' }}>
                                <strong>Jam Operasional Helpdesk:</strong><br />
                                Senin - Jumat: 07:30 - 15:30 WIB<br />
                                Sabtu: 07:30 - 12:30 WIB
                            </p>
                        </div>

                        {/* Floating Mobile Trigger */}
                        <div className="mobile-feature-trigger">
                            <button type="button" onClick={() => setShowFeatures(true)}>
                                Layanan Bantuan IT <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="login-footer-info">
                        <p>© 2026 SAADA • IT Support Team</p>
                    </div>
                </div>
            </main>

            <style jsx>{`
                .contact-card:hover {
                    background: #f1f5f9 !important;
                    transform: translateY(-2px);
                    border-color: #e2e8f0 !important;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                }
                .contact-card:hover :global(svg[color="#cbd5e1"]) {
                    color: #065f46 !important;
                }
            `}</style>
        </div>
    );
}
