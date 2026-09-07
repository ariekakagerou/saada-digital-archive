"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import {
    User, Edit, Lock, LogOut, Shield, CheckCircle, XCircle, Loader2,
    Mail, Clock, Calendar, ShieldCheck, KeyRound, Info, Laptop,
    Zap, QrCode, Smartphone, Settings, ChevronRight, Camera, Bell,
    GraduationCap, Phone, Globe, Download, Cloud, Save, RotateCcw,
    MapPin, Map, Inbox, CreditCard, Check, MoreVertical, AlertTriangle,
    HelpCircle, Megaphone, FileText, FolderOpen, LogIn, Search, Eye,
    Trash, Filter, ChevronLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

type Role = "Operator" | "Penulis" | "Admin" | "AdminSuper";

const ROLE_LABELS: Record<Role, string> = {
    Operator: "Operator",
    Penulis: "Penulis",
    Admin: "Admin",
    AdminSuper: "Super Administrator",
};

const ROLE_BADGES: Record<Role, string> = {
    Operator: "Operator",
    Penulis: "Penulis",
    Admin: "Admin",
    AdminSuper: "Super Admin",
};

const ROLE_COLORS: Record<Role, { bg: string; text: string; border: string }> = {
    Operator: { bg: "#dbeafe", text: "#1e40af", border: "#bfdbfe" },
    Penulis: { bg: "#fef9c3", text: "#854d0e", border: "#fef08a" },
    Admin: { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" },
    AdminSuper: { bg: "#faf5ff", text: "#6b21a8", border: "#e9d5ff" },
};

export default function ProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [currentRole, setCurrentRole] = useState<Role>("AdminSuper");
    const [userProfile, setUserProfile] = useState({
        fullName: "Super Administrator",
        email: "superadmin@assaadah.sch.id",
        username: "superuser",
        joinedDate: "1 Januari 2024 10:00",
        
        // Data Pribadi
        phone: "0812-3456-7890",
        nik: "3271061705900001",
        gender: "Laki-laki",
        birthPlaceDate: "Bogor, 17 Mei 1990",
        address: "Jl. Pendidikan No. 1, Kec. Cibinong",
        city: "Bogor",
        province: "Jawa Barat",
        postalCode: "16914",
        
        // Informasi Akademik
        nisn: "1234567890",
        tahunMasuk: "2020",
        tahunLulus: "2023",
        jurusan: "IPA",
        angkatan: "2020",
        statusAlumni: "Alumni Aktif",
        unitLembaga: "MTs Assa'adah",
        jabatan: "Super Administrator",

        // Kontak Darurat
        emergencyName: "Ahmad Faisal",
        emergencyRelation: "Kakak Kandung",
        emergencyPhone: "0813-9876-5432",

        // Media Sosial
        facebook: "-",
        instagram: "@assaadah_official",
        linkedIn: "-",
        website: "www.assaadah.sch.id",

        // Photo/Avatar URL
        avatarUrl: ""
    });
    const [sessionTime, setSessionTime] = useState("");
    const [activeTab, setActiveTab] = useState("ringkasan");

    // Modal states
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [modalTab, setModalTab] = useState("pribadi");

    // Notification & Activity states
    const [notifPrefs, setNotifPrefs] = useState({
        email: true,
        login: true,
        password: true,
        archive: true,
        system: true,
        whatsapp: false,
        reminder: false
    });
    const [notifFrequency, setNotifFrequency] = useState("realtime");
    const [activitySearch, setActivitySearch] = useState("");
    const [activityFilter, setActivityFilter] = useState("Semua Aktivitas");
    const [activityPage, setActivityPage] = useState(1);

    const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "error" }>({
        show: false, msg: "", type: "success"
    });

    useEffect(() => {
        setIsMounted(true);
        const stored = localStorage.getItem("user");
        if (stored) {
            const u = JSON.parse(stored);
            setCurrentRole((u.role as Role) || "Operator");
            setUserProfile(prev => ({
                ...prev,
                fullName: u.fullName || prev.fullName,
                email: u.email || prev.email,
                username: u.username || prev.username,
            }));
        }

        // Ambil data profil lengkap dari backend
        fetchApi('/api/profile')
            .then((data: any) => {
                setCurrentRole((data.role as Role) || "Operator");
                setUserProfile(prev => ({
                    ...prev,
                    fullName: data.fullName || prev.fullName,
                    email: data.email || prev.email,
                    username: data.username || prev.username,
                    joinedDate: data.joinedDate || prev.joinedDate,
                    phone: data.profile?.phone || "",
                    nik: data.profile?.nik || "",
                    gender: data.profile?.gender || "",
                    birthPlaceDate: data.profile?.birthPlaceDate || "",
                    address: data.profile?.address || "",
                    city: data.profile?.city || "",
                    province: data.profile?.province || "",
                    postalCode: data.profile?.postalCode || "",
                    nisn: data.profile?.nisn || "",
                    tahunMasuk: data.profile?.tahunMasuk || "",
                    tahunLulus: data.profile?.tahunLulus || "",
                    jurusan: data.profile?.jurusan || "",
                    angkatan: data.profile?.angkatan || "",
                    statusAlumni: data.profile?.statusAlumni || "",
                    unitLembaga: data.profile?.unitLembaga || "",
                    jabatan: data.profile?.jabatan || "",
                    emergencyName: data.profile?.emergencyName || "",
                    emergencyRelation: data.profile?.emergencyRelation || "",
                    emergencyPhone: data.profile?.emergencyPhone || "",
                    facebook: data.profile?.facebook || "",
                    instagram: data.profile?.instagram || "",
                    linkedIn: data.profile?.linkedIn || "",
                    website: data.profile?.website || "",
                    avatarUrl: data.profile?.avatarUrl || "",
                }));
            })
            .catch(() => {
                // Tidak perlu melakukan apa-apa, data lokal masih digunakan
            });

        const options: Intl.DateTimeFormatOptions = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
        };
        const timePart = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setSessionTime(`${new Date().toLocaleDateString('id-ID', options)} pukul ${timePart}`);
    }, []);

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3500);
    };

    const handleLogout = () => {
        setIsLoading(true);
        localStorage.removeItem("user");
        document.cookie = "saada_token=; path=/; max-age=0; SameSite=Strict";
        setTimeout(() => router.push("/login"), 1000);
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showToast("Ukuran foto maksimal 2MB.", "error");
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Url = event.target?.result as string;
                setUserProfile(prev => {
                    const nextProfile = { ...prev, avatarUrl: base64Url };
                    // Persist to localStorage
                    const stored = localStorage.getItem("user");
                    if (stored) {
                        const u = JSON.parse(stored);
                        u.avatarUrl = base64Url;
                        localStorage.setItem("user", JSON.stringify(u));
                    }
                    return nextProfile;
                });
                showToast("Foto profil berhasil diperbarui.");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Data Pribadi
        const n = (document.getElementById("edit-fullname") as HTMLInputElement).value;
        const em = (document.getElementById("edit-email") as HTMLInputElement).value;
        const us = (document.getElementById("edit-username") as HTMLInputElement).value;
        const ph = (document.getElementById("edit-phone") as HTMLInputElement).value;
        const ni = (document.getElementById("edit-nik") as HTMLInputElement).value;
        const ge = (document.getElementById("edit-gender") as HTMLSelectElement).value;
        const bi = (document.getElementById("edit-birthPlaceDate") as HTMLInputElement).value;
        const ad = (document.getElementById("edit-address") as HTMLInputElement).value;
        const ci = (document.getElementById("edit-city") as HTMLInputElement).value;
        const pr = (document.getElementById("edit-province") as HTMLInputElement).value;
        const po = (document.getElementById("edit-postalCode") as HTMLInputElement).value;

        // Informasi Akademik
        const nis = (document.getElementById("edit-nisn") as HTMLInputElement).value;
        const tm = (document.getElementById("edit-tahunMasuk") as HTMLInputElement).value;
        const tl = (document.getElementById("edit-tahunLulus") as HTMLInputElement).value;
        const ju = (document.getElementById("edit-jurusan") as HTMLInputElement).value;
        const an = (document.getElementById("edit-angkatan") as HTMLInputElement).value;
        const sa = (document.getElementById("edit-statusAlumni") as HTMLSelectElement).value;
        const ul = (document.getElementById("edit-unitLembaga") as HTMLInputElement).value;
        const ja = (document.getElementById("edit-jabatan") as HTMLInputElement).value;

        // Kontak Darurat
        const en = (document.getElementById("edit-emergencyName") as HTMLInputElement).value;
        const er = (document.getElementById("edit-emergencyRelation") as HTMLInputElement).value;
        const ep = (document.getElementById("edit-emergencyPhone") as HTMLInputElement).value;

        // Media Sosial
        const fb = (document.getElementById("edit-facebook") as HTMLInputElement).value;
        const ig = (document.getElementById("edit-instagram") as HTMLInputElement).value;
        const li = (document.getElementById("edit-linkedIn") as HTMLInputElement).value;
        const web = (document.getElementById("edit-website") as HTMLInputElement).value;
        
        if (!n.trim() || !em.trim() || !us.trim()) {
            showToast("Nama Lengkap, Email, dan Username wajib diisi.", "error");
            return;
        }

        try {
            await fetchApi('/api/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    fullName: n,
                    email: em,
                    username: us,
                    profile: {
                        phone: ph, nik: ni, gender: ge, birthPlaceDate: bi,
                        address: ad, city: ci, province: pr, postalCode: po,
                        nisn: nis, tahunMasuk: tm, tahunLulus: tl, jurusan: ju,
                        angkatan: an, statusAlumni: sa, unitLembaga: ul, jabatan: ja,
                        emergencyName: en, emergencyRelation: er, emergencyPhone: ep,
                        facebook: fb, instagram: ig, linkedIn: li, website: web,
                        avatarUrl: userProfile.avatarUrl
                    }
                })
            });

            setUserProfile(prev => ({
                ...prev,
                fullName: n, email: em, username: us,
                phone: ph, nik: ni, gender: ge, birthPlaceDate: bi,
                address: ad, city: ci, province: pr, postalCode: po,
                nisn: nis, tahunMasuk: tm, tahunLulus: tl, jurusan: ju,
                angkatan: an, statusAlumni: sa, unitLembaga: ul, jabatan: ja,
                emergencyName: en, emergencyRelation: er, emergencyPhone: ep,
                facebook: fb, instagram: ig, linkedIn: li, website: web
            }));

            // Sinkronkan nama ke localStorage
            const stored = localStorage.getItem("user");
            if (stored) {
                const u = JSON.parse(stored);
                u.fullName = n; u.username = us; u.email = em;
                localStorage.setItem("user", JSON.stringify(u));
                window.dispatchEvent(new Event('storage'));
            }

            setShowProfileModal(false);
            showToast("Profil berhasil diperbarui dan disimpan ke database.");
        } catch (err: any) {
            showToast(err.message || "Gagal menyimpan profil.", "error");
        }
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        const oldPw = (document.getElementById("pw-old") as HTMLInputElement).value;
        const newPw = (document.getElementById("pw-new") as HTMLInputElement).value;
        const confirmPw = (document.getElementById("pw-confirm") as HTMLInputElement).value;

        if (newPw.length < 6) {
            showToast("Password baru minimal 6 karakter.", "error");
            return;
        }

        if (newPw !== confirmPw) {
            showToast("Konfirmasi password baru tidak cocok.", "error");
            return;
        }

        setShowPasswordModal(false);
        showToast("Password berhasil diperbarui.");
    };

    const handleResetProfile = () => {
        const defaultProfile = {
            fullName: "Super Administrator",
            email: "superadmin@assaadah.sch.id",
            username: "superuser",
            joinedDate: "1 Januari 2024 10:00",
            phone: "0812-3456-7890",
            nik: "3271061705900001",
            gender: "Laki-laki",
            birthPlaceDate: "Bogor, 17 Mei 1990",
            address: "Jl. Pendidikan No. 1, Kec. Cibinong",
            city: "Bogor",
            province: "Jawa Barat",
            postalCode: "16914",
            nisn: "1234567890",
            tahunMasuk: "2020",
            tahunLulus: "2023",
            jurusan: "IPA",
            angkatan: "2020",
            statusAlumni: "Alumni Aktif",
            unitLembaga: "MTs Assa'adah",
            jabatan: "Super Administrator",
            emergencyName: "Ahmad Faisal",
            emergencyRelation: "Kakak Kandung",
            emergencyPhone: "0813-9876-5432",
            facebook: "-",
            instagram: "@assaadah_official",
            linkedIn: "-",
            website: "www.assaadah.sch.id",
            avatarUrl: ""
        };
        setUserProfile(defaultProfile);
        const stored = localStorage.getItem("user");
        if (stored) {
            const u = JSON.parse(stored);
            Object.assign(u, defaultProfile);
            localStorage.setItem("user", JSON.stringify(u));
            window.dispatchEvent(new Event('storage'));
        }
        showToast("Informasi data pribadi berhasil direset.");
    };

    if (!isMounted) return null;

    return (
        <AdminLayout>
            <input 
                type="file" 
                id="profile-avatar-input" 
                accept="image/*" 
                style={{ display: "none" }} 
                onChange={handleAvatarUpload} 
            />
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
                        <Loader2 size={48} color="#15803d" style={{ animation: "spin 1s linear infinite" }} />
                        <span style={{ fontWeight: "600", color: "#15803d" }}>Memproses...</span>
                    </div>
                </div>
            )}

            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1.5rem" }}>
                {/* Header */}
                <header style={{ marginBottom: "1.5rem" }}>
                    <h1 style={{ fontSize: "2rem", color: "var(--text-heading)", fontWeight: "800", margin: "0 0 0.35rem 0", fontFamily: "inherit" }}>Profil Saya</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", margin: 0 }}>
                        Kelola data identitas pribadi, keamanan akun, dan preferensi Anda.
                    </p>
                </header>

                {/* Tab Navigation Menu */}
                <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", gap: "2rem", marginBottom: "2rem", overflowX: "auto", scrollbarWidth: "none" }}>
                    {[
                        { id: "ringkasan", label: "Ringkasan Profil" },
                        { id: "pribadi", label: "Informasi Pribadi" },
                        { id: "keamanan", label: "Keamanan & Sesi" },
                        { id: "notifikasi", label: "Notifikasi" },
                        { id: "aktivitas", label: "Aktivitas Akun" }
                    ].map((tab) => {
                        const isTabActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    borderBottom: isTabActive ? "3px solid #15803d" : "3px solid transparent",
                                    padding: "0.75rem 0.25rem",
                                    color: isTabActive ? "#15803d" : "#64748b",
                                    fontWeight: isTabActive ? "700" : "500",
                                    fontSize: "0.95rem",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    transition: "all 0.2s ease",
                                    outline: "none"
                                }}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {activeTab === "ringkasan" ? (
                    /* Main Page Content: Split Column Grid */
                    <div className="grid-profile-layout">
                        
                        {/* LEFT COLUMN */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                            
                            {/* Card: Ringkasan Profil */}
                            <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
                                {/* Curve & Wave Styled Hero Header */}
                                <div style={{ 
                                    height: "120px", 
                                    background: "linear-gradient(135deg, #054c35 0%, #15803d 100%)", 
                                    position: "relative",
                                }}>
                                    {/* Wave Lines wrapped in overflow: hidden to avoid clipping the avatar */}
                                    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                                        {/* High Fidelity Wave Lines */}
                                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, width: "100%", height: "40px", fill: "rgba(255,255,255,0.08)" }}>
                                            <path d="M0,30 Q25,50 50,30 T100,30 L100,100 L0,100 Z" />
                                        </svg>
                                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", bottom: -5, width: "100%", height: "25px", fill: "rgba(255,255,255,0.12)" }}>
                                            <path d="M0,40 Q25,20 50,40 T100,40 L100,100 L0,100 Z" />
                                        </svg>
                                    </div>

                                    {/* Overlapping Avatar Container */}
                                    <div style={{ position: "absolute", bottom: "-36px", left: "24px", display: "flex", alignItems: "flex-end" }}>
                                        <div style={{ position: "relative" }}>
                                             {userProfile.avatarUrl ? (
                                                 <img 
                                                     src={userProfile.avatarUrl} 
                                                     alt="Foto Profil" 
                                                     style={{ 
                                                         width: "88px", 
                                                         height: "88px", 
                                                         borderRadius: "50%", 
                                                         objectFit: "cover", 
                                                         border: "4px solid white", 
                                                         boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                                                     }} 
                                                 />
                                             ) : (
                                                 <svg width="88" height="88" viewBox="0 0 120 120" style={{ borderRadius: "50%", border: "4px solid white", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                                                     <circle cx="60" cy="60" r="60" fill="#dcfce7" />
                                                     <path d="M60 85 L60 95" stroke="#fbcfe8" strokeWidth="12" strokeLinecap="round" />
                                                     <circle cx="60" cy="55" r="25" fill="#fbcfe8" />
                                                     <path d="M40 45 C40 25, 80 25, 80 45" fill="#2d3748" />
                                                     <path d="M35 50 Q38 35 48 38 Q58 32 70 38 Q82 35 85 50 L87 55 L33 55 Z" fill="#2d3748" />
                                                     <circle cx="52" cy="52" r="2.5" fill="#2d3748" />
                                                     <circle cx="68" cy="52" r="2.5" fill="#2d3748" />
                                                     <path d="M56 65 Q60 69 64 65" stroke="#2d3748" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                                     <path d="M30 100 C30 85, 90 85, 90 100 L95 120 L25 120 Z" fill="#ffffff" />
                                                     <path d="M45 85 L60 105 L75 85 Z" fill="#15803d" />
                                                     <path d="M57 90 L63 90 L65 120 L55 120 Z" fill="#15803d" />
                                                 </svg>
                                             )}
                                            
                                            {/* Camera Icon Badge */}
                                            <button style={{
                                                position: "absolute",
                                                bottom: 0,
                                                right: 0,
                                                background: "white",
                                                border: "1px solid #d1d5db",
                                                width: "28px",
                                                height: "28px",
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                                cursor: "pointer",
                                                color: "#6b7280"
                                            }}>
                                                <Camera size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Profil Card Body */}
                                <div style={{ padding: "3.2rem 2rem 2rem 2rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                                        <div>
                                            <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#1e293b", margin: "0 0 0.35rem 0" }}>
                                                {userProfile.fullName}
                                            </h2>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                                <span style={{
                                                    background: ROLE_COLORS[currentRole]?.bg ?? "#faf5ff",
                                                    color: ROLE_COLORS[currentRole]?.text ?? "#6b21a8",
                                                    border: `1px solid ${ROLE_COLORS[currentRole]?.border ?? "#e9d5ff"}`,
                                                    padding: "1px 8px", 
                                                    borderRadius: "6px", 
                                                    fontSize: "0.78rem", 
                                                    fontWeight: "750",
                                                }}>
                                                    {ROLE_BADGES[currentRole]}
                                                </span>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                                                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e" }}></span>
                                                    <span style={{ fontSize: "0.82rem", color: "#22c55e", fontWeight: "700" }}>Aktif</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button onClick={() => setShowProfileModal(true)} className="btn-edit-profil" style={{ 
                                            display: "flex", 
                                            alignItems: "center", 
                                            gap: "0.45rem", 
                                            padding: "0.55rem 1rem", 
                                            border: "1px solid #15803d", 
                                            borderRadius: "8px",
                                            color: "#15803d", 
                                            background: "white", 
                                            fontSize: "0.88rem", 
                                            fontWeight: "700",
                                            cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}>
                                            <Edit size={14} /> Edit Profil
                                        </button>
                                    </div>

                                    {/* 2x2 Grid Info */}
                                    <div style={{ 
                                        display: "grid", 
                                        gridTemplateColumns: "1fr 1fr", 
                                        gap: "1.5rem 2rem",
                                        borderTop: "1px dashed #e2e8f0", 
                                        paddingTop: "1.5rem" 
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                                            <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#f8fafc", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <span style={{ display: "block", fontSize: "0.72rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.03em" }}>Username</span>
                                                <span style={{ fontSize: "0.9rem", color: "#334155", fontWeight: "600" }}>{userProfile.username}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                                            <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#f8fafc", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                                                <Shield size={18} />
                                            </div>
                                            <div>
                                                <span style={{ display: "block", fontSize: "0.72rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.03em" }}>Role</span>
                                                <span style={{ fontSize: "0.9rem", color: "#334155", fontWeight: "600" }}>{ROLE_LABELS[currentRole]}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                                            <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#f8fafc", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                                                <Mail size={18} />
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <span style={{ display: "block", fontSize: "0.72rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.03em" }}>Email</span>
                                                <span style={{ fontSize: "0.9rem", color: "#334155", fontWeight: "600", wordBreak: "break-all" }}>{userProfile.email}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                                            <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#f8fafc", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                                                <Calendar size={18} />
                                            </div>
                                            <div>
                                                <span style={{ display: "block", fontSize: "0.72rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.03em" }}>Bergabung Sejak</span>
                                                <span style={{ fontSize: "0.9rem", color: "#334155", fontWeight: "600" }}>{userProfile.joinedDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card: Informasi Akun */}
                            <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9", padding: "1.5rem 2rem" }}>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", margin: "0 0 1.25rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                    <div style={{ background: "#dcfce7", color: "#15803d", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Info size={16} />
                                    </div>
                                    Informasi Akun
                                </h3>

                                <div className="info-table" style={{ display: "flex", flexDirection: "column" }}>
                                    {[
                                        { 
                                            label: "Role", 
                                            val: (
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                    <span>{ROLE_LABELS[currentRole]}</span>
                                                    <span style={{ background: "#faf5ff", color: "#6b21a8", padding: "1px 8px", borderRadius: "4px", fontSize: "0.72rem", fontWeight: "700" }}>{ROLE_BADGES[currentRole]}</span>
                                                </div>
                                            )
                                        },
                                        { 
                                            label: "Unit Kerja", 
                                            val: "MTs Assa'adah Sukabumi - Bogor" 
                                        },
                                        { 
                                            label: "Hak Akses", 
                                            val: (
                                                <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700" }}>
                                                    Penuh (Semua Modul)
                                                </span>
                                            ) 
                                        },
                                        { 
                                            label: "Status Akun", 
                                            val: (
                                                <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700" }}>
                                                    Aktif
                                                </span>
                                            ) 
                                        },
                                        { 
                                            label: "Terakhir Login", 
                                            val: "17 Mei 2025 10:10 WIB" 
                                        },
                                        { 
                                            label: "Alamat IP Terakhir", 
                                            val: "103.127.45.67" 
                                        }
                                    ].map((row, i) => (
                                        <div key={i} style={{ 
                                            display: "grid", 
                                            gridTemplateColumns: "1fr 1.8fr", 
                                            padding: "0.85rem 0", 
                                            borderBottom: i < 5 ? "1px solid #f1f5f9" : "none",
                                            alignItems: "center"
                                        }}>
                                            <span style={{ fontSize: "0.88rem", color: "#64748b", fontWeight: "500" }}>{row.label}</span>
                                            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                                                <span style={{ color: "#64748b", fontSize: "0.88rem" }}>:</span>
                                                <div style={{ fontSize: "0.88rem", color: "#334155", fontWeight: "600" }}>{row.val}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                            
                            {/* Card: Keamanan & Sesi */}
                            <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9", padding: "1.5rem" }}>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", margin: "0 0 1.25rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                    <div style={{ background: "#dcfce7", color: "#15803d", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Shield size={16} />
                                    </div>
                                    Keamanan & Sesi
                                </h3>

                                <div style={{ marginBottom: "1.25rem" }}>
                                    <span style={{ display: "block", fontSize: "0.82rem", color: "#64748b", fontWeight: "500", marginBottom: "0.5rem" }}>Sesi aktif saat ini</span>
                                    
                                    <div style={{ display: "flex", gap: "0.8rem", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "0.85rem 1rem", borderRadius: "10px" }}>
                                        <div style={{ color: "#64748b", marginTop: "3px" }}><Laptop size={18} /></div>
                                        <div>
                                            <span style={{ display: "block", fontSize: "0.82rem", color: "#334155", fontWeight: "700" }}>Windows • Chrome</span>
                                            <span style={{ display: "block", fontSize: "0.72rem", color: "#94a3b8", fontWeight: "500", marginTop: "2px" }}>Bogor, {sessionTime}</span>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => setShowPasswordModal(true)} className="btn-profile-primary" style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    background: "#15803d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                    fontWeight: "700",
                                    fontSize: "0.9rem",
                                    cursor: "pointer",
                                    marginBottom: "0.75rem",
                                    transition: "all 0.2s"
                                }}>
                                    <Lock size={15} /> Ganti Password
                                </button>
                                
                                <button onClick={handleLogout} className="btn-profile-danger" style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    background: "#fef2f2",
                                    color: "#991b1b",
                                    border: "1px solid #fecaca",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                    fontWeight: "700",
                                    fontSize: "0.9rem",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}>
                                    <LogOut size={15} /> Keluar Akun
                                </button>
                            </div>

                            {/* Card: Aksi Cepat */}
                            <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9", padding: "1.5rem" }}>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", margin: "0 0 1.25rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                    <div style={{ background: "#dcfce7", color: "#15803d", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Zap size={16} />
                                    </div>
                                    Aksi Cepat
                                </h3>

                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    {[
                                        { title: "Unduh QR Code Saya", subtitle: "Bagikan identitas Anda", icon: <QrCode size={18} /> },
                                        { title: "Lihat Riwayat Aktivitas", subtitle: "Pantau aktivitas akun Anda", icon: <Clock size={18} /> },
                                        { title: "Kelola Perangkat", subtitle: "Kelola perangkat yang terhubung", icon: <Smartphone size={18} /> },
                                        { title: "Ubah Preferensi", subtitle: "Atur tampilan & preferensi sistem", icon: <Settings size={18} /> }
                                    ].map((action, i) => (
                                        <div 
                                            key={i} 
                                            className="action-item-hover" 
                                            style={{ 
                                                display: "flex", 
                                                alignItems: "center", 
                                                justifyContent: "space-between", 
                                                padding: "0.75rem", 
                                                borderRadius: "10px", 
                                                cursor: "pointer",
                                                border: "1px solid transparent",
                                                transition: "all 0.2s"
                                            }}
                                            onClick={() => showToast(`Fitur "${action.title}" akan segera tersedia.`)}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                                                <div style={{ 
                                                    width: "36px", 
                                                    height: "36px", 
                                                    borderRadius: "50%", 
                                                    background: "#f0fdf4", 
                                                    color: "#15803d", 
                                                    display: "flex", 
                                                    alignItems: "center", 
                                                    justifyContent: "center" 
                                                }}>
                                                    {action.icon}
                                                </div>
                                                <div>
                                                    <span style={{ display: "block", fontSize: "0.86rem", color: "#1e293b", fontWeight: "700" }}>{action.title}</span>
                                                    <span style={{ display: "block", fontSize: "0.72rem", color: "#94a3b8", fontWeight: "500", marginTop: "1px" }}>{action.subtitle}</span>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} color="#94a3b8" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                ) : activeTab === "pribadi" ? (
                    /* High Fidelity Halaman Informasi Pribadi Layout */
                    <div className="grid-profile-layout" style={{ animation: "fadeIn 0.3s ease" }}>
                        
                        {/* LEFT COLUMN: Data Pribadi & Detail Cards */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                            
                            {/* Card 1: Data Pribadi */}
                            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "2rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                                    <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>Data Pribadi</h3>
                                    <button className="btn-edit-outline" style={{
                                        background: "transparent",
                                        color: "#15803d",
                                        border: "1px solid #15803d",
                                        borderRadius: "6px",
                                        padding: "0.45rem 0.9rem",
                                        fontSize: "0.82rem",
                                        fontWeight: "700",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.4rem",
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                    }} onClick={() => setShowProfileModal(true)}>
                                        <Edit size={14} /> Edit Data Pribadi
                                    </button>
                                </div>

                                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                                    {/* Left Sub-Column: Avatar & Upload Button */}
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "160px", flexShrink: 0 }}>
                                        <div style={{ position: "relative", marginBottom: "1rem" }}>
                                            {/* Beautiful inline SVG matching cartoon avatar in screenshot or uploaded image */}
                                            {userProfile.avatarUrl ? (
                                                <img 
                                                    src={userProfile.avatarUrl} 
                                                    alt="Foto Profil" 
                                                    style={{ 
                                                        width: "110px", 
                                                        height: "110px", 
                                                        borderRadius: "50%", 
                                                        objectFit: "cover", 
                                                        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                                                        border: "3px solid #dcfce7"
                                                    }} 
                                                />
                                            ) : (
                                                <svg width="110" height="110" viewBox="0 0 120 120" style={{ borderRadius: "50%", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                                                    <circle cx="60" cy="60" r="60" fill="#dcfce7" />
                                                    <path d="M60 85 L60 95" stroke="#fbcfe8" strokeWidth="12" strokeLinecap="round" />
                                                    <circle cx="60" cy="55" r="25" fill="#fbcfe8" />
                                                    <path d="M40 45 C40 25, 80 25, 80 45" fill="#2d3748" />
                                                    <path d="M35 50 Q38 35 48 38 Q58 32 70 38 Q82 35 85 50 L87 55 L33 55 Z" fill="#2d3748" />
                                                    <circle cx="52" cy="52" r="2.5" fill="#2d3748" />
                                                    <circle cx="68" cy="52" r="2.5" fill="#2d3748" />
                                                    <path d="M56 65 Q60 69 64 65" stroke="#2d3748" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                                    <path d="M30 100 C30 85, 90 85, 90 100 L95 120 L25 120 Z" fill="#ffffff" />
                                                    <path d="M45 85 L60 105 L75 85 Z" fill="#15803d" />
                                                    <path d="M57 90 L63 90 L65 120 L55 120 Z" fill="#15803d" />
                                                </svg>
                                            )}
                                        </div>
                                        <button style={{
                                            background: "#f8fafc",
                                            border: "1px solid #cbd5e1",
                                            color: "#334155",
                                            borderRadius: "6px",
                                            padding: "0.4rem 0.85rem",
                                            fontSize: "0.76rem",
                                            fontWeight: "700",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.35rem",
                                            cursor: "pointer",
                                            marginBottom: "0.4rem",
                                            transition: "all 0.2s"
                                        }} onClick={() => document.getElementById("profile-avatar-input")?.click()}>
                                            <Camera size={13} /> Ubah Foto
                                        </button>
                                        <span style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: "500" }}>PNG, JPG maks. 2MB</span>
                                    </div>
 
                                    {/* Middle & Right Sub-Columns (Personal info details with colons & small grey icons) */}
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1rem 2rem", flex: 1, minWidth: "280px" }}>
                                        {/* Column 1 (Left details) */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                                            <div style={{ display: "flex", fontSize: "0.86rem", alignItems: "center" }}>
                                                <div style={{ width: "24px", color: "#94a3b8", display: "flex", alignItems: "center" }}><User size={15} /></div>
                                                <span style={{ width: "135px", color: "#64748b", fontWeight: "500" }}>Nama Lengkap</span>
                                                <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                                <span style={{ color: "#1e293b", fontWeight: "600" }}>{userProfile.fullName}</span>
                                            </div>
                                            <div style={{ display: "flex", fontSize: "0.86rem", alignItems: "center" }}>
                                                <div style={{ width: "24px", color: "#94a3b8", display: "flex", alignItems: "center" }}><User size={15} /></div>
                                                <span style={{ width: "135px", color: "#64748b", fontWeight: "500" }}>Username</span>
                                                <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                                <span style={{ color: "#1e293b", fontWeight: "600" }}>{userProfile.username}</span>
                                            </div>
                                            <div style={{ display: "flex", fontSize: "0.86rem", alignItems: "center" }}>
                                                <div style={{ width: "24px", color: "#94a3b8", display: "flex", alignItems: "center" }}><Mail size={15} /></div>
                                                <span style={{ width: "135px", color: "#64748b", fontWeight: "500" }}>Email</span>
                                                <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                                <span style={{ color: "#1e293b", fontWeight: "600", wordBreak: "break-all" }}>{userProfile.email}</span>
                                            </div>
                                            <div style={{ display: "flex", fontSize: "0.86rem", alignItems: "center" }}>
                                                <div style={{ width: "24px", color: "#94a3b8", display: "flex", alignItems: "center" }}><Phone size={15} /></div>
                                                <span style={{ width: "135px", color: "#64748b", fontWeight: "500" }}>Nomor HP / WhatsApp</span>
                                                <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                                <span style={{ color: "#1e293b", fontWeight: "600" }}>{userProfile.phone}</span>
                                            </div>
                                            <div style={{ display: "flex", fontSize: "0.86rem", alignItems: "center" }}>
                                                <div style={{ width: "24px", color: "#94a3b8", display: "flex", alignItems: "center" }}><CreditCard size={15} /></div>
                                                <span style={{ width: "135px", color: "#64748b", fontWeight: "500" }}>NIK</span>
                                                <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                                <span style={{ color: "#1e293b", fontWeight: "600" }}>{userProfile.nik}</span>
                                            </div>
                                        </div>
 
                                        {/* Column 2 (Right details) */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                                            <div style={{ display: "flex", fontSize: "0.86rem", alignItems: "center" }}>
                                                <div style={{ width: "24px", color: "#94a3b8", display: "flex", alignItems: "center" }}><User size={15} /></div>
                                                <span style={{ width: "125px", color: "#64748b", fontWeight: "500" }}>Jenis Kelamin</span>
                                                <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                                <span style={{ color: "#1e293b", fontWeight: "600" }}>{userProfile.gender}</span>
                                            </div>
                                            <div style={{ display: "flex", fontSize: "0.86rem", alignItems: "center" }}>
                                                <div style={{ width: "24px", color: "#94a3b8", display: "flex", alignItems: "center" }}><Calendar size={15} /></div>
                                                <span style={{ width: "125px", color: "#64748b", fontWeight: "500" }}>Tempat, Tgl Lahir</span>
                                                <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                                <span style={{ color: "#1e293b", fontWeight: "600" }}>{userProfile.birthPlaceDate}</span>
                                            </div>
                                            <div style={{ display: "flex", fontSize: "0.86rem", alignItems: "center" }}>
                                                <div style={{ width: "24px", color: "#94a3b8", display: "flex", alignItems: "center" }}><MapPin size={15} /></div>
                                                <span style={{ width: "125px", color: "#64748b", fontWeight: "500" }}>Alamat</span>
                                                <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                                <span style={{ color: "#1e293b", fontWeight: "600", fontSize: "0.82rem" }}>{userProfile.address}</span>
                                            </div>
                                            <div style={{ display: "flex", fontSize: "0.86rem", alignItems: "center" }}>
                                                <div style={{ width: "24px", color: "#94a3b8", display: "flex", alignItems: "center" }}><Map size={15} /></div>
                                                <span style={{ width: "125px", color: "#64748b", fontWeight: "500" }}>Kota / Kabupaten</span>
                                                <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                                <span style={{ color: "#1e293b", fontWeight: "600" }}>{userProfile.city}</span>
                                            </div>
                                            <div style={{ display: "flex", fontSize: "0.86rem", alignItems: "center" }}>
                                                <div style={{ width: "24px", color: "#94a3b8", display: "flex", alignItems: "center" }}><Globe size={15} /></div>
                                                <span style={{ width: "125px", color: "#64748b", fontWeight: "500" }}>Provinsi</span>
                                                <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                                <span style={{ color: "#1e293b", fontWeight: "600" }}>{userProfile.province}</span>
                                            </div>
                                            <div style={{ display: "flex", fontSize: "0.86rem", alignItems: "center" }}>
                                                <div style={{ width: "24px", color: "#94a3b8", display: "flex", alignItems: "center" }}><Inbox size={15} /></div>
                                                <span style={{ width: "125px", color: "#64748b", fontWeight: "500" }}>Kode Pos</span>
                                                <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                                <span style={{ color: "#1e293b", fontWeight: "600" }}>{userProfile.postalCode}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cards Side-by-Side: Akademik & Kontak Darurat */}
                            <div className="grid-responsive-2" style={{ gap: "1.5rem" }}>
                                
                                {/* Card 2: Informasi Akademik */}
                                <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.5rem 2rem" }}>
                                    <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b", margin: "0 0 1.25rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                        <div style={{ background: "#dcfce7", color: "#15803d", width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <GraduationCap size={15} />
                                        </div>
                                        Informasi Akademik
                                    </h3>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                                        {[
                                            { label: "NISN", val: userProfile.nisn },
                                            { label: "Tahun Masuk", val: userProfile.tahunMasuk },
                                            { label: "Tahun Lulus", val: userProfile.tahunLulus },
                                            { label: "Jurusan / Program", val: userProfile.jurusan },
                                            { label: "Angkatan", val: userProfile.angkatan },
                                            { 
                                                label: "Status Alumni", 
                                                val: (
                                                    <span style={{ 
                                                        background: userProfile.statusAlumni === "Alumni Aktif" ? "#dcfce7" : "#fee2e2", 
                                                        color: userProfile.statusAlumni === "Alumni Aktif" ? "#166534" : "#991b1b", 
                                                        padding: "2px 8px", 
                                                        borderRadius: "6px", 
                                                        fontSize: "0.74rem", 
                                                        fontWeight: "700" 
                                                    }}>
                                                        {userProfile.statusAlumni}
                                                    </span>
                                                ) 
                                            },
                                            { label: "Unit / Lembaga", val: userProfile.unitLembaga },
                                            { label: "Jabatan", val: userProfile.jabatan }
                                        ].map((row, idx) => (
                                            <div key={idx} style={{ display: "flex", fontSize: "0.85rem", paddingBottom: "0.55rem", borderBottom: idx < 7 ? "1px dashed #f1f5f9" : "none" }}>
                                                <span style={{ width: "140px", color: "#64748b", fontWeight: "500" }}>{row.label}</span>
                                                <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                                <span style={{ color: "#1e293b", fontWeight: "600" }}>{row.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Side: Emergency Contact & Social Media */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                    
                                    {/* Card 3: Kontak Darurat */}
                                    <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.25rem 1.5rem" }}>
                                        <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b", margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                            <div style={{ background: "#dcfce7", color: "#15803d", width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Phone size={14} />
                                            </div>
                                            Kontak Darurat
                                        </h3>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                                            {[
                                                { label: "Nama Kontak", val: userProfile.emergencyName },
                                                { label: "Hubungan", val: userProfile.emergencyRelation },
                                                { label: "Nomor HP", val: userProfile.emergencyPhone }
                                            ].map((row, idx) => (
                                                <div key={idx} style={{ display: "flex", fontSize: "0.85rem" }}>
                                                    <span style={{ width: "115px", color: "#64748b", fontWeight: "500" }}>{row.label}</span>
                                                    <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                                    <span style={{ color: "#1e293b", fontWeight: "600" }}>{row.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Card 4: Media Sosial (Opsional) */}
                                    <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.25rem 1.5rem" }}>
                                        <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b", margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                            <div style={{ background: "#dcfce7", color: "#15803d", width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Globe size={14} />
                                            </div>
                                            Media Sosial (Opsional)
                                        </h3>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                                            {[
                                                { label: "Facebook", val: userProfile.facebook },
                                                { label: "Instagram", val: userProfile.instagram },
                                                { label: "LinkedIn", val: userProfile.linkedIn },
                                                { label: "Website", val: userProfile.website }
                                            ].map((row, idx) => (
                                                <div key={idx} style={{ display: "flex", fontSize: "0.85rem" }}>
                                                    <span style={{ width: "115px", color: "#64748b", fontWeight: "500" }}>{row.label}</span>
                                                    <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                                    <span style={{ color: "#1e293b", fontWeight: "600" }}>{row.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Bottom Actions Form */}
                            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                                <button style={{
                                    background: "#15803d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "0.65rem 1.5rem",
                                    fontSize: "0.88rem",
                                    fontWeight: "700",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 10px rgba(21,128,61,0.15)",
                                    transition: "all 0.2s"
                                }} onClick={() => setShowProfileModal(true)}>
                                    <Save size={16} /> Edit Data Lengkap
                                </button>
                                <button style={{
                                    background: "white",
                                    color: "#64748b",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "8px",
                                    padding: "0.65rem 1.5rem",
                                    fontSize: "0.88rem",
                                    fontWeight: "700",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }} onClick={handleResetProfile}>
                                    <RotateCcw size={16} /> Reset Form
                                </button>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Quick Actions & Status Akun */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                            
                            {/* Card 5: Quick Actions */}
                            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.5rem" }}>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", margin: "0 0 1.25rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                    <Zap size={18} style={{ color: "#1e293b" }} /> Quick Actions
                                </h3>

                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    {[
                                        { title: "Download QR Identitas", subtitle: "Unduh QR Code identitas Anda", icon: <QrCode size={18} />, color: "#22c55e", bg: "#f0fdf4" },
                                        { title: "Lihat Riwayat Login", subtitle: "Lihat perangkat & riwayat login", icon: <Clock size={18} />, color: "#3b82f6", bg: "#eff6ff" },
                                        { title: "Kelola Perangkat", subtitle: "Kelola perangkat yang terhubung", icon: <Smartphone size={18} />, color: "#a855f7", bg: "#faf5ff" },
                                        { title: "Export Data Akun", subtitle: "Unduh data akun Anda", icon: <Download size={18} />, color: "#f59e0b", bg: "#fffbeb" },
                                        { title: "Backup Data Akun", subtitle: "Buat cadangan data akun", icon: <Cloud size={18} />, color: "#14b8a6", bg: "#f0fdfa" }
                                    ].map((action, i) => (
                                        <div 
                                            key={i} 
                                            className="action-item-hover" 
                                            style={{ 
                                                display: "flex", 
                                                alignItems: "center", 
                                                justifyContent: "space-between", 
                                                padding: "0.75rem", 
                                                borderRadius: "10px", 
                                                cursor: "pointer",
                                                border: "1px solid transparent",
                                                transition: "all 0.2s"
                                            }}
                                            onClick={() => showToast(`Fitur "${action.title}" sedang disiapkan.`)}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                                                <div style={{ 
                                                    width: "36px", 
                                                    height: "36px", 
                                                    borderRadius: "50%", 
                                                    background: action.bg, 
                                                    color: action.color, 
                                                    display: "flex", 
                                                    alignItems: "center", 
                                                    justifyContent: "center" 
                                                }}>
                                                    {action.icon}
                                                </div>
                                                <div>
                                                    <span style={{ display: "block", fontSize: "0.86rem", color: "#1e293b", fontWeight: "700" }}>{action.title}</span>
                                                    <span style={{ display: "block", fontSize: "0.72rem", color: "#94a3b8", fontWeight: "500", marginTop: "1px" }}>{action.subtitle}</span>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} color="#94a3b8" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card 6: Status Akun */}
                            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.5rem" }}>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", margin: "0 0 1.25rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                    <ShieldCheck size={18} style={{ color: "#1e293b" }} /> Status Akun
                                </h3>

                                {/* Alert Box Green */}
                                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "0.85rem 1rem", display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1.25rem" }}>
                                    <CheckCircle size={22} style={{ color: "#22c55e", flexShrink: 0 }} />
                                    <div>
                                        <span style={{ display: "block", fontSize: "0.82rem", color: "#166534", fontWeight: "700" }}>Akun Anda Aman</span>
                                        <span style={{ display: "block", fontSize: "0.72rem", color: "#166534", opacity: 0.85, marginTop: "2px" }}>Tidak ada aktivitas mencurigakan pada akun Anda.</span>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                                    <div style={{ display: "flex", fontSize: "0.85rem", alignItems: "center" }}>
                                        <span style={{ width: "120px", color: "#64748b", fontWeight: "500" }}>Password</span>
                                        <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                            <span style={{ color: "#15803d", fontWeight: "700" }}>Sangat Kuat</span>
                                            <div style={{ display: "flex", gap: "2px", marginLeft: "2px" }}>
                                                {[1,2,3,4,5].map(i => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e" }} />)}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", fontSize: "0.85rem", alignItems: "center" }}>
                                        <span style={{ width: "120px", color: "#64748b", fontWeight: "500" }}>Verifikasi 2FA</span>
                                        <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "#dcfce7", color: "#166534", padding: "1px 8px", borderRadius: "6px", fontSize: "0.74rem", fontWeight: "700" }}>
                                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} /> Aktif
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", fontSize: "0.85rem", alignItems: "center" }}>
                                        <span style={{ width: "120px", color: "#64748b", fontWeight: "500" }}>Email Verifikasi</span>
                                        <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "#dcfce7", color: "#166534", padding: "1px 8px", borderRadius: "6px", fontSize: "0.74rem", fontWeight: "700" }}>
                                            <Check size={12} color="#22c55e" strokeWidth={3} /> Terverifikasi
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", fontSize: "0.85rem", alignItems: "center" }}>
                                        <span style={{ width: "120px", color: "#64748b", fontWeight: "500" }}>Akun Dibuat</span>
                                        <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                        <span style={{ color: "#334155", fontWeight: "600" }}>1 Januari 2024 10:00</span>
                                    </div>
                                    <div style={{ display: "flex", fontSize: "0.85rem", alignItems: "center" }}>
                                        <span style={{ width: "120px", color: "#64748b", fontWeight: "500" }}>Login Terakhir</span>
                                        <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                        <span style={{ color: "#334155", fontWeight: "600" }}>17 Mei 2025 10:10 WIB</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ) : activeTab === "keamanan" ? (
                    /* High Fidelity Halaman Keamanan & Sesi Layout */
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", animation: "fadeIn 0.3s ease" }}>
                        
                        {/* ROW 1: Password & Keamanan AND Two-Factor Authentication */}
                        <div className="grid-profile-split">
                            
                            {/* Card 1: Password & Keamanan */}
                            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                    <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#1e293b", margin: "0 0 1.25rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                        <div style={{ background: "#faf5ff", color: "#a855f7", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <KeyRound size={16} />
                                        </div>
                                        Password & Keamanan
                                    </h3>

                                    <div className="grid-responsive-2" style={{ gap: "1.5rem", marginTop: "1rem" }}>
                                        <div>
                                            <span style={{ display: "block", fontSize: "0.82rem", color: "#64748b", fontWeight: "500", marginBottom: "0.5rem" }}>Password terakhir diubah</span>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.86rem", color: "#334155", fontWeight: "700" }}>
                                                <Calendar size={14} color="#94a3b8" />
                                                12 Mei 2025 09:45 WIB
                                            </div>
                                        </div>
                                        <div>
                                            <span style={{ display: "block", fontSize: "0.82rem", color: "#64748b", fontWeight: "500", marginBottom: "0.25rem" }}>Kekuatan Password</span>
                                            <span style={{ display: "block", fontSize: "0.86rem", color: "#15803d", fontWeight: "700" }}>Sangat Kuat</span>
                                            <div style={{ display: "flex", gap: "4px", marginTop: "0.5rem" }}>
                                                {[1,2,3,4,5].map(i => (
                                                    <div key={i} style={{ flex: 1, height: "6px", borderRadius: "3px", background: "#22c55e" }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button style={{
                                    width: "100%",
                                    padding: "0.7rem",
                                    background: "#15803d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                    fontWeight: "700",
                                    fontSize: "0.88rem",
                                    cursor: "pointer",
                                    marginTop: "1.75rem",
                                    boxShadow: "0 4px 10px rgba(21,128,61,0.15)",
                                    transition: "all 0.2s"
                                }} onClick={() => setShowPasswordModal(true)}>
                                    <Lock size={14} /> Ganti Password
                                </button>
                            </div>

                            {/* Card 2: Two-Factor Authentication (2FA) */}
                            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.75rem" }}>
                                <div style={{ display: "flex", gap: "1.5rem", justifyContent: "space-between" }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#1e293b", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                            <div style={{ background: "#eff6ff", color: "#3b82f6", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Shield size={16} />
                                            </div>
                                            Two-Factor Authentication (2FA)
                                        </h3>
                                        <p style={{ color: "#64748b", fontSize: "0.8rem", margin: "0 0 1.25rem 0", lineHeight: "1.5" }}>
                                            Tambahkan lapisan keamanan ekstra untuk melindungi akun Anda.
                                        </p>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                            <div style={{ display: "flex", fontSize: "0.85rem", alignItems: "center" }}>
                                                <span style={{ width: "120px", color: "#64748b", fontWeight: "500" }}>Status 2FA</span>
                                                <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                                <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "6px", fontSize: "0.74rem", fontWeight: "700" }}>
                                                    Aktif
                                                </span>
                                            </div>
                                            <div style={{ display: "flex", fontSize: "0.85rem", alignItems: "center" }}>
                                                <span style={{ width: "120px", color: "#64748b", fontWeight: "500" }}>Metode Verifikasi</span>
                                                <span style={{ color: "#64748b", marginRight: "0.5rem" }}>:</span>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#334155", fontWeight: "600" }}>
                                                    <Mail size={13} color="#94a3b8" /> Email OTP (superadmin@assaadah.sch.id)
                                                </div>
                                            </div>
                                        </div>

                                        <button style={{
                                            background: "white",
                                            border: "1px solid #cbd5e1",
                                            color: "#334155",
                                            borderRadius: "8px",
                                            padding: "0.55rem 1.15rem",
                                            fontSize: "0.82rem",
                                            fontWeight: "700",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.4rem",
                                            cursor: "pointer",
                                            marginTop: "1.25rem",
                                            transition: "all 0.2s"
                                        }} onClick={() => showToast("Preferensi 2FA Anda dalam keadaan optimal.")}>
                                            <Settings size={13} /> Kelola 2FA
                                        </button>
                                    </div>

                                    {/* High Fidelity Shield & Lock Graphic SVG */}
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <svg width="105" height="105" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="42" fill="#eff6ff" />
                                            <circle cx="50" cy="50" r="32" fill="#dbeafe" />
                                            <path d="M50 22 C50 22, 72 27, 72 44 C72 64, 50 76, 50 76 C50 76, 28 64, 28 44 C28 27, 50 22, 50 22 Z" fill="#3b82f6" />
                                            <path d="M42 48 L48 54 L58 42" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                            <circle cx="76" cy="72" r="14" fill="white" stroke="#3b82f6" strokeWidth="2" />
                                            <rect x="70" y="68" width="12" height="9" rx="1.5" fill="#3b82f6" />
                                            <path d="M73 68 L73 65 C73 63.5, 79 63.5, 79 65 L79 68" stroke="#3b82f6" strokeWidth="2" fill="none" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ROW 2: Sesi Aktif AND Riwayat Login */}
                        <div className="grid-profile-split">
                            
                            {/* Card 3: Sesi Aktif */}
                            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                    <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#1e293b", margin: "0 0 0.25rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                        <div style={{ background: "#dcfce7", color: "#15803d", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Laptop size={16} />
                                        </div>
                                        Sesi Aktif
                                    </h3>
                                    <p style={{ color: "#64748b", fontSize: "0.8rem", margin: "0 0 1.25rem 0" }}>
                                        Perangkat yang sedang masuk ke akun Anda
                                    </p>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                        {/* Device 1 */}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid #f1f5f9" }}>
                                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                                                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f0fdf4", color: "#15803d", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <Laptop size={18} />
                                                </div>
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                                        <span style={{ fontSize: "0.86rem", color: "#1e293b", fontWeight: "700" }}>Windows • Chrome</span>
                                                        <span style={{ background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0", padding: "1px 6px", borderRadius: "4px", fontSize: "0.68rem", fontWeight: "700" }}>
                                                            Perangkat Saat Ini
                                                        </span>
                                                    </div>
                                                    <span style={{ display: "block", fontSize: "0.74rem", color: "#64748b", marginTop: "2px" }}>Bogor, Indonesia • 103.127.45.67</span>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <span style={{ fontSize: "0.74rem", color: "#94a3b8", fontWeight: "600", textAlign: "right" }}>17 Mei 2025<br/>10:10 WIB</span>
                                                <button style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center" }}>
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Device 2 */}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid #f1f5f9" }}>
                                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                                                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f8fafc", color: "#15803d", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <Smartphone size={18} />
                                                </div>
                                                <div>
                                                    <span style={{ display: "block", fontSize: "0.86rem", color: "#1e293b", fontWeight: "700" }}>Android • Chrome</span>
                                                    <span style={{ display: "block", fontSize: "0.74rem", color: "#64748b", marginTop: "2px" }}>Sukabumi, Indonesia • 114.10.22.33</span>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <span style={{ fontSize: "0.74rem", color: "#94a3b8", fontWeight: "600", textAlign: "right" }}>16 Mei 2025<br/>22:14 WIB</span>
                                                <button style={{
                                                    background: "white",
                                                    border: "1px solid #fca5a5",
                                                    color: "#ef4444",
                                                    fontSize: "0.74rem",
                                                    fontWeight: "700",
                                                    borderRadius: "6px",
                                                    padding: "0.25rem 0.65rem",
                                                    cursor: "pointer",
                                                    transition: "all 0.2s"
                                                }} onClick={() => showToast("Sesi Android berhasil dikeluarkan.")}>
                                                    Keluar
                                                </button>
                                            </div>
                                        </div>

                                        {/* Device 3 */}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                                                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f8fafc", color: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <Laptop size={18} />
                                                </div>
                                                <div>
                                                    <span style={{ display: "block", fontSize: "0.86rem", color: "#1e293b", fontWeight: "700" }}>MacOS • Safari</span>
                                                    <span style={{ display: "block", fontSize: "0.74rem", color: "#64748b", marginTop: "2px" }}>Bandung, Indonesia • 36.80.11.21</span>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <span style={{ fontSize: "0.74rem", color: "#94a3b8", fontWeight: "600", textAlign: "right" }}>15 Mei 2025<br/>08:50 WIB</span>
                                                <button style={{
                                                    background: "white",
                                                    border: "1px solid #fca5a5",
                                                    color: "#ef4444",
                                                    fontSize: "0.74rem",
                                                    fontWeight: "700",
                                                    borderRadius: "6px",
                                                    padding: "0.25rem 0.65rem",
                                                    cursor: "pointer",
                                                    transition: "all 0.2s"
                                                }} onClick={() => showToast("Sesi MacOS berhasil dikeluarkan.")}>
                                                    Keluar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button style={{
                                    width: "100%",
                                    padding: "0.7rem",
                                    background: "#fef2f2",
                                    color: "#dc2626",
                                    border: "1px solid #fca5a5",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                    fontWeight: "700",
                                    fontSize: "0.85rem",
                                    cursor: "pointer",
                                    marginTop: "1.5rem",
                                    transition: "all 0.2s"
                                }} onClick={() => showToast("Seluruh sesi perangkat lain berhasil dikeluarkan.")}>
                                    <LogOut size={14} /> Keluar dari Semua Perangkat
                                </button>
                            </div>

                            {/* Card 4: Riwayat Login */}
                            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                    <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#1e293b", margin: "0 0 0.25rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                        <div style={{ background: "#faf5ff", color: "#a855f7", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Clock size={16} />
                                        </div>
                                        Riwayat Login
                                    </h3>
                                    <p style={{ color: "#64748b", fontSize: "0.8rem", margin: "0 0 1rem 0" }}>
                                        Riwayat aktivitas login ke akun Anda
                                    </p>

                                    <div style={{ overflowX: "auto" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                                            <thead>
                                                <tr style={{ borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
                                                    <th style={{ padding: "0.6rem 0.4rem", color: "#64748b", fontWeight: "600" }}>Waktu</th>
                                                    <th style={{ padding: "0.6rem 0.4rem", color: "#64748b", fontWeight: "600" }}>Perangkat</th>
                                                    <th style={{ padding: "0.6rem 0.4rem", color: "#64748b", fontWeight: "600" }}>Browser</th>
                                                    <th style={{ padding: "0.6rem 0.4rem", color: "#64748b", fontWeight: "600" }}>IP Address</th>
                                                    <th style={{ padding: "0.6rem 0.4rem", color: "#64748b", fontWeight: "600" }}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    { time: "17 Mei 2025 10:10", dev: "Windows", devIcon: <Laptop size={12} />, br: "Chrome", ip: "103.127.45.67", status: "Berhasil", stColor: "#166534", stBg: "#dcfce7" },
                                                    { time: "16 Mei 2025 22:14", dev: "Android", devIcon: <Smartphone size={12} />, br: "Chrome", ip: "114.10.22.33", status: "Berhasil", stColor: "#166534", stBg: "#dcfce7" },
                                                    { time: "15 Mei 2025 08:11", dev: "MacOS", devIcon: <Laptop size={12} />, br: "Safari", ip: "36.80.11.21", status: "Berhasil", stColor: "#166534", stBg: "#dcfce7" },
                                                    { time: "14 Mei 2025 19:32", dev: "Windows", devIcon: <Laptop size={12} />, br: "Firefox", ip: "98.76.54.32", status: "Mencurigakan", stColor: "#9a3412", stBg: "#ffedd5" },
                                                    { time: "14 Mei 2025 19:25", dev: "Unknown", devIcon: <HelpCircle size={12} />, br: "Unknown", ip: "45.67.89.10", status: "Gagal", stColor: "#991b1b", stBg: "#fee2e2" }
                                                ].map((row, i) => (
                                                    <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                                                        <td style={{ padding: "0.65rem 0.4rem", color: "#334155", fontWeight: "500" }}>{row.time}</td>
                                                        <td style={{ padding: "0.65rem 0.4rem", color: "#1e293b", fontWeight: "600" }}>
                                                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                                                                {row.devIcon} {row.dev}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "0.65rem 0.4rem", color: "#334155", fontWeight: "500" }}>{row.br}</td>
                                                        <td style={{ padding: "0.65rem 0.4rem", color: "#64748b", fontWeight: "600" }}>{row.ip}</td>
                                                        <td style={{ padding: "0.65rem 0.4rem" }}>
                                                            <span style={{ background: row.stBg, color: row.stColor, padding: "2px 6px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700" }}>
                                                                {row.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <button style={{
                                    background: "white",
                                    border: "1px solid #cbd5e1",
                                    color: "#334155",
                                    borderRadius: "8px",
                                    padding: "0.55rem 1.25rem",
                                    fontSize: "0.82rem",
                                    fontWeight: "700",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.4rem",
                                    cursor: "pointer",
                                    margin: "1rem auto 0 auto",
                                    transition: "all 0.2s"
                                }} onClick={() => showToast("Seluruh riwayat login berhasil dimuat.")}>
                                    <Clock size={13} /> Lihat Semua Riwayat
                                </button>
                            </div>

                        </div>

                        {/* ROW 3: Tips Keamanan Akun Banner (Full-Width with Shield Watermark) */}
                        <div style={{ 
                            background: "#f0fdf4", 
                            border: "1px solid #bbf7d0", 
                            borderRadius: "16px", 
                            padding: "1.75rem", 
                            position: "relative",
                            overflow: "hidden"
                        }}>
                            {/* Decorative shield watermark inline SVG on far right */}
                            <div style={{ position: "absolute", right: "20px", bottom: "-10px", opacity: 0.08, color: "#15803d" }}>
                                <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>

                            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.25rem" }}>
                                <div style={{ background: "#dcfce7", color: "#15803d", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <ShieldCheck size={20} />
                                </div>
                                <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#166534", margin: 0 }}>Tips Keamanan Akun</h3>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                                {[
                                    { title: "Gunakan password yang kuat", desc: "Minimal 8 karakter dengan kombinasi huruf, angka, dan simbol." },
                                    { title: "Jangan bagikan password", desc: "Jangan pernah membagikan password ke siapapun." },
                                    { title: "Aktifkan 2FA", desc: "Gunakan Two-Factor Authentication untuk keamanan ekstra." },
                                    { title: "Logout jika selesai", desc: "Selalu logout setelah selesai menggunakan akun." }
                                ].map((tip, idx) => (
                                    <div key={idx} style={{ display: "flex", gap: "0.5rem" }}>
                                        <Check size={14} color="#22c55e" strokeWidth={3} style={{ marginTop: "3px", flexShrink: 0 }} />
                                        <div>
                                            <span style={{ display: "block", fontSize: "0.84rem", color: "#1e293b", fontWeight: "700" }}>{tip.title}</span>
                                            <span style={{ display: "block", fontSize: "0.74rem", color: "#64748b", marginTop: "3px", lineHeight: "1.4" }}>{tip.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                ) : activeTab === "notifikasi" ? (
                    /* High Fidelity Halaman Notifikasi Layout */
                    <div className="grid-profile-layout" style={{ animation: "fadeIn 0.3s ease" }}>
                        
                        {/* LEFT COLUMN: Preferensi & Frekuensi */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                            
                            {/* Card 1: Preferensi Notifikasi */}
                            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "2rem" }}>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", margin: "0 0 0.25rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                    <div style={{ background: "#f0fdf4", color: "#15803d", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Bell size={16} />
                                    </div>
                                    Preferensi Notifikasi
                                </h3>
                                <p style={{ color: "#64748b", fontSize: "0.8rem", margin: "0 0 1.5rem 0" }}>
                                    Pilih jenis notifikasi yang ingin Anda terima.
                                </p>

                                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                    {[
                                        { key: "email" as const, title: "Email Notifikasi", desc: "Terima notifikasi melalui email terdaftar", icon: <Mail size={16} /> },
                                        { key: "login" as const, title: "Login Baru", desc: "Dapatkan pemberitahuan ketika ada login baru ke akun Anda", icon: <Laptop size={16} /> },
                                        { key: "password" as const, title: "Perubahan Password", desc: "Notifikasi ketika password akun Anda diubah", icon: <Lock size={16} /> },
                                        { key: "archive" as const, title: "Aktivitas Arsip", desc: "Notifikasi untuk upload, update, dan hapus arsip", icon: <FolderOpen size={16} /> },
                                        { key: "system" as const, title: "Pengumuman Sistem", desc: "Informasi penting dan pengumuman dari sistem", icon: <Megaphone size={16} /> },
                                        { key: "whatsapp" as const, title: "Notifikasi WhatsApp", desc: "Terima notifikasi melalui WhatsApp", icon: <Phone size={16} /> },
                                        { key: "reminder" as const, title: "Reminder Arsip Alumni", desc: "Pengingat untuk melengkapi data/arsip alumni", icon: <Clock size={16} /> }
                                    ].map((item, idx) => (
                                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: idx < 6 ? "0.75rem" : "0", borderBottom: idx < 6 ? "1px solid #f8fafc" : "none" }}>
                                            <div style={{ display: "flex", gap: "0.85rem", alignItems: "center" }}>
                                                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#f0fdf4", color: "#15803d", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <span style={{ display: "block", fontSize: "0.86rem", color: "#1e293b", fontWeight: "700" }}>{item.title}</span>
                                                    <span style={{ display: "block", fontSize: "0.74rem", color: "#64748b", marginTop: "2px" }}>{item.desc}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Interactive Custom Toggle Switch */}
                                            <div 
                                                onClick={() => {
                                                    const key = item.key;
                                                    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
                                                    showToast(`Preferensi "${item.title}" diperbarui.`);
                                                }}
                                                style={{
                                                    width: "44px",
                                                    height: "24px",
                                                    borderRadius: "12px",
                                                    background: notifPrefs[item.key] ? "#15803d" : "#cbd5e1",
                                                    position: "relative",
                                                    cursor: "pointer",
                                                    transition: "background-color 0.2s",
                                                    flexShrink: 0
                                                }}
                                            >
                                                <div 
                                                    style={{
                                                        width: "18px",
                                                        height: "18px",
                                                        borderRadius: "50%",
                                                        background: "white",
                                                        position: "absolute",
                                                        top: "3px",
                                                        left: notifPrefs[item.key] ? "23px" : "3px",
                                                        transition: "left 0.2s",
                                                        boxShadow: "0 1px 3px rgba(0,0,0,0.15)"
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card 2: Pengaturan Frekuensi Notifikasi */}
                            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.75rem", position: "relative" }}>
                                <div style={{ display: "flex", gap: "2rem", justifyContent: "space-between", flexWrap: "wrap" }}>
                                    <div style={{ flex: 1, minWidth: "220px" }}>
                                        <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#1e293b", margin: "0 0 0.25rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                            <div style={{ background: "#eff6ff", color: "#3b82f6", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Calendar size={16} />
                                            </div>
                                            Pengaturan Frekuensi Notifikasi
                                        </h3>
                                        <p style={{ color: "#64748b", fontSize: "0.8rem", margin: "0 0 1.5rem 0" }}>
                                            Atur kapan Anda ingin menerima ringkasan notifikasi.
                                        </p>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                            {[
                                                { val: "realtime", title: "Real-time", desc: "Terima notifikasi secara langsung saat terjadi" },
                                                { val: "daily", title: "Harian", desc: "Terima ringkasan notifikasi setiap hari" },
                                                { val: "weekly", title: "Mingguan", desc: "Terima ringkasan notifikasi setiap minggu" }
                                            ].map((freq, i) => (
                                                <div 
                                                    key={i} 
                                                    onClick={() => {
                                                        setNotifFrequency(freq.val);
                                                        showToast(`Frekuensi notifikasi diubah ke: ${freq.title}`);
                                                    }}
                                                    style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer", padding: "4px" }}
                                                >
                                                    <div style={{
                                                        width: "18px",
                                                        height: "18px",
                                                        borderRadius: "50%",
                                                        border: "2px solid #15803d",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        marginTop: "2px",
                                                        flexShrink: 0
                                                    }}>
                                                        {notifFrequency === freq.val && (
                                                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#15803d" }} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span style={{ display: "block", fontSize: "0.85rem", color: "#1e293b", fontWeight: "700" }}>{freq.title}</span>
                                                        <span style={{ display: "block", fontSize: "0.74rem", color: "#64748b", marginTop: "1px" }}>{freq.desc}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* High Fidelity floating letter envelope & bell vector SVG illustration */}
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "130px", flexShrink: 0 }}>
                                        <svg width="120" height="95" viewBox="0 0 120 90">
                                            <circle cx="80" cy="50" r="32" fill="#f0fdf4" />
                                            <circle cx="80" cy="50" r="22" fill="#dcfce7" />
                                            <path d="M80 30 C74 30 70 34 70 40 L70 52 L90 52 L90 40 C90 34 86 30 80 30 Z" fill="#22c55e" />
                                            <rect x="67" y="52" width="26" height="4" rx="2" fill="#15803d" />
                                            <path d="M77 56 C77 58 83 58 83 56" stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                            
                                            <g style={{ transform: "rotate(-10deg) translate(15px, 35px)" }}>
                                                <rect x="0" y="0" width="30" height="19" rx="3" fill="white" stroke="#3b82f6" strokeWidth="2" />
                                                <path d="M0 2 L15 10 L30 2" stroke="#3b82f6" strokeWidth="2" fill="none" />
                                            </g>
                                            <path d="M12 25 L20 20 M8 38 L16 35" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Riwayat & Saluran */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                            
                            {/* Card 3: Riwayat Notifikasi */}
                            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.5rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                                    <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                        <Clock size={16} /> Riwayat Notifikasi
                                    </h3>
                                    <span style={{ fontSize: "0.78rem", color: "#15803d", fontWeight: "700", cursor: "pointer" }} onClick={() => showToast("Seluruh log notifikasi ditampilkan.")}>
                                        Lihat Semua
                                    </span>
                                </div>

                                {/* Vertical Timeline list */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "relative", paddingLeft: "1.25rem" }}>
                                    {/* Timeline dashed line */}
                                    <div style={{ position: "absolute", left: "6px", top: "10px", bottom: "10px", width: "2px", borderLeft: "2px dashed #e2e8f0" }} />
                                    
                                    {/* Timeline Point 1 */}
                                    <div>
                                        <div style={{ fontSize: "0.72rem", color: "#15803d", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.4rem", position: "relative" }}>
                                            <div style={{ position: "absolute", left: "-20px", top: "3px", width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", border: "2px solid white" }} />
                                            Hari ini
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "0.5rem" }}>
                                            <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                                                <div style={{ background: "#f0fdf4", color: "#22c55e", width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    <Bell size={13} />
                                                </div>
                                                <div>
                                                    <span style={{ display: "block", fontSize: "0.82rem", color: "#1e293b", fontWeight: "700" }}>Login baru terdeteksi</span>
                                                    <span style={{ display: "block", fontSize: "0.74rem", color: "#64748b", marginTop: "1px" }}>Login berhasil dari Windows • Chrome • Bogor</span>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600", flexShrink: 0 }}>10:10 WIB</span>
                                        </div>
                                        
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "0.85rem" }}>
                                            <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                                                <div style={{ background: "#f0fdf4", color: "#22c55e", width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    <Bell size={13} />
                                                </div>
                                                <div>
                                                    <span style={{ display: "block", fontSize: "0.82rem", color: "#1e293b", fontWeight: "700" }}>Password berhasil diubah</span>
                                                    <span style={{ display: "block", fontSize: "0.74rem", color: "#64748b", marginTop: "1px" }}>Password akun Anda telah diperbarui</span>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600", flexShrink: 0 }}>09:45 WIB</span>
                                        </div>
                                    </div>

                                    {/* Timeline Point 2 */}
                                    <div>
                                        <div style={{ fontSize: "0.72rem", color: "#3b82f6", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.4rem", position: "relative" }}>
                                            <div style={{ position: "absolute", left: "-20px", top: "3px", width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6", border: "2px solid white" }} />
                                            Kemarin
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "0.5rem" }}>
                                            <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                                                <div style={{ background: "#eff6ff", color: "#3b82f6", width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    <Info size={13} />
                                                </div>
                                                <div>
                                                    <span style={{ display: "block", fontSize: "0.82rem", color: "#1e293b", fontWeight: "700" }}>Pengumuman maintenance sistem</span>
                                                    <span style={{ display: "block", fontSize: "0.74rem", color: "#64748b", marginTop: "1px", lineHeight: "1.4" }}>Sistem akan maintenance pada 18 Mei 2025 pukul 02:00 - 04:00 WIB</span>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600", flexShrink: 0, textAlign: "right" }}>16 Mei<br/>19:20</span>
                                        </div>
                                    </div>

                                    {/* Timeline Point 3 */}
                                    <div>
                                        <div style={{ fontSize: "0.72rem", color: "#a855f7", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.4rem", position: "relative" }}>
                                            <div style={{ position: "absolute", left: "-20px", top: "3px", width: "8px", height: "8px", borderRadius: "50%", background: "#a855f7", border: "2px solid white" }} />
                                            Minggu ini
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "0.5rem" }}>
                                            <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                                                <div style={{ background: "#faf5ff", color: "#a855f7", width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    <Settings size={13} />
                                                </div>
                                                <div>
                                                    <span style={{ display: "block", fontSize: "0.82rem", color: "#1e293b", fontWeight: "700" }}>Data alumni berhasil diperbarui</span>
                                                    <span style={{ display: "block", fontSize: "0.74rem", color: "#64748b", marginTop: "1px" }}>Data alumni angkatan 2023 telah diperbarui oleh Anda</span>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600", flexShrink: 0, textAlign: "right" }}>15 Mei<br/>14:32</span>
                                        </div>
                                    </div>

                                    {/* Timeline Point 4 */}
                                    <div>
                                        <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.4rem", position: "relative" }}>
                                            <div style={{ position: "absolute", left: "-20px", top: "3px", width: "8px", height: "8px", borderRadius: "50%", background: "#94a3b8", border: "2px solid white" }} />
                                            Minggu Lalu
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "0.5rem" }}>
                                            <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                                                <div style={{ background: "#f8fafc", color: "#64748b", width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    <FileText size={13} />
                                                </div>
                                                <div>
                                                    <span style={{ display: "block", fontSize: "0.82rem", color: "#1e293b", fontWeight: "700" }}>Arsip baru diunggah</span>
                                                    <span style={{ display: "block", fontSize: "0.74rem", color: "#64748b", marginTop: "1px" }}>File &quot;Ijazah_Ananda_2023.pdf&quot; telah diunggah</span>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600", flexShrink: 0, textAlign: "right" }}>11 Mei<br/>11:05</span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Card 4: Saluran Notifikasi Aktif */}
                            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.5rem" }}>
                                <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#1e293b", margin: "0 0 0.25rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                    <Mail size={16} /> Saluran Notifikasi Aktif
                                </h3>
                                <p style={{ color: "#64748b", fontSize: "0.8rem", margin: "0 0 1rem 0" }}>
                                    Kelola saluran komunikasi yang aktif untuk notifikasi.
                                </p>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                                    {/* Email Channel */}
                                    <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.75rem", display: "flex", gap: "0.6rem", alignItems: "center", justifyContent: "space-between" }}>
                                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                            <div style={{ background: "#f0fdf4", color: "#15803d", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Mail size={14} />
                                            </div>
                                            <div>
                                                <span style={{ display: "block", fontSize: "0.76rem", color: "#1e293b", fontWeight: "700" }}>Email</span>
                                                <span style={{ display: "block", fontSize: "0.68rem", color: "#64748b", marginTop: "1px", wordBreak: "break-all" }}>superadmin@assaadah.sch.id</span>
                                            </div>
                                        </div>
                                        <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 6px", borderRadius: "4px", fontSize: "0.68rem", fontWeight: "700" }}>
                                            Aktif
                                        </span>
                                    </div>

                                    {/* WhatsApp Channel */}
                                    <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.75rem", display: "flex", gap: "0.6rem", alignItems: "center", justifyContent: "space-between" }}>
                                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                            <div style={{ background: "#fffbeb", color: "#f59e0b", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Phone size={14} />
                                            </div>
                                            <div>
                                                <span style={{ display: "block", fontSize: "0.76rem", color: "#1e293b", fontWeight: "700" }}>WhatsApp</span>
                                                <span style={{ display: "block", fontSize: "0.68rem", color: "#64748b", marginTop: "1px" }}>0812-3456-7890</span>
                                            </div>
                                        </div>
                                        <span style={{ background: "#fff9db", color: "#854d0e", padding: "2px 6px", borderRadius: "4px", fontSize: "0.68rem", fontWeight: "700" }}>
                                            Tidak Aktif
                                        </span>
                                    </div>
                                </div>

                                <button style={{
                                    width: "100%",
                                    padding: "0.6rem",
                                    background: "white",
                                    border: "1px solid #cbd5e1",
                                    color: "#334155",
                                    borderRadius: "8px",
                                    fontWeight: "700",
                                    fontSize: "0.82rem",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }} onClick={() => showToast("Konfigurasi saluran komunikasi berhasil dibuka.")}>
                                    Kelola Saluran
                                </button>
                            </div>

                        </div>

                    </div>
                ) : activeTab === "aktivitas" ? (
                    /* High Fidelity Halaman Aktivitas Akun Layout */
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", animation: "fadeIn 0.3s ease" }}>
                        
                        {/* ROW 1: Statistik Aktivitas (Header Row with 5 Cards) */}
                        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
                                <div>
                                    <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>Statistik Aktivitas</h3>
                                    <p style={{ color: "#64748b", fontSize: "0.78rem", margin: "2px 0 0 0" }}>Ringkasan aktivitas akun Anda secara keseluruhan.</p>
                                </div>
                                
                                {/* Date Range Picker Dropdown */}
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0.45rem 0.75rem", background: "white", fontSize: "0.82rem", fontWeight: "600", color: "#334155", cursor: "pointer" }} onClick={() => showToast("Filter rentang waktu dibuka.")}>
                                    <Calendar size={14} color="#94a3b8" />
                                    17 Apr – 17 Mei 2025
                                    <ChevronRight size={14} style={{ transform: "rotate(90deg)" }} color="#94a3b8" />
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem" }}>
                                {[
                                    { title: "Total Login", val: "128", trend: "▲ 12% vs bulan lalu", icon: <LogIn size={18} />, color: "#22c55e", bg: "#f0fdf4" },
                                    { title: "Upload Arsip", val: "45", trend: "▲ 8% vs bulan lalu", icon: <FolderOpen size={18} />, color: "#a855f7", bg: "#faf5ff" },
                                    { title: "Scan Kamera", val: "32", trend: "▲ 6% vs bulan lalu", icon: <Camera size={18} />, color: "#3b82f6", bg: "#eff6ff" },
                                    { title: "Cari Alumni", val: "67", trend: "▲ 15% vs bulan lalu", icon: <Search size={18} />, color: "#f59e0b", bg: "#fffbeb" },
                                    { title: "Perubahan Profil", val: "8", trend: "▲ 2% vs bulan lalu", icon: <Edit size={18} />, color: "#14b8a6", bg: "#f0fdfa" }
                                ].map((stat, i) => (
                                    <div key={i} style={{ border: "1px solid #f1f5f9", borderRadius: "12px", padding: "1rem", display: "flex", alignItems: "center", gap: "1rem", background: "#f8fafc" }}>
                                        <div style={{ 
                                            width: "42px", 
                                            height: "42px", 
                                            borderRadius: "10px", 
                                            background: stat.bg, 
                                            color: stat.color, 
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "center",
                                            flexShrink: 0
                                        }}>
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <span style={{ display: "block", fontSize: "0.74rem", color: "#64748b", fontWeight: "600" }}>{stat.title}</span>
                                            <span style={{ display: "block", fontSize: "1.4rem", color: "#1e293b", fontWeight: "800", margin: "2px 0" }}>{stat.val}</span>
                                            <span style={{ display: "block", fontSize: "0.68rem", color: "#15803d", fontWeight: "700" }}>{stat.trend}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ROW 2: Timeline Aktivitas AND Log Audit */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "2rem", flexWrap: "wrap" }}>
                            
                            {/* Card 2: Timeline Aktivitas */}
                            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                    <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#1e293b", margin: "0 0 0.25rem 0" }}>Timeline Aktivitas</h3>
                                    <p style={{ color: "#64748b", fontSize: "0.78rem", margin: "0 0 1.25rem 0" }}>Aktivitas terbaru yang dilakukan pada akun Anda.</p>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "relative", paddingLeft: "1.25rem" }}>
                                        {/* Timeline Line */}
                                        <div style={{ position: "absolute", left: "6px", top: "10px", bottom: "10px", width: "2px", background: "#e2e8f0" }} />

                                        {/* Day 1 */}
                                        <div>
                                            <div style={{ fontSize: "0.72rem", color: "#15803d", fontWeight: "750", textTransform: "uppercase", position: "relative" }}>
                                                <div style={{ position: "absolute", left: "-20px", top: "3px", width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", border: "2px solid white" }} />
                                                Hari ini - 17 Mei 2025
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                                                {[
                                                    { t: "10:10", label: "Login ke sistem", desc: "Login berhasil dari Windows • Chrome • Bogor", icon: <LogIn size={11} /> },
                                                    { t: "09:45", label: "Mengubah password", desc: "Password akun Anda berhasil diperbarui", icon: <Lock size={11} /> },
                                                    { t: "09:20", label: "Melihat data alumni", desc: "Membuka detail data alumni an. Ahmad Fadillah (2023)", icon: <Eye size={11} /> }
                                                ].map((act, i) => (
                                                    <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", justifyContent: "space-between" }}>
                                                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                                                            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                                                                {act.icon}
                                                            </div>
                                                            <div>
                                                                <span style={{ display: "block", fontSize: "0.8rem", color: "#1e293b", fontWeight: "700" }}>{act.label}</span>
                                                                <span style={{ display: "block", fontSize: "0.72rem", color: "#64748b", marginTop: "1px" }}>{act.desc}</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
                                                            <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600" }}>{act.t}</span>
                                                            <span style={{ color: "#166534", background: "#dcfce7", padding: "1px 4px", borderRadius: "4px", fontSize: "0.62rem", fontWeight: "700", marginTop: "2px" }}>Berhasil</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Day 2 */}
                                        <div>
                                            <div style={{ fontSize: "0.72rem", color: "#3b82f6", fontWeight: "750", textTransform: "uppercase", position: "relative" }}>
                                                <div style={{ position: "absolute", left: "-20px", top: "3px", width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6", border: "2px solid white" }} />
                                                Kemarin - 16 Mei 2025
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                                                {[
                                                    { t: "19:20", label: "Upload arsip alumni 2023", desc: "Mengunggah file \"Ijazah_Ananda_2023.pdf\"", icon: <FileText size={11} /> },
                                                    { t: "15:42", label: "Scan QR alumni", desc: "Memindai QR code alumni an. Naila Putri (2022)", icon: <QrCode size={11} /> }
                                                ].map((act, i) => (
                                                    <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", justifyContent: "space-between" }}>
                                                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                                                            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                                                                {act.icon}
                                                            </div>
                                                            <div>
                                                                <span style={{ display: "block", fontSize: "0.8rem", color: "#1e293b", fontWeight: "700" }}>{act.label}</span>
                                                                <span style={{ display: "block", fontSize: "0.72rem", color: "#64748b", marginTop: "1px" }}>{act.desc}</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
                                                            <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600" }}>{act.t}</span>
                                                            <span style={{ color: "#166534", background: "#dcfce7", padding: "1px 4px", borderRadius: "4px", fontSize: "0.62rem", fontWeight: "700", marginTop: "2px" }}>Berhasil</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Day 3 */}
                                        <div>
                                            <div style={{ fontSize: "0.72rem", color: "#a855f7", fontWeight: "750", textTransform: "uppercase", position: "relative" }}>
                                                <div style={{ position: "absolute", left: "-20px", top: "3px", width: "8px", height: "8px", borderRadius: "50%", background: "#a855f7", border: "2px solid white" }} />
                                                Minggu ini
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                                                {[
                                                    { t: "14 Mei", label: "Update profil admin", desc: "Memperbarui informasi kontak dan alamat", icon: <User size={11} /> },
                                                    { t: "13 Mei", label: "Ekspor data alumni", desc: "Mengunduh data alumni angkatan 2020-2023", icon: <Download size={11} /> }
                                                ].map((act, i) => (
                                                    <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", justifyContent: "space-between" }}>
                                                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                                                            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                                                                {act.icon}
                                                            </div>
                                                            <div>
                                                                <span style={{ display: "block", fontSize: "0.8rem", color: "#1e293b", fontWeight: "700" }}>{act.label}</span>
                                                                <span style={{ display: "block", fontSize: "0.72rem", color: "#64748b", marginTop: "1px" }}>{act.desc}</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
                                                            <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600" }}>{act.t}</span>
                                                            <span style={{ color: "#166534", background: "#dcfce7", padding: "1px 4px", borderRadius: "4px", fontSize: "0.62rem", fontWeight: "700", marginTop: "2px" }}>Berhasil</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <button style={{
                                    width: "100%",
                                    padding: "0.6rem",
                                    background: "white",
                                    border: "1px solid #cbd5e1",
                                    color: "#334155",
                                    borderRadius: "8px",
                                    fontWeight: "700",
                                    fontSize: "0.82rem",
                                    cursor: "pointer",
                                    marginTop: "1.25rem",
                                    transition: "all 0.2s"
                                }} onClick={() => showToast("Seluruh timeline aktivitas berhasil dimuat.")}>
                                    Lihat Semua Aktivitas
                                </button>
                            </div>

                            {/* Card 3: Log Aktivitas (Audit Log) */}
                            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem", flexWrap: "wrap", gap: "1rem" }}>
                                        <div>
                                            <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>Log Aktivitas (Audit Log)</h3>
                                            <p style={{ color: "#64748b", fontSize: "0.78rem", margin: "2px 0 0 0" }}>Catatan detail semua aktivitas yang dilakukan.</p>
                                        </div>
                                    </div>

                                    {/* Filters Row */}
                                    <div style={{ display: "flex", gap: "0.75rem", margin: "1rem 0", flexWrap: "wrap" }}>
                                        {/* Dropdown Filter */}
                                        <select 
                                            value={activityFilter}
                                            onChange={(e) => {
                                                setActivityFilter(e.target.value);
                                                showToast(`Filter log diubah ke: ${e.target.value}`);
                                            }}
                                            style={{
                                                border: "1px solid #cbd5e1",
                                                borderRadius: "6px",
                                                padding: "0.45rem 1.75rem 0.45rem 0.75rem",
                                                background: "white",
                                                fontSize: "0.82rem",
                                                fontWeight: "600",
                                                color: "#334155",
                                                outline: "none",
                                                cursor: "pointer"
                                            }}
                                        >
                                            {["Semua Aktivitas", "Arsip", "Auth", "Pengaturan", "Alumni", "Scan Kamera"].map((filter, i) => (
                                                <option key={i} value={filter}>{filter}</option>
                                            ))}
                                        </select>

                                        {/* Search Input */}
                                        <div style={{ position: "relative", flex: 1, minWidth: "150px" }}>
                                            <input 
                                                type="text" 
                                                value={activitySearch}
                                                onChange={(e) => setActivitySearch(e.target.value)}
                                                placeholder="Cari aktivitas..."
                                                style={{
                                                    width: "100%",
                                                    border: "1px solid #cbd5e1",
                                                    borderRadius: "6px",
                                                    padding: "0.45rem 0.75rem 0.45rem 2rem",
                                                    fontSize: "0.82rem",
                                                    outline: "none"
                                                }}
                                            />
                                            <Search size={14} color="#94a3b8" style={{ position: "absolute", left: "8px", top: "10px" }} />
                                        </div>

                                        {/* Filter Button */}
                                        <button style={{
                                            border: "1px solid #cbd5e1",
                                            borderRadius: "6px",
                                            background: "white",
                                            padding: "0.45rem 0.75rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.35rem",
                                            fontSize: "0.82rem",
                                            fontWeight: "600",
                                            color: "#334155",
                                            cursor: "pointer"
                                        }} onClick={() => showToast("Filter log berhasil diterapkan.")}>
                                            <Filter size={14} color="#94a3b8" /> Filter
                                        </button>
                                    </div>

                                    {/* Audit Log Table */}
                                    <div style={{ overflowX: "auto" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                                            <thead>
                                                <tr style={{ borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
                                                    <th style={{ padding: "0.6rem 0.4rem", color: "#64748b", fontWeight: "600" }}>Aktivitas</th>
                                                    <th style={{ padding: "0.6rem 0.4rem", color: "#64748b", fontWeight: "600" }}>Modul</th>
                                                    <th style={{ padding: "0.6rem 0.4rem", color: "#64748b", fontWeight: "600" }}>Waktu</th>
                                                    <th style={{ padding: "0.6rem 0.4rem", color: "#64748b", fontWeight: "600" }}>Perangkat</th>
                                                    <th style={{ padding: "0.6rem 0.4rem", color: "#64748b", fontWeight: "600" }}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    { act: "Upload Arsip", mod: "Arsip", time: "17 Mei 2025 10:20", dev: "Windows • Chrome", status: "Berhasil", color: "#1e293b" },
                                                    { act: "Login", mod: "Auth", time: "17 Mei 2025 10:10", dev: "Windows • Chrome", status: "Berhasil", color: "#1e293b" },
                                                    { act: "Ubah Password", mod: "Pengaturan", time: "17 Mei 2025 09:45", dev: "Windows • Chrome", status: "Berhasil", color: "#1e293b" },
                                                    { act: "Lihat Data Alumni", mod: "Alumni", time: "17 Mei 2025 09:20", dev: "Windows • Chrome", status: "Berhasil", color: "#1e293b" },
                                                    { act: "Scan QR", mod: "Scan Kamera", time: "16 Mei 2025 15:42", dev: "Android • Chrome", status: "Berhasil", color: "#1e293b" },
                                                    { act: "Upload Arsip", mod: "Arsip", time: "16 Mei 2025 19:20", dev: "Windows • Chrome", status: "Berhasil", color: "#1e293b" },
                                                    { act: "Hapus Data", mod: "Alumni", time: "16 Mei 2025 09:10", dev: "Windows • Chrome", status: "Berhasil", color: "#ef4444", fontWeight: "700" },
                                                    { act: "Export Data", mod: "Alumni", time: "13 Mei 2025 14:10", dev: "Windows • Chrome", status: "Berhasil", color: "#1e293b" }
                                                ].filter(row => {
                                                    // Dynamic interactive filter
                                                    const matchFilter = activityFilter === "Semua Aktivitas" || row.mod === activityFilter;
                                                    const matchSearch = row.act.toLowerCase().includes(activitySearch.toLowerCase()) || row.mod.toLowerCase().includes(activitySearch.toLowerCase());
                                                    return matchFilter && matchSearch;
                                                }).map((row, i) => (
                                                    <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                                                        <td style={{ padding: "0.65rem 0.4rem", color: row.color, fontWeight: row.fontWeight || "600" }}>{row.act}</td>
                                                        <td style={{ padding: "0.65rem 0.4rem", color: "#334155", fontWeight: "500" }}>{row.mod}</td>
                                                        <td style={{ padding: "0.65rem 0.4rem", color: "#64748b", fontWeight: "500" }}>{row.time}</td>
                                                        <td style={{ padding: "0.65rem 0.4rem", color: "#334155", fontWeight: "600" }}>{row.dev}</td>
                                                        <td style={{ padding: "0.65rem 0.4rem" }}>
                                                            <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 6px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700" }}>
                                                                {row.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", borderTop: "1px solid #f1f5f9", paddingTop: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                                    <span style={{ fontSize: "0.74rem", color: "#64748b", fontWeight: "500" }}>Menampilkan 1 - 8 dari 32 data</span>
                                    {/* Pagination Row */}
                                    <div style={{ display: "flex", gap: "4px" }}>
                                        <button 
                                            onClick={() => { setActivityPage(1); showToast("Ke halaman sebelumnya."); }}
                                            style={{ border: "1px solid #cbd5e1", borderRadius: "6px", background: "white", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                        >
                                            <ChevronLeft size={12} color="#94a3b8" />
                                        </button>
                                        <button onClick={() => setActivityPage(1)} style={{ border: "none", borderRadius: "6px", background: activityPage === 1 ? "#15803d" : "white", color: activityPage === 1 ? "white" : "#334155", fontWeight: "700", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.8rem" }}>1</button>
                                        <button onClick={() => { setActivityPage(2); showToast("Ke halaman 2."); }} style={{ border: "none", borderRadius: "6px", background: activityPage === 2 ? "#15803d" : "white", color: activityPage === 2 ? "white" : "#334155", fontWeight: "700", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.8rem" }}>2</button>
                                        <button onClick={() => { setActivityPage(3); showToast("Ke halaman 3."); }} style={{ border: "none", borderRadius: "6px", background: activityPage === 3 ? "#15803d" : "white", color: activityPage === 3 ? "white" : "#334155", fontWeight: "700", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.8rem" }}>3</button>
                                        <button onClick={() => { setActivityPage(4); showToast("Ke halaman 4."); }} style={{ border: "none", borderRadius: "6px", background: activityPage === 4 ? "#15803d" : "white", color: activityPage === 4 ? "white" : "#334155", fontWeight: "700", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.8rem" }}>4</button>
                                        <button 
                                            onClick={() => { setActivityPage(2); showToast("Ke halaman berikutnya."); }}
                                            style={{ border: "1px solid #cbd5e1", borderRadius: "6px", background: "white", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                        >
                                            <ChevronRight size={12} color="#94a3b8" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ROW 3: Visual Analytics Columns (Donut, Line Area, and Quick Actions) */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 1fr", gap: "1.5rem", flexWrap: "wrap" }}>
                            
                            {/* Card 4: Ringkasan Aktivitas Per Modul (Donut Chart) */}
                            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                    <h4 style={{ fontSize: "0.88rem", fontWeight: "800", color: "#1e293b", margin: "0 0 0.15rem 0" }}>Ringkasan Aktivitas Per Modul</h4>
                                    <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: "500" }}>Distribusi aktivitas berdasarkan modul sistem.</span>

                                    {/* Donut Chart SVG with hole and center total */}
                                    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: "170px", marginTop: "1rem" }}>
                                        <svg width="150" height="150" viewBox="0 0 42 42" style={{ transform: "rotate(-90deg)" }}>
                                            {/* Segment 1: Arsip 45.6% */}
                                            <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#3b82f6" strokeWidth="6.2" strokeDasharray="45.6 54.4" strokeDashoffset="0" />
                                            {/* Segment 2: Alumni 24.6% */}
                                            <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#a855f7" strokeWidth="6.2" strokeDasharray="24.6 75.4" strokeDashoffset="-45.6" />
                                            {/* Segment 3: Scan Kamera 11.8% */}
                                            <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#06b6d4" strokeWidth="6.2" strokeDasharray="11.8 88.2" strokeDashoffset="-70.2" />
                                            {/* Segment 4: Auth 9.6% */}
                                            <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#f59e0b" strokeWidth="6.2" strokeDasharray="9.6 90.4" strokeDashoffset="-82" />
                                            {/* Segment 5: Pengaturan 8.4% */}
                                            <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#10b981" strokeWidth="6.2" strokeDasharray="8.4 91.6" strokeDashoffset="-91.6" />
                                            {/* Hole inside */}
                                            <circle cx="21" cy="21" r="12.5" fill="white" />
                                        </svg>
                                        <div style={{ position: "absolute", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <span style={{ fontSize: "1.3rem", fontWeight: "850", color: "#1e293b" }}>272</span>
                                            <span style={{ fontSize: "0.62rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", marginTop: "1px" }}>Total Aktivitas</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Legend Area below donut */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.72rem", borderTop: "1px solid #f8fafc", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
                                    {[
                                        { label: "Arsip", share: "45.6% (124)", color: "#3b82f6" },
                                        { label: "Alumni", share: "24.6% (67)", color: "#a855f7" },
                                        { label: "Scan Kamera", share: "11.8% (32)", color: "#06b6d4" },
                                        { label: "Auth (Login)", share: "9.6% (26)", color: "#f59e0b" },
                                        { label: "Pengaturan", share: "8.4% (23)", color: "#10b981" }
                                    ].map((leg, idx) => (
                                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: leg.color, flexShrink: 0 }} />
                                            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                <span style={{ color: "#334155", fontWeight: "700", marginRight: "3px" }}>{leg.label}</span>
                                                <span style={{ color: "#94a3b8", fontWeight: "500" }}>{leg.share}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card 5: Aktivitas per Hari (Grafik) (Area/Line Chart) */}
                            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                    <h4 style={{ fontSize: "0.88rem", fontWeight: "800", color: "#1e293b", margin: "0 0 0.15rem 0" }}>Aktivitas per Hari (Grafik)</h4>
                                    <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: "500" }}>Grafik aktivitas dalam 14 hari terakhir.</span>

                                    {/* High Fidelity Line Area Chart SVG */}
                                    <div style={{ height: "160px", marginTop: "1.5rem", display: "flex", alignItems: "center" }}>
                                        <svg viewBox="0 0 300 120" style={{ width: "100%", height: "120px", overflow: "visible" }}>
                                            <line x1="30" y1="10" x2="30" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                                            <line x1="75" y1="10" x2="75" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                                            <line x1="120" y1="10" x2="120" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                                            <line x1="165" y1="10" x2="165" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                                            <line x1="210" y1="10" x2="210" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                                            <line x1="255" y1="10" x2="255" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                                            <line x1="290" y1="10" x2="290" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                                            
                                            <path d="M30,85 Q52.5,50 75,60 T120,50 T165,70 T210,55 T255,65 T290,40 L290,100 L30,100 Z" fill="rgba(34,197,94,0.06)" />
                                            <path d="M30,85 Q52.5,50 75,60 T120,50 T165,70 T210,55 T255,65 T290,40" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
                                            
                                            <circle cx="30" cy="85" r="3.5" fill="#22c55e" stroke="white" strokeWidth="1.5" />
                                            <circle cx="75" cy="60" r="3.5" fill="#22c55e" stroke="white" strokeWidth="1.5" />
                                            <circle cx="120" cy="50" r="3.5" fill="#22c55e" stroke="white" strokeWidth="1.5" />
                                            <circle cx="165" cy="70" r="3.5" fill="#22c55e" stroke="white" strokeWidth="1.5" />
                                            <circle cx="210" cy="55" r="3.5" fill="#22c55e" stroke="white" strokeWidth="1.5" />
                                            <circle cx="255" cy="65" r="3.5" fill="#22c55e" stroke="white" strokeWidth="1.5" />
                                            <circle cx="290" cy="40" r="3.5" fill="#22c55e" stroke="white" strokeWidth="1.5" />
                                            
                                            {/* Flag on 17 Mei */}
                                            <g style={{ transform: "translate(242px, 0px)" }}>
                                                <rect x="-35" y="-12" width="70" height="20" rx="4" fill="#334155" />
                                                <text x="0" y="2" fill="white" fontSize="7" fontWeight="bold" textAnchor="middle">17 Mei: 28 act</text>
                                                <line x1="0" y1="8" x2="0" y2="40" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                                            </g>
                                            
                                            <text x="30" y="112" fill="#94a3b8" fontSize="7" textAnchor="middle">4 Mei</text>
                                            <text x="75" y="112" fill="#94a3b8" fontSize="7" textAnchor="middle">6 Mei</text>
                                            <text x="120" y="112" fill="#94a3b8" fontSize="7" textAnchor="middle">8 Mei</text>
                                            <text x="165" y="112" fill="#94a3b8" fontSize="7" textAnchor="middle">10 Mei</text>
                                            <text x="210" y="112" fill="#94a3b8" fontSize="7" textAnchor="middle">12 Mei</text>
                                            <text x="255" y="112" fill="#94a3b8" fontSize="7" textAnchor="middle">14 Mei</text>
                                            <text x="290" y="112" fill="#94a3b8" fontSize="7" textAnchor="middle">17 Mei</text>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Card 6: Aksi Cepat (Quick Actions Activity-themed) */}
                            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                    <h4 style={{ fontSize: "0.88rem", fontWeight: "800", color: "#1e293b", margin: "0 0 0.15rem 0" }}>Aksi Cepat</h4>
                                    <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: "500" }}>Modifikasi log dan manajemen riwayat instan.</span>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
                                        {[
                                            { title: "Ekspor Log Aktivitas", subtitle: "Unduh log aktivitas dalam format Excel", icon: <Download size={14} />, color: "#22c55e", bg: "#f0fdf4" },
                                            { title: "Lihat Riwayat Login", subtitle: "Tampilkan riwayat semua login", icon: <Clock size={14} />, color: "#3b82f6", bg: "#eff6ff" },
                                            { title: "Kelola Perangkat", subtitle: "Lihat & kelola perangkat yang terhubung", icon: <Smartphone size={14} />, color: "#a855f7", bg: "#faf5ff" },
                                            { title: "Bersihkan Riwayat", subtitle: "Hapus riwayat aktivitas tertentu", icon: <Trash size={14} />, color: "#ef4444", bg: "#fef2f2" }
                                        ].map((act, i) => (
                                            <div 
                                                key={i} 
                                                className="action-item-hover" 
                                                style={{ 
                                                    display: "flex", 
                                                    alignItems: "center", 
                                                    justifyContent: "space-between", 
                                                    padding: "0.6rem 0.75rem", 
                                                    borderRadius: "10px", 
                                                    cursor: "pointer",
                                                    border: "1px solid transparent",
                                                    transition: "all 0.2s"
                                                }}
                                                onClick={() => {
                                                    if (act.title === "Lihat Riwayat Login" || act.title === "Kelola Perangkat") {
                                                        setActiveTab("keamanan");
                                                        showToast(`Navigasi ke ${act.title}`);
                                                    } else {
                                                        showToast(`Fitur "${act.title}" sedang disiapkan.`);
                                                    }
                                                }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                    <div style={{ 
                                                        width: "30px", 
                                                        height: "30px", 
                                                        borderRadius: "50%", 
                                                        background: act.bg, 
                                                        color: act.color, 
                                                        display: "flex", 
                                                        alignItems: "center", 
                                                        justifyContent: "center",
                                                        flexShrink: 0
                                                    }}>
                                                        {act.icon}
                                                    </div>
                                                    <div>
                                                        <span style={{ display: "block", fontSize: "0.8rem", color: "#1e293b", fontWeight: "700" }}>{act.title}</span>
                                                        <span style={{ display: "block", fontSize: "0.68rem", color: "#94a3b8", fontWeight: "500", marginTop: "1px" }}>{act.subtitle}</span>
                                                    </div>
                                                </div>
                                                <ChevronRight size={14} color="#94a3b8" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                ) : (
                    /* Other tabs fallback - Empty container */
                    <div />
                )}

                {/* Institutional Footer */}
                <footer style={{ textAlign: "center", paddingTop: "3rem", paddingBottom: "1.5rem", color: "var(--text-muted)", fontSize: "0.82rem", borderTop: "1px solid #f1f5f9", marginTop: "4rem" }}>
                    © 2026 <strong>SAADA (Sistem Arsip Alumni ASSA&apos;ADAH)</strong> | Prototipe Penelitian Skripsi MTS
                </footer>
            </div>

            {/* ══════════════ MODALS ══════════════ */}

            {/* Modal: Ubah Profil */}
            {showProfileModal && (
                <ModalWrapper onClose={() => setShowProfileModal(false)} wide={true}>
                    <ModalHeader icon={<Edit size={20} color="#15803d" />} title="Edit Data Profil & Arsip Alumni" onClose={() => setShowProfileModal(false)} />
                    
                    {/* Tab Navigation inside Modal */}
                    <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", background: "#f8fafc" }}>
                        {[
                            { id: "pribadi", label: "Data Pribadi" },
                            { id: "akademik", label: "Akademik" },
                            { id: "kontak_medsos", label: "Kontak & Medsos" }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setModalTab(tab.id)}
                                style={{
                                    flex: 1,
                                    padding: "0.85rem",
                                    background: "none",
                                    border: "none",
                                    borderBottom: modalTab === tab.id ? "3px solid #15803d" : "3px solid transparent",
                                    color: modalTab === tab.id ? "#15803d" : "#64748b",
                                    fontWeight: "750",
                                    fontSize: "0.82rem",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleUpdateProfile}>
                        <div style={{ padding: "1.5rem", maxHeight: "55vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            
                            {/* Tab 1: Data Pribadi */}
                            <div style={{ display: modalTab === "pribadi" ? "flex" : "none", flexDirection: "column", gap: "1rem" }}>
                                <FormField label="Nama Lengkap" id="edit-fullname" type="text" defaultValue={userProfile.fullName} />
                                <FormField label="Username" id="edit-username" type="text" defaultValue={userProfile.username} />
                                <FormField label="Alamat Email" id="edit-email" type="email" defaultValue={userProfile.email} />
                                <FormField label="Nomor HP / WhatsApp" id="edit-phone" type="text" defaultValue={userProfile.phone} />
                                <FormField label="NIK" id="edit-nik" type="text" defaultValue={userProfile.nik} />
                                <div>
                                    <label htmlFor="edit-gender" style={labelStyle}>Jenis Kelamin</label>
                                    <select id="edit-gender" defaultValue={userProfile.gender} style={inputStyle}>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                                <FormField label="Tempat, Tgl Lahir" id="edit-birthPlaceDate" type="text" defaultValue={userProfile.birthPlaceDate} />
                                <FormField label="Alamat" id="edit-address" type="text" defaultValue={userProfile.address} />
                                <FormField label="Kota / Kabupaten" id="edit-city" type="text" defaultValue={userProfile.city} />
                                <FormField label="Provinsi" id="edit-province" type="text" defaultValue={userProfile.province} />
                                <FormField label="Kode Pos" id="edit-postalCode" type="text" defaultValue={userProfile.postalCode} />
                            </div>

                            {/* Tab 2: Informasi Akademik */}
                            <div style={{ display: modalTab === "akademik" ? "flex" : "none", flexDirection: "column", gap: "1rem" }}>
                                <FormField label="NISN" id="edit-nisn" type="text" defaultValue={userProfile.nisn} />
                                <FormField label="Tahun Masuk" id="edit-tahunMasuk" type="text" defaultValue={userProfile.tahunMasuk} />
                                <FormField label="Tahun Lulus" id="edit-tahunLulus" type="text" defaultValue={userProfile.tahunLulus} />
                                <FormField label="Jurusan / Program" id="edit-jurusan" type="text" defaultValue={userProfile.jurusan} />
                                <FormField label="Angkatan" id="edit-angkatan" type="text" defaultValue={userProfile.angkatan} />
                                <div>
                                    <label htmlFor="edit-statusAlumni" style={labelStyle}>Status Alumni</label>
                                    <select id="edit-statusAlumni" defaultValue={userProfile.statusAlumni} style={inputStyle}>
                                        <option value="Alumni Aktif">Alumni Aktif</option>
                                        <option value="Tidak Aktif">Tidak Aktif</option>
                                    </select>
                                </div>
                                <FormField label="Unit / Lembaga" id="edit-unitLembaga" type="text" defaultValue={userProfile.unitLembaga} />
                                <FormField label="Jabatan" id="edit-jabatan" type="text" defaultValue={userProfile.jabatan} />
                            </div>

                            {/* Tab 3: Kontak & Medsos */}
                            <div style={{ display: modalTab === "kontak_medsos" ? "flex" : "none", flexDirection: "column", gap: "1.25rem" }}>
                                <div style={{ borderBottom: "1px dashed #e2e8f0", paddingBottom: "1rem" }}>
                                    <span style={{ display: "block", fontSize: "0.85rem", fontWeight: "800", color: "#15803d", marginBottom: "0.75rem" }}>📞 Kontak Darurat</span>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                        <FormField label="Nama Kontak" id="edit-emergencyName" type="text" defaultValue={userProfile.emergencyName} />
                                        <FormField label="Hubungan" id="edit-emergencyRelation" type="text" defaultValue={userProfile.emergencyRelation} />
                                        <FormField label="Nomor HP" id="edit-emergencyPhone" type="text" defaultValue={userProfile.emergencyPhone} />
                                    </div>
                                </div>
                                <div>
                                    <span style={{ display: "block", fontSize: "0.85rem", fontWeight: "800", color: "#15803d", marginBottom: "0.75rem" }}>🌐 Media Sosial</span>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                        <FormField label="Facebook" id="edit-facebook" type="text" defaultValue={userProfile.facebook} />
                                        <FormField label="Instagram" id="edit-instagram" type="text" defaultValue={userProfile.instagram} />
                                        <FormField label="LinkedIn" id="edit-linkedIn" type="text" defaultValue={userProfile.linkedIn} />
                                        <FormField label="Website" id="edit-website" type="text" defaultValue={userProfile.website} />
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                        {/* Footer Action buttons */}
                        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e5e7eb", background: "#f8fafc", display: "flex", gap: "0.75rem" }}>
                            <button type="button" onClick={() => setShowProfileModal(false)} style={{ flex: 1, padding: "0.75rem", background: "white", border: "1px solid #cbd5e1", color: "#334155", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem" }}>Batal</button>
                            <button type="submit" style={{ ...btnGreenStyle, flex: 1, margin: 0 }}>Simpan Semua</button>
                        </div>
                    </form>
                </ModalWrapper>
            )}

            {/* Modal: Ganti Password */}
            {showPasswordModal && (
                <ModalWrapper onClose={() => setShowPasswordModal(false)}>
                    <ModalHeader icon={<Lock size={20} color="#15803d" />} title="Ganti Password" onClose={() => setShowPasswordModal(false)} />
                    <form onSubmit={handleUpdatePassword}>
                        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <FormField label="Password Lama" id="pw-old" type="password" />
                            <FormField label="Password Baru (min. 6 karakter)" id="pw-new" type="password" />
                            <FormField label="Konfirmasi Password Baru" id="pw-confirm" type="password" />
                            <button type="submit" style={btnGreenStyle}>Simpan Password Baru</button>
                        </div>
                    </form>
                </ModalWrapper>
            )}

            <style>{`
                @media (max-width: 768px) {
                    /* Responsiveness */
                    div[style*="gridTemplateColumns: 1.7fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                    .info-table div[style*="gridTemplateColumns: 1fr 1.8fr"] {
                        grid-template-columns: 1fr !important;
                        gap: 0.25rem;
                    }
                    .info-table span[style*="color: #64748b"] {
                        display: none !important;
                    }
                }
                @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
                @keyframes spin { to { transform: rotate(360deg); } }
                
                .hover-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
                
                /* Action items hover style */
                .action-item-hover:hover {
                    background-color: #f8fafc !important;
                    border-color: #f1f5f9 !important;
                }

                .btn-edit-profil:hover {
                    background-color: #15803d !important;
                    color: white !important;
                    box-shadow: 0 4px 10px rgba(21, 128, 61, 0.15);
                }

                .btn-profile-primary:hover {
                    background-color: #14532d !important;
                    box-shadow: 0 4px 12px rgba(21, 128, 61, 0.2);
                }

                .btn-profile-danger:hover {
                    background-color: #fee2e2 !important;
                    border-color: #f87171 !important;
                    color: #b91c1c !important;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
                }
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
