"use client";

import AdminLayout from "../../../components/AdminLayout";
import { BookOpen, GraduationCap, Hash, BarChart2, FileText, ChevronRight, Info } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function FileMasterPage() {
    const fileMenus = [
        { name: "Buku Induk", href: "/buku-induk", icon: BookOpen, desc: "Kelola master identitas alumni, data pribadi, dan informasi dasar alumni.", badge: "Data Alumni", color: "#15803d", bgColor: "#e8f5e9" },
        { name: "Dokumen Ijazah", href: "/dokumen-ijazah", icon: GraduationCap, desc: "Kelola lembar ijazah, nomor ijazah, dan data kelulusan alumni.", badge: "Ijazah & Kelulusan", color: "#0f766e", bgColor: "#ccfbf1" },
        { name: "Dokumen SKHU", href: "/dokumen-skhu", icon: Hash, desc: "Kelola dokumen SKHU dan nomor SKHU alumni.", badge: "SKHU", color: "#1d4ed8", bgColor: "#dbeafe" },
        { name: "Transkrip Nilai", href: "/dokumen-transkrip", icon: BarChart2, desc: "Kelola transkrip nilai akademik alumni.", badge: "Akademik", color: "#6b21a8", bgColor: "#f3e8ff" },
        { name: "Rekap Rapor", href: "/dokumen-rapor", icon: FileText, desc: "Kelola rekap nilai rapor semester alumni.", badge: "Rapor", color: "#c2410c", bgColor: "#ffedd5" },
    ];

    return (
        <AdminLayout>
            <div className="fm-container">
                
                {/* Hero Banner Card */}
                <div className="fm-hero-banner">
                    <div className="fm-hero-content">
                        <h2>File Master 🗂️</h2>
                        <p>Kelola seluruh data master sistem arsip alumni</p>
                    </div>
                </div>

                {/* List Container */}
                <div className="fm-list-container">
                    {fileMenus.map((item, idx) => (
                        <Link href={item.href} key={idx} passHref className="fm-link-wrap">
                            <div className="fm-list-card">
                                <div className="fm-icon-box" style={{ background: item.bgColor, color: item.color }}>
                                    <item.icon size={38} strokeWidth={1.5} />
                                </div>
                                <div className="fm-item-content">
                                    <h3>{item.name}</h3>
                                    <p>{item.desc}</p>
                                    <div>
                                        <span className="fm-badge" style={{ color: item.color, background: item.bgColor }}>
                                            {item.badge}
                                        </span>
                                    </div>
                                </div>
                                <div className="fm-chevron">
                                    <ChevronRight size={22} color="#15803d" strokeWidth={2.5} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Info Card */}
                <div className="fm-info-card">
                    <div className="fm-info-icon">
                        <Info size={18} color="white" strokeWidth={3} />
                    </div>
                    <div className="fm-info-text">
                        <h4>Informasi</h4>
                        <p>Menu File Master digunakan untuk mengelola seluruh data master yang menjadi dasar sistem arsip alumni.</p>
                    </div>
                </div>

            </div>

            <style jsx>{`
                .fm-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 1rem;
                    padding-bottom: 2rem;
                    font-family: 'Inter', sans-serif;
                }

                @media (max-width: 768px) {
                    .fm-container {
                        padding-bottom: 6rem;
                    }
                }

                /* Banner */
                .fm-hero-banner {
                    background: linear-gradient(135deg, #065f46 0%, #15803d 100%);
                    border-radius: 16px;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 4px 15px rgba(6, 95, 70, 0.15);
                }

                .fm-hero-content {
                    padding: 1.5rem;
                }

                .fm-hero-content h2 {
                    color: white;
                    font-size: 1.6rem;
                    font-weight: 800;
                    margin: 0 0 0.5rem 0;
                    letter-spacing: -0.5px;
                }

                .fm-hero-content p {
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 0.85rem;
                    margin: 0;
                    font-weight: 500;
                    line-height: 1.4;
                }

                /* List Cards */
                .fm-list-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    width: 100%;
                }

                .fm-link-wrap {
                    display: block;
                    width: 100%;
                    text-decoration: none;
                }

                .fm-list-card {
                    display: flex;
                    flex-direction: row; /* FORCE STRICT ROW */
                    flex-wrap: nowrap;   /* PREVENT STACKING */
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;         /* FILL ENTIRE WIDTH */
                    box-sizing: border-box;
                    gap: 1rem;
                    background: white;
                    border-radius: 16px;
                    padding: 1rem;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
                    transition: all 0.2s ease;
                }

                .fm-link-wrap:active .fm-list-card {
                    transform: scale(0.98);
                    background: #f8fafc;
                }

                .fm-icon-box {
                    width: 65px;
                    height: 65px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .fm-item-content {
                    flex: 1; /* TAKE UP ALL REMAINING SPACE */
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: center;
                }

                .fm-item-content h3 {
                    font-size: 1.05rem;
                    font-weight: 800;
                    color: #1f2937;
                    margin: 0 0 0.25rem 0;
                }

                .fm-item-content p {
                    font-size: 0.8rem;
                    color: #6b7280;
                    margin: 0 0 0.6rem 0;
                    line-height: 1.4;
                }

                .fm-badge {
                    display: inline-block;
                    font-size: 0.65rem;
                    font-weight: 800;
                    padding: 4px 8px;
                    border-radius: 8px;
                }

                .fm-chevron {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    padding-left: 0.25rem;
                }

                /* Info Card */
                .fm-info-card {
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    border-radius: 16px;
                    padding: 1.25rem 1rem;
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    box-shadow: 0 4px 12px rgba(21, 128, 61, 0.05);
                }

                .fm-info-icon {
                    width: 32px;
                    height: 32px;
                    background: #15803d;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .fm-info-text h4 {
                    font-size: 0.95rem;
                    font-weight: 800;
                    color: #15803d;
                    margin: 0 0 0.4rem 0;
                }

                .fm-info-text p {
                    font-size: 0.75rem;
                    color: #4b5563;
                    margin: 0;
                    line-height: 1.5;
                    font-weight: 500;
                }
            `}</style>
        </AdminLayout>
    );
}
