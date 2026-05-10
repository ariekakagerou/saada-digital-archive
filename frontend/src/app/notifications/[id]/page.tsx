"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../../components/AdminLayout";
import { ArrowLeft, Clock, Info, CheckCircle, AlertCircle, Calendar, Tag, User, Trash2, Share2, Bell, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface NotificationDetail {
    id: number;
    title: string;
    message: string;
    fullDescription: string;
    type: "success" | "info" | "warning" | "alert";
    timestamp: string;
    category: string;
    sender: string;
    actionLink?: string;
    actionLabel?: string;
}

const DUMMY_DETAILS: Record<number, NotificationDetail> = {
    1: {
        id: 1,
        title: "Arsip Baru Berhasil Diunggah",
        message: "Dokumen Ijazah atas nama Ahmad Fauzi (2023) telah berhasil diproses oleh sistem OCR.",
        fullDescription: "Sistem cerdas SAADA telah menyelesaikan pemindaian dan ekstraksi teks (OCR) untuk dokumen Ijazah terbaru. Data telah dipetakan secara otomatis ke profil alumni Ahmad Fauzi. Akurasi ekstraksi terukur sebesar 98.5%. Anda dapat meninjau hasilnya melalui tautan di bawah ini.",
        type: "success",
        timestamp: "21 April 2024, 08:30 WIB",
        category: "System Update",
        sender: "SAADA AI Engine",
        actionLink: "/alumni/1",
        actionLabel: "Lihat Profil Alumni"
    },
    2: {
        id: 2,
        title: "Permintaan Verifikasi Data",
        message: "Ada 3 data buku induk baru yang memerlukan verifikasi manual oleh petugas.",
        fullDescription: "Terdapat data masukan dari impor Excel yang memiliki NISN ganda atau format tanggal lahir yang tidak standar. Diperlukan intervensi petugas Admin untuk melakukan validasi data sebelum disimpan ke database utama guna menjaga integritas data alumni.",
        type: "warning",
        timestamp: "21 April 2024, 07:15 WIB",
        category: "Data Verification",
        sender: "Database Validator",
        actionLink: "/buku-induk",
        actionLabel: "Buka Buku Induk"
    }
};

export default function NotificationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);
    const [detail, setDetail] = useState<NotificationDetail | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (DUMMY_DETAILS[id]) {
            setDetail(DUMMY_DETAILS[id]);
        }
    }, [id]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "success": return <CheckCircle size={32} color="#10b981" />;
            case "warning": return <AlertCircle size={32} color="#f59e0b" />;
            case "alert": return <AlertCircle size={32} color="#ef4444" />;
            default: return <Info size={32} color="#3b82f6" />;
        }
    };

    if (!isMounted) return null;

    if (!detail) {
        return (
            <AdminLayout>
                <div className="notif-error">
                    <Bell size={48} color="#cbd5e1" />
                    <h2>Notifikasi Tidak Ditemukan</h2>
                    <p>Maaf, notifikasi yang Anda cari tidak tersedia atau telah dihapus.</p>
                    <Link href="/notifications" className="btn-back-home">
                        Kembali ke Notifikasi
                    </Link>
                </div>
                <style jsx>{`
                    .notif-error { text-align: center; padding: 5rem 2rem; }
                    .btn-back-home { display: inline-block; margin-top: 1.5rem; color: var(--header-bg); font-weight: 600; }
                `}</style>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="detail-container">
                {/* Back Link */}
                <Link href="/notifications" className="back-link">
                    <ArrowLeft size={18} /> Kembali ke Pusat Notifikasi
                </Link>

                <div className="detail-card glass-morph">
                    {/* Header Details */}
                    <div className="detail-header">
                        <div className="icon-badge" style={{ 
                            background: detail.type === 'success' ? '#ecfdf5' : 
                                       detail.type === 'warning' ? '#fffbeb' : 
                                       detail.type === 'alert' ? '#fef2f2' : '#eff6ff' 
                        }}>
                            {getTypeIcon(detail.type)}
                        </div>
                        <div className="header-text">
                            <span className="detail-category">{detail.category}</span>
                            <h1>{detail.title}</h1>
                            <div className="meta-info">
                                <span className="meta-item"><Clock size={14} /> {detail.timestamp}</span>
                                <span className="meta-item"><User size={14} /> Pengirim: {detail.sender}</span>
                            </div>
                        </div>
                    </div>

                    <hr className="divider" />

                    {/* Content Section */}
                    <div className="detail-body">
                        <h3>Pesan Notifikasi</h3>
                        <p className="summary">{detail.message}</p>
                        
                        <h3>Deskripsi Lengkap</h3>
                        <div className="description">
                            {detail.fullDescription}
                        </div>

                        {detail.actionLink && (
                            <div className="action-footer">
                                <Link href={detail.actionLink} className="primary-action">
                                    {detail.actionLabel} <ChevronRight size={18} />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Quick Tools */}
                    <div className="detail-tools">
                        <button className="tool-btn"><Share2 size={18} /> Bagikan</button>
                        <button className="tool-btn delete"><Trash2 size={18} /> Hapus Notifikasi</button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .detail-container {
                    max-width: 800px;
                    margin: 0 auto;
                    animation: slideUp 0.4s ease-out;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .back-link {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-body);
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    opacity: 0.8;
                    transition: all 0.2s;
                }

                .back-link:hover {
                    color: var(--header-bg);
                    opacity: 1;
                    transform: translateX(-4px);
                }

                .glass-morph {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.1);
                    border-radius: 24px;
                    padding: 2.5rem;
                }

                .detail-header {
                    display: flex;
                    gap: 1.5rem;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                }

                .icon-badge {
                    width: 64px;
                    height: 64px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .header-text h1 {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: var(--text-heading);
                    margin: 0.5rem 0;
                    letter-spacing: -0.5px;
                }

                .detail-category {
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    background: #f1f5f9;
                    color: #475569;
                    padding: 4px 12px;
                    border-radius: 8px;
                }

                .meta-info {
                    display: flex;
                    gap: 1.5rem;
                    color: #64748b;
                    font-size: 0.85rem;
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }

                .divider {
                    border: none;
                    border-top: 1px solid #f1f5f9;
                    margin: 0 0 2rem 0;
                }

                .detail-body h3 {
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    color: #94a3b8;
                    margin-bottom: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                }

                .summary {
                    font-size: 1.15rem;
                    font-weight: 600;
                    color: #334155;
                    margin-bottom: 2rem;
                    line-height: 1.5;
                }

                .description {
                    font-size: 1.05rem;
                    color: #475569;
                    line-height: 1.8;
                    margin-bottom: 2.5rem;
                    white-space: pre-line;
                }

                .action-footer {
                    background: #f8fafc;
                    padding: 1.5rem;
                    border-radius: 16px;
                    border: 1px solid #f1f5f9;
                }

                .primary-action {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: var(--header-bg);
                    color: white;
                    padding: 0.8rem 1.5rem;
                    border-radius: 12px;
                    font-weight: 700;
                    transition: all 0.2s;
                    box-shadow: 0 4px 15px rgba(21, 128, 61, 0.25);
                }

                .primary-action:hover {
                    box-shadow: 0 6px 20px rgba(21, 128, 61, 0.35);
                    transform: translateY(-2px);
                }

                .detail-tools {
                    margin-top: 3rem;
                    display: flex;
                    gap: 1rem;
                    border-top: 1px solid #f1f5f9;
                    padding-top: 2rem;
                }

                .tool-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.6rem 1.25rem;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    color: #64748b;
                    font-weight: 600;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .tool-btn:hover {
                    background: #f8fafc;
                    color: #334155;
                }

                .tool-btn.delete:hover {
                    background: #fef2f2;
                    color: #ef4444;
                    border-color: #fecaca;
                }

                @media (max-width: 640px) {
                    .detail-card { padding: 1.5rem; }
                    .detail-header { flex-direction: column; gap: 0.75rem; }
                    .meta-info { flex-direction: column; gap: 0.5rem; }
                }
            `}</style>
        </AdminLayout>
    );
}
