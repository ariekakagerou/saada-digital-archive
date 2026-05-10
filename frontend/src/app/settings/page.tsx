"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import {
    User, Edit, Lock, LogOut, FileSpreadsheet, RefreshCw, HelpCircle,
    ChevronRight, Shield, Eye, EyeOff, CheckCircle, XCircle, Loader2,
    KeyRound, Users, Activity, Info, Trash2, UserPlus, AlertTriangle,
    ChevronDown, ChevronUp
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as api from "../../../services/api";

type Role = "Operator" | "Penulis" | "Admin" | "AdminSuper";

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
    { id: 1, fullName: "Bapak Syaiful", email: "syaiful@mts.sch.id", role: "AdminSuper", active: true },
    { id: 2, fullName: "Ibu Rahma", email: "rahma@mts.sch.id", role: "Admin", active: true },
    { id: 3, fullName: "Ahmad Fauzi", email: "fauzi@mts.sch.id", role: "Operator", active: true },
    { id: 4, fullName: "Siti Aminah", email: "siti@mts.sch.id", role: "Penulis", active: false },
];

const DUMMY_LOGS: ActivityLog[] = [
    { id: 1, user: "Ahmad Fauzi", action: "Upload", detail: "Mengunggah arsip NISN 1234567890", time: "12 Mar 2026, 14:32" },
    { id: 2, user: "Ibu Rahma", action: "Edit", detail: "Mengedit data alumni Budi Santoso", time: "12 Mar 2026, 13:10" },
    { id: 3, user: "Bapak Syaiful", action: "Login", detail: "Login ke sistem SAADA", time: "12 Mar 2026, 08:00" },
    { id: 4, user: "Siti Aminah", action: "Export", detail: "Mengunduh data alumni format CSV", time: "11 Mar 2026, 16:45" },
    { id: 5, user: "Ahmad Fauzi", action: "Scan", detail: "Scan kamera berkas NISN 9876543210", time: "11 Mar 2026, 10:20" },
];

const ROLE_LABELS: Record<Role, string> = {
    Operator: "Operator",
    Penulis: "Penulis",
    Admin: "Admin",
    AdminSuper: "Super Admin",
};

const ROLE_COLORS: Record<Role, { bg: string; text: string }> = {
    Operator: { bg: "#dbeafe", text: "#1e40af" },
    Penulis: { bg: "#fef9c3", text: "#854d0e" },
    Admin: { bg: "#dcfce7", text: "#166534" },
    AdminSuper: { bg: "#f3e8ff", text: "#581c87" },
};

