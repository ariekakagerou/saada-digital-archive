"use client";

import React, { useState, useEffect } from "react";
import { 
    ArrowLeft, 
    Scale, 
    ShieldCheck, 
    BookOpen, 
    Lock, 
    AlertCircle, 
    FileText,
    ChevronRight,
    ExternalLink,
    Printer,
    ArrowUp
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TermsPage() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setScrolled(scrolled);
            setShowBackToTop(winScroll > 400);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const sections = [
        { id: "pengantar", title: "1. Pengantar", icon: <BookOpen size={18} /> },
        { id: "akses", title: "2. Hak Akses & Keamanan", icon: <Lock size={18} /> },
        { id: "data", title: "3. Pengolahan Data Alumni", icon: <ShieldCheck size={18} /> },
        { id: "tanggungjawab", title: "4. Batasan Tanggung Jawab", icon: <AlertCircle size={18} /> },
        { id: "perubahan", title: "5. Perubahan Ketentuan", icon: <FileText size={18} /> },
    ];

    const isActive = (path: string) => pathname === path;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="legal-wrapper">
            {/* Progress Bar */}
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${scrolled}%` }}></div>
            </div>

            {/* Background Elements */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
            <div className="bg-blur"></div>

            <div className="legal-container">
                {/* Header Section */}
                <header className="legal-header">
                    <Link href="/login" className="glass-back-btn">
                        <ArrowLeft size={18} />
                        <span>Kembali ke Login</span>
                    </Link>
                    
                    <div className="header-actions">
                        <button className="icon-btn" onClick={() => window.print()} title="Cetak Dokumen">
                            <Printer size={20} />
                        </button>
                    </div>
                </header>

                {/* Mobile Tab Navigation */}
                <nav className="mobile-tabs">
                    <Link href="/terms" className={`tab-item ${isActive('/terms') ? 'active' : ''}`}>
                        Syarat & Ketentuan
                    </Link>
                    <Link href="/privacy" className={`tab-item ${isActive('/privacy') ? 'active' : ''}`}>
                        Kebijakan Privasi
                    </Link>
                </nav>

                <main className="legal-content">
                    {/* Sidebar / Navigation (Desktop Only) */}
                    <aside className="legal-sidebar">
                        <div className="sidebar-sticky">
                            <div className="legal-nav-group">
                                <p className="nav-label">Dokumen Hukum</p>
                                <Link 
                                    href="/terms" 
                                    className={`nav-item ${isActive('/terms') ? 'active' : ''}`}
                                >
                                    <Scale size={18} />
                                    <span>Syarat & Ketentuan</span>
                                    {isActive('/terms') && <div className="active-dot" />}
                                </Link>
                                <Link 
                                    href="/privacy" 
                                    className={`nav-item ${isActive('/privacy') ? 'active' : ''}`}
                                >
                                    <ShieldCheck size={18} />
                                    <span>Kebijakan Privasi</span>
                                    {isActive('/privacy') && <div className="active-dot" />}
                                </Link>
                            </div>

                            <div className="legal-nav-group mt-8">
                                <p className="nav-label">Navigasi Halaman</p>
                                {sections.map((section) => (
                                    <a 
                                        key={section.id} 
                                        href={`#${section.id}`} 
                                        className="nav-sub-item"
                                    >
                                        <span className="dot" />
                                        <span>{section.title}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Document Card */}
                    <div className="document-card animate-slide-up">
                        <div className="doc-header">
                            <div className="doc-icon-wrapper">
                                <Scale size={32} className="doc-icon" />
                            </div>
                            <div className="doc-title-meta">
                                <h1>Syarat & Ketentuan Penggunaan</h1>
                                <div className="meta-badges">
                                    <span className="badge version">v1.2</span>
                                    <span className="badge date">21 April 2024</span>
                                    <span className="badge status">Resmi</span>
                                </div>
                            </div>
                        </div>

                        <div className="doc-body">
                            <section id="pengantar" className="doc-section">
                                <div className="section-header">
                                    <BookOpen className="section-icon" />
                                    <h2>1. Pengantar</h2>
                                </div>
                                <div className="section-content">
                                    <p>
                                        Selamat datang di <strong>SAADA (Sistem Arsip Alumni Digital Assa'adah)</strong>. 
                                        Dengan mengakses dan menggunakan aplikasi ini, Anda secara otomatis menyatakan telah membaca, 
                                        memahami, dan setuju untuk terikat oleh syarat dan ketentuan yang tercantum di sini.
                                    </p>
                                    <p>
                                        Aplikasi ini merupakan platform internal yang dikelola oleh <strong>MTs Assadah Sukaraja Bogor</strong> 
                                        yang ditujukan khusus untuk digitalisasi, penyimpanan, dan pengelolaan arsip alumni secara profesional.
                                    </p>
                                </div>
                            </section>

                            <section id="akses" className="doc-section">
                                <div className="section-header">
                                    <Lock className="section-icon" />
                                    <h2>2. Hak Akses & Keamanan</h2>
                                </div>
                                <div className="section-content">
                                    <p>
                                        Akses ke sistem SAADA bersifat terbatas dan hanya diberikan kepada staf resmi yang terdaftar:
                                    </p>
                                    <div className="role-grid">
                                        <div className="role-card">
                                            <strong>Petugas Admin</strong>
                                            <p>Kontrol penuh sistem & manajemen pengguna.</p>
                                        </div>
                                        <div className="role-card">
                                            <strong>Penulis</strong>
                                            <p>Wewenang input & edit data alumni.</p>
                                        </div>
                                        <div className="role-card">
                                            <strong>Operator</strong>
                                            <p>Pencarian & verifikasi data alumni.</p>
                                        </div>
                                    </div>
                                    <div className="alert-box warning">
                                        <AlertCircle size={20} className="shrink-0" />
                                        <p>Anda bertanggung jawab penuh atas kerahasiaan kredensial login Anda. Segala penyalahgunaan akun merupakan tanggung jawab pemegang akun.</p>
                                    </div>
                                </div>
                            </section>

                            <section id="data" className="doc-section">
                                <div className="section-header">
                                    <ShieldCheck className="section-icon" />
                                    <h2>3. Pengolahan Data Alumni</h2>
                                </div>
                                <div className="section-content">
                                    <p>
                                        Semua dokumen yang diunggah ke dalam sistem, termasuk namun tidak terbatas pada 
                                        <strong> Ijazah, SKL (Surat Keterangan Lulus), Legger Kelas, dan Transkrip Nilai</strong>, dikategorikan sebagai Data Sensitif.
                                    </p>
                                    <ul className="custom-list">
                                        <li>Dilarang keras menyebarluaskan data alumni kepada pihak ketiga tanpa izin tertulis.</li>
                                        <li>Penggunaan data hanya diperbolehkan untuk kepentingan kedinasan dan administrasi sekolah.</li>
                                        <li>Penyalahgunaan data dapat berujung pada sanksi administratif atau hukum sesuai <strong>UU ITE</strong> yang berlaku.</li>
                                    </ul>
                                </div>
                            </section>

                            <section id="tanggungjawab" className="doc-section">
                                <div className="section-header">
                                    <AlertCircle className="section-icon" />
                                    <h2>4. Batasan Tanggung Jawab</h2>
                                </div>
                                <div className="section-content">
                                    <p>
                                        Meskipun kami berupaya menjaga ketersediaan sistem 24/7, MTs Assa'adah tidak bertanggung jawab atas:
                                    </p>
                                    <ul className="custom-list">
                                        <li>Kerugian akibat gangguan teknis mendadak atau Force Majeure.</li>
                                        <li>Kesalahan interpretasi data hasil OCR (Optical Character Recognition) yang belum diverifikasi manual.</li>
                                    </ul>
                                    <div className="alert-box info">
                                        <ExternalLink size={20} className="shrink-0" />
                                        <p>Setiap data hasil scan harus melalui tahap <strong>Verifikasi Manual</strong> oleh petugas sebelum dianggap valid.</p>
                                    </div>
                                </div>
                            </section>

                            <section id="perubahan" className="doc-section">
                                <div className="section-header">
                                    <FileText className="section-icon" />
                                    <h2>5. Perubahan Ketentuan</h2>
                                </div>
                                <div className="section-content">
                                    <p>
                                        MTs Assa'adah berhak untuk memperbarui syarat dan ketentuan ini sewaktu-waktu guna mengikuti perkembangan teknologi dan regulasi hukum. 
                                        Perubahan signifikan akan diinformasikan melalui dashboard sistem atau pengumuman resmi.
                                    </p>
                                </div>
                            </section>
                        </div>

                        <footer className="doc-footer">
                            <p>© 2024 MTs Assa'adah Sukaraja Bogor • Alumni Smart Archive (SAADA)</p>
                            <div className="footer-links">
                                <Link href="/contact-it">Hubungi IT Support</Link>
                                <span className="dot-separator">•</span>
                                <Link href="/privacy">Kebijakan Privasi</Link>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>

            {/* Back to Top */}
            <button 
                className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
                onClick={scrollToTop}
            >
                <ArrowUp size={20} />
            </button>

            <style jsx>{`
                .legal-wrapper {
                    min-height: 100vh;
                    background: #022c22;
                    color: #f8fafc;
                    font-family: 'Inter', system-ui, sans-serif;
                    position: relative;
                    overflow-x: hidden;
                    padding-bottom: 4rem;
                }

                /* Progress Bar */
                .progress-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    z-index: 1000;
                }
                .progress-bar {
                    height: 100%;
                    background: #10b981;
                    transition: width 0.1s;
                }

                /* Background Effects */
                .bg-blob {
                    position: fixed;
                    width: 50vw;
                    height: 50vw;
                    border-radius: 50%;
                    filter: blur(80px);
                    z-index: 0;
                    opacity: 0.15;
                    pointer-events: none;
                }
                .blob-1 { background: #059669; top: -10%; right: -10%; }
                .blob-2 { background: #047857; bottom: -10%; left: -10%; }
                .bg-blur {
                    position: fixed;
                    inset: 0;
                    backdrop-filter: blur(20px);
                    z-index: 0;
                    pointer-events: none;
                }

                .legal-container {
                    position: relative;
                    z-index: 10;
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .legal-header {
                    padding: 2rem 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .glass-back-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.85rem 1.5rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1.5px solid rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(12px);
                    border-radius: 100px;
                    color: #ffffff;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 1.05rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .glass-back-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateX(-5px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
                }

                .icon-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .icon-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                    transform: scale(1.05);
                }

                /* Mobile Tabs */
                .mobile-tabs {
                    display: none;
                    margin-bottom: 2rem;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 4px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .tab-item {
                    flex: 1;
                    text-align: center;
                    padding: 1rem;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 700;
                    color: #ffffff;
                    opacity: 0.7;
                    transition: all 0.3s;
                }

                .tab-item.active {
                    background: #10b981;
                    color: white;
                    opacity: 1;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }

                .legal-content {
                    display: grid;
                    grid-template-columns: 240px 1fr;
                    gap: 3rem;
                    align-items: flex-start;
                }

                /* Sidebar */
                .legal-sidebar {
                    position: sticky;
                    top: 3rem;
                }

                .sidebar-sticky { display: flex; flex-direction: column; gap: 2rem; }
                .nav-label {
                    font-size: 0.95rem;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    color: #ffffff;
                    margin-bottom: 1.25rem;
                    font-weight: 900;
                    opacity: 0.9;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.25rem;
                    border-radius: 12px;
                    color: #ffffff;
                    transition: all 0.2s;
                    font-weight: 700;
                    font-size: 1.1rem;
                    position: relative;
                    background: rgba(255, 255, 255, 0.03);
                    margin-bottom: 0.5rem;
                }

                .nav-item:hover { 
                    color: #ffffff; 
                    background: rgba(255, 255, 255, 0.1); 
                    transform: translateX(4px);
                }

                .nav-item.active {
                    color: #ffffff;
                    background: #10b981;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }

                .active-dot {
                    width: 8px;
                    height: 8px;
                    background: #ffffff;
                    border-radius: 50%;
                    margin-left: auto;
                }

                .nav-sub-item {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    padding: 0.75rem 1.25rem;
                    color: #e2e8f0;
                    font-size: 1.05rem;
                    transition: all 0.2s;
                    font-weight: 500;
                }

                .nav-sub-item:hover { 
                    color: #ffffff; 
                    transform: translateX(4px);
                }

                .dot { 
                    width: 6px; 
                    height: 6px; 
                    background: rgba(255, 255, 255, 0.3); 
                    border-radius: 50%; 
                }
                .nav-sub-item:hover .dot { 
                    background: #10b981; 
                    transform: scale(2); 
                }

                /* Document Card */
                .document-card {
                    background: white;
                    border-radius: 24px;
                    padding: 4rem;
                    color: #1e293b;
                    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.6);
                    border: 1px solid #f1f5f9;
                }

                .doc-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 1.5rem;
                    margin-bottom: 4rem;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid #f1f5f9;
                }

                .doc-icon-wrapper {
                    width: 64px;
                    height: 64px;
                    background: #f0fdf4;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #059669;
                    flex-shrink: 0;
                }

                .doc-title-meta h1 {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 0.75rem;
                }

                .meta-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }
                .badge {
                    padding: 0.25rem 0.75rem;
                    border-radius: 100px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .badge.version { background: #f1f5f9; color: #64748b; }
                .badge.date { background: #ecfdf5; color: #059669; }
                .badge.status { background: #10b981; color: white; }

                .doc-body { display: flex; flex-direction: column; gap: 4rem; }
                .section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
                .section-icon { color: #10b981; opacity: 0.5; }
                .section-header h2 { font-size: 1.5rem; font-weight: 700; color: #0f172a; }

                .section-content p { line-height: 1.8; color: #475569; font-size: 1.05rem; margin-bottom: 1.5rem; }

                /* Role Grid */
                .role-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    margin: 2rem 0;
                }
                .role-card {
                    background: #f8fafc;
                    padding: 1.25rem;
                    border-radius: 16px;
                    border: 1px solid #f1f5f9;
                }
                .role-card strong { display: block; color: #0f172a; margin-bottom: 0.25rem; font-size: 0.95rem; }
                .role-card p { font-size: 0.8rem; color: #64748b; margin: 0; line-height: 1.4; }

                .custom-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
                .custom-list li { position: relative; padding-left: 1.75rem; color: #475569; line-height: 1.7; }
                .custom-list li::before {
                    content: ""; position: absolute; left: 0; top: 0.6em;
                    width: 8px; height: 8px; background: #10b981; border-radius: 2px;
                }

                .alert-box {
                    display: flex; gap: 1rem; padding: 1.5rem; border-radius: 16px; align-items: center; margin: 2rem 0;
                }
                .alert-box.warning { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; }
                .alert-box.info { background: #f0fdfa; border: 1px solid #ccfbf1; color: #0f766e; }
                .alert-box p { margin: 0; font-size: 0.95rem; font-weight: 500; line-height: 1.6; }

                .doc-footer { margin-top: 6rem; padding-top: 3rem; border-top: 1px solid #f1f5f9; text-align: center; }
                .doc-footer p { color: #94a3b8; font-size: 0.85rem; margin-bottom: 1rem; }
                .footer-links { display: flex; justify-content: center; gap: 1rem; align-items: center; }
                .footer-links a { color: #10b981; font-weight: 600; font-size: 0.9rem; }
                .dot-separator { color: #cbd5e1; }

                /* Back to Top */
                .back-to-top {
                    position: fixed; bottom: 2rem; right: 2rem;
                    width: 48px; height: 48px; background: #10b981; color: white;
                    border: none; border-radius: 50%; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    opacity: 0; transform: translateY(20px); transition: all 0.3s;
                    z-index: 100; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
                }
                .back-to-top.visible { opacity: 1; transform: translateY(0); }
                .back-to-top:hover { background: #059669; transform: scale(1.1); }

                /* Animations */
                .animate-slide-up {
                    animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .shrink-0 { flex-shrink: 0; }
                .mt-8 { margin-top: 2rem; }

                @media (max-width: 1024px) {
                    .legal-content { grid-template-columns: 1fr; }
                    .legal-sidebar { display: none; }
                    .mobile-tabs { display: flex; }
                    .document-card { padding: 3rem; }
                    .role-grid { grid-template-columns: 1fr; }
                }

                @media (max-width: 640px) {
                    .document-card { padding: 1.5rem; border-radius: 20px; }
                    .doc-header { flex-direction: column; gap: 1rem; }
                    .doc-title-meta h1 { font-size: 1.5rem; }
                    .section-header h2 { font-size: 1.25rem; }
                    .legal-header { padding: 1rem 0; }
                    .glass-back-btn span { display: none; }
                    .glass-back-btn { padding: 0.75rem; border-radius: 50%; }
                }

                @media print {
                    .legal-wrapper { background: white; padding: 0; }
                    .bg-blob, .bg-blur, .legal-header, .mobile-tabs, .legal-sidebar, .back-to-top, .progress-container { display: none !important; }
                    .legal-container { max-width: 100%; padding: 0; }
                    .document-card { box-shadow: none; border: none; padding: 0; }
                }
            `}</style>
        </div>
    );
}


