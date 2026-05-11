"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { Briefcase, GraduationCap } from "lucide-react";
import * as api from "../../../services/api";

export default function TracerStudyPage() {
    const [tracerData, setTracerData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await api.getTracerStudy();
                if(res.success) setTracerData(res.data);
            } catch(e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <AdminLayout>
            <div className="premium-container">
                <header className="page-hero" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    <div className="hero-badge" style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#f0fdf4', color: '#15803d', fontWeight: 800, fontSize: '0.75rem', borderRadius: '20px', textTransform: 'uppercase', marginBottom: '1rem' }}>Alumni Data</div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, color: '#1e293b' }}>Tracer Study</h1>
                    <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Pemantauan karir dan studi lanjut alumni secara real-time.</p>
                </header>

                <div className="glass" style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.7)', borderRadius: '28px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.03)' }}>
                    {isLoading ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Memuat data tracer study...</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                                        <th style={{ padding: '1rem' }}>Nama Alumni</th>
                                        <th style={{ padding: '1rem' }}>Status Saat Ini</th>
                                        <th style={{ padding: '1rem' }}>Instansi / Universitas</th>
                                        <th style={{ padding: '1rem' }}>Jabatan / Jurusan</th>
                                        <th style={{ padding: '1rem' }}>Diperbarui</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tracerData.length === 0 ? (
                                        <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Belum ada data tracer study.</td></tr>
                                    ) : (
                                        tracerData.map(item => (
                                            <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                                                <td style={{ padding: '1.2rem 1rem', fontWeight: 600, color: '#0f172a' }}>{item.alumni?.fullName || "Alumni #" + item.alumniId}</td>
                                                <td style={{ padding: '1.2rem 1rem' }}>
                                                    <span style={{ 
                                                        padding: '0.4rem 0.8rem', 
                                                        background: item.statusSaatIni === 'Bekerja' ? '#dcfce7' : '#dbeafe', 
                                                        color: item.statusSaatIni === 'Bekerja' ? '#166534' : '#1e40af',
                                                        borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 
                                                    }}>
                                                        {item.statusSaatIni === 'Bekerja' ? <Briefcase size={12} style={{display:'inline', marginRight:'4px', verticalAlign:'middle'}}/> : <GraduationCap size={12} style={{display:'inline', marginRight:'4px', verticalAlign:'middle'}}/>}
                                                        {item.statusSaatIni}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.2rem 1rem', color: '#334155' }}>{item.namaInstansi}</td>
                                                <td style={{ padding: '1.2rem 1rem', color: '#334155' }}>{item.jabatanAtauJurusan}</td>
                                                <td style={{ padding: '1.2rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                                                    {new Date(item.diperbaruiPada).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
