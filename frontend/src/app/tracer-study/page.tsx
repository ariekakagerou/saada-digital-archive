"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { 
    Briefcase, GraduationCap, BookOpen, HelpCircle, 
    Search, FileSpreadsheet, Edit2, ExternalLink, 
    Filter, Calendar, ChevronDown, Check, X, Loader2,
    MapPin, ClipboardCheck, Building2, Award, MessageSquare,
    CheckCircle2, AlertCircle, ArrowRight, User, Sparkles,
    ChevronRight, Save
} from "lucide-react";
import * as api from "../../../services/api";
import { 
    ResponsiveContainer, PieChart, Pie, Cell, 
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from "recharts";
import * as XLSX from "xlsx";

// ═══════════════════════════════════════════════════════════════
// ALUMNI TRACER FORM VIEW
// ═══════════════════════════════════════════════════════════════

const STATUS_OPTIONS = [
    { value: "Melanjutkan ke SMA/SMK", label: "Melanjutkan ke SMA/SMK", icon: "📚", desc: "Saya melanjutkan pendidikan ke jenjang SMA/SMK", color: "#f59e0b", bg: "#fffbeb" },
    { value: "Kuliah", label: "Kuliah / Perguruan Tinggi", icon: "🎓", desc: "Saya melanjutkan ke Universitas / Perguruan Tinggi", color: "#6366f1", bg: "#eef2ff" },
    { value: "Bekerja", label: "Bekerja", icon: "💼", desc: "Saya sedang bekerja di sebuah perusahaan / instansi", color: "#10b981", bg: "#ecfdf5" },
    { value: "Wirausaha", label: "Wirausaha / Bisnis Sendiri", icon: "🚀", desc: "Saya menjalankan usaha / bisnis sendiri", color: "#8b5cf6", bg: "#f5f3ff" },
    { value: "Lainnya", label: "Lainnya", icon: "✨", desc: "Status saya tidak tercantum di atas", color: "#64748b", bg: "#f8fafc" },
];

function AlumniTracerForm() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasExistingData, setHasExistingData] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    const [form, setForm] = useState({
        statusSaatIni: "",
        namaInstansi: "",
        jabatanAtauJurusan: "",
        tahunMulai: "",
        catatanTambahan: "",
    });

    useEffect(() => {
        const user = api.getCurrentUser();
        setCurrentUser(user);
        loadExistingTracer();
    }, []);

    const loadExistingTracer = async () => {
        setIsLoading(true);
        try {
            const res = await api.getAlumniPortalTracer();
            if (res && res.statusSaatIni) {
                setHasExistingData(true);
                setForm({
                    statusSaatIni: res.statusSaatIni || "",
                    namaInstansi: res.namaInstansi || "",
                    jabatanAtauJurusan: res.jabatanAtauJurusan || "",
                    tahunMulai: res.tahunMulai || "",
                    catatanTambahan: res.catatanTambahan || "",
                });
            }
        } catch (e: any) {
            // No existing data, that's fine
            console.log("No existing tracer data:", e?.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.statusSaatIni) {
            setError("Pilih status kamu terlebih dahulu.");
            return;
        }
        setIsSaving(true);
        setError(null);
        try {
            await api.saveAlumniPortalTracer(form);
            setIsSuccess(true);
            setHasExistingData(true);
        } catch (e: any) {
            setError(e?.message || "Gagal menyimpan data. Silakan coba lagi.");
        } finally {
            setIsSaving(false);
        }
    };

    const selectedStatus = STATUS_OPTIONS.find(s => s.value === form.statusSaatIni);
    const totalSteps = 3;

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', border: '4px solid #e2e8f0', borderTopColor: '#16803d', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#64748b', fontWeight: 600 }}>Memuat data tracer study...</p>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                <div style={{
                    textAlign: 'center', maxWidth: '480px', padding: '3rem 2rem',
                    background: 'white', borderRadius: '28px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    border: '1px solid #f1f5f9'
                }}>
                    <div style={{
                        width: '80px', height: '80px', background: 'linear-gradient(135deg, #16803d, #22c55e)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem', boxShadow: '0 8px 24px rgba(22, 128, 61, 0.3)'
                    }}>
                        <CheckCircle2 size={40} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e293b', marginBottom: '0.75rem' }}>
                        Data Tersimpan! 🎉
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Terima kasih sudah mengisi data tracer study. Data kamu telah berhasil disimpan dan akan membantu sekolah dalam pemantauan alumni.
                    </p>
                    <div style={{
                        background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px',
                        padding: '1rem 1.25rem', marginBottom: '2rem', textAlign: 'left'
                    }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '1.5rem' }}>{selectedStatus?.icon || '✨'}</span>
                            <div>
                                <div style={{ fontWeight: 800, color: '#166534', fontSize: '0.88rem' }}>Status kamu</div>
                                <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem', marginTop: '0.1rem' }}>{form.statusSaatIni}</div>
                                {form.namaInstansi && <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '0.25rem' }}>{form.namaInstansi}</div>}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => { setIsSuccess(false); setStep(1); }}
                        style={{
                            background: 'linear-gradient(135deg, #16803d, #22c55e)', color: 'white',
                            border: 'none', padding: '0.875rem 2rem', borderRadius: '14px',
                            fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(22, 128, 61, 0.25)', width: '100%'
                        }}
                    >
                        Perbarui Data Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', paddingBottom: '3rem' }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .tracer-status-card { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); border: 2px solid #e2e8f0 !important; }
                .tracer-status-card:hover { transform: translateY(-3px) scale(1.01); box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
                .tracer-status-card.selected { transform: translateY(-2px); }
                .tracer-input:focus { border-color: #16803d !important; box-shadow: 0 0 0 3px rgba(22, 128, 61, 0.1) !important; outline: none; }
                .tracer-btn-next:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(22, 128, 61, 0.35) !important; }
                .tracer-btn-back:hover { background: #f1f5f9 !important; }
            `}</style>

            {/* ─── HERO HEADER ─── */}
            <div style={{ textAlign: 'center', padding: '2.5rem 0 2rem', animation: 'slideInUp 0.5s ease-out' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', color: '#16803d',
                    padding: '0.5rem 1.25rem', borderRadius: '100px', fontSize: '0.8rem',
                    fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
                    marginBottom: '1rem', border: '1px solid #bbf7d0'
                }}>
                    <MapPin size={14} /> Tracer Study Alumni
                </div>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1e293b', margin: '0 0 0.75rem', lineHeight: 1.2 }}>
                    Halo, {currentUser?.fullName?.split(' ')[0] || 'Alumni'}! 👋
                </h1>
                <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
                    {hasExistingData 
                        ? 'Data tracer study kamu sudah tersimpan. Kamu bisa memperbarui informasi terbaru di bawah.'
                        : 'Bantu kami memantau jejak karirmu! Isi data tracer study ini hanya butuh 2 menit.'
                    }
                </p>
                {hasExistingData && (
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem',
                        background: '#fffbeb', color: '#d97706', padding: '0.4rem 1rem',
                        borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #fde68a'
                    }}>
                        <CheckCircle2 size={13} /> Data sudah pernah diisi — kamu bisa perbarui
                    </div>
                )}
            </div>

            {/* ─── PROGRESS BAR ─── */}
            <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    {['Status Saat Ini', 'Detail Informasi', 'Konfirmasi'].map((label, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                            <div style={{
                                width: '28px', height: '28px', borderRadius: '50%', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800,
                                flexShrink: 0,
                                background: step > i + 1 ? '#16803d' : step === i + 1 ? 'linear-gradient(135deg, #16803d, #22c55e)' : '#e2e8f0',
                                color: step >= i + 1 ? 'white' : '#94a3b8',
                                boxShadow: step === i + 1 ? '0 4px 12px rgba(22, 128, 61, 0.3)' : 'none',
                                transition: 'all 0.3s'
                            }}>
                                {step > i + 1 ? <Check size={13} /> : i + 1}
                            </div>
                            <span style={{
                                fontSize: '0.78rem', fontWeight: step === i + 1 ? 700 : 500,
                                color: step === i + 1 ? '#16803d' : step > i + 1 ? '#64748b' : '#94a3b8',
                                whiteSpace: 'nowrap'
                            }}>{label}</span>
                            {i < 2 && <div style={{ flex: 1, height: '2px', background: step > i + 1 ? '#16803d' : '#e2e8f0', borderRadius: '4px', margin: '0 0.25rem', transition: 'background 0.3s' }} />}
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit}>

                {/* ───────────── STEP 1: PILIH STATUS ───────────── */}
                {step === 1 && (
                    <div style={{ animation: 'fadeInScale 0.35s ease-out' }}>
                        <div style={{
                            background: 'white', borderRadius: '24px', padding: '2rem',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
                            marginBottom: '1.5rem'
                        }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.375rem' }}>
                                Apa status kamu saat ini? <span style={{ color: '#ef4444' }}>*</span>
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                Pilih satu opsi yang paling sesuai dengan kondisi kamu sekarang.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                {STATUS_OPTIONS.map(opt => {
                                    const isSelected = form.statusSaatIni === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            className={`tracer-status-card ${isSelected ? 'selected' : ''}`}
                                            onClick={() => setForm(prev => ({ ...prev, statusSaatIni: opt.value }))}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '1rem',
                                                padding: '1.1rem 1.25rem', borderRadius: '16px',
                                                cursor: 'pointer', background: isSelected ? opt.bg : '#fafafa',
                                                border: `2px solid ${isSelected ? opt.color : '#e2e8f0'} !important`,
                                                textAlign: 'left', width: '100%',
                                                boxShadow: isSelected ? `0 4px 16px ${opt.color}25` : 'none',
                                                borderColor: isSelected ? opt.color : '#e2e8f0',
                                            }}
                                        >
                                            <span style={{
                                                fontSize: '1.75rem', lineHeight: 1,
                                                width: '44px', height: '44px', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                background: isSelected ? `${opt.color}18` : '#f1f5f9',
                                                borderRadius: '12px', flexShrink: 0
                                            }}>{opt.icon}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 800, color: isSelected ? opt.color : '#1e293b', fontSize: '0.95rem' }}>
                                                    {opt.label}
                                                </div>
                                                <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.1rem' }}>
                                                    {opt.desc}
                                                </div>
                                            </div>
                                            <div style={{
                                                width: '22px', height: '22px', borderRadius: '50%',
                                                border: `2px solid ${isSelected ? opt.color : '#cbd5e1'}`,
                                                background: isSelected ? opt.color : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0, transition: 'all 0.2s'
                                            }}>
                                                {isSelected && <Check size={12} color="white" strokeWidth={3} />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                className="tracer-btn-next"
                                disabled={!form.statusSaatIni}
                                onClick={() => setStep(2)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    background: form.statusSaatIni ? 'linear-gradient(135deg, #16803d, #22c55e)' : '#e2e8f0',
                                    color: form.statusSaatIni ? 'white' : '#94a3b8',
                                    border: 'none', padding: '0.875rem 1.75rem', borderRadius: '14px',
                                    fontSize: '0.95rem', fontWeight: 700, cursor: form.statusSaatIni ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s',
                                    boxShadow: form.statusSaatIni ? '0 4px 14px rgba(22, 128, 61, 0.25)' : 'none'
                                }}
                            >
                                Lanjutkan <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ───────────── STEP 2: DETAIL INFORMASI ───────────── */}
                {step === 2 && (
                    <div style={{ animation: 'fadeInScale 0.35s ease-out' }}>
                        {/* Status badge */}
                        {selectedStatus && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                background: selectedStatus.bg, border: `1px solid ${selectedStatus.color}30`,
                                borderRadius: '16px', padding: '0.875rem 1.25rem', marginBottom: '1.25rem'
                            }}>
                                <span style={{ fontSize: '1.4rem' }}>{selectedStatus.icon}</span>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Status yang dipilih</div>
                                    <div style={{ fontWeight: 800, color: selectedStatus.color }}>{selectedStatus.label}</div>
                                </div>
                            </div>
                        )}

                        <div style={{
                            background: 'white', borderRadius: '24px', padding: '2rem',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
                            marginBottom: '1.5rem'
                        }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.375rem' }}>
                                Lengkapi detail informasi
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>
                                Isi informasi di bawah sesuai kondisi saat ini. Field bertanda <span style={{ color: '#ef4444' }}>*</span> wajib diisi.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Nama Instansi */}
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: '0.625rem' }}>
                                        <Building2 size={15} color="#16803d" />
                                        {form.statusSaatIni === 'Melanjutkan ke SMA/SMK' || form.statusSaatIni === 'Kuliah'
                                            ? 'Nama Sekolah / Universitas'
                                            : form.statusSaatIni === 'Bekerja'
                                            ? 'Nama Perusahaan / Instansi'
                                            : 'Nama Instansi / Tempat'
                                        }
                                        <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="tracer-input"
                                        required
                                        value={form.namaInstansi}
                                        onChange={(e) => setForm(prev => ({ ...prev, namaInstansi: e.target.value }))}
                                        placeholder={
                                            form.statusSaatIni === 'Melanjutkan ke SMA/SMK' ? 'Contoh: SMAN 2 Bogor, SMK Nusantara...'
                                            : form.statusSaatIni === 'Kuliah' ? 'Contoh: Universitas Indonesia, UGM, IPB...'
                                            : form.statusSaatIni === 'Bekerja' ? 'Contoh: PT Telkom Indonesia, CV Maju Jaya...'
                                            : form.statusSaatIni === 'Wirausaha' ? 'Contoh: Toko Online "Keren Store", Warung Bakso...'
                                            : 'Masukkan nama instansi...'
                                        }
                                        style={{
                                            width: '100%', padding: '0.875rem 1rem',
                                            border: '2px solid #e2e8f0', borderRadius: '12px',
                                            fontSize: '0.95rem', color: '#1e293b', background: '#fafafa',
                                            transition: 'all 0.2s', boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                {/* Jurusan / Jabatan */}
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: '0.625rem' }}>
                                        <Award size={15} color="#16803d" />
                                        {form.statusSaatIni === 'Bekerja' || form.statusSaatIni === 'Wirausaha' ? 'Jabatan / Posisi' : 'Jurusan / Program Studi'}
                                    </label>
                                    <input
                                        type="text"
                                        className="tracer-input"
                                        value={form.jabatanAtauJurusan}
                                        onChange={(e) => setForm(prev => ({ ...prev, jabatanAtauJurusan: e.target.value }))}
                                        placeholder={
                                            form.statusSaatIni === 'Bekerja' ? 'Contoh: Staff Administrasi, Programmer, Marketing...'
                                            : form.statusSaatIni === 'Wirausaha' ? 'Contoh: Owner, Manajer, Direktur...'
                                            : 'Contoh: IPA, Teknik Komputer, Akuntansi...'
                                        }
                                        style={{
                                            width: '100%', padding: '0.875rem 1rem',
                                            border: '2px solid #e2e8f0', borderRadius: '12px',
                                            fontSize: '0.95rem', color: '#1e293b', background: '#fafafa',
                                            transition: 'all 0.2s', boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                {/* Tahun Mulai */}
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: '0.625rem' }}>
                                        <Calendar size={15} color="#16803d" />
                                        Tahun Mulai
                                    </label>
                                    <select
                                        className="tracer-input"
                                        value={form.tahunMulai}
                                        onChange={(e) => setForm(prev => ({ ...prev, tahunMulai: e.target.value }))}
                                        style={{
                                            width: '100%', padding: '0.875rem 1rem',
                                            border: '2px solid #e2e8f0', borderRadius: '12px',
                                            fontSize: '0.95rem', color: form.tahunMulai ? '#1e293b' : '#94a3b8',
                                            background: '#fafafa', transition: 'all 0.2s',
                                            cursor: 'pointer', boxSizing: 'border-box',
                                            appearance: 'none'
                                        }}
                                    >
                                        <option value="">-- Pilih tahun --</option>
                                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(yr => (
                                            <option key={yr} value={String(yr)}>{yr}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Catatan Tambahan */}
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: '0.625rem' }}>
                                        <MessageSquare size={15} color="#16803d" />
                                        Cerita / Catatan Tambahan
                                        <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.78rem' }}>(opsional)</span>
                                    </label>
                                    <textarea
                                        className="tracer-input"
                                        value={form.catatanTambahan}
                                        onChange={(e) => setForm(prev => ({ ...prev, catatanTambahan: e.target.value }))}
                                        placeholder="Ceritakan pengalaman, prestasi, atau hal menarik lainnya yang ingin kamu bagikan ke sekolah..."
                                        rows={4}
                                        style={{
                                            width: '100%', padding: '0.875rem 1rem',
                                            border: '2px solid #e2e8f0', borderRadius: '12px',
                                            fontSize: '0.95rem', color: '#1e293b', background: '#fafafa',
                                            transition: 'all 0.2s', resize: 'vertical',
                                            fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between' }}>
                            <button
                                type="button"
                                className="tracer-btn-back"
                                onClick={() => setStep(1)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    background: '#ffffff', color: '#475569',
                                    border: '2px solid #e2e8f0', padding: '0.875rem 1.5rem', borderRadius: '14px',
                                    fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                ← Kembali
                            </button>
                            <button
                                type="button"
                                className="tracer-btn-next"
                                disabled={!form.namaInstansi}
                                onClick={() => setStep(3)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    background: form.namaInstansi ? 'linear-gradient(135deg, #16803d, #22c55e)' : '#e2e8f0',
                                    color: form.namaInstansi ? 'white' : '#94a3b8',
                                    border: 'none', padding: '0.875rem 1.75rem', borderRadius: '14px',
                                    fontSize: '0.95rem', fontWeight: 700,
                                    cursor: form.namaInstansi ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s',
                                    boxShadow: form.namaInstansi ? '0 4px 14px rgba(22, 128, 61, 0.25)' : 'none'
                                }}
                            >
                                Lanjutkan <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ───────────── STEP 3: KONFIRMASI ───────────── */}
                {step === 3 && (
                    <div style={{ animation: 'fadeInScale 0.35s ease-out' }}>
                        <div style={{
                            background: 'white', borderRadius: '24px', padding: '2rem',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
                                <div style={{
                                    width: '44px', height: '44px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '1px solid #bbf7d0'
                                }}>
                                    <ClipboardCheck size={22} color="#16803d" />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Konfirmasi Data</h2>
                                    <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>Periksa kembali sebelum menyimpan</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                {[
                                    { icon: selectedStatus?.icon || '✨', label: 'Status Saat Ini', value: form.statusSaatIni, required: true },
                                    { icon: '🏢', label: form.statusSaatIni === 'Bekerja' || form.statusSaatIni === 'Wirausaha' ? 'Perusahaan / Instansi' : 'Sekolah / Universitas', value: form.namaInstansi, required: true },
                                    { icon: '📋', label: form.statusSaatIni === 'Bekerja' || form.statusSaatIni === 'Wirausaha' ? 'Jabatan' : 'Jurusan', value: form.jabatanAtauJurusan || '-', required: false },
                                    { icon: '📅', label: 'Tahun Mulai', value: form.tahunMulai || '-', required: false },
                                    { icon: '💬', label: 'Catatan', value: form.catatanTambahan || '-', required: false },
                                ].map((row, i) => (
                                    <div key={i} style={{
                                        display: 'flex', gap: '1rem', padding: '1rem 0',
                                        borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none',
                                        alignItems: 'flex-start'
                                    }}>
                                        <span style={{
                                            fontSize: '1.1rem', width: '32px', height: '32px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: '#f8fafc', borderRadius: '8px', flexShrink: 0
                                        }}>{row.icon}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.2rem' }}>
                                                {row.label}
                                            </div>
                                            <div style={{
                                                fontWeight: 700, fontSize: '0.95rem',
                                                color: row.value === '-' ? '#94a3b8' : '#1e293b'
                                            }}>
                                                {row.value}
                                            </div>
                                        </div>
                                        {row.required && (
                                            <div style={{
                                                width: '20px', height: '20px', borderRadius: '50%',
                                                background: '#dcfce7', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', flexShrink: 0
                                            }}>
                                                <Check size={11} color="#16803d" strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Privacy note */}
                        <div style={{
                            background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '14px',
                            padding: '0.875rem 1.25rem', marginBottom: '1.5rem',
                            display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
                        }}>
                            <AlertCircle size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '1px' }} />
                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#0369a1', lineHeight: 1.6 }}>
                                Data tracer study kamu akan digunakan oleh sekolah untuk keperluan pemantauan dan pelaporan alumni. 
                                Data ini bersifat anonim dan tidak akan disebarluaskan ke pihak ketiga.
                            </p>
                        </div>

                        {error && (
                            <div style={{
                                background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c',
                                padding: '0.875rem 1.25rem', borderRadius: '12px', fontSize: '0.875rem',
                                fontWeight: 600, marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center'
                            }}>
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between' }}>
                            <button
                                type="button"
                                className="tracer-btn-back"
                                onClick={() => setStep(2)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    background: '#ffffff', color: '#475569',
                                    border: '2px solid #e2e8f0', padding: '0.875rem 1.5rem', borderRadius: '14px',
                                    fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                ← Kembali
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="tracer-btn-next"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    background: 'linear-gradient(135deg, #16803d, #22c55e)',
                                    color: 'white', border: 'none', padding: '0.875rem 2rem',
                                    borderRadius: '14px', fontSize: '0.95rem', fontWeight: 700,
                                    cursor: isSaving ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                                    boxShadow: '0 4px 14px rgba(22, 128, 61, 0.25)',
                                    opacity: isSaving ? 0.75 : 1
                                }}
                            >
                                {isSaving ? (
                                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Menyimpan...</>
                                ) : (
                                    <><Save size={16} /> Simpan Data Tracer</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

function AdminTracerDashboard() {
    const [tracerData, setTracerData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [yearFilter, setYearFilter] = useState("all");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;

    // Modal state for editing
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [editForm, setEditForm] = useState({
        statusSaatIni: "",
        namaInstansi: "",
        jabatanAtauJurusan: "",
        tahunMulai: "",
        catatanTambahan: ""
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Config states
    const [googleFormUrl, setGoogleFormUrl] = useState("https://docs.google.com/forms/d/e/1FAIpQLSdZ3hu3c4aWlCKxTPfHbS9PwnaKAygStfrDHjZ78-BqmbJm7g/viewform?usp=publish-editor");

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await api.getTracerStudy();
            if (res.success) {
                setTracerData(res.data);
            } else {
                setError("Gagal memuat data. Server tidak merespons dengan benar.");
            }
        } catch (e: any) {
            console.error(e);
            setError(e?.message || "Gagal memuat data tracer study.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        // Load Google Form Url from settings if configured
        const storedUrl = localStorage.getItem("saada_google_form_url");
        if (storedUrl) setGoogleFormUrl(storedUrl);
    }, []);

    // ── DATA COMPUTATION FOR ANALYTICS ──
    const total = tracerData.length;
    const melanjutkan = tracerData.filter(i => i.statusSaatIni === 'Melanjutkan ke SMA/SMK').length;
    const bekerja = tracerData.filter(i => i.statusSaatIni === 'Bekerja').length;
    const tidakDiketahui = tracerData.filter(i => i.statusSaatIni === 'Tidak Diketahui').length;
    const lainnya = total - melanjutkan - bekerja - tidakDiketahui;

    const statusCounts = tracerData.reduce((acc: any, item: any) => {
        const status = item.statusSaatIni || "Lainnya";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const COLORS = ['#f59e0b', '#22c55e', '#64748b', '#3b82f6', '#ec4899', '#8b5cf6'];
    const pieData = Object.keys(statusCounts).map(key => ({
        name: key,
        value: statusCounts[key]
    }));

    // Top Destination Schools / Instansi
    const instansiCounts = tracerData.reduce((acc: any, item: any) => {
        const inst = item.namaInstansi?.trim();
        if (inst && inst !== "-" && inst.toLowerCase() !== "tidak diketahui") {
            acc[inst] = (acc[inst] || 0) + 1;
        }
        return acc;
    }, {});
    const barData = Object.keys(instansiCounts)
        .map(key => ({ name: key, count: instansiCounts[key] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Graduation years list for dropdown filter
    const graduationYears = Array.from(
        new Set(tracerData.map(i => i.alumni?.graduationYear).filter(Boolean))
    ).sort((a: any, b: any) => b - a);

    // ── SEARCH & FILTER LOGIC ──
    const filteredData = tracerData.filter(item => {
        const matchesSearch = !searchQuery || 
            item.alumni?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.namaInstansi?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || item.statusSaatIni === statusFilter;
        const matchesYear = yearFilter === "all" || String(item.alumni?.graduationYear) === yearFilter;
        return matchesSearch && matchesStatus && matchesYear;
    });

    // ── PAGINATION LOGIC ──
    const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedData = filteredData.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);

    const handlePageChange = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, yearFilter]);

    // ── ACTIONS ──
    const handleExportExcel = () => {
        if (filteredData.length === 0) {
            alert("Peringatan: Tidak ada data tracer study yang dapat diekspor.");
            return;
        }
        const dataToExport = filteredData.map((item, index) => ({
            "No": index + 1,
            "Nama Alumni": item.alumni?.fullName || `Alumni #${item.alumniId}`,
            "NIS": item.alumni?.nis || "-",
            "NISN": item.alumni?.nisn || "-",
            "Status Saat Ini": item.statusSaatIni,
            "Nama Instansi / Sekolah": item.namaInstansi || "-",
            "Jabatan / Jurusan": item.jabatanAtauJurusan || "-",
            "Tahun Mulai": item.tahunMulai || "-",
            "Catatan": item.catatanTambahan || "-",
            "Tanggal Diperbarui": new Date(item.diperbaruiPada).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            })
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tracer Study");
        
        // Auto-fit columns
        const maxLens = Object.keys(dataToExport[0] || {}).map(key => {
            return Math.max(
                key.length,
                ...dataToExport.map(row => String(row[key as keyof typeof row] || "").length)
            ) + 3;
        });
        worksheet["!cols"] = maxLens.map(len => ({ wch: len }));

        XLSX.writeFile(workbook, `Tracer_Study_Alumni_SAADA_${new Date().getFullYear()}.xlsx`);
    };

    const openEditModal = (item: any) => {
        setEditingItem(item);
        setEditForm({
            statusSaatIni: item.statusSaatIni || "",
            namaInstansi: item.namaInstansi || "",
            jabatanAtauJurusan: item.jabatanAtauJurusan || "",
            tahunMulai: item.tahunMulai || "",
            catatanTambahan: item.catatanTambahan || ""
        });
        setSaveError(null);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;
        setIsSaving(true);
        setSaveError(null);
        try {
            const payload = {
                ...editingItem,
                ...editForm
            };
            const res = await api.updateTracerStudy(editingItem.id, payload);
            if (res.success) {
                // Update state locally
                setTracerData(prev => prev.map(t => t.id === editingItem.id ? { ...t, ...editForm, diperbaruiPada: new Date().toISOString() } : t));
                setIsEditModalOpen(false);
            } else {
                setSaveError("Gagal memperbarui data. Coba beberapa saat lagi.");
            }
        } catch (e: any) {
            console.error(e);
            setSaveError(e?.message || "Terjadi kesalahan saat menyimpan data.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="premium-container">
                {/* ── HERO HEADER ── */}
                <header className="page-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <div className="hero-badge" style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#f0fdf4', color: '#15803d', fontWeight: 800, fontSize: '0.75rem', borderRadius: '20px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Alumni Data</div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, color: '#1e293b', letterSpacing: '-0.5px' }}>Tracer Study</h1>
                        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Pemantauan karir dan studi lanjut alumni secara real-time.</p>
                    </div>
                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <a 
                            href={googleFormUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '0.5rem', 
                                background: '#7c3aed', padding: '0.75rem 1.25rem', 
                                borderRadius: '14px', fontSize: '0.88rem', fontWeight: 700, 
                                cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none',
                                color: '#ffffff', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)'
                            }}
                            className="hover-card"
                        >
                            <ExternalLink size={16} />
                            <span>Isi via Google Form</span>
                        </a>
                        <button 
                            onClick={handleExportExcel}
                            disabled={filteredData.length === 0}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '0.5rem', 
                                background: '#16803d', color: 'white', padding: '0.75rem 1.25rem', 
                                borderRadius: '14px', fontSize: '0.88rem', fontWeight: 700, 
                                border: 'none', cursor: filteredData.length === 0 ? 'not-allowed' : 'pointer', 
                                transition: 'all 0.2s', opacity: filteredData.length === 0 ? 0.6 : 1,
                                boxShadow: '0 4px 12px rgba(22, 128, 61, 0.15)'
                            }}
                            className="hover-card"
                        >
                            <FileSpreadsheet size={16} />
                            <span>Ekspor Excel</span>
                        </button>
                    </div>
                </header>

                {/* ── STATS CARDS ── */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Terlacak</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>{total} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>siswa</span></div>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ color: '#d97706', fontSize: '0.8rem', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Melanjutkan SMA/SMK</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#d97706' }}>{melanjutkan} <span style={{ fontSize: '0.9rem', color: '#b45309', fontWeight: '600' }}>({total ? Math.round((melanjutkan/total)*100) : 0}%)</span></div>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ color: '#166534', fontSize: '0.8rem', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bekerja / Usaha</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#166534' }}>{bekerja} <span style={{ fontSize: '0.9rem', color: '#14532d', fontWeight: '600' }}>({total ? Math.round((bekerja/total)*100) : 0}%)</span></div>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Belum Terlacak</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#475569' }}>{tidakDiketahui} <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '600' }}>({total ? Math.round((tidakDiketahui/total)*100) : 0}%)</span></div>
                    </div>
                </section>

                {/* ── VISUAL ANALYTICS GRID ── */}
                {total > 0 && (
                    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        {/* Status Distribution (Pie Chart) */}
                        <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(255,255,255,0.6)', height: '340px', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>Sebaran Status Alumni</h3>
                            <div style={{ flex: 1, minHeight: 0 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value} Alumni`, 'Jumlah']} />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '0.78rem', fontWeight: 600 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Top Destination Schools (Bar Chart) */}
                        <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(255,255,255,0.6)', height: '340px', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>Sekolah Tujuan Terpopuler</h3>
                            {barData.length === 0 ? (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>Belum ada data sekolah lanjutan terdaftar.</div>
                            ) : (
                                <div style={{ flex: 1, minHeight: 0 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '0.75rem', fontWeight: 700, fill: '#475569' }} axisLine={false} tickLine={false} />
                                            <Tooltip formatter={(value) => [`${value} Siswa`, 'Jumlah']} />
                                            <Bar dataKey="count" fill="#4f46e5" radius={[0, 8, 8, 0]} barSize={16}>
                                                {barData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#818cf8'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* ── FILTER & SEARCH TOOLBAR ── */}
                <div className="glass" style={{ padding: '1.25rem', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.85)', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.01)' }}>
                    {/* Search box */}
                    <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                            type="text" 
                            placeholder="Cari nama alumni atau sekolah tujuan..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ 
                                width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', 
                                border: '1px solid #e2e8f0', borderRadius: '12px', 
                                fontSize: '0.88rem', color: '#1e293b', background: '#f8fafc',
                                outline: 'none', transition: 'border 0.2s'
                            }}
                        />
                    </div>

                    {/* Status filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={14} color="#94a3b8" />
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ 
                                padding: '0.75rem 2.2rem 0.75rem 1rem', border: '1px solid #e2e8f0', 
                                borderRadius: '12px', fontSize: '0.88rem', color: '#475569', 
                                background: '#f8fafc', outline: 'none', cursor: 'pointer' 
                            }}
                        >
                            <option value="all">Semua Status</option>
                            <option value="Melanjutkan ke SMA/SMK">Melanjutkan ke SMA/SMK</option>
                            <option value="Bekerja">Bekerja</option>
                            <option value="Tidak Diketahui">Tidak Diketahui</option>
                        </select>
                    </div>

                    {/* Year filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={14} color="#94a3b8" />
                        <select 
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            style={{ 
                                padding: '0.75rem 2.2rem 0.75rem 1rem', border: '1px solid #e2e8f0', 
                                borderRadius: '12px', fontSize: '0.88rem', color: '#475569', 
                                background: '#f8fafc', outline: 'none', cursor: 'pointer' 
                            }}
                        >
                            <option value="all">Semua Angkatan</option>
                            {graduationYears.map(yr => (
                                <option key={yr} value={String(yr)}>Angkatan {yr}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ── DATA TABLE ── */}
                <div className="glass" style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.7)', borderRadius: '28px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.03)' }}>
                    {isLoading ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Memuat data tracer study...</p>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: '1rem' }}>⚠️ {error}</p>
                            <button onClick={loadData} style={{ padding: '0.6rem 1.5rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                Coba Lagi
                            </button>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                                        <th style={{ padding: '1rem' }}>Nama Alumni</th>
                                        <th style={{ padding: '1rem' }}>Angkatan</th>
                                        <th style={{ padding: '1rem' }}>Status Saat Ini</th>
                                        <th style={{ padding: '1rem' }}>Instansi / Universitas</th>
                                        <th style={{ padding: '1rem' }}>Jabatan / Jurusan</th>
                                        <th style={{ padding: '1rem' }}>Diperbarui</th>
                                        <th style={{ padding: '1rem', width: '80px', textAlign: 'center' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length === 0 ? (
                                        <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Tidak ada data yang cocok dengan kriteria pencarian/filter.</td></tr>
                                    ) : (
                                        paginatedData.map(item => (
                                            <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                                                <td style={{ padding: '1.2rem 1rem', fontWeight: 600, color: '#0f172a' }}>{item.alumni?.fullName || "Alumni #" + item.alumniId}</td>
                                                <td style={{ padding: '1.2rem 1rem', color: '#475569', fontWeight: 500 }}>{item.alumni?.graduationYear || "-"}</td>
                                                <td style={{ padding: '1.2rem 1rem' }}>
                                                    {(() => {
                                                        let bg = '#dbeafe', color = '#1e40af', icon = <GraduationCap size={12} style={{display:'inline', marginRight:'4px', verticalAlign:'middle'}}/>;
                                                        if (item.statusSaatIni === 'Bekerja') {
                                                            bg = '#dcfce7'; color = '#166534';
                                                            icon = <Briefcase size={12} style={{display:'inline', marginRight:'4px', verticalAlign:'middle'}}/>;
                                                        } else if (item.statusSaatIni === 'Melanjutkan ke SMA/SMK') {
                                                            bg = '#fef3c7'; color = '#92400e';
                                                            icon = <BookOpen size={12} style={{display:'inline', marginRight:'4px', verticalAlign:'middle'}}/>;
                                                        } else if (item.statusSaatIni === 'Tidak Diketahui') {
                                                            bg = '#f1f5f9'; color = '#475569';
                                                            icon = <HelpCircle size={12} style={{display:'inline', marginRight:'4px', verticalAlign:'middle'}}/>;
                                                        }
                                                        return (
                                                            <span style={{ 
                                                                padding: '0.4rem 0.8rem', 
                                                                background: bg, 
                                                                color: color,
                                                                borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 
                                                            }}>
                                                                {icon}
                                                                {item.statusSaatIni}
                                                            </span>
                                                        );
                                                    })()}
                                                </td>
                                                <td style={{ padding: '1.2rem 1rem', color: '#334155' }}>{item.namaInstansi || "-"}</td>
                                                <td style={{ padding: '1.2rem 1rem', color: '#334155' }}>{item.jabatanAtauJurusan || "-"}</td>
                                                <td style={{ padding: '1.2rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                                                    {new Date(item.diperbaruiPada).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                                                </td>
                                                <td style={{ padding: '1.2rem 1rem', textAlign: 'center' }}>
                                                    <button 
                                                        onClick={() => openEditModal(item)}
                                                        style={{ 
                                                            background: 'rgba(79, 70, 229, 0.08)', color: '#4f46e5', 
                                                            border: 'none', padding: '0.5rem', borderRadius: '10px', 
                                                            cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
                                                            justifyContent: 'center', transition: 'all 0.2s' 
                                                        }}
                                                        className="hover-card"
                                                        title="Edit Data Tracer"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ── PAGINATION CONTROLS ── */}
                    {!isLoading && !error && filteredData.length > 0 && (
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            marginTop: '1.5rem', flexWrap: 'wrap', gap: '0.75rem'
                        }}>
                            {/* Info */}
                            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                                Menampilkan <strong style={{ color: '#1e293b' }}>
                                    {(safeCurrentPage - 1) * PAGE_SIZE + 1}–{Math.min(safeCurrentPage * PAGE_SIZE, filteredData.length)}
                                </strong> dari <strong style={{ color: '#1e293b' }}>{filteredData.length}</strong> data
                            </span>

                            {/* Buttons */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {/* Back */}
                                <button
                                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                                    disabled={safeCurrentPage === 1}
                                    style={{
                                        padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem',
                                        fontWeight: 700, border: '1px solid #e2e8f0',
                                        background: safeCurrentPage === 1 ? '#f1f5f9' : '#ffffff',
                                        color: safeCurrentPage === 1 ? '#94a3b8' : '#475569',
                                        cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    ← Back
                                </button>

                                {/* Page numbers */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - safeCurrentPage) <= 1)
                                    .reduce<(number | string)[]>((acc, p, idx, arr) => {
                                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((p, idx) =>
                                        p === '...' ? (
                                            <span key={`ellipsis-${idx}`} style={{ padding: '0 0.25rem', color: '#94a3b8', fontSize: '0.82rem' }}>…</span>
                                        ) : (
                                            <button
                                                key={p}
                                                onClick={() => handlePageChange(p as number)}
                                                style={{
                                                    width: '36px', height: '36px', borderRadius: '10px',
                                                    fontSize: '0.82rem', fontWeight: 700,
                                                    border: safeCurrentPage === p ? 'none' : '1px solid #e2e8f0',
                                                    background: safeCurrentPage === p ? '#4f46e5' : '#ffffff',
                                                    color: safeCurrentPage === p ? '#ffffff' : '#475569',
                                                    cursor: 'pointer', transition: 'all 0.2s',
                                                    boxShadow: safeCurrentPage === p ? '0 4px 12px rgba(79,70,229,0.25)' : 'none'
                                                }}
                                            >
                                                {p}
                                            </button>
                                        )
                                    )
                                }

                                {/* Next */}
                                <button
                                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                                    disabled={safeCurrentPage === totalPages}
                                    style={{
                                        padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem',
                                        fontWeight: 700, border: '1px solid #e2e8f0',
                                        background: safeCurrentPage === totalPages ? '#f1f5f9' : '#4f46e5',
                                        color: safeCurrentPage === totalPages ? '#94a3b8' : '#ffffff',
                                        cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: safeCurrentPage === totalPages ? 'none' : '0 4px 12px rgba(79,70,229,0.2)'
                                    }}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── EDIT MODAL POPUP ── */}
            {isEditModalOpen && editingItem && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 3000, animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        background: '#ffffff', border: '1px solid rgba(255,255,255,0.8)',
                        borderRadius: '24px', width: '100%', maxWidth: '520px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', display: 'flex',
                        flexDirection: 'column', overflow: 'hidden'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#1e293b' }}>Edit Tracer Study</h3>
                                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 550 }}>{editingItem.alumni?.fullName || "Alumni"}</p>
                            </div>
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSaveEdit}>
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {/* Error alert */}
                                {saveError && (
                                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 600 }}>
                                        ⚠️ {saveError}
                                    </div>
                                )}

                                {/* Status */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 750, color: '#475569', marginBottom: '0.5rem' }}>Status Saat Ini</label>
                                    <select 
                                        value={editForm.statusSaatIni}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, statusSaatIni: e.target.value }))}
                                        required
                                        style={{ 
                                            width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', 
                                            borderRadius: '12px', fontSize: '0.88rem', color: '#1e293b', 
                                            outline: 'none', cursor: 'pointer', background: '#f8fafc'
                                        }}
                                    >
                                        <option value="Melanjutkan ke SMA/SMK">Melanjutkan ke SMA/SMK</option>
                                        <option value="Bekerja">Bekerja</option>
                                        <option value="Tidak Diketahui">Tidak Diketahui</option>
                                        <option value="Kuliah">Kuliah</option>
                                        <option value="Wirausaha">Wirausaha</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>

                                {/* Nama Instansi / Sekolah */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 750, color: '#475569', marginBottom: '0.5rem' }}>Nama Instansi / Sekolah Lanjutan</label>
                                    <input 
                                        type="text"
                                        value={editForm.namaInstansi}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, namaInstansi: e.target.value }))}
                                        placeholder="Contoh: SMAN 2 Bogor, SMK Nusantara, PT Sukses"
                                        style={{ 
                                            width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', 
                                            borderRadius: '12px', fontSize: '0.88rem', color: '#1e293b', 
                                            outline: 'none', background: '#f8fafc'
                                        }}
                                    />
                                </div>

                                {/* Jabatan / Jurusan */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 750, color: '#475569', marginBottom: '0.5rem' }}>Jabatan / Jurusan</label>
                                    <input 
                                        type="text"
                                        value={editForm.jabatanAtauJurusan}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, jabatanAtauJurusan: e.target.value }))}
                                        placeholder="Contoh: IPA, Teknik Komputer, Staff Administrasi"
                                        style={{ 
                                            width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', 
                                            borderRadius: '12px', fontSize: '0.88rem', color: '#1e293b', 
                                            outline: 'none', background: '#f8fafc'
                                        }}
                                    />
                                </div>

                                {/* Tahun Mulai */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 750, color: '#475569', marginBottom: '0.5rem' }}>Tahun Mulai</label>
                                    <input 
                                        type="text"
                                        value={editForm.tahunMulai}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, tahunMulai: e.target.value }))}
                                        placeholder="Contoh: 2024"
                                        style={{ 
                                            width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', 
                                            borderRadius: '12px', fontSize: '0.88rem', color: '#1e293b', 
                                            outline: 'none', background: '#f8fafc'
                                        }}
                                    />
                                </div>

                                {/* Catatan Tambahan */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 750, color: '#475569', marginBottom: '0.5rem' }}>Catatan Tambahan</label>
                                    <textarea 
                                        value={editForm.catatanTambahan}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, catatanTambahan: e.target.value }))}
                                        placeholder="Keterangan tambahan..."
                                        rows={3}
                                        style={{ 
                                            width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', 
                                            borderRadius: '12px', fontSize: '0.88rem', color: '#1e293b', 
                                            outline: 'none', resize: 'vertical', background: '#f8fafc'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{
                                padding: '1rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9',
                                display: 'flex', justifyContent: 'flex-end', gap: '0.75rem'
                            }}>
                                <button 
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    style={{
                                        padding: '0.75rem 1.25rem', border: '1px solid #cbd5e1',
                                        borderRadius: '12px', background: '#ffffff', color: '#475569',
                                        fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer'
                                    }}
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    style={{
                                        padding: '0.75rem 1.5rem', border: 'none',
                                        borderRadius: '12px', background: '#4f46e5', color: 'white',
                                        fontSize: '0.88rem', fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                                    }}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : (
                                        <span>Simpan Perubahan</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE — ROLE-BASED ROUTER
// ═══════════════════════════════════════════════════════════════
export default function TracerStudyPage() {
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                const user = JSON.parse(stored);
                setUserRole(user.role || "Admin");
            } else {
                setUserRole("Admin");
            }
        } catch {
            setUserRole("Admin");
        }
    }, []);

    if (userRole === null) {
        // Still loading role
        return (
            <AdminLayout>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
                    <style>{`@keyframes spin-router { to { transform: rotate(360deg); } }`}</style>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#16803d', borderRadius: '50%', animation: 'spin-router 1s linear infinite' }} />
                </div>
            </AdminLayout>
        );
    }

    if (userRole === "Alumni") {
        return (
            <AdminLayout>
                <AlumniTracerForm />
            </AdminLayout>
        );
    }

    return <AdminTracerDashboard />;
}
