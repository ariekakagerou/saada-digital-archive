"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import {
    User, Edit, Lock, LogOut, FileSpreadsheet, RefreshCw, HelpCircle,
    ChevronRight, Shield, Eye, EyeOff, CheckCircle, XCircle, Loader2,
    KeyRound, Users, Activity, Info, Trash2, UserPlus, AlertTriangle,
    ChevronDown, ChevronUp, MoreVertical, Sliders, Zap, Download,
    Upload, Database, Server, Clock, ShieldAlert, Trash, Power, Image as ImageIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as api from "../../../services/api";

type Role = "Operator" | "Penulis" | "Admin" | "AdminSuper" | "Petugas";

interface UserAccount {
    id: number;
    fullName: string;
    email: string;
    role: Role;
    active: boolean;
}

interface ActivityLog {
    id: number;
    user: string;
    action: string;
    detail: string;
    time: string;
}

const DUMMY_USERS: UserAccount[] = [
    { id: 1, fullName: "Kepala Pengarsipan", email: "arsip@mts.sch.id", role: "Admin", active: false },
    { id: 2, fullName: "Petugas Digitalisasi", email: "petugas@mts.sch.id", role: "Petugas", active: false },
    { id: 3, fullName: "Fauzi Ar Rahman", email: "fauzi@mts.sch.id", role: "Operator", active: false },
    { id: 4, fullName: "Super Administrator", email: "super@mts.sch.id", role: "AdminSuper", active: true },
];

const DUMMY_LOGS: ActivityLog[] = [
    { id: 1, user: "Ahmad Fauzi", action: "Upload", detail: "Mengunggah arsip NISN 1234567890", time: "12 Mar 2026, 14:32" },
    { id: 2, user: "Ibu Rahma", action: "Edit", detail: "Mengedit data alumni Budi Santoso", time: "12 Mar 2026, 13:10" },
    { id: 3, user: "Bapak Syaiful", action: "Login", detail: "Login ke sistem SAADA", time: "12 Mar 2026, 08:00" },
];

const ROLE_LABELS: Record<Role, string> = {
    Operator: "Operator",
    Penulis: "Penulis",
    Admin: "Admin",
    AdminSuper: "Super Admin",
    Petugas: "Petugas",
};

const ROLE_COLORS: Record<Role, { bg: string; text: string }> = {
    Operator: { bg: "#e0f2fe", text: "#0369a1" },
    Penulis: { bg: "#fef9c3", text: "#854d0e" },
    Admin: { bg: "#ccfbf1", text: "#0d9488" },
    AdminSuper: { bg: "#f3e8ff", text: "#581c87" },
    Petugas: { bg: "#dcfce7", text: "#15803d" },
};