export default function SettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [currentRole, setCurrentRole] = useState<Role>("Operator");
    const [currentUser, setCurrentUser] = useState({ fullName: "", email: "" });

    // Modal states
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showChangePinModal, setShowChangePinModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showAppInfoModal, setShowAppInfoModal] = useState(false);

    // Data states
    const [userProfile, setUserProfile] = useState({ fullName: "Petugas Admin MTS", email: "admin@mts.sch.id" });
    const [scanPin, setScanPin] = useState("123456");
    const [showPin, setShowPin] = useState(false);
    const [pinLastChanged, setPinLastChanged] = useState("Belum pernah diubah");
    const [userList, setUserList] = useState<UserAccount[]>(DUMMY_USERS);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [logsExpanded, setLogsExpanded] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "error" }>({
        show: false, msg: "", type: "success"
    });

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            const u = JSON.parse(stored);
            setCurrentRole(u.role as Role);
            setCurrentUser({ fullName: u.fullName || "Pengguna", email: u.email || "-" });
            setUserProfile({ fullName: u.fullName || "Pengguna", email: u.email || "-" });
        }
        
        // Fetch real users if admin
        fetchUsers();
        // Fetch activity logs
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
            setLogs(mappedLogs);
        } catch (err) {
            console.error("Failed to fetch logs:", err);
            setLogs(DUMMY_LOGS); // fallback if error
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await api.getUsers();
            // Transform backend fields if necessary (Active vs active, Role vs role)
            const mapped = data.map((u: any) => ({
                id: u.id,
                fullName: u.fullName,
                email: u.email,
                role: u.role as Role,
                active: u.active
            }));
            setUserList(mapped);
        } catch (err) {
            console.error("Failed to fetch users, using dummy data:", err);
            setUserList(DUMMY_USERS);
        }
    };

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3500);
    };

    const handleLogout = () => {
        setIsLoading(true);
        localStorage.removeItem("user");
        setTimeout(() => router.push("/login"), 1000);
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
        }, 1500);
    };

    const handleBackup = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            showToast("Backup berhasil disinkronkan ke server eksternal.");
        }, 2000);
    };

    const handleToggleUser = async (id: number) => {
        const user = userList.find(u => u.id === id);
        if (!user) return;

        try {
            setIsLoading(true);
            await api.updateUser(id, {
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                active: !user.active
            });
            await fetchUsers();
            showToast("Status pengguna diperbarui.");
        } catch (err: any) {
            showToast(err.message || "Gagal memperbarui status", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            setIsLoading(true);
            await api.deleteUser(id);
            await fetchUsers();
            setDeleteConfirmId(null);
            showToast("Pengguna berhasil dihapus.");
        } catch (err: any) {
            showToast(err.message || "Gagal menghapus pengguna", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearLogs = async () => {
        try {
            setIsLoading(true);
            await api.clearLogs();
            setLogs([]);
            showToast("Log aktivitas telah dihapus dari sistem.");
        } catch (err: any) {
            showToast(err.message || "Gagal menghapus log", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Role permission helpers
    const can = {
        editPin: currentRole === "Admin" || currentRole === "AdminSuper",
        viewPin: currentRole === "Operator" || currentRole === "Admin" || currentRole === "AdminSuper",
        sistem: currentRole === "Admin" || currentRole === "AdminSuper",
        logs: currentRole === "Admin" || currentRole === "AdminSuper",
        clearLogs: currentRole === "AdminSuper",
        manageUsers: currentRole === "AdminSuper",
    };

    const visibleLogs = logsExpanded ? logs : logs.slice(0, 3);

    return (
        <AdminLayout>
            {/* Toast */}
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
                        <Loader2 size={48} color="#15803d" style={{ animation: "spin 1s linear infinite" }} />
                        <span style={{ fontWeight: "600", color: "#15803d" }}>Memproses...</span>
                    </div>
                </div>
            )}

            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

                {/* Header */}
                <header style={{ marginBottom: "2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <h1 style={{ fontSize: "2rem", color: "var(--text-heading)", fontWeight: "700", margin: 0 }}>Pengaturan</h1>
                        {/* Role Badge */}
                        <span style={{
                            background: ROLE_COLORS[currentRole]?.bg ?? "#f3f4f6",
                            color: ROLE_COLORS[currentRole]?.text ?? "#374151",
                            padding: "0.35rem 0.9rem", borderRadius: "20px",
                            fontWeight: "700", fontSize: "0.8rem", letterSpacing: "0.03em"
                        }}>
                            {ROLE_LABELS[currentRole]}
                        </span>
                    </div>
                    <p style={{ color: "var(--text-muted)", paddingBottom: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
                        Kelola pengaturan akun dan aplikasi sesuai hak akses Anda.
                    </p>
                </header>

                <div className="settings-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>

                    {/* ── LEFT COLUMN ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                        {/* Card: Akun — semua role */}
                        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                            <div style={{ padding: "1rem 1.5rem", background: "#f0fdf4", borderBottom: "1px solid #dcfce7", display: "flex", alignItems: "center", gap: "0.5rem", color: "#166534", fontWeight: "700", fontSize: "1.1rem" }}>
                                <User size={18} /> Akun
                            </div>
                            <div style={{ padding: "1.5rem" }}>
                                <div className="profile-container" style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
                                    <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #bbf7d0", flexShrink: 0 }}>
                                        <User size={36} color="#15803d" />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-heading)", marginBottom: "0.2rem" }}>{userProfile.fullName}</h3>
                                        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.4rem" }}>{userProfile.email}</p>
                                        <span style={{
                                            background: ROLE_COLORS[currentRole]?.bg ?? "#f3f4f6",
                                            color: ROLE_COLORS[currentRole]?.text ?? "#374151",
                                            padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "600"
                                        }}>
                                            {ROLE_LABELS[currentRole]}
                                        </span>
                                    </div>
                                </div>
                                <div className="profile-actions" style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
                                    <button onClick={() => setShowProfileModal(true)} className="btn" style={{ background: "#15803d", color: "white", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.6rem", fontSize: "0.875rem" }}>
                                        <Edit size={15} /> Ubah Profil
                                    </button>
                                    <button onClick={() => setShowPasswordModal(true)} className="btn" style={{ background: "#15803d", color: "white", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.6rem", fontSize: "0.875rem" }}>
                                        <Lock size={15} /> Ganti Password
                                    </button>
                                </div>
                                <button onClick={handleLogout} className="btn" style={{ background: "#fef2f2", color: "#991b1b", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.6rem", border: "1px solid #fecaca", fontSize: "0.875rem" }}>
                                    <LogOut size={15} /> Keluar Akun
                                </button>
                            </div>
                        </div>

                        {/* Card: PIN Scan — Operator (read-only), Admin, AdminSuper (edit) */}
                        {can.viewPin && (
                            <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                                <div style={{ padding: "1rem 1.5rem", background: "#f0fdf4", borderBottom: "1px solid #dcfce7", display: "flex", alignItems: "center", gap: "0.5rem", color: "#166534", fontWeight: "700", fontSize: "1.1rem" }}>
                                    <Shield size={18} /> PIN Scan Keamanan
                                    {!can.editPin && (
                                        <span style={{ marginLeft: "auto", fontSize: "0.7rem", background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: "8px", fontWeight: "600" }}>Lihat Saja</span>
                                    )}
                                </div>
                                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                                    <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "1.1rem" }}>
                                        <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6b7280", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>PIN Aktif Saat Ini</p>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <span style={{ fontSize: "1.7rem", fontWeight: "700", letterSpacing: "0.35em", color: "#111827", fontFamily: "monospace" }}>
                                                {showPin ? scanPin : "•".repeat(scanPin.length)}
                                            </span>
                                            <button onClick={() => setShowPin(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "0.25rem" }} title={showPin ? "Sembunyikan" : "Tampilkan"}>
                                                {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "0.4rem" }}>Terakhir diubah: <strong>{pinLastChanged}</strong></p>
                                    </div>
                                    <div style={{ background: "#fefce8", border: "1px solid #fef08a", borderRadius: "8px", padding: "0.8rem 1rem", fontSize: "0.82rem", color: "#854d0e", lineHeight: "1.5" }}>
                                        ℹ️ PIN ini digunakan petugas untuk membuka akses <strong>Scan Kamera</strong>.
                                    </div>
                                    {can.editPin && (
                                        <button onClick={() => setShowChangePinModal(true)} className="btn" style={{ background: "#15803d", color: "white", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.65rem", fontSize: "0.875rem" }}>
                                            <KeyRound size={15} /> Ganti PIN Scan
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Card: Manajemen Pengguna — AdminSuper only */}
                        {can.manageUsers && (
                            <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                                <div style={{ padding: "1rem 1.5rem", background: "#faf5ff", borderBottom: "1px solid #e9d5ff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#581c87", fontWeight: "700", fontSize: "1.1rem" }}>
                                        <Users size={18} /> Manajemen Pengguna
                                    </div>
                                    <button onClick={() => setShowAddUserModal(true)} style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "#7c3aed", color: "white", border: "none", borderRadius: "8px", padding: "0.4rem 0.9rem", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer" }}>
                                        <UserPlus size={14} /> Tambah
                                    </button>
                                </div>
                                <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                    {userList.map(u => (
                                        <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", background: u.active ? "#fafafa" : "#f3f4f6", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
                                            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: u.active ? "#dcfce7" : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <User size={18} color={u.active ? "#15803d" : "#9ca3af"} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: "600", fontSize: "0.875rem", color: u.active ? "#111827" : "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.fullName}</div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "2px" }}>
                                                    <span style={{ fontSize: "0.72rem", background: ROLE_COLORS[u.role]?.bg, color: ROLE_COLORS[u.role]?.text, padding: "1px 7px", borderRadius: "8px", fontWeight: "600" }}>
                                                        {ROLE_LABELS[u.role]}
                                                    </span>
                                                    {!u.active && <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Nonaktif</span>}
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", gap: "0.4rem" }}>
                                                <button onClick={() => handleToggleUser(u.id)} style={{ background: u.active ? "#fee2e2" : "#dcfce7", color: u.active ? "#991b1b" : "#166534", border: "none", borderRadius: "6px", padding: "0.3rem 0.7rem", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer" }}>
                                                    {u.active ? "Nonaktifkan" : "Aktifkan"}
                                                </button>
                                                {deleteConfirmId === u.id ? (
                                                    <button onClick={() => handleDeleteUser(u.id)} style={{ background: "#dc2626", color: "white", border: "none", borderRadius: "6px", padding: "0.3rem 0.7rem", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer" }}>
                                                        Yakin Hapus?
                                                    </button>
                                                ) : (
                                                    <button onClick={() => setDeleteConfirmId(u.id)} style={{ background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: "6px", padding: "0.3rem", cursor: "pointer", display: "flex", alignItems: "center" }}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                        {/* Card: Sistem — Admin & AdminSuper */}
                        {can.sistem && (
                            <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                                <div style={{ padding: "1rem 1.5rem", background: "#f0fdf4", borderBottom: "1px solid #dcfce7", display: "flex", alignItems: "center", gap: "0.5rem", color: "#166534", fontWeight: "700", fontSize: "1.1rem" }}>
                                    <RefreshCw size={18} /> Sistem
                                </div>
                                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                    <div>
                                        <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-heading)", marginBottom: "0.9rem" }}>Backup Data</h4>
                                        <div className="backup-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem", marginBottom: "0.9rem" }}>
                                            <button onClick={handleExport} className="hover-card" style={{ background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "8px", padding: "1.2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem", cursor: "pointer", transition: "all 0.2s" }}>
                                                <div style={{ padding: "0.5rem", background: "#15803d", borderRadius: "6px", color: "white" }}><FileSpreadsheet size={22} /></div>
                                                <span style={{ fontWeight: "600", color: "#166534", fontSize: "0.85rem" }}>Download Excel</span>
                                            </button>
                                            <button onClick={handleBackup} className="hover-card" style={{ background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "8px", padding: "1.2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem", cursor: "pointer", transition: "all 0.2s" }}>
                                                <div style={{ padding: "0.5rem", background: "#15803d", borderRadius: "6px", color: "white" }}><RefreshCw size={22} /></div>
                                                <span style={{ fontWeight: "600", color: "#166534", fontSize: "0.85rem" }}>Backup Otomatis</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ height: "1px", background: "#e5e7eb" }} />
                                    
                                    {/* Simulasi & Demo Section */}
                                    <div>
                                        <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-heading)", marginBottom: "0.9rem" }}>Simulasi & Demo</h4>
                                        <div style={{ 
                                            padding: "1rem", 
                                            background: "#f8fafc", 
                                            border: "1px solid #e2e8f0", 
                                            borderRadius: "10px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between"
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: "600", fontSize: "0.85rem", color: "#334155" }}>Mode Offline (Simulasi)</div>
                                                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Gunakan untuk demo saat sidang.</div>
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

                                    <div style={{ height: "1px", background: "#e5e7eb" }} />
                                    <div onClick={() => setShowHelpModal(true)} className="hover-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.9rem", background: "#f9fafb", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                            <HelpCircle size={18} color="#15803d" />
                                            <span style={{ fontWeight: "600", color: "var(--text-heading)", fontSize: "0.9rem" }}>Bantuan & Kontak</span>
                                        </div>
                                        <ChevronRight size={16} color="#9ca3af" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Card: Log Aktivitas — Admin & AdminSuper */}
                        {can.logs && (
                            <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                                <div style={{ padding: "1rem 1.5rem", background: "#fff7ed", borderBottom: "1px solid #fed7aa", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#9a3412", fontWeight: "700", fontSize: "1.1rem" }}>
                                        <Activity size={18} /> Log Aktivitas
                                    </div>
                                    {can.clearLogs && logs.length > 0 && (
                                        <button onClick={handleClearLogs} style={{ background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: "6px", padding: "0.3rem 0.8rem", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer" }}>
                                            Hapus Semua
                                        </button>
                                    )}
                                </div>
                                <div style={{ padding: "1rem" }}>
                                    {logs.length === 0 ? (
                                        <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af", fontSize: "0.875rem" }}>Tidak ada log aktivitas.</div>
                                    ) : (
                                        <>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                {visibleLogs.map(log => (
                                                    <div key={log.id} style={{ display: "flex", gap: "0.75rem", padding: "0.75rem", background: "#f9fafb", borderRadius: "8px", border: "1px solid #f3f4f6" }}>
                                                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f97316", marginTop: "5px", flexShrink: 0 }} />
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                                                                <span style={{ fontWeight: "600", fontSize: "0.82rem", color: "#111827" }}>{log.user}</span>
                                                                <span style={{ fontSize: "0.7rem", color: "#9ca3af", whiteSpace: "nowrap" }}>{log.time}</span>
                                                            </div>
                                                            <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "2px" }}>
                                                                <span style={{ background: "#fff7ed", color: "#9a3412", padding: "1px 6px", borderRadius: "4px", fontWeight: "600", fontSize: "0.7rem", marginRight: "6px" }}>{log.action}</span>
                                                                {log.detail}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {logs.length > 3 && (
                                                <button onClick={() => setLogsExpanded(p => !p)} style={{ width: "100%", marginTop: "0.75rem", background: "none", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "0.5rem", cursor: "pointer", fontSize: "0.8rem", color: "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem", fontWeight: "600" }}>
                                                    {logsExpanded ? <><ChevronUp size={14} /> Sembunyikan</> : <><ChevronDown size={14} /> Lihat {logs.length - 3} log lainnya</>}
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Card: Bantuan (untuk semua role yang tidak punya kartu Sistem) */}
                        {!can.sistem && (
                            <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                                <div style={{ padding: "1rem 1.5rem", background: "#f0fdf4", borderBottom: "1px solid #dcfce7", display: "flex", alignItems: "center", gap: "0.5rem", color: "#166534", fontWeight: "700", fontSize: "1.1rem" }}>
                                    <HelpCircle size={18} /> Bantuan
                                </div>
                                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    <div onClick={() => setShowHelpModal(true)} className="hover-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.9rem", background: "#f9fafb", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                            <HelpCircle size={18} color="#15803d" />
                                            <span style={{ fontWeight: "600", color: "var(--text-heading)", fontSize: "0.9rem" }}>Bantuan & Kontak</span>
                                        </div>
                                        <ChevronRight size={16} color="#9ca3af" />
                                    </div>
                                    <div onClick={() => setShowAppInfoModal(true)} className="hover-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.9rem", background: "#f9fafb", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                            <Info size={18} color="#15803d" />
                                            <span style={{ fontWeight: "600", color: "var(--text-heading)", fontSize: "0.9rem" }}>Informasi Aplikasi</span>
                                        </div>
                                        <ChevronRight size={16} color="#9ca3af" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Card: Informasi Aplikasi (untuk Admin & SuperAdmin) */}
                        {can.sistem && (
                            <div onClick={() => setShowAppInfoModal(true)} className="hover-card" style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: "1.1rem 1.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <Info size={20} color="#15803d" />
                                    <div>
                                        <div style={{ fontWeight: "700", color: "var(--text-heading)", fontSize: "0.95rem" }}>Informasi Aplikasi</div>
                                        <div style={{ fontSize: "0.78rem", color: "#9ca3af" }}>SAADA v1.0 — Skripsi 2026</div>
                                    </div>
                                </div>
                                <ChevronRight size={16} color="#9ca3af" />
                            </div>
                        )}
                    </div>
                </div>

                <footer style={{ textAlign: "center", paddingTop: "3rem", paddingBottom: "1rem", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                    © 2026 <strong>SAADA (Sistem Arsip Alumni ASSA&apos;ADAH)</strong> | Prototipe Penelitian Skripsi MTS
                </footer>
            </div>

            {/* ══════════════ MODALS ══════════════ */}

            {/* Ubah Profil */}
            {showProfileModal && (
                <ModalWrapper onClose={() => setShowProfileModal(false)}>
                    <ModalHeader icon={<Edit size={20} color="#15803d" />} title="Ubah Profil Akun" onClose={() => setShowProfileModal(false)} />
                    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <FormField label="Nama Lengkap" id="edit-fullname" type="text" defaultValue={userProfile.fullName} />
                        <FormField label="Alamat Email" id="edit-email" type="email" defaultValue={userProfile.email} />
                        <button onClick={() => {
                            const n = (document.getElementById("edit-fullname") as HTMLInputElement).value;
                            const e = (document.getElementById("edit-email") as HTMLInputElement).value;
                            if (n.trim()) setUserProfile({ fullName: n, email: e });
                            setShowProfileModal(false);
                            showToast("Profil berhasil diperbarui.");
                        }} style={btnGreenStyle}>Simpan Perubahan</button>
                    </div>
                </ModalWrapper>
            )}

            {/* Ganti Password */}
            {showPasswordModal && (
                <ModalWrapper onClose={() => setShowPasswordModal(false)}>
                    <ModalHeader icon={<Lock size={20} color="#15803d" />} title="Ganti Password" onClose={() => setShowPasswordModal(false)} />
                    <form onSubmit={(e) => { e.preventDefault(); setShowPasswordModal(false); showToast("Password berhasil diganti."); }}>
                        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <FormField label="Password Lama" id="pw-old" type="password" />
                            <FormField label="Password Baru (min. 6 karakter)" id="pw-new" type="password" />
                            <FormField label="Konfirmasi Password Baru" id="pw-confirm" type="password" />
                            <button type="submit" style={btnGreenStyle}>Simpan Password Baru</button>
                        </div>
                    </form>
                </ModalWrapper>
            )}

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
                            // Use Auth register
                            const regRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5084/api"}/auth/register`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ nama: fn, email: em, password: "password123" }) // Default password
                            });
                            
                            if(!regRes.ok) throw new Error("Gagal mendaftarkan user baru");
                            
                            await fetchUsers();
                            setShowAddUserModal(false);
                            showToast(`Pengguna ${fn} berhasil ditambahkan.`);
                        } catch (err: any) {
                            showToast(err.message || "Gagal mendaftarkan user baru", "error");
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
                                    <option value="Penulis">Penulis</option>
                                    <option value="Admin">Admin</option>
                                    <option value="AdminSuper">Super Admin</option>
                                </select>
                            </div>
                            <button type="submit" style={{ ...btnGreenStyle, background: "#7c3aed" }}>Tambahkan Pengguna</button>
                        </div>
                    </form>
                </ModalWrapper>
            )}

            {/* Bantuan & Kontak */}
            {showHelpModal && (
                <ModalWrapper onClose={() => setShowHelpModal(false)} wide>
                    <ModalHeader icon={<HelpCircle size={20} color="#15803d" />} title="Bantuan & Kontak" onClose={() => setShowHelpModal(false)} />
                    <div style={{ padding: "1.5rem", overflowY: "auto", maxHeight: "60vh" }}>
                        <h4 style={{ fontWeight: "700", marginBottom: "1rem", color: "var(--text-heading)" }}>FAQ</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                            {[
                                { q: "Bagaimana jika OCR salah membaca data?", a: "Gunakan fitur \"Verifikasi Manual\" pada halaman detail arsip untuk memperbaiki teks secara langsung." },
                                { q: "Format gambar apa yang disarankan?", a: "Sistem bekerja optimal dengan format JPG/PNG resolusi minimal 300 DPI." },
                                { q: "Di mana data backup disimpan?", a: "Data di-backup setiap Minggu ke server cloud terenkripsi khusus MTs." },
                            ].map((faq, i) => (
                                <div key={i} style={{ background: "#f9fafb", padding: "1rem", borderRadius: "8px" }}>
                                    <div style={{ fontWeight: "600", color: "#15803d", marginBottom: "0.25rem", fontSize: "0.9rem" }}>{faq.q}</div>
                                    <div style={{ fontSize: "0.85rem", color: "#4b5563" }}>{faq.a}</div>
                                </div>
                            ))}
                        </div>
                        <h4 style={{ fontWeight: "700", marginBottom: "1rem", color: "var(--text-heading)" }}>Kontak Dukungan Teknis</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <a href="mailto:support@mts.sch.id" style={{ textDecoration: "none", padding: "1rem", background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                <span style={{ fontSize: "0.78rem", color: "#166534" }}>Email</span>
                                <span style={{ fontWeight: "600", color: "#15803d", fontSize: "0.9rem" }}>support@mts.sch.id</span>
                            </a>
                            <a href="#" style={{ textDecoration: "none", padding: "1rem", background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                <span style={{ fontSize: "0.78rem", color: "#166534" }}>WhatsApp</span>
                                <span style={{ fontWeight: "600", color: "#15803d", fontSize: "0.9rem" }}>+62 812-3456-7890</span>
                            </a>
                        </div>
                    </div>
                    <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e5e7eb", background: "#f9fafb", textAlign: "center", fontSize: "0.8rem", color: "#9ca3af" }}>
                        SAADA v1.0 — Prototipe Skripsi 2026
                    </div>
                </ModalWrapper>
            )}

            {/* Informasi Aplikasi */}
            {showAppInfoModal && (
                <ModalWrapper onClose={() => setShowAppInfoModal(false)}>
                    <ModalHeader icon={<Info size={20} color="#15803d" />} title="Informasi Aplikasi" onClose={() => setShowAppInfoModal(false)} />
                    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {[
                            { label: "Nama Aplikasi", value: "SAADA (Sistem Arsip Alumni ASSA'ADAH)" },
                            { label: "Versi", value: "1.0.0 (Prototipe)" },
                            { label: "Platform", value: "Next.js 16 + React 19" },
                            { label: "Instansi", value: "MTs Assa'adah" },
                            { label: "Tahun", value: "2026" },
                            { label: "Jenis", value: "Penelitian Skripsi" },
                        ].map((item, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.65rem 0", borderBottom: "1px solid #f3f4f6" }}>
                                <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>{item.label}</span>
                                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#111827", textAlign: "right", maxWidth: "60%" }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </ModalWrapper>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .settings-grid { grid-template-columns: 1fr !important; }
                    .profile-container { flex-direction: column !important; text-align: center; }
                    .profile-actions { flex-direction: column !important; }
                    .backup-grid { grid-template-columns: 1fr !important; }
                }
                @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
                @keyframes spin { to { transform: rotate(360deg); } }
                 .hover-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
                
                /* Switch Style */
                .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; }
                .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; }
                input:checked + .slider { background-color: #15803d; }
                input:focus + .slider { box-shadow: 0 0 1px #15803d; }
                input:checked + .slider:before { transform: translateX(20px); }
                .slider.round { border-radius: 34px; }
                .slider.round:before { border-radius: 50%; }
            `}</style>
        </AdminLayout>
    );
}

// ── Shared style helpers ──────────────────────────────────
const btnGreenStyle: React.CSSProperties = {
    width: "100%", padding: "0.8rem", background: "#15803d",
    color: "white", border: "none", borderRadius: "8px",
    fontWeight: "600", cursor: "pointer", fontSize: "0.95rem",
    marginTop: "0.25rem", transition: "all 0.2s"
};
const labelStyle: React.CSSProperties = {
    display: "block", marginBottom: "0.5rem",
    fontWeight: "600", fontSize: "0.875rem", color: "#374151"
};
const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.7rem 0.85rem",
    borderRadius: "8px", border: "1px solid #d1d5db",
    fontSize: "0.95rem", outline: "none"
};

// ── Sub-components ────────────────────────────────────────
function ModalWrapper({ children, onClose, wide }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
    return (
        <div onClick={onClose} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 3000, padding: "1rem", animation: "fadeIn 0.25s ease"
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                background: "white", borderRadius: "16px",
                maxWidth: wide ? "600px" : "440px", width: "100%",
                maxHeight: "92vh", overflow: "hidden", display: "flex",
                flexDirection: "column", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
            }}>
                {children}
            </div>
        </div>
    );
}

function ModalHeader({ icon, title, onClose }: { icon: React.ReactNode; title: string; onClose: () => void }) {
    return (
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f0fdf4" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                {icon}
                <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#166534", margin: 0 }}>{title}</h3>
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
