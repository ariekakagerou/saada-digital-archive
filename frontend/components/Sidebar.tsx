"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Upload, Search, History, LogOut, Menu, X, Settings, Camera, BookOpen, GraduationCap, Hash, BarChart2, ChevronDown, ChevronRight, FolderOpen, MapPin, ClipboardList } from "lucide-react";
import { logout } from "@services/api";

export default function Sidebar() {
    const [isMounted, setIsMounted] = useState(false);
    const [userRole, setUserRole] = useState<string>("Admin");
    const pathname = usePathname();
    
    // State untuk melihat apakah menu folder dokumen sedang terbuka
    const [isDocOpen, setIsDocOpen] = useState(
        pathname.includes("/buku-induk") || 
        pathname.includes("/dokumen-") ||
        pathname.includes("/tracer-study") ||
        pathname.includes("/permohonan-dokumen")
    );

    useEffect(() => {
        setIsMounted(true);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserRole(user.role);
        }
    }, []);

    const handleLogout = () => {
        logout(); // Hapus token dari localStorage dan cookie, lalu redirect ke /login
    };

    const menuItems = [
        { name: "Beranda", href: "/dashboard", icon: LayoutDashboard, roles: ["Operator", "Penulis", "Admin", "AdminSuper", "Alumni"] },
        { name: "Dokumen Saya", href: "/alumni/my-documents", icon: GraduationCap, roles: ["Alumni"] },
        { name: "Permohonan Legalisir", href: "/alumni/my-requests", icon: ClipboardList, roles: ["Alumni"] },
        { name: "Tracer Study", href: "/tracer-study", icon: MapPin, roles: ["Alumni"] },
        { name: "Unggah Arsip", href: "/upload", icon: Upload, roles: ["Operator", "AdminSuper"] },
        { name: "Scan Kamera", href: "/scan-camera", icon: Camera, roles: ["Operator", "AdminSuper"] },
        { name: "Cari Alumni", href: "/alumni", icon: Search, roles: ["Penulis", "Admin", "AdminSuper"] },
        { 
            name: "File Master Siswa", 
            icon: FolderOpen, 
            roles: ["Penulis", "Admin", "AdminSuper"],
            isParent: true, // penanda bahwa ini punya sub-menu
            subItems: [
                { name: "Buku Induk", href: "/buku-induk", icon: BookOpen },
                { name: "Dokumen Ijazah", href: "/dokumen-ijazah", icon: GraduationCap },
                { name: "Dokumen SKL (Surat Keterangan Lulus)", href: "/dokumen-skhu", icon: Hash },
                { name: "Transkrip Nilai", href: "/dokumen-transkrip", icon: BarChart2 },
                { name: "Rekap Rapor", href: "/dokumen-rapor", icon: FileText },
                { name: "Tracer Study", href: "/tracer-study", icon: MapPin },
                { name: "Permohonan Legalisir", href: "/permohonan-dokumen", icon: ClipboardList },
            ]
        },
        { name: "Riwayat Audit", href: "/history", icon: History, roles: ["Admin", "AdminSuper"] },
        { name: "Pengaturan", href: "/settings", icon: Settings, roles: ["Admin", "AdminSuper", "Operator", "Penulis", "Alumni"] },
    ];

    const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

    return (
        <>
            {/* Sidebar (Desktop) */}
            <aside
                className="sidebar-container"
                style={{
                    width: "260px",
                    height: "calc(100vh - 68px)",
                    position: "fixed",
                    left: 0,
                    top: "68px",
                    background: "var(--sidebar-bg)",
                    display: "flex",
                    flexDirection: "column",
                    padding: "1rem 0",
                    zIndex: 40,
                    overflowY: "auto",
                    overflowX: "hidden",
                    /* Hide scrollbar */
                    scrollbarWidth: "none" as any,
                    msOverflowStyle: "none" as any,
                }}
            >
                <nav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    {isMounted && filteredMenu.map((item, idx) => {
                        // Jika item adalah parent menu (punya dropdown)
                        if (item.isParent && item.subItems) {
                            return (
                                <div key={`parent-${idx}`}>
                                    <div
                                        onClick={() => setIsDocOpen(!isDocOpen)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "1rem 1.5rem",
                                            color: "var(--sidebar-text)",
                                            fontWeight: 600,
                                            borderLeft: "4px solid transparent",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                            <item.icon size={20} />
                                            {item.name}
                                        </div>
                                        {isDocOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </div>
                                    
                                    {/* Sub-menu rendering */}
                                    {isDocOpen && (
                                        <div style={{ background: "rgba(0,0,0,0.15)", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>
                                            {item.subItems.map((sub, sIdx) => {
                                                const isSubActive = pathname === sub.href;
                                                return (
                                                    <Link
                                                        key={`sub-${sIdx}`}
                                                        href={sub.href}
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "0.75rem",
                                                            padding: "0.75rem 1.5rem 0.75rem 3rem", // indentasi lebih dalam
                                                            backgroundColor: isSubActive ? "rgba(255,255,255,0.1)" : "transparent",
                                                            color: isSubActive ? "white" : "rgba(255,255,255,0.7)",
                                                            fontSize: "0.9rem",
                                                            fontWeight: isSubActive ? 600 : 400,
                                                            transition: "all 0.2s ease"
                                                        }}
                                                    >
                                                        <sub.icon size={16} />
                                                        {sub.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // Jika item adalah menu biasa
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href || idx}
                                href={item.href || "#"}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    padding: "1rem 1.5rem",
                                    backgroundColor: isActive ? "var(--sidebar-bg-active)" : "transparent",
                                    color: isActive ? "var(--sidebar-text-active)" : "var(--sidebar-text)",
                                    fontWeight: isActive ? 600 : 500,
                                    borderLeft: isActive ? "4px solid var(--sidebar-border)" : "4px solid transparent",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Tombol Keluar */}
                {isMounted && (
                    <button
                        onClick={handleLogout}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "1rem 1.5rem",
                            margin: "0.5rem 1rem",
                            background: "rgba(239, 68, 68, 0.15)",
                            color: "#fca5a5",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            width: "calc(100% - 2rem)",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <LogOut size={18} />
                        Keluar
                    </button>
                )}
            </aside>

            {/* Bottom Nav dihapus dari sini karena dikelola di AdminLayout.tsx khusus desain floating camera */}
        </>
    );
}
