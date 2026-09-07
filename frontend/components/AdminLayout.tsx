"use client";

import React from "react";
import Sidebar from "./Sidebar"; // Same directory
import Link from "next/link";
import { Users, LayoutDashboard, Upload, Camera, Search, Settings, LogOut, Bell, FolderOpen, History, BookOpen, GraduationCap, Hash, BarChart2, FileText, ChevronRight, ChevronDown, ClipboardList } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import PullToRefresh from "./PullToRefresh";
import ChatbotBubble from "./ChatbotBubble";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = React.useState(false);
    const [user, setUser] = React.useState<{ fullName: string, role: string, email?: string } | null>(null);
    const [showScanMenu, setShowScanMenu] = React.useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
    const [isNotifOpen, setIsNotifOpen] = React.useState(false);
    const [notifCount, setNotifCount] = React.useState(5);
    const userMenuRef = React.useRef<HTMLDivElement>(null);
    const notifMenuRef = React.useRef<HTMLDivElement>(null);

    // Dummy Notifications Data
    const notifications = [
        { id: 1, title: "Arsip Baru Diunggah", desc: "Operator baru saja mengunggah Ijazah Alumni 2024", time: "2 menit yang lalu", type: "info" },
        { id: 2, title: "Permohonan Legalisir", desc: "Ahmad Faisal mengajukan legalisir ijazah", time: "15 menit yang lalu", type: "warning" },
        { id: 3, title: "Sistem Update", desc: "Versi 2.1.0 baru saja diterapkan", time: "1 jam yang lalu", type: "success" },
        { id: 4, title: "Tracer Study", desc: "5 alumni baru mengisi kuisioner hari ini", time: "3 jam yang lalu", type: "info" },
        { id: 5, title: "Keamanan Akun", desc: "Login baru terdeteksi dari perangkat lain", time: "5 jam yang lalu", type: "danger" },
    ];

    // Close dropdowns when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    React.useEffect(() => {
        setIsMounted(true);
        const checkUser = () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Invalid user data", e);
                    router.push("/login");
                }
            } else {
                router.push("/login");
            }
        };

        checkUser();

        // --- IDLE TIMER LOGIC (8 Hours, synced with JWT token) ---
        let idleTimer: NodeJS.Timeout;
        const TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 Jam (28.800.000 ms)

        const resetTimer = () => {
            if (idleTimer) clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                handleLogout();
            }, TIMEOUT_MS);
        };

        const handleLogout = () => {
            localStorage.removeItem("user");
            document.cookie = "saada_token=; path=/; max-age=0; SameSite=Strict";
            router.push("/login");
        };

        // Events to listen for activity
        const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

        // Start initial timer
        resetTimer();

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        return () => {
            if (idleTimer) clearTimeout(idleTimer);
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [router]);

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

    const handleNotifClick = (e: React.MouseEvent) => {
        // Kurangi notifikasi jika masih ada
        if (notifCount > 0) {
            setNotifCount(prev => prev - 1);
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case "Operator": return "Operator";
            case "Penulis": return "Penulis";
            case "Admin": return "Admin";
            case "AdminSuper": return "Super Admin";
            case "Alumni": return "Alumni";
            default: return "Staff";
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-main)" }} suppressHydrationWarning>

            {/* 1. Top Navigation Bar (Fixed) - Solid Green per Mockup */}
            <header style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: "64px",
                background: "#065f46",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 1rem",
                zIndex: 50,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                color: "white"
            }}>
                {/* Logo & Title */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }} suppressHydrationWarning>
                    <div style={{
                        background: "white",
                        padding: "3px",
                        borderRadius: "10px",
                        display: "flex",
                        flexShrink: 0,
                        width: "44px",
                        height: "44px",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                    }} suppressHydrationWarning>
                        <img src="/logo-assaadah.jpg" alt="Logo Assa'adah" style={{ width: "90%", height: "90%", objectFit: "contain" }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: "1rem", fontWeight: "800", lineHeight: "1.2", margin: 0, letterSpacing: "-0.3px" }}>SAADA (Sistem Arsip Alumni Digital Assa'adah)</h1>
                        <p style={{ fontSize: "0.72rem", opacity: 0.85, margin: 0, fontWeight: "500", letterSpacing: "0.2px" }}>MTs Assa'adah Sukabumi - Bogor</p>
                    </div>
                </div>

                {/* Right Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }} suppressHydrationWarning>

                    {/* Notification with Badge */}
                    <div style={{ position: "relative" }} ref={notifMenuRef} suppressHydrationWarning>
                        <button 
                            className="header-icon-btn" 
                            onClick={() => {
                                setIsNotifOpen(!isNotifOpen);
                                setIsUserMenuOpen(false);
                                if (!isNotifOpen) setNotifCount(0); // Reset saat dibuka
                            }}
                        >
                            <Bell size={20} color="#ffffff" strokeWidth={2} />
                            {notifCount > 0 && (
                                <span className="notification-badge">{notifCount}</span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {isNotifOpen && (
                            <div className="notif-dropdown-card">
                                <div className="dropdown-header">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                        <strong>Notifikasi Terbaru</strong>
                                        <Link href="/notifications" onClick={() => setIsNotifOpen(false)} style={{ fontSize: "0.7rem", color: "#065f46", textDecoration: "none" }}>Lihat Semua</Link>
                                    </div>
                                </div>
                                <div className="dropdown-divider" />
                                <div className="notif-list">
                                    {notifications.map((n) => (
                                        <div key={n.id} className="notif-item">
                                            <div className={`notif-indicator ${n.type}`} />
                                            <div className="notif-content">
                                                <div className="notif-title">{n.title}</div>
                                                <div className="notif-desc">{n.desc}</div>
                                                <div className="notif-time">{n.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile Dropdown */}
                    <div style={{ position: "relative" }} ref={userMenuRef} suppressHydrationWarning>
                        <button 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="header-profile-pill"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                background: "rgba(255,255,255,0.12)",
                                padding: "5px 10px 5px 12px",
                                borderRadius: "14px",
                                border: "1px solid rgba(255,255,255,0.2)",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                outline: "none"
                            }}
                        >
                            <div style={{ textAlign: "right" }} className="hidden-mobile" suppressHydrationWarning>
                                <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "white", lineHeight: "1.1" }} suppressHydrationWarning>
                                    {isMounted ? (user?.fullName || "Staff") : "..."}
                                </div>
                                <div style={{ 
                                    fontSize: "0.62rem", 
                                    color: "#fcd34d", 
                                    fontWeight: "900", 
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    marginTop: "2px"
                                }} suppressHydrationWarning>
                                    {isMounted ? getRoleLabel(user?.role || "") : "Admin"}
                                </div>
                            </div>
                            
                            <div style={{ 
                                background: "white", 
                                color: "#065f46", 
                                width: "34px", 
                                height: "34px", 
                                borderRadius: "10px", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                fontWeight: "900",
                                fontSize: "0.9rem",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                            }} suppressHydrationWarning>
                                {isMounted ? (user?.fullName?.charAt(0) || "S") : "S"}
                            </div>
                            
                            <ChevronDown size={14} color="white" style={{ 
                                transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease'
                            }} />
                        </button>

                        {/* Dropdown Menu */}
                        {isUserMenuOpen && (
                            <div className="user-dropdown-card">
                                <div className="dropdown-header" suppressHydrationWarning>
                                    <strong>{isMounted ? user?.fullName : "..."}</strong>
                                    <span>{isMounted ? (user?.email || "staff@saada.id") : "..."}</span>
                                </div>
                                <div className="dropdown-divider" />
                                <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="dropdown-item">
                                    <Users size={16} /> <span>Profil Saya</span>
                                </Link>
                                <Link href="/settings" onClick={() => setIsUserMenuOpen(false)} className="dropdown-item">
                                    <Settings size={16} /> <span>Pengaturan</span>
                                </Link>
                                <div className="dropdown-divider" />
                                <button 
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        localStorage.removeItem("user");
                                        router.push("/login");
                                    }} 
                                    className="dropdown-item logout-action"
                                >
                                    <LogOut size={16} /> <span>Keluar</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Sidebar Navigation (Hidden on Mobile via CSS) */}
            <div className="sidebar-container" suppressHydrationWarning>
                <Sidebar />
            </div>

            {/* Pull to Refresh Indicator */}
            <PullToRefresh />

            {/* Main Content */}
            <main className="admin-main">
                {children}
            </main>

            {/* Bottom Navigation (Visible on Mobile only via CSS) */}
            <div className="bottom-nav" suppressHydrationWarning>
                <Link href="/dashboard" className={`bottom-nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                    <LayoutDashboard size={24} />
                    <span>Beranda</span>
                </Link>

                {isMounted && user?.role === "Alumni" && (
                    <>
                        <Link href="/alumni/my-documents" className={`bottom-nav-item ${isActive('/alumni/my-documents') ? 'active' : ''}`}>
                            <GraduationCap size={24} />
                            <span>Dokumen</span>
                        </Link>
                        <Link href="/alumni/my-requests" className={`bottom-nav-item ${isActive('/alumni/my-requests') ? 'active' : ''}`}>
                            <ClipboardList size={24} />
                            <span>Legalisir</span>
                        </Link>
                    </>
                )}

                {isMounted && (user?.role === "Penulis" || user?.role === "Admin" || user?.role === "AdminSuper") && (
                    <Link href="/file-master" className={`bottom-nav-item ${isActive('/file-master') || isActive('/buku-induk') || pathname.includes('/dokumen-') ? 'active' : ''}`}>
                        <FolderOpen size={24} />
                        <span>File</span>
                    </Link>
                )}

                {isMounted && (user?.role === "Operator" || user?.role === "AdminSuper") && (
                    <div style={{ position: "relative", display: "flex", justifyContent: "center" }} className="bottom-nav-item" suppressHydrationWarning>
                        {/* Popup Menu (Mobile) */}
                        {showScanMenu && (
                            <>
                                {/* Overlay transparan untuk menutup menu saat diklik di luar */}
                                <div 
                                    style={{ position: "fixed", inset: 0, zIndex: 99 }} 
                                    onClick={() => setShowScanMenu(false)}
                                />
                                <div style={{
                                    position: "absolute",
                                    bottom: "100%", // Muncul di atas tombol kamera
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    marginBottom: "15px",
                                    background: "white",
                                    borderRadius: "16px",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                                    padding: "0.5rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.25rem",
                                    width: "180px",
                                    zIndex: 100,
                                    border: "1px solid #f1f5f9"
                                }}>
                                    <Link href="/upload" onClick={() => setShowScanMenu(false)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.75rem", color: "#374151", textDecoration: "none", borderRadius: "10px", fontWeight: "600", fontSize: "0.85rem", transition: "all 0.2s" }}>
                                        <div style={{ background: "#f0fdf4", padding: "6px", borderRadius: "8px", color: "#15803d", display: "flex" }}><Upload size={16} /></div>
                                        <span>Unggah Arsip</span>
                                    </Link>
                                    <Link href="/scan-camera" onClick={() => setShowScanMenu(false)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.75rem", color: "#374151", textDecoration: "none", borderRadius: "10px", fontWeight: "600", fontSize: "0.85rem", transition: "all 0.2s" }}>
                                        <div style={{ background: "#f0fdf4", padding: "6px", borderRadius: "8px", color: "#15803d", display: "flex" }}><Camera size={16} /></div>
                                        <span>Scan Kamera</span>
                                    </Link>
                                </div>
                            </>
                        )}

                        <button 
                            onClick={() => setShowScanMenu(!showScanMenu)}
                            style={{ 
                                marginTop: "-20px", 
                                background: "var(--header-bg)", 
                                padding: "12px", 
                                borderRadius: "50%", 
                                boxShadow: "0 4px 10px rgba(21, 128, 61, 0.4)",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "transform 0.2s ease",
                                transform: showScanMenu ? "scale(0.95)" : "scale(1)"
                            }} 
                        >
                            <Camera size={28} color="white" />
                        </button>
                    </div>
                )}

                {isMounted && (user?.role === "Admin" || user?.role === "AdminSuper") && (
                    <Link href="/history" className={`bottom-nav-item ${isActive('/history') ? 'active' : ''}`}>
                        <History size={24} />
                        <span>Riwayat</span>
                    </Link>
                )}

                <Link href="/settings" className={`bottom-nav-item ${isActive('/settings') ? 'active' : ''}`}>
                    <Settings size={24} />
                    <span>Pengaturan</span>
                </Link>
            </div>

            <style jsx global>{`
                @media (max-width: 768px) {
                    .hidden-mobile { display: none !important; }
                    
                    header {
                        padding: 0 0.85rem !important;
                        height: 60px !important;
                    }
                    
                    header h1 {
                        font-size: 0.875rem !important;
                    }
                    
                    header p {
                        font-size: 0.68rem !important;
                    }
                }

                .header-icon-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                    borderRadius: 12px;
                    transition: all 0.2s ease;
                    position: relative;
                }

                .header-icon-btn:hover {
                    background: rgba(255,255,255,0.25);
                    transform: translateY(-1px);
                }

                .notification-badge {
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    background: #ff3b30;
                    color: white;
                    font-size: 0.65rem;
                    font-weight: 900;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #065f46;
                    boxShadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .btn.header-btn-notification:hover,
                .btn.header-btn-profile:hover {
                    background: rgba(255,255,255,0.28) !important;
                    transform: translateY(-1px);
                }

                .btn.header-btn-logout:hover {
                    background: white !important;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.2) !important;
                    transform: translateY(-1px);
                }

                .header-profile-pill:hover {
                    background: rgba(255,255,255,0.2) !important;
                    border-color: rgba(255,255,255,0.4) !important;
                }

                .user-dropdown-card {
                    position: absolute;
                    top: calc(100% + 10px);
                    right: 0;
                    width: 220px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
                    padding: 0.5rem;
                    display: flex;
                    flex-direction: column;
                    z-index: 100;
                    border: 1px solid #f1f5f9;
                    animation: slideDown 0.2s ease-out;
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .dropdown-header {
                    padding: 0.75rem 1rem;
                    display: flex;
                    flex-direction: column;
                }

                .dropdown-header strong {
                    display: block;
                    font-size: 0.9rem;
                    color: #1e293b;
                }

                .dropdown-header span {
                    font-size: 0.75rem;
                    color: #64748b;
                }

                .dropdown-divider {
                    height: 1px;
                    background: #f1f5f9;
                    margin: 0.25rem 0;
                }

                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.7rem 1rem;
                    color: #475569;
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 500;
                    border-radius: 10px;
                    transition: all 0.2s;
                    border: none;
                    background: none;
                    width: 100%;
                    text-align: left;
                    cursor: pointer;
                }

                .dropdown-item:hover {
                    background: #f8fafc;
                    color: #065f46;
                }

                .dropdown-item.logout-action {
                    color: #ef4444;
                }

                .dropdown-item.logout-action:hover {
                    background: #fef2f2;
                    color: #dc2626;
                }

                /* Notification Dropdown Styles */
                .notif-dropdown-card {
                    position: absolute;
                    top: calc(100% + 10px);
                    right: 0;
                    width: 320px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
                    display: flex;
                    flex-direction: column;
                    z-index: 101;
                    border: 1px solid #f1f5f9;
                    animation: slideDown 0.2s ease-out;
                    overflow: hidden;
                }

                .notif-list {
                    max-height: 400px;
                    overflow-y: auto;
                    padding: 0.25rem;
                }

                .notif-item {
                    display: flex;
                    gap: 0.8rem;
                    padding: 1rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .notif-item:hover {
                    background: #f8fafc;
                }

                .notif-indicator {
                    width: 4px;
                    height: 40px;
                    border-radius: 4px;
                    flex-shrink: 0;
                }

                .notif-indicator.info { background: #3b82f6; }
                .notif-indicator.warning { background: #f59e0b; }
                .notif-indicator.success { background: #10b981; }
                .notif-indicator.danger { background: #ef4444; }

                .notif-content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.2rem;
                }

                .notif-title {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #1e293b;
                }

                .notif-desc {
                    font-size: 0.75rem;
                    color: #64748b;
                    line-height: 1.4;
                }

                .notif-time {
                    font-size: 0.65rem;
                    color: #94a3b8;
                    font-weight: 600;
                    margin-top: 2px;
                }
            `}</style>
            
            {/* Global Chatbot */}
            <ChatbotBubble />

        </div>
    );
}
