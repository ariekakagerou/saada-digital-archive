"use client";

import AdminLayout from "../../../components/AdminLayout";
import { Users, FileText, CheckCircle, Clock, Upload, Camera, Search, BarChart2, Database, Download, Plus, Bell, ArrowRight, BookOpen, GraduationCap, Inbox, Cloud, Book } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
    CartesianGrid, Tooltip, BarChart, Bar, Legend, Cell 
} from "recharts";

export default function DashboardPage() {
    const [statsData, setStatsData] = useState({
        totalArchives: 0,
        totalAlumni: 0,
        totalBukuInduk: 0,
        totalPetugas: 0,
        ocrCount: 0,
        arsipBurukCount: 0,
        progressPerTahun: [] as any[]
    });
    const [alumniDash, setAlumniDash] = useState<{
        totalArchives: number;
        totalRequests: number;
        pendingRequests: number;
        hasTracerStudy: boolean;
        archives: any[];
        me: any;
    }>({
        totalArchives: 0,
        totalRequests: 0,
        pendingRequests: 0,
        hasTracerStudy: false,
        archives: [],
        me: null
    });
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);

    useEffect(() => {
        setIsMounted(true);
        const storedUser = localStorage.getItem("user");
        let parsedUser: any = null;
        if (storedUser) {
            parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }

        const fetchStats = async () => {
            try {
                const api = await import("../../../services/api");
                if (parsedUser && parsedUser.role === "Alumni") {
                    const [dashData, meData] = await Promise.all([
                        api.getAlumniPortalDashboard().catch(() => ({ totalArchives: 0, totalRequests: 0, pendingRequests: 0, hasTracerStudy: false, archives: [] })),
                        api.getAlumniPortalMe().catch(() => null)
                    ]);
                    setAlumniDash({
                        totalArchives: dashData.totalArchives ?? 0,
                        totalRequests: dashData.totalRequests ?? 0,
                        pendingRequests: dashData.pendingRequests ?? 0,
                        hasTracerStudy: dashData.hasTracerStudy ?? false,
                        archives: dashData.archives ?? [],
                        me: meData
                    });
                } else {
                    const data = await api.getDashboardStats();
                    setStatsData({
                        totalArchives: data.totalArsip ?? 0,
                        totalAlumni: data.totalAlumni ?? 0,
                        totalBukuInduk: data.totalBukuInduk ?? 0,
                        totalPetugas: data.totalPetugas ?? 0,
                        ocrCount: data.ocrCount ?? 0,
                        arsipBurukCount: data.arsipBurukCount ?? 0,
                        progressPerTahun: data.progressPerTahun ?? []
                    });
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const stats = [
        { label: "Total Arsip", value: loading ? "..." : statsData.totalArchives.toLocaleString(), icon: FileText, color: "var(--primary)" },
        { label: "Alumni Terdaftar", value: loading ? "..." : statsData.totalAlumni.toLocaleString(), icon: Users, color: "var(--secondary)" },
        { label: "Pemindaian Teks", value: loading ? "..." : statsData.ocrCount.toLocaleString(), icon: CheckCircle, color: "var(--success)" },
        { label: "Kualitas Arsip", value: loading ? "..." : statsData.arsipBurukCount.toLocaleString(), icon: Clock, color: "var(--warning)" },
    ];

    const displayName = isMounted && user?.fullName ? user.fullName.split(" ")[0] : "Petugas";
    const totalProgressPct = statsData.totalAlumni > 0 ? Math.min(100, Math.round((statsData.totalBukuInduk / statsData.totalAlumni) * 100)) : 0;

    // Prepare Chart Data
    const chartData = statsData.progressPerTahun.length > 0 
        ? statsData.progressPerTahun.map(p => ({ 
            name: p.year, 
            count: p.count,
            trend: Math.floor(p.count * 0.8) // Simulated cumulative for visual
        }))
        : [
            { name: "2020", count: 45, trend: 45 },
            { name: "2021", count: 120, trend: 165 },
            { name: "2022", count: 250, trend: 415 },
            { name: "2023", count: 180, trend: 595 },
            { name: "2024", count: 320, trend: 915 },
        ];

    if (isMounted && user?.role === "Alumni") {
        return (
            <AdminLayout>
                <div style={{ padding: "0.5rem", maxWidth: "1200px", margin: "0 auto" }}>
                    {/* Welcome Banner */}
                    <div style={{
                        background: "linear-gradient(135deg, #065f46 0%, #15803d 100%)",
                        borderRadius: "20px",
                        padding: "2rem",
                        color: "white",
                        boxShadow: "0 10px 25px rgba(6, 95, 70, 0.2)",
                        marginBottom: "2rem",
                        position: "relative",
                        overflow: "hidden"
                    }}>
                        <div style={{ position: "relative", zIndex: 2 }}>
                            <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                                Portal Alumni Mandiri SAADA
                            </span>
                            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginTop: "0.75rem", marginBottom: "0.5rem" }}>
                                Selamat Datang, {user?.fullName}! 👋
                            </h2>
                            <p style={{ opacity: 0.9, fontSize: "0.95rem", maxWidth: "600px" }}>
                                Kelola salinan arsip ijazah, transkrip nilai, pengajuan legalisir resmi, dan pembaharuan tracer study Anda dalam satu pintu.
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="responsive-grid-4" style={{ marginBottom: "2rem" }}>
                        <div style={{ background: "white", padding: "1.5rem", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#15803d", marginBottom: "0.5rem" }}>
                                <GraduationCap size={24} />
                                <span style={{ fontWeight: "700", fontSize: "0.9rem" }}>Dokumen Saya</span>
                            </div>
                            <p style={{ fontSize: "1.8rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>
                                {loading ? "..." : alumniDash.totalArchives} <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "normal" }}>Berkas Digital</span>
                            </p>
                        </div>

                        <div style={{ background: "white", padding: "1.5rem", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#d97706", marginBottom: "0.5rem" }}>
                                <Clock size={24} />
                                <span style={{ fontWeight: "700", fontSize: "0.9rem" }}>Legalisir Aktif</span>
                            </div>
                            <p style={{ fontSize: "1.8rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>
                                {loading ? "..." : alumniDash.pendingRequests} <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "normal" }}>Dalam Proses</span>
                            </p>
                        </div>

                        <div style={{ background: "white", padding: "1.5rem", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#2563eb", marginBottom: "0.5rem" }}>
                                <BarChart2 size={24} />
                                <span style={{ fontWeight: "700", fontSize: "0.9rem" }}>Tracer Study</span>
                            </div>
                            <p style={{ fontSize: "1.2rem", fontWeight: "800", color: alumniDash.hasTracerStudy ? "#15803d" : "#ef4444", margin: 0 }}>
                                {loading ? "..." : (alumniDash.hasTracerStudy ? "Sudah Diperbarui ✓" : "Belum Diisi ⚠️")}
                            </p>
                        </div>

                        <div style={{ background: "white", padding: "1.5rem", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#7c3aed", marginBottom: "0.5rem" }}>
                                <CheckCircle size={24} />
                                <span style={{ fontWeight: "700", fontSize: "0.9rem" }}>Status Akun</span>
                            </div>
                            <p style={{ fontSize: "1.2rem", fontWeight: "800", color: "#15803d", margin: 0 }}>
                                Terverifikasi Alumni
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions Grid */}
                    <div style={{ marginBottom: "2rem" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", marginBottom: "1rem" }}>Layanan Mandiri Alumni</h3>
                        <div className="responsive-grid-4">
                            <Link href="/alumni/my-documents" style={{ textDecoration: "none" }}>
                                <div style={{ background: "#f0fdf4", padding: "1.25rem", borderRadius: "16px", border: "1px solid #bbf7d0", display: "flex", flexDirection: "column", gap: "0.75rem", transition: "transform 0.2s" }}>
                                    <div style={{ background: "#15803d", color: "white", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <GraduationCap size={22} />
                                    </div>
                                    <div>
                                        <strong style={{ display: "block", color: "#14532d", fontSize: "1rem" }}>Dokumen Saya</strong>
                                        <span style={{ fontSize: "0.8rem", color: "#166534" }}>Lihat & unduh arsip ijazah/SKL</span>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/alumni/my-requests" style={{ textDecoration: "none" }}>
                                <div style={{ background: "#fffbeb", padding: "1.25rem", borderRadius: "16px", border: "1px solid #fde68a", display: "flex", flexDirection: "column", gap: "0.75rem", transition: "transform 0.2s" }}>
                                    <div style={{ background: "#d97706", color: "white", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <FileText size={22} />
                                    </div>
                                    <div>
                                        <strong style={{ display: "block", color: "#78350f", fontSize: "1rem" }}>Permohonan Legalisir</strong>
                                        <span style={{ fontSize: "0.8rem", color: "#92400e" }}>Ajukan cetak legalisir resmi</span>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/tracer-study" style={{ textDecoration: "none" }}>
                                <div style={{ background: "#eff6ff", padding: "1.25rem", borderRadius: "16px", border: "1px solid #bfdbfe", display: "flex", flexDirection: "column", gap: "0.75rem", transition: "transform 0.2s" }}>
                                    <div style={{ background: "#2563eb", color: "white", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <BarChart2 size={22} />
                                    </div>
                                    <div>
                                        <strong style={{ display: "block", color: "#1e3a8a", fontSize: "1rem" }}>Tracer Study</strong>
                                        <span style={{ fontSize: "0.8rem", color: "#1e40af" }}>Update status karir & kuliah</span>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/profile" style={{ textDecoration: "none" }}>
                                <div style={{ background: "#faf5ff", padding: "1.25rem", borderRadius: "16px", border: "1px solid #e9d5ff", display: "flex", flexDirection: "column", gap: "0.75rem", transition: "transform 0.2s" }}>
                                    <div style={{ background: "#7c3aed", color: "white", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Users size={22} />
                                    </div>
                                    <div>
                                        <strong style={{ display: "block", color: "#4c1d95", fontSize: "1rem" }}>Profil Saya</strong>
                                        <span style={{ fontSize: "0.8rem", color: "#6b21a8" }}>Kelola kontak & data diri</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Available Documents Preview List */}
                    <div style={{ background: "white", padding: "1.5rem", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>Ringkasan Arsip Digital</h3>
                            <Link href="/alumni/my-documents" style={{ color: "#15803d", fontWeight: "700", fontSize: "0.85rem", textDecoration: "none" }}>Lihat Semua &gt;</Link>
                        </div>

                        {alumniDash.archives && alumniDash.archives.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                {alumniDash.archives.map((item: any, idx: number) => (
                                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 1rem", background: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                                            <div style={{ background: "#e0f2fe", padding: "8px", borderRadius: "10px", color: "#0284c7" }}>
                                                <GraduationCap size={20} />
                                            </div>
                                            <div>
                                                <strong style={{ display: "block", fontSize: "0.95rem", color: "#1e293b" }}>Dokumen {item.jenisArsip}</strong>
                                                <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Tipe File: {item.fileType}</span>
                                            </div>
                                        </div>
                                        <Link href="/alumni/my-documents">
                                            <button className="btn" style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem", background: "#15803d", color: "white", borderRadius: "8px" }}>Buka Berkas</button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#64748b" }}>
                                <GraduationCap size={40} style={{ opacity: 0.3, marginBottom: "0.5rem" }} />
                                <p style={{ margin: 0, fontSize: "0.9rem" }}>Belum ada berkas digital yang diunggah oleh sekolah untuk akun Anda.</p>
                                <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Hubungi pihak administrasi MTs Assa&apos;adah untuk pemindaian berkas.</span>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>

            {/* ======================== DESKTOP VIEW ======================== */}
            <div className="desktop-only-dashboard">

                {/* Welcome */}
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-heading)", marginBottom: "1.5rem" }}>
                    Selamat Datang, Petugas Admin MTs!
                </h2>

                {/* Stats Grid */}
                <div className="responsive-grid-4" style={{ marginBottom: "2rem" }} suppressHydrationWarning>
                    {/* Card 1: Total Arsip (Yellow) */}
                    <div className="stat-card" style={{ background: "var(--card-yellow-bg)", padding: "1.5rem", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: "0.5rem" }} suppressHydrationWarning>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--card-yellow-text)" }} suppressHydrationWarning>
                            <FileText size={20} />
                            <span style={{ fontWeight: "600" }}>Total Arsip</span>
                        </div>
                        <p style={{ fontSize: "1.8rem", fontWeight: "700", color: "#422006" }}>{stats[0].value} <span style={{ fontSize: "0.9rem", fontWeight: "normal" }}>Data Arsip</span></p>
                    </div>

                    {/* Card 2: Total Alumni (Green) */}
                    <div className="stat-card" style={{ background: "var(--card-green-bg)", padding: "1.5rem", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: "0.5rem" }} suppressHydrationWarning>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--card-green-text)" }} suppressHydrationWarning>
                            <Users size={20} />
                            <span style={{ fontWeight: "600" }}>Total Alumni</span>
                        </div>
                        <p style={{ fontSize: "1.8rem", fontWeight: "700", color: "#14532d" }}>{stats[1].value} <span style={{ fontSize: "0.9rem", fontWeight: "normal" }}>Data Alumni</span></p>
                    </div>

                    {/* Card 3: OCR (Blue) */}
                    <div className="stat-card" style={{ background: "var(--card-blue-bg)", padding: "1.5rem", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: "0.5rem" }} suppressHydrationWarning>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--card-blue-text)" }} suppressHydrationWarning>
                            <div style={{ background: "var(--card-blue-text)", color: "white", padding: "2px 4px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "bold" }} suppressHydrationWarning>OCR</div>
                            <span style={{ fontWeight: "600" }}>Pemindaian Teks</span>
                        </div>
                        <p style={{ fontSize: "1.8rem", fontWeight: "700", color: "#1e3a8a" }}>{stats[2].value} <span style={{ fontSize: "0.9rem", fontWeight: "normal" }}>Berkas</span></p>
                    </div>

                    {/* Card 4: Quality (Red) */}
                    <div className="stat-card" style={{ background: "var(--card-red-bg)", padding: "1.5rem", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: "0.5rem" }} suppressHydrationWarning>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--card-red-text)" }} suppressHydrationWarning>
                            <CheckCircle size={20} />
                            <span style={{ fontWeight: "600" }}>Kualitas Arsip</span>
                        </div>
                        <p style={{ fontSize: "1.8rem", fontWeight: "700", color: "#7f1d1d" }}>{stats[3].value} <span style={{ fontSize: "0.9rem", fontWeight: "normal" }}>Arsip Buruk</span></p>
                    </div>
                </div>

                {/* Split Section: Recent Scans & Search */}
                <div className="responsive-split" style={{ marginBottom: "2rem" }} suppressHydrationWarning>

                    {/* Left: Pemindaian Terakhir */}
                    <div style={{ background: "white", padding: "1.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }} suppressHydrationWarning>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "var(--text-heading)" }}>Pemindaian Terakhir</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }} suppressHydrationWarning>
                            {[
                                { title: "Transkrip Nilai : Ahmad Faisal", date: "21 April 2024 - 10:15", color: "#facc15" },
                                { title: "Ijazah : Siti Nurhaliza", date: "20 April 2024 - 14:32", color: "#166534" },
                                { title: "SKL : Muhammad Rizki", date: "18 April 2024 - 09:20", color: "#166534" }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: idx < 2 ? "1px solid #f3f4f6" : "none" }} suppressHydrationWarning>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }} suppressHydrationWarning>
                                        <div style={{ width: "10px", height: "10px", background: item.color, borderRadius: "2px" }} suppressHydrationWarning></div>
                                        <div suppressHydrationWarning>
                                            <p style={{ fontWeight: "600", fontSize: "0.95rem", color: "var(--text-heading)" }}>{item.title}</p>
                                            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.date}</p>
                                        </div>
                                    </div>
                                    <Clock size={16} color="var(--text-muted)" />
                                </div>
                            ))}
                        </div>
                        <Link href="/history" style={{ width: "100%" }}>
                            <button className="btn" style={{ width: "100%", marginTop: "0.5rem", border: "1px solid var(--border)", color: "var(--text-body)" }}>Lihat Semua &gt;</button>
                        </Link>
                    </div>

                    {/* Right: Pencarian Cepat */}
                    <div style={{ background: "white", padding: "1.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }} suppressHydrationWarning>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "var(--text-heading)" }}>Pencarian Cepat Alumni</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }} suppressHydrationWarning>
                            <input type="text" placeholder="Nama / NISN" style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--border)", width: "100%" }} />
                            <select style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--border)", width: "100%", color: "var(--text-body)" }}>
                                <option>Tahun Lulus</option>
                                <option>2024</option>
                                <option>2023</option>
                                <option>2022</option>
                            </select>
                            <Link href="/alumni" style={{ width: "100%" }}>
                                <button className="btn" style={{ background: "var(--btn-dark-green)", color: "white", width: "100%" }}>Cari Arsip</button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Feature 3: Digitization Progress Statistics (Professional Charts) */}
                <div style={{ background: "white", padding: "2rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", marginBottom: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem" }}>
                        <div>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-heading)", marginBottom: "0.25rem" }}>Statistik & Tren Digitalisasi</h3>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Visualisasi performa sistem dan pertumbuhan data arsip alumni</p>
                        </div>
                        <div style={{ background: "#f8fafc", padding: "0.5rem 1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#15803d" }}>Tahun Ajaran 2024/2025</span>
                        </div>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "2rem" }}>
                        
                        {/* Circular Progress (Pie Alternative) */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRight: "1px solid #f1f5f9", paddingRight: "2rem" }}>
                            <div style={{ position: "relative", width: "220px", height: "220px" }}>
                                <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                                    <circle 
                                        cx="50" cy="50" r="45" fill="none" stroke="#15803d" strokeWidth="10" 
                                        strokeDasharray={`${totalProgressPct * 2.827} 282.7`} 
                                        strokeLinecap="round"
                                        style={{ transition: "stroke-dasharray 1s ease-in-out" }}
                                    />
                                </svg>
                                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                                    <span style={{ fontSize: "2.8rem", fontWeight: "900", color: "#15803d", display: "block" }}>{totalProgressPct}%</span>
                                    <span style={{ fontSize: "0.8rem", fontWeight: "750", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Selesai</span>
                                </div>
                            </div>
                            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                                <p style={{ fontSize: "1rem", color: "#1e293b", fontWeight: "600" }}>
                                    Target Tercapai: <strong style={{ color: "#15803d" }}>{loading ? "..." : statsData.totalBukuInduk}</strong> Berkas
                                </p>
                            </div>
                        </div>

                        {/* Recharts Area Chart: Tren Digitalisasi */}
                        <div style={{ height: "300px", width: "100%" }}>
                            <h4 style={{ fontSize: "0.95rem", fontWeight: "750", marginBottom: "1.5rem", color: "#475569", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <BarChart2 size={18} color="#15803d" />
                                Tren Pertumbuhan Data Per Tahun
                            </h4>
                            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#15803d" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#15803d" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} 
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        cursor={{ stroke: '#15803d', strokeWidth: 2 }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="count" 
                                        stroke="#15803d" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorCount)" 
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                    </div>
                </div>

                {/* Action Buttons */}
                <div className="responsive-grid-4" style={{ marginBottom: "3rem" }} suppressHydrationWarning>
                    <Link href="/upload" style={{ width: "100%" }}>
                        <button className="btn" style={{ background: "var(--btn-yellow)", color: "white", flexDirection: "column", padding: "1.5rem", alignItems: "center", gap: "0.5rem", width: "100%" }}>
                            <Upload size={32} />
                            <span style={{ fontSize: "1rem" }}>Unggah Arsip</span>
                        </button>
                    </Link>
                    <Link href="/scan-camera" style={{ width: "100%" }}>
                        <button className="btn" style={{ background: "var(--btn-teal)", color: "white", flexDirection: "column", padding: "1.5rem", alignItems: "center", gap: "0.5rem", width: "100%" }}>
                            <Camera size={32} />
                            <span style={{ fontSize: "1rem" }}>Scan Kamera</span>
                        </button>
                    </Link>
                    <Link href="/dashboard/guide" style={{ width: "100%" }}>
                        <button className="btn" style={{ background: "var(--btn-green)", color: "white", flexDirection: "column", padding: "1.5rem", alignItems: "center", gap: "0.5rem", width: "100%" }}>
                            <FileText size={32} />
                            <span style={{ fontSize: "1rem" }}>Panduan Sistem</span>
                        </button>
                    </Link>
                    <Link href="/settings" style={{ width: "100%" }}>
                        <button className="btn" style={{ background: "var(--btn-dark-green)", color: "white", flexDirection: "column", padding: "1.5rem", alignItems: "center", gap: "0.5rem", width: "100%" }}>
                            <Upload size={32} style={{ transform: "rotate(180deg)" }} />
                            <span style={{ fontSize: "1rem" }}>Ekspor Data</span>
                        </button>
                    </Link>
                </div>

                {/* Footer */}
                <footer style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", paddingBottom: "2rem" }}>
                    &copy; 2026 <strong>SAADA (Sistem Arsip Alumni ASSA&apos;ADAH)</strong> | Prototipe Penelitian Skripsi MTS
                </footer>

            </div>

            {/* ======================== MOBILE VIEW ======================== */}
            <div className="mobile-only-dashboard">

                {/* High-Fidelity SVG Banner (Institutional Silhouette) */}
                <div className="mob-banner">
                    <div className="mob-banner-art">
                        <svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", opacity: 0.25 }}>
                            {/* School Architecture */}
                            <path d="M60,110 L60,60 L140,20 L220,60 L220,110 Z" fill="white" />
                            <path d="M140,20 L160,30 L160,110 L120,110 L120,30 Z" fill="rgba(255,255,255,0.8)" />
                            {/* Roofs */}
                            <path d="M50,65 L140,20 L230,65" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" />
                            {/* Flag */}
                            <line x1="140" y1="20" x2="140" y2="5" stroke="white" strokeWidth="2" />
                            <polygon points="140,5 160,10 140,15" fill="#FDCB01" />
                            {/* Windows */}
                            <rect x="80" y="75" width="15" height="15" fill="rgba(255,255,255,0.4)" rx="2" />
                            <rect x="185" y="75" width="15" height="15" fill="rgba(255,255,255,0.4)" rx="2" />
                            {/* Ground */}
                            <line x1="0" y1="110" x2="320" y2="110" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                        </svg>
                    </div>
                    <div className="mob-banner-text" style={{ position: "relative", zIndex: 2 }}>
                        <p className="mob-banner-greet">Selamat Datang,</p>
                        <p className="mob-banner-name" suppressHydrationWarning>{displayName.toLowerCase().startsWith("pak") || displayName.toLowerCase().startsWith("bu") ? "" : "Pak "} {displayName}!</p>
                    </div>
                </div>


                {/* Section: Monitor Progres (Professional Charts) */}
                <div className="mob-section">
                    <div className="mob-progress-card">
                        <h3 className="mob-section-title">Monitor Progres Digitalisasi</h3>
                        <p className="mob-section-subtitle">Pertumbuhan data alumni per tahun lulus:</p>
                        
                        <div style={{ height: "200px", width: "100%", marginTop: "1.5rem" }}>
                            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} 
                                    />
                                    <Tooltip 
                                        cursor={{fill: '#f8fafc'}}
                                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                                    />
                                    <Bar 
                                        dataKey="count" 
                                        fill="#15803d" 
                                        radius={[4, 4, 0, 0]} 
                                        animationDuration={1500}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#15803d' : '#22c55e'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mob-chart-legend" style={{ marginTop: "1rem" }}>
                            <div className="legend-item"><div className="legend-dot" style={{ background: "#15803d" }}></div><span>Terverifikasi</span></div>
                            <div className="legend-item"><div className="legend-dot" style={{ background: "#22c55e" }}></div><span>Dalam Proses</span></div>
                        </div>
                    </div>
                </div>

                {/* Section: Action Buttons (Mockup Parity) */}
                <div className="mob-section">
                    <div className="mob-action-grid-2x2">
                        <Link href="/upload" className="mob-tile yellow">
                            <Upload size={28} />
                            <span>Unggah Arsip</span>
                        </Link>
                        <Link href="/scan-camera" className="mob-tile teal">
                            <Camera size={28} />
                            <span>Scan Kamera</span>
                        </Link>
                        <Link href="/dashboard/guide" className="mob-tile green">
                            <Book size={28} />
                            <span>Panduan Scan</span>
                        </Link>
                        <Link href="/settings" className="mob-tile dark-green">
                            <Database size={28} />
                            <span>Ekspor Data</span>
                        </Link>
                    </div>
                </div>

                {/* Section: Menu Utama Row Card (Mockup Parity) */}
                <div className="mob-section">
                    <div className="mob-menu-row-card">
                        <Link href="/alumni" className="mob-row-item">
                            <div className="icon-circ" style={{ background: "#f0fdf4" }}><Users size={22} color="#15803d" /></div>
                            <span>Data Alumni</span>
                        </Link>
                        <Link href="/alumni?mode=search" className="mob-row-item">
                            <div className="icon-circ" style={{ background: "#fdf2f8" }}><Search size={22} color="#db2777" /></div>
                            <span>Cari Alumni</span>
                        </Link>
                        <Link href="/dashboard#statistik" className="mob-row-item">
                            <div className="icon-circ" style={{ background: "#eff6ff" }}><BarChart2 size={22} color="#2563eb" /></div>
                            <span>Statistik</span>
                        </Link>
                        <Link href="/history" className="mob-row-item">
                            <div className="icon-circ" style={{ background: "#fffbeb" }}><FileText size={22} color="#d97706" /></div>
                            <span>Laporan</span>
                        </Link>
                    </div>
                    <div className="mob-menu-label-under">Menu Utama</div>
                </div>

                {/* Divider */}
                <div className="mob-section-header">
                    <span>Info &amp; Pengumuman</span>
                </div>

                {/* Section: Info & Pengumuman */}
                <div className="mob-section mob-section-info">

                    {/* Info Card 1 */}
                    <div className="mob-info-card">
                        <div className="mob-info-icon-wrap" style={{ background: "linear-gradient(135deg, #2E7D32, #43A047)" }}>
                            <Bell size={20} color="white" />
                        </div>
                        <div className="mob-info-content">
                            <p className="mob-info-title">Update Data Alumni 2022</p>
                            <p className="mob-info-desc">Pk Nana: Data alumni diupdate 20.22 segera.</p>
                            <p className="mob-info-time">1 hari yang lalu</p>
                        </div>
                    </div>

                    {/* Info Card 2 */}
                    <div className="mob-info-card">
                        <div className="mob-info-icon-wrap" style={{ background: "linear-gradient(135deg, #F57F17, #F9A825)" }}>
                            <BookOpen size={20} color="white" />
                        </div>
                        <div className="mob-info-content">
                            <p className="mob-info-title">Rapat Evaluasi Arsip</p>
                            <p className="mob-info-desc">Jadwal rapat evaluasi data arsip.</p>
                            <p className="mob-info-time">1 m yang lalu</p>
                        </div>
                    </div>

                    <Link href="/history" className="mob-see-all">
                        <span>Lihat Semua</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Ringkasan Data Section (Mockup Parity) */}
                <div className="mob-section-header">
                    <span>Ringkasan Data</span>
                    <Link href="/history" className="header-link">Lihat Semua &gt;</Link>
                </div>
                <div className="mob-section">
                    <div className="mob-summary-row">
                        <div className="mob-summary-card">
                            <div className="s-icon" style={{ background: "#ffae00" }}><GraduationCap size={20} color="white" /></div>
                            <div className="s-vals">
                                <strong>3.820</strong>
                                <span>Alumni</span>
                            </div>
                        </div>
                        <div className="mob-summary-card">
                            <div className="s-icon" style={{ background: "#00a2ff" }}><Inbox size={20} color="white" /></div>
                            <div className="s-vals">
                                <strong>7.452</strong>
                                <span>Dokumen</span>
                            </div>
                        </div>
                        <div className="mob-summary-card">
                            <div className="s-icon" style={{ background: "#00c853" }}><Cloud size={20} color="white" /></div>
                            <div className="s-vals">
                                <strong>12</strong>
                                <span>Dokumen</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer mobile */}
                <div className="mob-footer">
                    &copy; 2026 <strong>SAADA</strong> | Sistem Arsip Alumni ASSA&apos;ADAH
                </div>

            </div>

            <style jsx global>{`
                /* ===== VISIBILITY TOGGLES ===== */
                .desktop-only-dashboard { display: block; }
                .mobile-only-dashboard  { display: none; }

                @media (max-width: 768px) {
                    .desktop-only-dashboard { display: none !important; }
                    .mobile-only-dashboard  { display: block !important; }
                }

                /* ===== MOBILE BANNER & LAYOUT ===== */
                .mob-section { margin-bottom: 1.5rem; }
                .mob-section-header { 
                    margin-bottom: 0.75rem; 
                    font-weight: 800; 
                    font-size: 0.95rem; 
                    color: #1f2937; 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                }
                
                .mob-banner {
                    position: relative;
                    background: linear-gradient(135deg, #065f46 0%, #15803d 100%);
                    padding: 1.75rem 1.5rem;
                    border-radius: 20px;
                    color: white;
                    overflow: hidden;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 10px 25px rgba(6, 95, 70, 0.25);
                }
                .mob-banner-art {
                    position: absolute;
                    bottom: -15px;
                    right: -10px;
                    width: 250px;
                    z-index: 1;
                    pointer-events: none;
                }
                .mob-banner-text {
                    position: relative;
                    z-index: 2;
                }
                .mob-banner-greet {
                    font-size: 0.9rem;
                    opacity: 0.9;
                    margin: 0 0 0.25rem 0;
                    font-weight: 500;
                }
                .mob-banner-name {
                    font-size: 1.4rem;
                    font-weight: 800;
                    margin: 0;
                    line-height: 1.2;
                }

                /* ===== MOBILE PROGRESS CARD (NEW PARITY) ===== */
                .mob-progress-card {
                    background: white; border-radius: 20px; padding: 1.5rem;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #f1f5f9;
                }
                .mob-progress-main-row { display: flex; align-items: center; gap: 1.5rem; margin-top: 1rem; }
                .mob-gauge-left .mob-gauge { width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                .mob-gauge-inner { width: 80px; height: 80px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                .mob-gauge-value { font-size: 1.5rem; font-weight: 900; color: #15803d; }
                .mob-gauge-text-right p { font-size: 0.9rem; color: #4b5563; line-height: 1.5; }
                .mob-gauge-text-right strong { color: #15803d; font-weight: 800; }

                .mob-bar-chart-enhanced { display: flex; align-items: flex-end; justify-content: space-between; height: 110px; margin-top: 1.5rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 5px; }
                .bar-column { flex: 1; display: flex; flexDirection: column; align-items: center; gap: 4px; }
                .bar-pillar { width: 100%; height: 100%; display: flex; align-items: flex-end; justify-content: center; }
                .bar-fill { width: 85%; borderRadius: 4px 4px 0 0; position: relative; }
                .bar-perc { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); font-size: 0.6rem; font-weight: 800; color: #374151; }
                .bar-count { font-size: 0.65rem; font-weight: 700; color: #9ca3af; }

                /* Action Tiles 2x2 */
                .mob-action-grid-2x2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .mob-tile { borderRadius: 20px; padding: 1.5rem; display: flex; flexDirection: column; align-items: center; gap: 0.75rem; text-decoration: none; color: white; box-shadow: 0 5px 15px rgba(0,0,0,0.08); transition: transform 0.1s; }
                .mob-tile:active { transform: scale(0.96); }
                .mob-tile span { font-weight: 800; font-size: 0.95rem; }
                .mob-tile.yellow { background: #ffc107; color: #422006; }
                .mob-tile.teal { background: #00695c; }
                .mob-tile.green { background: #2e7d32; }
                .mob-tile.dark-green { background: #1b5e20; }

                /* Menu Row Card */
                .mob-menu-row-card { background: white; borderRadius: 22px; padding: 1.25rem 0.5rem; display: flex; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; }
                .mob-row-item { flex: 1; display: flex; flexDirection: column; align-items: center; gap: 0.5rem; text-decoration: none; }
                .icon-circ { width: 44px; height: 44px; borderRadius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
                .mob-row-item span { font-size: 0.68rem; font-weight: 700; color: #4b5563; }
                .mob-menu-label-under { text-align: center; font-size: 0.85rem; font-weight: 700; color: #4b5563; margin-top: 0.75rem; }

                /* Summary Cards */
                .mob-summary-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
                .mob-summary-card { background: white; borderRadius: 16px; padding: 0.75rem; display: flex; flexDirection: column; align-items: center; gap: 0.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.04); border: 1px solid #f8fafc; }
                .s-icon { width: 34px; height: 34px; borderRadius: 10px; display: flex; align-items: center; justify-content: center; }
                .s-vals { display: flex; flexDirection: column; align-items: center; }
                .s-vals strong { font-size: 1rem; font-weight: 900; color: #1f2937; line-height: 1; }
                .s-vals span { font-size: 0.65rem; color: #9ca3af; font-weight: 700; }
                .header-link { font-size: 0.75rem; color: #2e7d32; font-weight: 700; text-decoration: none; }

                /* ===== INFO CARDS ===== */
                .mob-section-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .mob-info-card {
                    background: white;
                    border-radius: 14px;
                    padding: 0.9rem 1rem;
                    display: flex;
                    align-items: flex-start;
                    gap: 0.85rem;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
                }

                .mob-info-icon-wrap {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .mob-info-content {
                    flex: 1;
                    min-width: 0;
                }

                .mob-info-title {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 0.15rem;
                }

                .mob-info-desc {
                    font-size: 0.78rem;
                    color: #6b7280;
                    line-height: 1.4;
                    margin-bottom: 0.2rem;
                }

                .mob-info-time {
                    font-size: 0.7rem;
                    color: #9ca3af;
                    font-weight: 500;
                }

                .mob-see-all {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.4rem;
                    padding: 0.65rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: #4b5563;
                    text-decoration: none;
                    background: white;
                    transition: background 0.15s;
                }

                .mob-see-all:active {
                    background: #f9fafb;
                }

                /* ===== STAT SUMMARY ROW ===== */
                .mob-stats-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.75rem;
                }

                .mob-stat-card {
                    background: white;
                    border-radius: 12px;
                    padding: 0.85rem 0.75rem;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
                }

                .mob-stat-value {
                    font-size: 1.2rem;
                    font-weight: 800;
                    color: #1f2937;
                    line-height: 1;
                    margin-bottom: 0.25rem;
                }

                .mob-stat-label {
                    font-size: 0.68rem;
                    color: #6b7280;
                    font-weight: 500;
                    line-height: 1.2;
                }

                /* ===== MOBILE FOOTER ===== */
                .mob-footer {
                    text-align: center;
                    font-size: 0.72rem;
                    color: #9ca3af;
                    padding: 1rem 0 1.5rem 0;
                }
            `}</style>

        </AdminLayout>
    );
}
