/**
 * DocumentPreview Component
 * Displays realistic document preview based on archive type
 */

import React from 'react';

interface DocumentPreviewProps {
    alumni: any;
    activeTab: 'before' | 'after';
}

export default function DocumentPreview({ alumni, activeTab }: DocumentPreviewProps) {
    return (
        <div style={{
            width: "100%", maxWidth: "500px", minHeight: "650px",
            background: "linear-gradient(to bottom, #fffcf5, #fdf8e1)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1), inset 0 0 50px rgba(0,0,0,0.02)",
            padding: "2.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", position: "relative",
            filter: activeTab === "before" ? "blur(0.8px) brightness(0.9) sepia(0.2)" : "none",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            border: "12px solid #15803d",
            borderImage: "repeating-linear-gradient(45deg, #15803d, #15803d 15px, #dcfce7 15px, #dcfce7 30px) 12",
            overflow: "hidden"
        }}>
            {/* Paper Texture Overlay */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
                opacity: 0.4, pointerEvents: "none"
            }}></div>

            {/* Subtle Watermark */}
            <div style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-45deg)",
                fontSize: "5rem", color: "rgba(21, 128, 61, 0.03)", fontWeight: "900", pointerEvents: "none",
                whiteSpace: "nowrap", userSelect: "none"
            }}>
                ARSIP RESMI MTS
            </div>
            {/* Badge indicator */}
            <div style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: activeTab === "before" ? "#fef3c7" : "#dcfce7",
                color: activeTab === "before" ? "#92400e" : "#166534",
                padding: "0.25rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: "600",
                border: activeTab === "before" ? "1px solid #fcd34d" : "1px solid #bbf7d0",
                zIndex: 10
            }}>
                {activeTab === "before" ? "📄 Original" : "✨ Enhanced"}
            </div>

            {/* Header with Logo */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", borderBottom: "2px solid #15803d", paddingBottom: "0.75rem" }}>
                <div style={{ width: "50px", height: "50px", background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🕌</div>
                <div>
                    <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "#15803d", textTransform: "uppercase" }}>Madrasah Tsanawiyah</div>
                    <div style={{ fontSize: "0.75rem", color: "#666" }}>Assa'adah Sukaraja Bogor</div>
                </div>
            </div>

            {/* Document Title */}
            <div style={{ textAlign: "center", fontSize: "1.3rem", fontWeight: "700", margin: "0.5rem 0", textTransform: "uppercase", letterSpacing: "1px" }}>
                {alumni.type}
            </div>

            {/* Dynamic Content based on Type */}
            {alumni.type === 'Ijazah' && (
                <IjazahContent alumni={alumni} />
            )}

            {alumni.type === 'SKHU' && (
                <SKHUContent alumni={alumni} />
            )}

            {alumni.type === 'Buku Induk' && (
                <BukuIndukContent alumni={alumni} />
            )}

            {alumni.type === 'Transkrip' && (
                <TranskripContent alumni={alumni} />
            )}

            {alumni.type === 'Rapor' && (
                <RaporContent alumni={alumni} />
            )}

            {/* Footer with Signature */}
            <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", alignItems: "flex-end" }}>
                    <div style={{ textAlign: "center", flex: 1 }}>
                        <div style={{ marginBottom: "0.25rem", fontSize: "0.65rem", color: "#666" }}>Dokumen ini telah diverifikasi secara digital</div>
                        <div>Bogor, {alumni.tanggalPenerbitan || `15 Juni ${alumni.year}`}</div>
                        <div style={{ marginTop: "2.5rem", fontWeight: "600" }}>Kepala Madrasah</div>
                        <div style={{ marginTop: "0.25rem", fontSize: "0.7rem" }}>{alumni.kepalaSekolah || 'Drs. H. Abdullah, M.Pd.I'}</div>
                    </div>

                    {/* Digital Verification ID & QR */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: "65px", height: "65px", border: "1px solid #ddd", padding: "2px", background: "white" }}>
                            <div style={{ width: "100%", height: "100%", background: "repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 10px 10px" }}></div>
                        </div>
                        <div style={{ fontSize: "0.55rem", color: "#9ca3af", textAlign: "center", fontFamily: "monospace" }}>
                            VERIF-ID: {alumni.id}992X8<br />
                            {alumni.nisn}
                        </div>
                    </div>

                    <div style={{ width: "75px", height: "75px", border: "2px solid #15803d", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", color: "#15803d", fontWeight: "600", transform: "rotate(-15deg)", opacity: 0.8 }}>
                        MADRASAH<br />TSANAWIYAH<br />RESMI
                    </div>
                </div>
            </div>
        </div>
    );
}

