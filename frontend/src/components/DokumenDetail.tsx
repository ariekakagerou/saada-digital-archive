"use client";

import { useState } from "react";
import { CheckCircle, Award, BookOpen, FileText, BarChart2, GraduationCap, Calendar, Hash, School, User } from "lucide-react";

// ─── SHARED ──────────────────────────────────────────────────

function Row({ label, value, mono }: { label: string; value?: string | number; mono?: boolean }) {
    if (!value || value === "-" || value === "") return null;
    return (
        <div className="grid-row-detail">
            <span style={{ fontSize: "0.82rem", color: "#9ca3af", fontWeight: 500 }}>{label}</span>
            <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1f2937", fontFamily: mono ? "monospace" : "inherit", background: mono ? "#f9fafb" : "transparent", padding: mono ? "0.1rem 0.4rem" : "0", borderRadius: mono ? "4px" : "0" }}>{value}</span>
        </div>
    );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem", paddingBottom: "0.6rem", borderBottom: "2px solid #f0fdf4" }}>
                <div style={{ width: 32, height: 32, background: "#f0fdf4", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #bbf7d0", flexShrink: 0 }}>{icon}</div>
                <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1f2937", margin: 0 }}>{title}</h4>
            </div>
            {children}
        </div>
    );
}

function NilaiBar({ label, nilai }: { label: string; nilai: number }) {
    const color = nilai >= 90 ? "#15803d" : nilai >= 80 ? "#2563eb" : nilai >= 70 ? "#ca8a04" : "#dc2626";
    const bg    = nilai >= 90 ? "#dcfce7" : nilai >= 80 ? "#dbeafe" : nilai >= 70 ? "#fef9c3" : "#fee2e2";
    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.75rem", alignItems: "center", padding: "0.45rem 0", borderBottom: "1px solid #f9fafb" }}>
            <div>
                <div style={{ fontSize: "0.82rem", color: "#4b5563", marginBottom: "0.3rem" }}>{label}</div>
                <div style={{ height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${nilai}%`, height: "100%", background: color, transition: "width 0.8s ease" }} />
                </div>
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color, background: bg, padding: "0.2rem 0.5rem", borderRadius: 6, minWidth: 36, textAlign: "center" }}>{nilai}</span>
        </div>
    );
}

// ─── IJAZAH ──────────────────────────────────────────────────

function IjazahDetail({ alumni }: { alumni: any }) {
    // Use real data if available, fallback to demo
    const detail = alumni.detailIjazah;
    const realNilai: {mapel: string; nilai: number}[] = detail?.nilaiUjian?.map((n: any) => ({ mapel: n.namaMapel || n.mataPelajaran?.namaMapel || `Mapel ${n.mataPelajaranId}`, nilai: n.nilai })) || [];
    const nilaiUN = realNilai.length > 0 ? realNilai : [
        { mapel: "Bahasa Indonesia", nilai: 87 },
        { mapel: "Matematika",       nilai: 85 },
        { mapel: "Bahasa Inggris",   nilai: 83 },
        { mapel: "IPA",              nilai: 88 },
    ];
    const rataRata = detail?.rataRataNilai ?? (nilaiUN.reduce((s, n) => s + n.nilai, 0) / nilaiUN.length);
    return (
        <div>
            <Section title="Identitas Pemilik Ijazah" icon={<User size={16} color="#15803d" />}>
                <Row label="Nama Lengkap"  value={alumni.name} />
                <Row label="NIS"           value={alumni.nis} mono />
                <Row label="NISN"          value={alumni.nisn} mono />
                <Row label="Tempat, Tgl Lahir" value={`${alumni.tempatLahir || "Bogor"}, ${alumni.tanggalLahir || "10 Feb 2005"}`} />
                <Row label="Jenis Kelamin" value={alumni.jenisKelamin === 'L' ? 'Laki-laki' : alumni.jenisKelamin === 'P' ? 'Perempuan' : '-'} />
                <Row label="Agama"         value={alumni.agama || 'Islam'} />
            </Section>

            <Section title="Informasi Sekolah" icon={<School size={16} color="#15803d" />}>
                <Row label="Nama Madrasah"  value={alumni.namaMadrasah || "MTs Assa'adah Sukaraja Bogor"} />
                <Row label="NPSN"           value="20533816" mono />
                <Row label="NSS"            value="121135730001" mono />
                <Row label="Akreditasi"     value="A (Unggul)" />
                <Row label="Kepala Madrasah" value={detail?.namaKepalaMadrasah || alumni.kepalaSekolah || "Drs. H. Abdullah, M.Pd.I"} />
            </Section>

            <Section title="Data Ijazah" icon={<Award size={16} color="#15803d" />}>
                <Row label="Nomor Ijazah"       value={alumni.nomorIjazah} mono />
                <Row label="Tanggal Penerbitan" value={detail?.tanggalPenerbitan ? new Date(detail.tanggalPenerbitan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : alumni.tanggalPenerbitan} />
                <Row label="Tahun Pelajaran"    value={`${parseInt(alumni.year) - 1}/${alumni.year}`} />
                <Row label="Status Kelulusan"   value="LULUS" />
            </Section>

            <Section title={`Nilai Ujian Akhir ${realNilai.length > 0 ? '(Data Nyata)' : '(Contoh)'}`} icon={<BarChart2 size={16} color="#15803d" />}>
                {nilaiUN.map((n, i) => <NilaiBar key={i} label={n.mapel} nilai={n.nilai} />)}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#15803d", background: "#f0fdf4", padding: "0.3rem 0.875rem", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                        Rata-rata: {rataRata.toFixed(2)}
                    </span>
                </div>
            </Section>
        </div>
    );
}

// ─── SKHU ─────────────────────────────────────────────────────

function SKHUDetail({ alumni }: { alumni: any }) {
    // Use real data if available, fallback to demo
    const detail = alumni.detailSkl;
    const realNilai: {mapel: string; nilai: number}[] = detail?.nilaiUjian?.map((n: any) => ({ mapel: n.namaMapel || n.mataPelajaran?.namaMapel || `Mapel ${n.mataPelajaranId}`, nilai: n.nilai })) || [];
    const nilaiMapel = realNilai.length > 0 ? realNilai : [
        { mapel: "Pendidikan Agama Islam", nilai: 88 },
        { mapel: "PKn",                    nilai: 85 },
        { mapel: "Bahasa Indonesia",        nilai: 87 },
        { mapel: "Bahasa Arab",             nilai: 82 },
        { mapel: "Matematika",              nilai: 84 },
        { mapel: "IPA (Sains)",             nilai: 86 },
        { mapel: "IPS (Terpadu)",           nilai: 83 },
        { mapel: "Bahasa Inggris",          nilai: 81 },
        { mapel: "Seni Budaya",             nilai: 90 },
        { mapel: "Penjaskes",               nilai: 88 },
        { mapel: "TIK/Prakarya",            nilai: 89 },
    ];
    const rata = detail?.rataRataNilai?.toFixed(2) ?? (nilaiMapel.reduce((s, n) => s + n.nilai, 0) / nilaiMapel.length).toFixed(2);
    return (
        <div>
            <Section title="Identitas Peserta" icon={<User size={16} color="#ca8a04" />}>
                <Row label="Nama Lengkap"  value={alumni.name} />
                <Row label="NIS"           value={alumni.nis} mono />
                <Row label="NISN"          value={alumni.nisn} mono />
                <Row label="Nomor Peserta" value={detail?.nomorPeserta || alumni.nomorPeserta || "-"} mono />
                <Row label="Tempat, Tgl Lahir" value={`${alumni.tempatLahir || "Surabaya"}, ${alumni.tanggalLahir || "20 Mar 2005"}`} />
            </Section>

            <Section title="Informasi Sekolah" icon={<School size={16} color="#ca8a04" />}>
                <Row label="Nama Madrasah"   value={alumni.namaMadrasah || "MTs Assa'adah Sukaraja Bogor"} />
                <Row label="NPSN"            value="20533816" mono />
                <Row label="Kepala Madrasah" value={alumni.kepalaSekolah || "Drs. H. Abdullah, M.Pd.I"} />
            </Section>

            <Section title="Data SKL" icon={<Hash size={16} color="#ca8a04" />}>
                <Row label="Nomor SKL"       value={alumni.nomorSKHU || alumni.nomorSkl} mono />
                <Row label="Nomor Peserta"    value={detail?.nomorPeserta || "-"} mono />
                <Row label="Tahun Pelajaran"  value={`${parseInt(alumni.year) - 1}/${alumni.year}`} />
                <Row label="Tanggal Terbit"   value={detail?.tanggalTerbit ? new Date(detail.tanggalTerbit).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : `10 Juni ${alumni.year}`} />
                <Row label="Status"           value="LULUS" />
                <Row label="Nilai Rata-rata"  value={`${rata}`} />
            </Section>

            <Section title={`Nilai Per Mata Pelajaran ${realNilai.length > 0 ? '(Data Nyata)' : '(Contoh)'}`} icon={<BarChart2 size={16} color="#ca8a04" />}>
                {nilaiMapel.map((n, i) => <NilaiBar key={i} label={n.mapel} nilai={n.nilai} />)}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ca8a04", background: "#fef9c3", padding: "0.3rem 0.875rem", borderRadius: 8, border: "1px solid #fde68a" }}>
                        Rata-rata: {rata}
                    </span>
                </div>
            </Section>
        </div>
    );
}

// ─── TRANSKRIP NILAI ──────────────────────────────────────────

function TranskripDetail({ alumni }: { alumni: any }) {
    const realSemesters = alumni.nilaiSemester || alumni.nilaiSemesterFull;
    
    const semestersToRender = (realSemesters && realSemesters.length > 0) 
        ? realSemesters.map((sem: any) => ({
            label: `Semester ${sem.semester} (${sem.semester <= 2 ? 'Kelas VII' : sem.semester <= 4 ? 'Kelas VIII' : 'Kelas IX'})`,
            mapel: (sem.mataPelajaran || []).map((m: any) => ({ n: m.nama, v: m.nilai })),
            rata: sem.rata !== undefined ? Number(sem.rata).toFixed(1) : '-'
          })).sort((a: any, b: any) => a.label.localeCompare(b.label))
        : [
            { label: "Semester 1 (Kelas VII)",  mapel: [{ n: "B. Indonesia", v: 82 }, { n: "Matematika", v: 78 }, { n: "IPA", v: 80 }, { n: "B. Inggris", v: 77 }, { n: "IPS", v: 79 }], rata: 79.2 },
            { label: "Semester 2 (Kelas VII)",  mapel: [{ n: "B. Indonesia", v: 84 }, { n: "Matematika", v: 80 }, { n: "IPA", v: 82 }, { n: "B. Inggris", v: 79 }, { n: "IPS", v: 81 }], rata: 81.2 },
            { label: "Semester 3 (Kelas VIII)", mapel: [{ n: "B. Indonesia", v: 85 }, { n: "Matematika", v: 82 }, { n: "IPA", v: 84 }, { n: "B. Inggris", v: 81 }, { n: "IPS", v: 83 }], rata: 83.0 },
            { label: "Semester 4 (Kelas VIII)", mapel: [{ n: "B. Indonesia", v: 86 }, { n: "Matematika", v: 83 }, { n: "IPA", v: 85 }, { n: "B. Inggris", v: 82 }, { n: "IPS", v: 84 }], rata: 84.0 },
            { label: "Semester 5 (Kelas IX)",   mapel: [{ n: "B. Indonesia", v: 87 }, { n: "Matematika", v: 85 }, { n: "IPA", v: 86 }, { n: "B. Inggris", v: 84 }, { n: "IPS", v: 85 }], rata: 85.4 },
            { label: "Semester 6 (Kelas IX)",   mapel: [{ n: "B. Indonesia", v: 88 }, { n: "Matematika", v: 86 }, { n: "IPA", v: 87 }, { n: "B. Inggris", v: 85 }, { n: "IPS", v: 87 }], rata: 86.6 },
        ];

    const totalSemesters = semestersToRender.length;
    const allRatas = semestersToRender.map((s: any) => Number(s.rata)).filter((n: any) => !isNaN(n));
    const avgRata = allRatas.length > 0 ? (allRatas.reduce((sum: number, r: number) => sum + r, 0) / allRatas.length).toFixed(1) : "-";
    const bestRata = allRatas.length > 0 ? Math.max(...allRatas).toFixed(1) : "-";

    return (
        <div>
            <Section title="Identitas Siswa" icon={<User size={16} color="#2563eb" />}>
                <Row label="Nama Lengkap" value={alumni.name} />
                <Row label="NIS / NISN"   value={`${alumni.nis} / ${alumni.nisn || "-"}`} mono />
                <Row label="Kelas"        value={alumni.class} />
                <Row label="Tahun Lulus"  value={alumni.year} />
            </Section>

            <Section title="Ringkasan Akademik" icon={<BarChart2 size={16} color="#2563eb" />}>
                <div className="grid-responsive-3" style={{ marginBottom: "0.5rem" }}>
                    {[
                        { label: "Rata-rata Umum",    value: alumni.nilaiRataRata || avgRata, color: "#2563eb", bg: "#dbeafe" },
                        { label: "Semester Terbaik",  value: bestRata,                          color: "#15803d", bg: "#dcfce7" },
                        { label: "Total Semester",    value: String(totalSemesters),            color: "#7c3aed", bg: "#f5f3ff" },
                    ].map((s, i) => (
                        <div key={i} style={{ textAlign: "center", padding: "0.75rem", background: s.bg, borderRadius: 10, border: `1px solid ${s.color}33` }}>
                            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
                <Row label="Keterangan Lulus" value={alumni.keteranganLulus || "Lulus"} />
            </Section>

            <Section title="Nilai Per Semester" icon={<BookOpen size={16} color="#2563eb" />}>
                {semestersToRender.map((sem: any, si: number) => (
                    <div key={si} style={{ marginBottom: "1rem", background: "#f9fafb", borderRadius: 10, padding: "0.75rem", border: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151" }}>{sem.label}</span>
                            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", background: "#dbeafe", padding: "0.1rem 0.5rem", borderRadius: 5 }}>Rata: {sem.rata}</span>
                        </div>
                        {sem.mapel.map((m: any, mi: number) => <NilaiBar key={mi} label={m.n} nilai={m.v} />)}
                    </div>
                ))}
            </Section>
        </div>
    );
}

// ─── RAPOR ───────────────────────────────────────────────────

function RaporDetail({ alumni }: { alumni: any }) {
    const realSemesters = alumni.nilaiSemesterFull || alumni.nilaiSemester;
    
    // State for selected semester index
    const [selectedSemIdx, setSelectedSemIdx] = useState(0);

    const hasRealData = realSemesters && realSemesters.length > 0;

    const currentSemesterData = hasRealData 
        ? realSemesters[selectedSemIdx] 
        : null;

    const mapelList = currentSemesterData 
        ? (currentSemesterData.mataPelajaran || []).map((m: any) => ({ n: m.nama, v: m.nilai, kkm: 75 }))
        : [
            { n: "Pend. Agama Islam", v: 85, kkm: 75 }, { n: "PKn", v: 82, kkm: 75 },
            { n: "B. Indonesia", v: 87, kkm: 75 },      { n: "Matematika", v: 78, kkm: 70 },
            { n: "IPA", v: 80, kkm: 72 },               { n: "IPS", v: 83, kkm: 72 },
            { n: "B. Inggris", v: 76, kkm: 70 },        { n: "Seni Budaya", v: 88, kkm: 75 },
            { n: "Penjaskes", v: 85, kkm: 75 },         { n: "Prakarya", v: 84, kkm: 75 },
        ];

    const lt = currentSemesterData?.leggerTambahan;

    const hadir = lt ? (220 - (lt.kehadiranSakit || 0) - (lt.kehadiranIzin || 0) - (lt.kehadiranAlfa || 0)) : 216;
    const sakit = lt?.kehadiranSakit ?? 2;
    const izin = lt?.kehadiranIzin ?? 1;
    const alfa = lt?.kehadiranAlfa ?? 0;
    
    const sikapSpiritual = lt?.sikapSpiritual || "Baik";
    const kelakuan = lt?.sikapSosial || "Baik";
    const kerajinan = "Baik";
    
    const waliKelas = "Ibu Siti Rahayu, S.Pd";
    const catatanWaliKelas = lt?.catatanWaliKelas || `${alumni.name} merupakan siswa yang aktif dan rajin dalam mengikuti kegiatan belajar mengajar. Perlu ditingkatkan kemampuan Matematika.`;

    const rata = (mapelList.reduce((s: number, m: any) => s + Number(m.v || 0), 0) / (mapelList.length || 1)).toFixed(1);

    return (
        <div>
            {hasRealData && (
                <div style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", background: "#f5f3ff", padding: "0.75rem 1rem", borderRadius: "12px", border: "1px solid #e9d5ff" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#6d28d9" }}>📅 Semester Rapor:</span>
                    <select 
                        value={selectedSemIdx} 
                        onChange={(e) => setSelectedSemIdx(Number(e.target.value))}
                        style={{ 
                            padding: "0.4rem 1rem", 
                            borderRadius: "8px", 
                            border: "1px solid #dcd7f9", 
                            fontSize: "0.88rem", 
                            fontWeight: 700,
                            color: "#6d28d9",
                            background: "white",
                            outline: "none",
                            cursor: "pointer"
                        }}
                    >
                        {realSemesters.map((sem: any, idx: number) => (
                            <option key={idx} value={idx}>Semester {sem.semester}</option>
                        ))}
                    </select>
                </div>
            )}

            <Section title="Identitas Siswa" icon={<User size={16} color="#7c3aed" />}>
                <Row label="Nama Lengkap" value={alumni.name} />
                <Row label="NIS / NISN"   value={`${alumni.nis} / ${alumni.nisn || "-"}`} mono />
                <Row label="Kelas"        value={currentSemesterData ? `Kelas ${currentSemesterData.semester <= 2 ? 'VII' : currentSemesterData.semester <= 4 ? 'VIII' : 'IX'}` : (alumni.class || "VII A")} />
                <Row label="Tahun Ajaran" value={currentSemesterData ? `${alumni.year - (currentSemesterData.semester <= 2 ? 2 : currentSemesterData.semester <= 4 ? 1 : 0)}/${alumni.year}` : "2021/2022"} />
                <Row label="Wali Kelas"   value={waliKelas} />
            </Section>

            <Section title="Rekap Kehadiran" icon={<Calendar size={16} color="#7c3aed" />}>
                <div className="grid-responsive-4-to-2">
                    {[
                        { label: "Hadir",  value: hadir, color: "#15803d", bg: "#dcfce7" },
                        { label: "Sakit",  value: sakit, color: "#2563eb", bg: "#dbeafe" },
                        { label: "Izin",   value: izin,  color: "#ca8a04", bg: "#fef9c3" },
                        { label: "Alfa",   value: alfa,  color: "#dc2626", bg: "#fee2e2" },
                    ].map((item, i) => (
                        <div key={i} style={{ textAlign: "center", padding: "0.6rem", background: item.bg, borderRadius: 8, border: `1px solid ${item.color}33` }}>
                            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: item.color }}>{item.value}</div>
                            <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>{item.label}</div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Penilaian Sikap" icon={<CheckCircle size={16} color="#7c3aed" />}>
                <Row label="Sikap Spiritual" value={sikapSpiritual} />
                <Row label="Kelakuan (Sosial)" value={kelakuan} />
                <Row label="Kerajinan"      value={kerajinan} />
            </Section>

            <Section title="Nilai Per Mata Pelajaran" icon={<BarChart2 size={16} color="#7c3aed" />}>
                {mapelList.map((m: any, i: number) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "0.5rem", alignItems: "center", padding: "0.4rem 0", borderBottom: "1px solid #f9fafb" }}>
                        <span style={{ fontSize: "0.82rem", color: "#4b5563" }}>{m.n}</span>
                        <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>KKM: {m.kkm}</span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: m.v >= m.kkm ? "#15803d" : "#dc2626", background: m.v >= m.kkm ? "#f0fdf4" : "#fef2f2", padding: "0.15rem 0.5rem", borderRadius: 5, minWidth: 36, textAlign: "center" }}>{m.v}</span>
                    </div>
                ))}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#7c3aed", background: "#f5f3ff", padding: "0.3rem 0.875rem", borderRadius: 8, border: "1px solid #e9d5ff" }}>
                        Rata-rata: {rata}
                    </span>
                </div>
            </Section>

            <Section title="Catatan Wali Kelas" icon={<FileText size={16} color="#7c3aed" />}>
                <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 10, padding: "0.875rem", fontSize: "0.875rem", color: "#374151", lineHeight: 1.6, fontStyle: "italic" }}>
                    "{catatanWaliKelas}"
                </div>
            </Section>
        </div>
    );
}

// ─── EXPORT: SWITCHER ─────────────────────────────────────────

const typeConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    Ijazah:    { label: "📜 Ijazah",         color: "#15803d", bg: "#f0fdf4", icon: <GraduationCap size={16} color="#15803d" /> },
    SKHU:      { label: "📋 SKL (Surat Keterangan Lulus)",            color: "#92400e", bg: "#fffbeb", icon: <Award size={16} color="#92400e" /> },
    SKL:       { label: "📋 SKL (Surat Keterangan Lulus)",            color: "#92400e", bg: "#fffbeb", icon: <Award size={16} color="#92400e" /> },
    "SKL (Surat Keterangan Lulus)": { label: "📋 SKL (Surat Keterangan Lulus)", color: "#92400e", bg: "#fffbeb", icon: <Award size={16} color="#92400e" /> },
    Transkrip: { label: "📊 Transkrip Nilai", color: "#1e40af", bg: "#eff6ff", icon: <BarChart2 size={16} color="#1e40af" /> },
    Rapor:     { label: "📚 Legger Kelas",      color: "#6d28d9", bg: "#faf5ff", icon: <BookOpen size={16} color="#6d28d9" /> },
};

export default function DokumenDetail({ alumni }: { alumni: any }) {
    const cfg = typeConfig[alumni.type];
    if (!cfg) return null;

    return (
        <div style={{ background: "white", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", overflow: "hidden", marginTop: "1.5rem" }}>
            {/* Header */}
            <div style={{ background: cfg.bg, borderBottom: `2px solid ${cfg.color}22`, padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {cfg.icon}
                <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: cfg.color, margin: 0 }}>Data Lengkap {cfg.label.split(" ").slice(1).join(" ")}</h3>
                    <p style={{ fontSize: "0.78rem", color: "#9ca3af", margin: 0, marginTop: 2 }}>Informasi terstruktur sesuai format dokumen resmi</p>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: "1.5rem" }}>
                {alumni.type === "Ijazah"    && <IjazahDetail    alumni={alumni} />}
                {(alumni.type === "SKHU" || alumni.type === "SKL" || alumni.type === "SKL (Surat Keterangan Lulus)")      && <SKHUDetail      alumni={alumni} />}
                {alumni.type === "Transkrip" && <TranskripDetail alumni={alumni} />}
                {alumni.type === "Rapor"     && <RaporDetail     alumni={alumni} />}
            </div>
        </div>
    );
}