export default function SettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [currentRole, setCurrentRole] = useState<Role>("AdminSuper");
    const [currentUser, setCurrentUser] = useState({ fullName: "Super Admin", email: "super@mts.sch.id" });

    // Modal states
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showChangePinModal, setShowChangePinModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showAppInfoModal, setShowAppInfoModal] = useState(false);

    // Data states
    const [scanPin, setScanPin] = useState("123456");
    const [googleFormUrl, setGoogleFormUrl] = useState("https://docs.google.com/forms/d/e/1FAIpQLScyO-8Y179n96mP28y-Mts-Assaadah-Tracer/viewform");
    const [showPin, setShowPin] = useState(false);
    const [pinLastChanged, setPinLastChanged] = useState("17 Mei 2026 10:10 WIB");
    const [userList, setUserList] = useState<UserAccount[]>(DUMMY_USERS);
    const [logs, setLogs] = useState<ActivityLog[]>(DUMMY_LOGS);
    const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "error" }>({
        show: false, msg: "", type: "success"
    });

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            const u = JSON.parse(stored);
            if (u.role) setCurrentRole(u.role as Role);
            setCurrentUser({ fullName: u.fullName || "Pengguna", email: u.email || "-" });
        }
        const storedUrl = localStorage.getItem("saada_google_form_url");
        if (storedUrl) setGoogleFormUrl(storedUrl);
        fetchUsers();
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const data = await api.getLogs();
            const mappedLogs = data.map((l: any) => ({
                id: l.id,
                user: l.namaPengguna,
                action: l.aksi,
                detail: l.targetObjek,
                time: new Date(l.waktu).toLocaleString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                })
            }));
            setLogs(mappedLogs.length > 0 ? mappedLogs : DUMMY_LOGS);
        } catch (err) {
            console.error("Failed to fetch logs:", err);
            setLogs(DUMMY_LOGS);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await api.getUsers();
            const mapped = data.map((u: any) => ({
                id: u.id,
                fullName: u.fullName,
                email: u.email,
                role: u.role as Role,
                active: u.active
            }));
            setUserList(mapped.length > 0 ? mapped : DUMMY_USERS);
        } catch (err) {
            console.error("Failed to fetch users, using dummy data:", err);
            setUserList(DUMMY_USERS);
        }
    };

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3500);
    };

    const handleExport = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            const headers = "No,NISN,Nama Alumni,Tahun Lulus,Email\n";
            const rows = "1,123456789,Ahmad Dhani,2020,ahmad@email.com\n2,987654321,Budi Santoso,2021,budi@email.com\n3,555555555,Siti Aminah,2022,siti@email.com\n";
            const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
            const link = document.createElement("a");
            link.setAttribute("href", encodeURI(csvContent));
            link.setAttribute("download", `Data_Alumni_SAADA_${new Date().getFullYear()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast("Data alumni berhasil diunduh.");
        }, 1200);
    };

    const handleBackup = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            showToast("Backup berhasil disinkronkan ke server eksternal.");
        }, 1500);
    };

    const handleClearCache = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            showToast("Cache sistem berhasil dibersihkan.");
        }, 1000);
    };

    const handleResetSettings = () => {
        if (!confirm("Apakah Anda yakin ingin mereset pengaturan ke default?")) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setScanPin("123456");
            showToast("Pengaturan sistem berhasil dikembalikan ke default.");
        }, 1200);
    };

    return (
        <AdminLayout>
            {/* Toast Notification */}
            {toast.show && (
                <div className="toast-notification" style={{
                    position: "fixed", top: "5rem", right: "1.5rem",
                    background: toast.type === "success" ? "#dcfce7" : "#fee2e2",
                    color: toast.type === "success" ? "#166534" : "#991b1b",
                    padding: "0.9rem 1.25rem", borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 5000,
                    display: "flex", alignItems: "center", gap: "0.6rem",
                    border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                    animation: "slideIn 0.3s ease-out", maxWidth: "340px"
                }}>
                    {toast.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>{toast.msg}</span>
                </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
                    justifyContent: "center", zIndex: 4000
                }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                        <Loader2 size={48} color="#15803d" className="animate-spin" />
                        <span style={{ fontWeight: "700", color: "#15803d" }}>Memproses...</span>
                    </div>
                </div>
            )}

            <div style={{ maxWidth: "1350px", margin: "0 auto", paddingBottom: "3rem" }}>
                
                {/* Header */}
                <header style={{ marginBottom: "2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <div>
                            <h1 style={{ fontSize: "2.2rem", color: "#1e293b", fontWeight: "850", margin: 0, letterSpacing: "-0.5px" }}>Pengaturan</h1>
                            <p style={{ color: "#64748b", margin: "0.25rem 0 0", fontSize: "0.92rem", fontWeight: "500" }}>Kelola pengaturan sistem sesuai kebutuhan Anda.</p>
                        </div>
                        {/* Purple Role Pill */}
                        <span style={{
                            background: "#f3e8ff",
                            color: "#581c87",
                            padding: "0.4rem 1.25rem",
                            borderRadius: "20px",
                            fontWeight: "800",
                            fontSize: "0.78rem",
                            letterSpacing: "0.03em"
                        }}>
                            {ROLE_LABELS[currentRole]}
                        </span>
                    </div>
                </header>

                {/* ── TWO COLUMN MAIN GRID ── */}
                <div className="settings-grid-main">
                    
                    {/* LEFT COLUMN */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        
                        {/* Card: PIN Scan Keamanan */}
                        <div className="card-settings">
                            <div className="card-header-settings">
                                <div className="card-title-settings" style={{ color: "#15803d" }}>
                                    <Shield size={20} />
                                    <span>PIN Scan Keamanan</span>
                                </div>
                            </div>
                            <div className="card-body-settings">
                                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", position: "relative", marginBottom: "1rem" }}>
                                    <div style={{ fontSize: "0.75rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>PIN AKTIF SAAT INI</div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: "2rem", fontWeight: "800", color: "#0f172a", fontFamily: "monospace", letterSpacing: "0.3em" }}>
                                            {showPin ? scanPin : "●  ●  ●  ●  ●  ●"}
                                        </span>
                                        <button type="button" onClick={() => setShowPin(!showPin)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                                            {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.5rem" }}>Terakhir diubah: <strong>{pinLastChanged}</strong></div>
                                </div>
                                
                                <div style={{ background: "#fffbeb", border: "1px solid #fef3c7", borderRadius: "10px", padding: "0.85rem 1rem", fontSize: "0.82rem", color: "#b45309", display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                                    <div style={{ padding: "0.25rem", background: "#f59e0b", borderRadius: "6px", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <ShieldAlert size={16} />
                                    </div>
                                    <span style={{ fontWeight: "600" }}>PIN digunakan sebagai perlindungan saat melakukan Scan Kamera.</span>
                                </div>

                                <button onClick={() => setShowChangePinModal(true)} style={{ background: "#15803d", color: "white", border: "none", borderRadius: "12px", padding: "0.8rem", fontWeight: "750", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: "pointer", transition: "all 0.2s" }} className="hover-card">
                                    <KeyRound size={16} />
                                    <span>Ubah PIN Scan</span>
                                </button>
                            </div>
                        </div>

                        {/* Card: Manajemen Pengguna */}
                        <div className="card-settings">
                            <div className="card-header-settings">
                                <div className="card-title-settings" style={{ color: "#7c3aed" }}>
                                    <Users size={20} />
                                    <span>Manajemen Pengguna</span>
                                </div>
                                <button onClick={() => setShowAddUserModal(true)} style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "#7c3aed", color: "white", border: "none", borderRadius: "8px", padding: "0.45rem 1rem", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}>
                                    <UserPlus size={14} /> <span>Tambah</span>
                                </button>
                            </div>
                            <div className="card-body-settings" style={{ gap: "0.75rem" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "0.5rem" }}>
                                    {userList.map(u => (
                                        <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1rem", background: "#fafafa", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: u.active ? "#dcfce7" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <User size={18} color={u.active ? "#15803d" : "#94a3b8"} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: "750", fontSize: "0.88rem", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                        <span>{u.fullName}</span>
                                                        <span style={{ fontSize: "0.68rem", fontWeight: "800", background: ROLE_COLORS[u.role]?.bg || "#f1f5f9", color: ROLE_COLORS[u.role]?.text || "#64748b", padding: "2px 8px", borderRadius: "6px", textTransform: "uppercase" }}>
                                                            {ROLE_LABELS[u.role]}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <span style={{ fontSize: "0.75rem", fontWeight: "800", background: u.active ? "#dcfce7" : "#fee2e2", color: u.active ? "#15803d" : "#ef4444", padding: "4px 12px", borderRadius: "20px" }}>
                                                    {u.active ? "Aktif" : "Non-aktif"}
                                                </span>
                                                <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" }}>
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => showToast("Membuka kelola semua pengguna...")} style={{ width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", borderRadius: "12px", padding: "0.75rem", fontWeight: "750", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: "pointer" }}>
                                    <Users size={16} />
                                    <span>Kelola Semua Pengguna</span>
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        
                        {/* Card: Sistem */}
                        <div className="card-settings">
                            <div className="card-header-settings">
                                <div className="card-title-settings" style={{ color: "#15803d" }}>
                                    <Sliders size={20} />
                                    <span>Sistem</span>
                                </div>
                            </div>
                            <div className="card-body-settings" style={{ gap: "1.25rem" }}>
                                <div>
                                    <div style={{ fontSize: "0.85rem", fontWeight: "800", color: "#475569", marginBottom: "0.75rem" }}>Backup Data</div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                        <button onClick={handleExport} style={{ background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem", cursor: "pointer", transition: "all 0.2s" }} className="hover-card">
                                            <div style={{ padding: "0.6rem", background: "#15803d", borderRadius: "10px", color: "white", display: "flex" }}><FileSpreadsheet size={20} /></div>
                                            <span style={{ fontWeight: "700", color: "#166534", fontSize: "0.82rem" }}>Download Excel</span>
                                        </button>
                                        <button onClick={handleBackup} style={{ background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem", cursor: "pointer", transition: "all 0.2s" }} className="hover-card">
                                            <div style={{ padding: "0.6rem", background: "#15803d", borderRadius: "10px", color: "white", display: "flex" }}><RefreshCw size={20} /></div>
                                            <span style={{ fontWeight: "700", color: "#166534", fontSize: "0.82rem" }}>Backup Otomatis</span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: "0.85rem", fontWeight: "800", color: "#475569", marginBottom: "0.75rem" }}>Notifikasi Sistem</div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1.25rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                                        <div>
                                            <div style={{ fontWeight: "750", fontSize: "0.88rem", color: "#334155" }}>Mode Offline (Terbatas)</div>
                                            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>Sistem berjalan dalam mode offline</div>
                                        </div>
                                        <label className="switch">
                                            <input 
                                                type="checkbox" 
                                                onChange={(e) => {
                                                    const isOffline = e.target.checked;
                                                    if (isOffline) {
                                                        window.dispatchEvent(new Event('offline'));
                                                    } else {
                                                        window.dispatchEvent(new Event('online'));
                                                    }
                                                    showToast(isOffline ? "Mode Offline diaktifkan." : "Mode Online diaktifkan.");
                                                }}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>

                                <button onClick={() => showToast("Membuka Riwayat & Statistik...")} style={{ width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", borderRadius: "12px", padding: "0.85rem 1.25rem", fontWeight: "750", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                        <Activity size={18} color="#15803d" />
                                        <span style={{ fontSize: "0.88rem" }}>Riwayat & Statistik</span>
                                    </div>
                                    <ChevronRight size={16} color="#94a3b8" />
                                </button>
                            </div>
                        </div>

                        {/* Card: Logo & Identitas */}
                        <div className="card-settings">
                            <div className="card-header-settings">
                                <div className="card-title-settings" style={{ color: "#d97706" }}>
                                    <ImageIcon size={20} />
                                    <span>Logo & Identitas</span>
                                </div>
                            </div>
                            <div className="card-body-settings">
                                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                                    <div style={{ width: "80px", height: "80px", minWidth: "80px", borderRadius: "16px", overflow: "hidden", border: "2px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
                                        <img src="/logo-assaadah.jpg" alt="Logo MTs Assa'adah" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "850", color: "#1e293b" }}>MTs Assa'adah Sukabumi - Bogor</h4>
                                        <p style={{ margin: "0.25rem 0 0.75rem", fontSize: "0.82rem", color: "#64748b", fontWeight: "500" }}>Sistem Arsip Alumni Digital Assa'adah</p>
                                        <button onClick={() => showToast("Modul unggah logo baru diaktifkan.")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#f0fdf4", border: "1px solid #dcfce7", color: "#15803d", borderRadius: "10px", padding: "0.45rem 1rem", fontWeight: "750", fontSize: "0.8rem", cursor: "pointer" }} className="hover-card">
                                            <Upload size={14} />
                                            <span>Ubah Logo</span>
                                        </button>
                                        <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.4rem" }}>Format: PNG, JPG, SVG (Maks. 2MB)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card: Integrasi Tracer Study */}
                        <div className="card-settings">
                            <div className="card-header-settings">
                                <div className="card-title-settings" style={{ color: "#2563eb" }}>
                                    <FileSpreadsheet size={20} />
                                    <span>Integrasi Tracer Study</span>
                                </div>
                            </div>
                            <div className="card-body-settings" style={{ gap: "1rem" }}>
                                <div>
                                    <label style={{ fontSize: "0.82rem", fontWeight: "750", color: "#475569", display: "block", marginBottom: "0.5rem" }}>Tautan Google Form</label>
                                    <input 
                                        type="url" 
                                        value={googleFormUrl} 
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setGoogleFormUrl(val);
                                            localStorage.setItem("saada_google_form_url", val);
                                        }}
                                        placeholder="https://docs.google.com/forms/..."
                                        style={{ 
                                            width: "100%", 
                                            padding: "0.75rem", 
                                            border: "1px solid #cbd5e1", 
                                            borderRadius: "10px", 
                                            fontSize: "0.85rem", 
                                            color: "#1e293b",
                                            background: "#f8fafc" 
                                        }}
                                    />
                                    <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.4rem" }}>
                                        Tautan ini digunakan oleh tombol &quot;Isi via Google Form&quot; di modul Tracer Study.
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                {/* ── THREE COLUMN BOTTOM GRID ── */}
                <div className="settings-grid-bottom">
                    
                    {/* Card: Pengaturan Aplikasi */}
                    <div className="card-settings">
                        <div className="card-header-settings">
                            <div className="card-title-settings" style={{ color: "#2563eb" }}>
                                <Sliders size={20} />
                                <span>Pengaturan Aplikasi</span>
                            </div>
                        </div>
                        <div className="card-body-settings" style={{ gap: "0.75rem" }}>
                            {[
                                { title: "Pengaturan Umum", desc: "Atur informasi dasar aplikasi" },
                                { title: "Pengaturan Arsip", desc: "Atur format file, ukuran, dan aturan arsip" },
                                { title: "Pengaturan Keamanan", desc: "Atur keamanan akun dan sistem" },
                                { title: "Pengaturan Tampilan", desc: "Atur tema, warna, dan tampilan aplikasi" }
                            ].map((item, idx) => (
                                <div key={idx} onClick={() => showToast(`Membuka ${item.title}...`)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", cursor: "pointer", transition: "all 0.2s" }} className="hover-card">
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
                                        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(37, 99, 235, 0.08)", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Sliders size={18} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: "750", fontSize: "0.85rem", color: "#1e293b" }}>{item.title}</div>
                                            <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "1px" }}>{item.desc}</div>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} color="#94a3b8" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card: Informasi Sistem */}
                    <div className="card-settings">
                        <div className="card-header-settings">
                            <div className="card-title-settings" style={{ color: "#2563eb" }}>
                                <Info size={20} />
                                <span>Informasi Sistem</span>
                            </div>
                        </div>
                        <div className="card-body-settings" style={{ gap: "1rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
                                {[
                                    { label: "Versi Aplikasi", val: "1.0.0" },
                                    { label: "Lingkungan", val: "Production" },
                                    { label: "Database", val: "MySQL 8.0" },
                                    { label: "Server", val: "Nginx 1.20" },
                                    { label: "Waktu Server", val: "17 Mei 2026 10:10 WIB" },
                                    { label: "Hak Akses", val: "Super Administrator" }
                                ].map((kv, idx) => (
                                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "110px 10px 1fr", fontSize: "0.82rem", color: "#475569" }}>
                                        <span style={{ fontWeight: "600" }}>{kv.label}</span>
                                        <span>:</span>
                                        <span style={{ fontWeight: "750", color: "#1e293b" }}>{kv.val}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <button onClick={() => showToast("Sistem Anda adalah yang terbaru.")} style={{ width: "100%", background: "#f0f9ff", border: "1px solid #bae6fd", color: "#0369a1", borderRadius: "12px", padding: "0.75rem", fontWeight: "750", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: "pointer" }} className="hover-card">
                                <RefreshCw size={14} className="animate-spin-slow" />
                                <span>Cek Pembaruan</span>
                            </button>
                        </div>
                    </div>

                    {/* Card: Aksi Cepat */}
                    <div className="card-settings">
                        <div className="card-header-settings">
                            <div className="card-title-settings" style={{ color: "#2563eb" }}>
                                <Zap size={20} />
                                <span>Aksi Cepat</span>
                            </div>
                        </div>
                        <div className="card-body-settings" style={{ gap: "0.75rem" }}>
                            {[
                                { title: "Bersihkan Cache", desc: "Hapus cache sistem", bg: "rgba(249, 115, 22, 0.08)", color: "#f97316", icon: <Trash size={18} />, action: handleClearCache },
                                { title: "Ekspor Data Alumni", desc: "Ekspor semua data ke Excel", bg: "rgba(21, 128, 61, 0.08)", color: "#15803d", icon: <Download size={18} />, action: handleExport },
                                { title: "Impor Data Alumni", desc: "Impor data dari file Excel", bg: "rgba(37, 99, 235, 0.08)", color: "#2563eb", icon: <Upload size={18} />, action: () => showToast("Modul impor data alumni aktif.") },
                                { title: "Reset Pengaturan", desc: "Kembalikan ke pengaturan default", bg: "rgba(239, 68, 68, 0.08)", color: "#ef4444", icon: <Power size={18} />, action: handleResetSettings }
                            ].map((item, idx) => (
                                <div key={idx} onClick={item.action} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", cursor: "pointer", transition: "all 0.2s" }} className="hover-card">
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
                                        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: item.bg, color: item.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: "750", fontSize: "0.85rem", color: "#1e293b" }}>{item.title}</div>
                                            <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "1px" }}>{item.desc}</div>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} color="#94a3b8" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <footer style={{ textAlign: "center", paddingTop: "3rem", paddingBottom: "1rem", color: "#94a3b8", fontSize: "0.82rem", fontWeight: "600" }}>
                    © 2026 SAADA (Sistem Arsip Alumni ASSA&apos;ADAH) | Prototipe Penelitian Skripsi MTS
                </footer>
            </div>

            {/* ══════════════ MODALS ══════════════ */}

            {/* Ganti PIN Scan */}
            {showChangePinModal && (
                <ModalWrapper onClose={() => setShowChangePinModal(false)}>
                    <ModalHeader icon={<KeyRound size={20} color="#15803d" />} title="Ganti PIN Scan" onClose={() => setShowChangePinModal(false)} />
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const cur = (document.getElementById("pin-cur") as HTMLInputElement).value;
                        const nw = (document.getElementById("pin-new") as HTMLInputElement).value;
                        const cf = (document.getElementById("pin-cf") as HTMLInputElement).value;
                        if (cur !== scanPin) { showToast("PIN lama tidak sesuai.", "error"); return; }
                        if (nw.length < 4) { showToast("PIN baru minimal 4 digit.", "error"); return; }
                        if (nw !== cf) { showToast("Konfirmasi PIN tidak cocok.", "error"); return; }
                        setScanPin(nw);
                        setPinLastChanged(new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }));
                        setShowChangePinModal(false);
                        showToast("PIN Scan berhasil diganti.");
                    }}>
                        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <FormField label="PIN Lama" id="pin-cur" type="password" inputMode="numeric" center letterSpacing />
                            <FormField label="PIN Baru (min. 4 digit)" id="pin-new" type="password" inputMode="numeric" center letterSpacing />
                            <FormField label="Konfirmasi PIN Baru" id="pin-cf" type="password" inputMode="numeric" center letterSpacing />
                            <button type="submit" style={btnGreenStyle}>Simpan PIN Baru</button>
                        </div>
                    </form>
                </ModalWrapper>
            )}

            {/* Tambah Pengguna */}
            {showAddUserModal && (
                <ModalWrapper onClose={() => setShowAddUserModal(false)}>
                    <ModalHeader icon={<UserPlus size={20} color="#7c3aed" />} title="Tambah Pengguna Baru" onClose={() => setShowAddUserModal(false)} />
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const fn = (document.getElementById("new-fullname") as HTMLInputElement).value;
                        const em = (document.getElementById("new-email") as HTMLInputElement).value;
                        const rl = (document.getElementById("new-role") as HTMLSelectElement).value as Role;
                        
                        try {
                            setIsLoading(true);
                            const apiBase = typeof window !== "undefined" ? `http://${window.location.hostname}:5084/api` : "http://localhost:5084/api";
                            const regRes = await fetch(`${apiBase}/auth/register`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ nama: fn, email: em, password: "password123" })
                            });
                            
                            if(!regRes.ok) throw new Error("Gagal mendaftarkan user baru");
                            
                            await fetchUsers();
                            setShowAddUserModal(false);
                            showToast(`Pengguna ${fn} berhasil ditambahkan.`);
                        } catch (err: any) {
                            // Local fallback if API fails
                            const newId = userList.length + 1;
                            setUserList([...userList, { id: newId, fullName: fn, email: em, role: rl, active: true }]);
                            setShowAddUserModal(false);
                            showToast(`Pengguna ${fn} berhasil ditambahkan (Demo Mode).`);
                        } finally {
                            setIsLoading(false);
                        }
                    }}>
                        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <FormField label="Nama Lengkap" id="new-fullname" type="text" />
                            <FormField label="Email" id="new-email" type="email" />
                            <div>
                                <label style={labelStyle}>Role</label>
                                <select id="new-role" required style={{ ...inputStyle, cursor: "pointer" }}>
                                    <option value="Operator">Operator</option>
                                    <option value="Petugas">Petugas</option>
                                    <option value="Admin">Admin</option>
                                    <option value="AdminSuper">Super Admin</option>
                                </select>
                            </div>
                            <button type="submit" style={{ ...btnGreenStyle, background: "#7c3aed" }}>Tambahkan Pengguna</button>
                        </div>
                    </form>
                </ModalWrapper>
            )}

            <style>{`
                .settings-grid-main {
                    display: grid;
                    grid-template-columns: 1.05fr 1fr;
                    gap: 1.5rem;
                }
                .settings-grid-bottom {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 1.5rem;
                    margin-top: 1.5rem;
                }
                .card-settings {
                    background: #ffffff;
                    border: 1px solid #f1f5f9;
                    border-radius: 20px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .card-header-settings {
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid #f8fafc;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .card-title-settings {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.05rem;
                    font-weight: 850;
                    letter-spacing: -0.3px;
                }
                .card-body-settings {
                    padding: 1.5rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                
                @media (max-width: 1024px) {
                    .settings-grid-main { grid-template-columns: 1fr !important; }
                    .settings-grid-bottom { grid-template-columns: 1fr !important; }
                }
                @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
                
                .animate-spin { animation: spin 1s linear infinite; }
                .animate-spin-slow { animation: spin 3s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                
                .hover-card { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
                .hover-card:hover { transform: translateY(-2px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05) !important; }
                .hover-card:active { transform: translateY(0px); }

                /* Switch Style */
                .switch { position: relative; display: inline-block; width: 48px; height: 26px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #e2e8f0; transition: .3s; }
                .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: white; transition: .3s; }
                input:checked + .slider { background-color: #15803d; }
                input:focus + .slider { box-shadow: 0 0 1px #15803d; }
                input:checked + .slider:before { transform: translateX(22px); }
                .slider.round { border-radius: 34px; }
                .slider.round:before { border-radius: 50%; }
            `}</style>
        </AdminLayout>
    );
}

