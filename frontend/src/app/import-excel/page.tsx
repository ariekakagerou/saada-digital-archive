"use client";

import { useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { Upload, FileDown, CheckCircle, XCircle, Loader2, AlertCircle, Trash2, ArrowRight } from "lucide-react";
import * as api from "../../../services/api";

export default function ImportExcelPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [fileName, setFileName] = useState("");
    const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({ show: false, msg: "", type: "success" });

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: "", type: 'success' }), 3000);
    };

    // Fungsi untuk mengunduh template CSV
    const downloadTemplate = () => {
        const headers = [
            "NIS", "NISN", "NamaLengkap", "JenisKelamin", "TempatLahir", "TanggalLahir", 
            "Agama", "TahunMasuk", "TahunLulus", "StatusKelulusan", "NomorIjazah", 
            "NamaAyah", "NamaIbu", "AlamatOrangTua"
        ];
        const exampleRow = [
            "21005", "0021005678", "Contoh Nama Alumni", "L", "Bogor", "2005-08-01", 
            "Islam", "2021", "2024", "Lulus", "DN-05/MTs/001", 
            "Nama Ayah", "Nama Ibu", "Jl. Contoh Alamat No. 1"
        ];
        
        const csvContent = [headers, exampleRow].map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "template_import_alumni.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Handle File Upload & Parsing (Manual CSV for now, or dynamic script loading for XLSX)
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setIsLoading(true);

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                const lines = text.split("\n");
                const headers = lines[0].split(",").map(h => h.trim());
                
                const data = lines.slice(1).filter(l => l.trim() !== "").map(line => {
                    const values = line.split(",").map(v => v.trim());
                    const obj: any = {};
                    headers.forEach((header, index) => {
                        obj[header] = values[index];
                    });
                    return obj;
                });

                setPreviewData(data);
                showToast(`Berhasil membaca ${data.length} baris data.`);
            } catch (err) {
                showToast("Gagal membaca file. Pastikan formatnya benar.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        reader.readAsText(file);
    };

    const handleImport = async () => {
        if (previewData.length === 0) return;

        setIsLoading(true);
        try {
            const response = await api.importBukuInduk(previewData);
            showToast(response.message || "Import Berhasil!");
            setPreviewData([]);
            setFileName("");
        } catch (err: any) {
            showToast(err.message || "Gagal mengimpor ke database", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            {/* Toast Notification */}
            {toast.show && (
                <div style={{
                    position: "fixed", top: "2rem", right: "2rem",
                    background: toast.type === 'success' ? "#dcfce7" : "#fee2e2",
                    color: toast.type === 'success' ? "#166534" : "#991b1b",
                    padding: "1rem 1.5rem", borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    zIndex: 1000, display: "flex", alignItems: "center", gap: "0.75rem",
                    border: `1px solid ${toast.type === 'success' ? "#bbf7d0" : "#fecaca"}`
                }}>
                    {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span style={{ fontWeight: "600" }}>{toast.msg}</span>
                </div>
            )}

            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                <header style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem", color: "var(--text-heading)", fontWeight: "700" }}>Import Masal Data Alumni</h1>
                    <p style={{ color: "var(--text-muted)" }}>Gunakan fitur ini untuk memasukkan data sekolah dalam jumlah banyak sekaligus.</p>
                </header>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
                    {/* Left: Instructions */}
                    <div className="glass-panel" style={{ padding: "1.5rem", height: "fit-content" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <AlertCircle size={18} color="#15803d" /> Langkah-langkah
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            <div>
                                <p style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem" }}>1. Unduh Template</p>
                                <button 
                                    onClick={downloadTemplate}
                                    className="btn" 
                                    style={{ width: "100%", background: "white", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                                >
                                    <FileDown size={18} /> Format Template
                                </button>
                            </div>
                            <div>
                                <p style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem" }}>2. Isi Data</p>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Salin data dari Excel sekolah ke template tersebut. Jangan ubah nama kolom di baris pertama.</p>
                            </div>
                            <div>
                                <p style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem" }}>3. Unggah & Simpan</p>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Unggah file yang sudah diisi, periksa pratinjau, lalu simpan ke database.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Upload Area */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", border: "2px dashed var(--border)" }}>
                            <div style={{ width: "64px", height: "64px", background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto", color: "#15803d" }}>
                                <Upload size={32} />
                            </div>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                                {fileName ? fileName : "Pilih File Excel/CSV"}
                            </h3>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>Format yang didukung adalah .csv (Excel juga bisa menyimpannya sebagai .csv)</p>
                            
                            <input 
                                type="file" 
                                id="excel-upload" 
                                style={{ display: "none" }} 
                                accept=".csv"
                                onChange={handleFileChange}
                            />
                            <button 
                                onClick={() => document.getElementById("excel-upload")?.click()}
                                className="btn" 
                                style={{ background: "var(--btn-dark-green)", color: "white", padding: "0.6rem 2rem" }}
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Pilih File"}
                            </button>
                        </div>

                        {/* Preview Table */}
                        {previewData.length > 0 && (
                            <div className="glass-panel" style={{ padding: "1.5rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                    <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Pratinjau Data ({previewData.length} baris)</h3>
                                    <button 
                                        onClick={() => setPreviewData([])}
                                        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem" }}
                                    >
                                        <Trash2 size={14} /> Bereskan
                                    </button>
                                </div>
                                <div style={{ overflowX: "auto", maxHeight: "300px", border: "1px solid var(--border)", borderRadius: "8px" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                                        <thead style={{ background: "#f8fafc", position: "sticky", top: 0 }}>
                                            <tr>
                                                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid var(--border)" }}>NISN</th>
                                                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid var(--border)" }}>Nama Lengkap</th>
                                                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid var(--border)" }}>Tahun Lulus</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.slice(0, 5).map((row, i) => (
                                                <tr key={i}>
                                                    <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>{row.NISN}</td>
                                                    <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>{row.NamaLengkap}</td>
                                                    <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>{row.TahunLulus}</td>
                                                </tr>
                                            ))}
                                            {previewData.length > 5 && (
                                                <tr>
                                                    <td colSpan={3} style={{ padding: "0.75rem", textAlign: "center", color: "var(--text-muted)", fontStyle: "italic" }}>
                                                        ... dan {previewData.length - 5} data lainnya
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <button 
                                    onClick={handleImport}
                                    className="btn" 
                                    style={{ width: "100%", marginTop: "1.5rem", background: "#15803d", color: "white", padding: "0.85rem", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle size={20} /> Konfirmasi & Simpan ke Database</>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
