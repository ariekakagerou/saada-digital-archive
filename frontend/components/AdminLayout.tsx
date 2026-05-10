"use client";

import React from "react";
import Sidebar from "./Sidebar"; // Same directory
import Link from "next/link";
import { Users, LayoutDashboard, Upload, Camera, Search, Settings, LogOut, Bell, FolderOpen, History, BookOpen, GraduationCap, Hash, BarChart2, FileText, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import PullToRefresh from "./PullToRefresh";
import ChatbotBubble from "./ChatbotBubble";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = React.useState(false);
    const [user, setUser] = React.useState<{ fullName: string, role: string } | null>(null);
    const [showScanMenu, setShowScanMenu] = React.useState(false);

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

        // --- IDLE TIMER LOGIC (5 Minutes) ---
        let idleTimer: NodeJS.Timeout;
        const TIMEOUT_MS = 5 * 60 * 1000; // 5 Minutes

        const resetTimer = () => {
            if (idleTimer) clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                handleLogout();
            }, TIMEOUT_MS);
        };

        const handleLogout = () => {
            localStorage.removeItem("user");
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

    const getRoleLabel = (role: string) => {
        switch (role) {
            case "Operator": return "Operator";
            case "Penulis": return "Penulis";
            case "Admin": return "Admin";
            case "AdminSuper": return "Super Admin";
            default: return "Staff";
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-main)" }}>

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
                    <div suppressHydrationWarning>
                        <h1 style={{ fontSize: "1rem", fontWeight: "800", lineHeight: "1.2", margin: 0, letterSpacing: "-0.3px" }}>SAADA (Sistem Arsip Alumni Digital Assa'adah)</h1>
                        <p style={{ fontSize: "0.72rem", opacity: 0.85, margin: 0, fontWeight: "500", letterSpacing: "0.2px" }}>MTs Assa'adah Sukaraja Bogor</p>
                    </div>
                </div>

                {/* Right Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>

                    {/* Profile Info - Desktop only */}
                    <div className="hidden-mobile" style={{ textAlign: "right", marginRight: "0.25rem" }}>
                        <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "white", lineHeight: "1.2" }}>
                            {isMounted ? (user?.fullName || "Staff") : "Memuat..."}
                        </div>
                        <div style={{
                            fontSize: "0.65rem",
                            background: "rgba(253, 203, 1, 0.85)",
                            color: "#1B5E20",
                            padding: "1px 7px",
                            borderRadius: "20px",
                            display: "inline-block",
                            marginTop: "2px",
                            textTransform: "uppercase",
                            letterSpacing: "0.6px",
                            fontWeight: "800"
                        }}>
                            {isMounted ? getRoleLabel(user?.role || "") : "Admin"}
                        </div>
                    </div>

                    {/* Notification with Badge */}
                    <Link href="/notifications">
                        <button className="header-icon-btn">
                            <Bell size={20} color="#ffffff" strokeWidth={2} />
                            <span className="notification-badge">5</span>
                        </button>
                    </Link>

                    <Link href="/settings">
                        <button className="header-icon-btn">
                            <Users size={20} color="#ffffff" strokeWidth={2} />
                        </button>
                    </Link>

                    {/* Logout Button - Desktop only */}
                    <button
                        onClick={() => {
                            localStorage.removeItem("user");
                            router.push("/login");
                        }}
                        className="btn header-btn-logout hidden-mobile"
                        style={{
                            background: "rgba(255,255,255,0.95)",
                            color: "#1B5E20",
                            padding: "0.45rem 1rem",
                            fontSize: "0.85rem",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "10px",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            transition: "all 0.2s ease",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                        }}
                    >
                        <LogOut size={15} />
                        Keluar
                    </button>
                </div>
            </header>

            {/* Sidebar Navigation (Hidden on Mobile via CSS) */}
            <div className="sidebar-container">
                <Sidebar />
            </div>

            {/* Pull to Refresh Indicator */}
            <PullToRefresh />

            {/* Main Content */}
            <main className="admin-main">
                {children}
            </main>

            {/* Bottom Navigation (Visible on Mobile only via CSS) */}
            <div className="bottom-nav">
                <Link href="/dashboard" className={`bottom-nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                    <LayoutDashboard size={24} />
                    <span>Beranda</span>
                </Link>

                {isMounted && (user?.role === "Penulis" || user?.role === "Admin" || user?.role === "AdminSuper") && (
                    <Link href="/file-master" className={`bottom-nav-item ${isActive('/file-master') || isActive('/buku-induk') || pathname.includes('/dokumen-') ? 'active' : ''}`}>
                        <FolderOpen size={24} />
                        <span>File</span>
                    </Link>
                )}

                {isMounted && (user?.role === "Operator" || user?.role === "AdminSuper") && (
                    <div style={{ position: "relative", display: "flex", justifyContent: "center" }} className="bottom-nav-item">
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
            `}</style>
            
            {/* Global Chatbot */}
            <ChatbotBubble />

        </div>
    );
}