// ── Shared style helpers ──────────────────────────────────
const btnGreenStyle: React.CSSProperties = {
    width: "100%", padding: "0.8rem", background: "#15803d",
    color: "white", border: "none", borderRadius: "12px",
    fontWeight: "750", cursor: "pointer", fontSize: "0.95rem",
    marginTop: "0.25rem", transition: "all 0.2s"
};
const labelStyle: React.CSSProperties = {
    display: "block", marginBottom: "0.5rem",
    fontWeight: "750", fontSize: "0.85rem", color: "#475569"
};
const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem",
    borderRadius: "12px", border: "1px solid #d1d5db",
    fontSize: "0.95rem", outline: "none", transition: "all 0.2s"
};

// ── Sub-components ────────────────────────────────────────
function ModalWrapper({ children, onClose, wide }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
    return (
        <div onClick={onClose} style={{
            position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 3000, padding: "1rem", animation: "fadeIn 0.2s ease"
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                background: "white", borderRadius: "24px",
                maxWidth: wide ? "600px" : "440px", width: "100%",
                maxHeight: "92vh", overflow: "hidden", display: "flex",
                flexDirection: "column", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)"
            }}>
                {children}
            </div>
        </div>
    );
}

function ModalHeader({ icon, title, onClose }: { icon: React.ReactNode; title: string; onClose: () => void }) {
    return (
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                {icon}
                <h3 style={{ fontSize: "1.05rem", fontWeight: "850", color: "#1e293b", margin: 0 }}>{title}</h3>
            </div>
            <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                <XCircle size={22} />
            </button>
        </div>
    );
}

function FormField({ label, id, type, defaultValue, inputMode, center, letterSpacing }: {
    label: string; id: string; type: string; defaultValue?: string;
    inputMode?: "numeric"; center?: boolean; letterSpacing?: boolean;
}) {
    return (
        <div>
            <label htmlFor={id} style={labelStyle}>{label}</label>
            <input
                id={id} type={type}
                inputMode={inputMode}
                defaultValue={defaultValue}
                required
                style={{
                    ...inputStyle,
                    textAlign: center ? "center" : "left",
                    letterSpacing: letterSpacing ? "0.3em" : "normal",
                    fontSize: letterSpacing ? "1.1rem" : "0.95rem",
                }}
            />
        </div>
    );
}