// Ijazah Content Component
function IjazahContent({ alumni }: { alumni: any }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                <div>Nama Peserta Didik</div>
                <div>: <strong>{alumni.name}</strong></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                <div>NIS</div>
                <div>: {alumni.nis}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                <div>NISN</div>
                <div>: {alumni.nisn}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                <div>Tempat, Tanggal Lahir</div>
                <div>: {alumni.tempatLahir}, {alumni.tanggalLahir}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                <div>Tahun Lulus</div>
                <div>: <strong>{alumni.year}</strong></div>
            </div>
            {alumni.nomorIjazah && (
                <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                    <div>Nomor Ijazah</div>
                    <div>: <strong>{alumni.nomorIjazah}</strong></div>
                </div>
            )}
            <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#f9fafb", borderRadius: "6px", textAlign: "center", fontSize: "0.75rem", color: "#666", border: "1px dashed #d1d5db" }}>
                Diberikan kepada yang bersangkutan sebagai tanda tamat belajar<br />
                dari Madrasah Tsanawiyah Assa'adah Sukaraja Bogor
            </div>
        </div>
    );
}

// SKHU Content Component
function SKHUContent({ alumni }: { alumni: any }) {
    const mataPelajaran = [
        { nama: 'Al-Qur\'an Hadits', nilai: 88 },
        { nama: 'Akidah Akhlak', nilai: 86 },
        { nama: 'Bahasa Indonesia', nilai: 87 },
        { nama: 'Matematika', nilai: 85 },
        { nama: 'IPA Terpadu', nilai: 84 }
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                <div>Nama</div>
                <div>: <strong>{alumni.name}</strong></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                <div>NISN</div>
                <div>: {alumni.nisn}</div>
            </div>
            {alumni.nomorPeserta && (
                <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                    <div>Nomor Peserta</div>
                    <div>: {alumni.nomorPeserta}</div>
                </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                <div>Tahun Lulus</div>
                <div>: {alumni.year}</div>
            </div>

            <div style={{ marginTop: "1rem", border: "1px solid #e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", background: "#f0fdf4", padding: "0.5rem", fontWeight: "600", fontSize: "0.75rem", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>
                    <div>Mata Pelajaran</div>
                    <div>Nilai</div>
                    <div>Ket</div>
                </div>
                {mataPelajaran.map((mapel, idx) => (
                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "0.4rem 0.5rem", fontSize: "0.75rem", textAlign: "center", borderBottom: idx < mataPelajaran.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        <div style={{ textAlign: "left" }}>{mapel.nama}</div>
                        <div>{mapel.nilai}</div>
                        <div>L</div>
                    </div>
                ))}
            </div>

            {alumni.nilaiRataRata && (
                <div style={{ marginTop: "0.5rem", padding: "0.5rem", background: "#dcfce7", borderRadius: "6px", textAlign: "center", fontSize: "0.85rem" }}>
                    <strong>Nilai Rata-rata: {alumni.nilaiRataRata}</strong>
                </div>
            )}
        </div>
    );
}

// Buku Induk Content Component
function BukuIndukContent({ alumni }: { alumni: any }) {
    // Helper to format date if it contains time
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "................";
        return dateStr.split('T')[0];
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <div style={{ fontWeight: "700", borderBottom: "1px solid #000" }}>KETERANGAN TENTANG DIRI SISWA</div>
                <div style={{ fontSize: "0.7rem", color: "#666" }}>Hal: {alumni.nomorHalaman || "..."}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "0.5rem" }}>
                <div>1. Nama Lengkap</div>
                <div>: <strong>{alumni.name}</strong></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "0.5rem" }}>
                <div>2. Nomor Induk / NISN</div>
                <div>: {alumni.nis || "........"} / {alumni.nisn || "........"}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "0.5rem" }}>
                <div>3. Tempat, Tgl Lahir</div>
                <div>: {alumni.tempatLahir || "........"}, {formatDate(alumni.tanggalLahir)}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "0.5rem" }}>
                <div>4. Jenis Kelamin</div>
                <div>: {alumni.jenisKelamin === 'L' ? 'Laki-laki' : alumni.jenisKelamin === 'P' ? 'Perempuan' : "........"}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "0.5rem" }}>
                <div>5. Agama / WN</div>
                <div>: {alumni.agama || "........"} / {alumni.kewarganegaraan || "........"}</div>
            </div>

            <div style={{ marginTop: "0.5rem", fontWeight: "700", borderBottom: "1px solid #000", width: "fit-content" }}>KETERANGAN ORANG TUA / WALI</div>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "0.5rem" }}>
                <div>6. Nama Ayah</div>
                <div>: {alumni.namaAyah || "................................"}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "0.5rem" }}>
                <div>7. Nama Ibu</div>
                <div>: {alumni.namaIbu || "................................"}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "0.5rem" }}>
                <div>8. Pekerjaan Ayah/Ibu</div>
                <div>: {alumni.pekerjaanAyah || "........"} / {alumni.pekerjaanIbu || "........"}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "0.5rem" }}>
                <div>9. Alamat Orang Tua</div>
                <div style={{ lineHeight: "1.2" }}>: {alumni.alamatOrangTua || alumni.alamat || "................................................"}</div>
            </div>

            <div style={{ marginTop: "0.5rem", fontWeight: "700", borderBottom: "1px solid #000", width: "fit-content" }}>RIWAYAT PENDIDIKAN</div>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "0.5rem" }}>
                <div>10. Asal Sekolah</div>
                <div>: {alumni.asalSekolah || "................................"}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "0.5rem" }}>
                <div>11. Diterima di Kelas</div>
                <div>: {alumni.kelasMasuk || alumni.class || "........"}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "0.5rem" }}>
                <div>12. Tahun Lulus</div>
                <div>: {alumni.year || "........"}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "0.5rem" }}>
                <div>13. Status Kelulusan</div>
                <div>: {alumni.statusKelulusan || "Lulus"}</div>
            </div>
        </div>
    );
}

