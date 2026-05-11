"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import * as api from "../../../services/api";

export default function PermohonanDokumenPage() {
    const [permohonan, setPermohonan] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        try {
            const res = await api.getPermohonanDokumen();
            if(res.success) setPermohonan(res.data);
        } catch(e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await api.updatePermohonanStatus(id, status);
            loadData(); // Refresh data
        } catch(e) {
            alert("Gagal merubah status");
        }
    };

    const getStatusBadge = (status: string) => {
        if(status === 'Selesai') return <span style={{ padding: '0.4rem 0.8rem', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}><CheckCircle size={14} style={{display:'inline', marginRight:'4px', verticalAlign:'middle'}}/>Selesai</span>;
        if(status === 'Ditolak') return <span style={{ padding: '0.4rem 0.8rem', background: '#fee2e2', color: '#991b1b', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}><XCircle size={14} style={{display:'inline', marginRight:'4px', verticalAlign:'middle'}}/>Ditolak</span>;
        return <span style={{ padding: '0.4rem 0.8rem', background: '#fef3c7', color: '#92400e', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}><Clock size={14} style={{display:'inline', marginRight:'4px', verticalAlign:'middle'}}/>{status}</span>;
    };

    return (
        <AdminLayout>
            <div className="premium-container">
                <header className="page-hero" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    <div className="hero-badge" style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#fef2f2', color: '#b91c1c', fontWeight: 800, fontSize: '0.75rem', borderRadius: '20px', textTransform: 'uppercase', marginBottom: '1rem' }}>Layanan Alumni</div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, color: '#1e293b' }}>Permohonan Legalisir</h1>
                    <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Kelola antrean permintaan dokumen dari alumni dengan mudah.</p>
                </header>

                <div className="glass" style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.7)', borderRadius: '28px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.03)' }}>
                    {isLoading ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Memuat data permohonan...</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                                        <th style={{ padding: '1rem' }}>Tgl Pengajuan</th>
                                        <th style={{ padding: '1rem' }}>Nama Pemohon</th>
                                        <th style={{ padding: '1rem' }}>Dokumen (Copy)</th>
                                        <th style={{ padding: '1rem' }}>Tujuan</th>
                                        <th style={{ padding: '1rem' }}>Status</th>
                                        <th style={{ padding: '1rem' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permohonan.length === 0 ? (
                                        <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Tidak ada antrean permohonan.</td></tr>
                                    ) : (
                                        permohonan.map(item => (
                                            <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                                                <td style={{ padding: '1.2rem 1rem', color: '#64748b', fontSize: '0.85rem' }}>{new Date(item.tanggalPengajuan).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}</td>
                                                <td style={{ padding: '1.2rem 1rem', fontWeight: 600, color: '#0f172a' }}>{item.alumni?.fullName || "Alumni #" + item.alumniId}</td>
                                                <td style={{ padding: '1.2rem 1rem', color: '#334155' }}>
                                                    <FileText size={14} style={{ display: 'inline', marginRight: '5px', color: '#64748b', verticalAlign: 'middle' }} />
                                                    {item.jenisDokumen} <strong style={{color:'#15803d', marginLeft: '5px'}}>x{item.jumlahCopy}</strong>
                                                </td>
                                                <td style={{ padding: '1.2rem 1rem', color: '#334155' }}>{item.tujuanPermohonan}</td>
                                                <td style={{ padding: '1.2rem 1rem' }}>{getStatusBadge(item.statusPermohonan)}</td>
                                                <td style={{ padding: '1.2rem 1rem' }}>
                                                    {item.statusPermohonan === 'Menunggu' && (
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <button onClick={() => handleUpdateStatus(item.id, 'Selesai')} style={{ padding: '0.4rem 0.8rem', background: '#15803d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', transition: 'opacity 0.2s' }}>Setujui</button>
                                                            <button onClick={() => handleUpdateStatus(item.id, 'Ditolak')} style={{ padding: '0.4rem 0.8rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', transition: 'opacity 0.2s' }}>Tolak</button>
                                                        </div>
                                                    )}
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
