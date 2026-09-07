"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { Bell, CheckCircle, AlertCircle, Info, Trash2, ArrowLeft, ChevronRight, Filter, Search, Clock } from "lucide-react";
import Link from "next/link";

interface NotificationItem {
    id: number;
    title: string;
    message: string;
    type: "success" | "info" | "warning" | "alert";
    timestamp: string;
    isRead: boolean;
    category: string;
}

const DUMMY_NOTIFICATIONS: NotificationItem[] = [
    {
        id: 1,
        title: "Arsip Baru Berhasil Diunggah",
        message: "Dokumen Ijazah atas nama Ahmad Fauzi (2023) telah berhasil diproses oleh sistem OCR.",
        type: "success",
        timestamp: "2024-04-21 08:30",
        isRead: false,
        category: "System"
    },
    {
        id: 2,
        title: "Permintaan Verifikasi Data",
        message: "Ada 3 data buku induk baru yang memerlukan verifikasi manual oleh petugas.",
        type: "warning",
        timestamp: "2024-04-21 07:15",
        isRead: false,
        category: "Verification"
    },
    {
        id: 3,
        title: "Pembaruan Sistem SAADA v2.4",
        message: "Sistem telah diperbarui. Silakan periksa log pembaruan untuk melihat fitur-fitur baru.",
        type: "info",
        timestamp: "2024-04-20 16:45",
        isRead: true,
        category: "Update"
    },
    {
        id: 4,
        title: "Kualitas Gambar Rendah",
        message: "Pemindaian dokumen Legger Kelas - Siti Aminah terdeteksi buram. Disarankan unggah ulang.",
        type: "alert",
        timestamp: "2024-04-20 10:20",
        isRead: true,
        category: "OCR"
    },
    {
        id: 5,
        title: "Backup Data Selesai",
        message: "Proses backup database mingguan telah selesai dilakukan secara otomatis.",
        type: "success",
        timestamp: "2024-04-19 23:00",
        isRead: true,
        category: "Maintenance"
    }
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationItem[]>(DUMMY_NOTIFICATIONS);
    const [filter, setFilter] = useState("Semua");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "success": return <CheckCircle size={20} color="#10b981" />;
            case "warning": return <AlertCircle size={20} color="#f59e0b" />;
            case "alert": return <AlertCircle size={20} color="#ef4444" />;
            default: return <Info size={20} color="#3b82f6" />;
        }
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const deleteNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    if (!isMounted) return null;

    return (
        <AdminLayout>
            <div className="notifications-container">
                {/* Header Section */}
                <div className="page-header">
                    <div className="header-left">
                        <Link href="/dashboard" className="back-btn">
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1>Pusat Notifikasi</h1>
                            <p>Pantau semua aktivitas dan update sistem Anda</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button onClick={markAllAsRead} className="action-btn-text">
                            Tandai semua dibaca
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="tabs-container">
                    {["Semua", "Belum Dibaca", "Sistem", "Data"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`tab-item ${filter === t ? "active" : ""}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* List Section */}
                <div className="notifications-list">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div key={notif.id} className={`notif-card ${!notif.isRead ? "unread" : ""}`}>
                                <div className="notif-icon-wrap" style={{ 
                                    background: notif.type === 'success' ? '#ecfdf5' : 
                                               notif.type === 'warning' ? '#fffbeb' : 
                                               notif.type === 'alert' ? '#fef2f2' : '#eff6ff' 
                                }}>
                                    {getTypeIcon(notif.type)}
                                </div>
                                
                                <div className="notif-content">
                                    <div className="notif-top">
                                        <div className="notif-meta">
                                            <span className={`category-tag ${notif.category.toLowerCase()}`}>{notif.category}</span>
                                            <span className="timestamp">
                                                <Clock size={12} />
                                                {notif.timestamp}
                                            </span>
                                        </div>
                                        {!notif.isRead && <span className="unread-dot"></span>}
                                    </div>
                                    
                                    <h3>{notif.title}</h3>
                                    <p>{notif.message}</p>
                                    
                                    <div className="notif-actions">
                                        <Link href={`/notifications/${notif.id}`} className="view-link">
                                            Lihat Detail <ChevronRight size={14} />
                                        </Link>
                                        <button onClick={() => deleteNotification(notif.id)} className="delete-btn" title="Hapus">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <Bell size={48} opacity={0.2} />
                            <p>Tidak ada notifikasi saat ini</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .notifications-container {
                    max-width: 900px;
                    margin: 0 auto;
                    animation: fadeIn 0.4s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                }

                .back-btn {
                    padding: 0.6rem;
                    background: white;
                    border-radius: 12px;
                    display: flex;
                    color: var(--text-body);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    transition: all 0.2s;
                }

                .back-btn:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    transform: translateX(-2px);
                }

                .page-header h1 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--text-heading);
                    margin: 0;
                    letter-spacing: -0.5px;
                }

                .page-header p {
                    font-size: 0.9rem;
                    color: var(--text-body);
                    margin: 0;
                    opacity: 0.7;
                }

                .action-btn-text {
                    background: none;
                    border: none;
                    color: var(--header-bg);
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .action-btn-text:hover {
                    background: rgba(46, 125, 50, 0.05);
                    text-decoration: underline;
                }

                .tabs-container {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                    overflow-x: auto;
                    padding-bottom: 0.5rem;
                    scrollbar-width: none;
                }

                .tab-item {
                    padding: 0.5rem 1.25rem;
                    border-radius: 20px;
                    background: white;
                    border: 1px solid var(--border);
                    color: var(--text-body);
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s;
                }

                .tab-item.active {
                    background: var(--header-bg);
                    color: white;
                    border-color: var(--header-bg);
                    box-shadow: 0 4px 10px rgba(46, 125, 50, 0.25);
                }

                .notifications-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .notif-card {
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 1.25rem;
                    display: flex;
                    gap: 1.25rem;
                    transition: all 0.2s;
                    position: relative;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .notif-card:hover {
                    box-shadow: 0 8px 20px rgba(0,0,0,0.06);
                    transform: translateY(-2px);
                    border-color: #cbd5e1;
                }

                .notif-card.unread {
                    border-left: 4px solid var(--header-bg);
                    background: #f0fdf4;
                }

                .notif-icon-wrap {
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .notif-content {
                    flex: 1;
                }

                .notif-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.5rem;
                }

                .notif-meta {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .category-tag {
                    font-size: 0.65rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    padding: 2px 8px;
                    border-radius: 6px;
                    background: #f1f5f9;
                    color: #475569;
                }

                .category-tag.system { background: #fee2e2; color: #991b1b; }
                .category-tag.verification { background: #fff7ed; color: #9a3412; }
                .category-tag.ocr { background: #fdf2f8; color: #9d174d; }

                .timestamp {
                    font-size: 0.75rem;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }

                .unread-dot {
                    width: 10px;
                    height: 10px;
                    background: #ef4444;
                    border-radius: 50%;
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
                }

                .notif-content h3 {
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: var(--text-heading);
                    margin: 0 0 0.35rem 0;
                }

                .notif-content p {
                    font-size: 0.92rem;
                    color: var(--text-body);
                    margin: 0 0 1rem 0;
                    line-height: 1.5;
                }

                .notif-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .view-link {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--header-bg);
                    display: flex;
                    align-items: center;
                    gap: 0.2rem;
                }

                .view-link:hover {
                    text-decoration: underline;
                }

                .delete-btn {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 0.4rem;
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .delete-btn:hover {
                    background: #fee2e2;
                    color: #ef4444;
                }

                .empty-state {
                    padding: 4rem;
                    text-align: center;
                    background: white;
                    border-radius: 20px;
                    border: 2px dashed var(--border);
                    color: #94a3b8;
                }

                @media (max-width: 640px) {
                    .page-header h1 { font-size: 1.25rem; }
                    .notif-card { flex-direction: column; gap: 0.75rem; }
                    .notif-icon-wrap { width: 36px; height: 36px; }
                }
            `}</style>
        </AdminLayout>
    );
}