// Transkrip Content Component
function TranskripContent({ alumni }: { alumni: any }) {
    const mataPelajaran = [
        { nama: 'Al-Qur\'an Hadits', vii: 85, viii: 87, ix: 89 },
        { nama: 'Matematika', vii: 83, viii: 85, ix: 88 },
        { nama: 'Bahasa Indonesia', vii: 86, viii: 88, ix: 90 },
        { nama: 'IPA', vii: 84, viii: 86, ix: 87 }
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                <div>Nama Alumni</div>
                <div>: <strong>{alumni.name}</strong></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                <div>NISN</div>
                <div>: {alumni.nisn}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                <div>Tahun Lulus</div>
                <div>: {alumni.year}</div>
            </div>

            <div style={{ marginTop: "1rem", border: "1px solid #e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", background: "#f0fdf4", padding: "0.5rem", fontWeight: "600", fontSize: "0.75rem", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>
                    <div>Mata Pelajaran</div>
                    <div>VII</div>
                    <div>VIII</div>
                    <div>IX</div>
                </div>
                {mataPelajaran.map((mapel, idx) => (
                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "0.4rem 0.5rem", fontSize: "0.75rem", textAlign: "center", borderBottom: idx < mataPelajaran.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        <div style={{ textAlign: "left" }}>{mapel.nama}</div>
                        <div>{mapel.vii}</div>
                        <div>{mapel.viii}</div>
                        <div>{mapel.ix}</div>
                    </div>
                ))}
            </div>

            {alumni.nilaiRataRata && (
                <div style={{ marginTop: "0.5rem", padding: "0.5rem", background: "#dcfce7", borderRadius: "6px", textAlign: "center", fontSize: "0.85rem" }}>
                    <strong>Rata-rata: {alumni.nilaiRataRata}</strong>
                </div>
            )}
            {alumni.keteranganLulus && (
                <div style={{ marginTop: "0.25rem", textAlign: "center", fontSize: "0.8rem", color: "#15803d", fontWeight: "600" }}>
                    {alumni.keteranganLulus}
                </div>
            )}
        </div>
    );
}

// Rapor Content Component
function RaporContent({ alumni }: { alumni: any }) {
    const mataPelajaran = [
        { nama: 'Al-Qur\'an Hadits', nilai: 88 },
        { nama: 'Akidah Akhlak', nilai: 86 },
        { nama: 'Bahasa Indonesia', nilai: 87 },
        { nama: 'Matematika', nilai: 85 },
        { nama: 'IPA', nilai: 86 },
        { nama: 'IPS', nilai: 84 }
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                <div>Nama</div>
                <div>: <strong>{alumni.name}</strong></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                <div>NISN</div>
                <div>: {alumni.nisn}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                <div>Kelas</div>
                <div>: {alumni.class}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem" }}>
                <div>Tahun Ajaran</div>
                <div>: {parseInt(alumni.year) - 1}/{alumni.year}</div>
            </div>

            <div style={{ marginTop: "1rem", border: "1px solid #e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", background: "#f0fdf4", padding: "0.5rem", fontWeight: "600", fontSize: "0.75rem", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>
                    <div>Mata Pelajaran</div>
                    <div>Nilai</div>
                    <div>Ket</div>
                </div>
                {mataPelajaran.map((mapel, idx) => (
                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "0.4rem 0.5rem", fontSize: "0.75rem", textAlign: "center", borderBottom: idx < mataPelajaran.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        <div style={{ textAlign: "left" }}>{mapel.nama}</div>
                        <div>{mapel.nilai}</div>
                        <div>B</div>
                    </div>
                ))}
            </div>

            {alumni.nilaiRataRata && (
                <div style={{ marginTop: "0.5rem", padding: "0.5rem", background: "#dcfce7", borderRadius: "6px", textAlign: "center", fontSize: "0.85rem" }}>
                    <strong>Rata-rata: {alumni.nilaiRataRata}</strong>
                </div>
            )}
        </div>
    );
}
