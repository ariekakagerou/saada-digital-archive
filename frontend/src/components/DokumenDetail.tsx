"use client";

import { CheckCircle, Award, BookOpen, FileText, BarChart2, GraduationCap, Calendar, Hash, School, User } from "lucide-react";

// ─── SHARED ──────────────────────────────────────────────────

function Row({ label, value, mono }: { label: string; value?: string | number; mono?: boolean }) {
    if (!value || value === "-" || value === "") return null;
    return (
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.75rem", alignItems: "start", padding: "0.55rem 0", borderBottom: "1px solid #f3f4f6" }}>
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
    const nilaiUN = [
        { mapel: "Bahasa Indonesia", nilai: 87 },
        { mapel: "Matematika",       nilai: 85 },
        { mapel: "Bahasa Inggris",   nilai: 83 },
        { mapel: "IPA",              nilai: 88 },
    ];
    return (
        <div>
            <Section title="Identitas Pemilik Ijazah" icon={<User size={16} color="#15803d" />}>
                <Row label="Nama Lengkap"  value={alumni.name} />
                <Row label="NIS"           value={alumni.nis} mono />
                <Row label="NISN"          value={alumni.nisn} mono />
                <Row label="Tempat, Tgl Lahir" value={`${alumni.tempatLahir || "Bogor"}, ${alumni.tanggalLahir || "10 Feb 2005"}`} />
                <Row label="Jenis Kelamin" value="Laki-laki" />
                <Row label="Agama"         value="Islam" />
            </Section>

            <Section title="Informasi Sekolah" icon={<School size={16} color="#15803d" />}>
                <Row label="Nama Madrasah"  value={alumni.namaMadrasah || "MTs Assa'adah Sukaraja Bogor"} />
                <Row label="NPSN"           value="20533816" mono />
                <Row label="NSS"            value="121135730001" mono />
                <Row label="Akreditasi"     value="A (Unggul)" />
                <Row label="Kepala Madrasah" value={alumni.kepalaSekolah || "Drs. H. Abdullah, M.Pd.I"} />
            </Section>

            <Section title="Data Ijazah" icon={<Award size={16} color="#15803d" />}>
                <Row label="Nomor Ijazah"       value={alumni.nomorIjazah} mono />
                <Row label="Tanggal Penerbitan" value={alumni.tanggalPenerbitan} />
                <Row label="Tahun Pelajaran"    value={`${parseInt(alumni.year) - 1}/${alumni.year}`} />
                <Row label="Status Kelulusan"   value="LULUS" />
            </Section>

            <Section title="Nilai Ujian Akhir" icon={<BarChart2 size={16} color="#15803d" />}>
                {nilaiUN.map((n, i) => <NilaiBar key={i} label={n.mapel} nilai={n.nilai} />)}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#15803d", background: "#f0fdf4", padding: "0.3rem 0.875rem", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                        Rata-rata: {(nilaiUN.reduce((s, n) => s + n.nilai, 0) / nilaiUN.length).toFixed(2)}
                    </span>
                </div>
            </Section>
        </div>
    );
}

// ─── SKHU ─────────────────────────────────────────────────────

function SKHUDetail({ alumni }: { alumni: any }) {
    const nilaiMapel = [
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
    const rata = (nilaiMapel.reduce((s, n) => s + n.nilai, 0) / nilaiMapel.length).toFixed(2);
    return (
        <div>
            <Section title="Identitas Peserta" icon={<User size={16} color="#ca8a04" />}>
                <Row label="Nama Lengkap"  value={alumni.name} />
                <Row label="NIS"           value={alumni.nis} mono />
                <Row label="NISN"          value={alumni.nisn} mono />
                <Row label="Nomor Peserta" value={alumni.nomorPeserta || "24-01-046-001"} mono />
                <Row label="Tempat, Tgl Lahir" value={`${alumni.tempatLahir || "Surabaya"}, ${alumni.tanggalLahir || "20 Mar 2005"}`} />
            </Section>

            <Section title="Informasi Sekolah" icon={<School size={16} color="#ca8a04" />}>
                <Row label="Nama Madrasah"   value={alumni.namaMadrasah || "MTs Assa'adah Sukaraja Bogor"} />
                <Row label="NPSN"            value="20533816" mono />
                <Row label="Kepala Madrasah" value={alumni.kepalaSekolah || "Drs. H. Abdullah, M.Pd.I"} />
            </Section>

            <Section title="Data SKHU" icon={<Hash size={16} color="#ca8a04" />}>
                <Row label="Nomor SKHU"       value={alumni.nomorSKHU} mono />
                <Row label="Tahun Pelajaran"  value={`${parseInt(alumni.year) - 1}/${alumni.year}`} />
                <Row label="Tanggal Terbit"   value={`10 Juni ${alumni.year}`} />
                <Row label="Status"           value="LULUS" />
                <Row label="Nilai Rata-rata"  value={`${alumni.nilaiRataRata || rata}`} />
            </Section>

            <Section title="Nilai Per Mata Pelajaran" icon={<BarChart2 size={16} color="#ca8a04" />}>
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
    const semesters = [
        { label: "Semester 1 (Kelas VII)",  mapel: [{ n: "B. Indonesia", v: 82 }, { n: "Matematika", v: 78 }, { n: "IPA", v: 80 }, { n: "B. Inggris", v: 77 }, { n: "IPS", v: 79 }], rata: 79.2 },
        { label: "Semester 2 (Kelas VII)",  mapel: [{ n: "B. Indonesia", v: 84 }, { n: "Matematika", v: 80 }, { n: "IPA", v: 82 }, { n: "B. Inggris", v: 79 }, { n: "IPS", v: 81 }], rata: 81.2 },
        { label: "Semester 3 (Kelas VIII)", mapel: [{ n: "B. Indonesia", v: 85 }, { n: "Matematika", v: 82 }, { n: "IPA", v: 84 }, { n: "B. Inggris", v: 81 }, { n: "IPS", v: 83 }], rata: 83.0 },
        { label: "Semester 4 (Kelas VIII)", mapel: [{ n: "B. Indonesia", v: 86 }, { n: "Matematika", v: 83 }, { n: "IPA", v: 85 }, { n: "B. Inggris", v: 82 }, { n: "IPS", v: 84 }], rata: 84.0 },
        { label: "Semester 5 (Kelas IX)",   mapel: [{ n: "B. Indonesia", v: 87 }, { n: "Matematika", v: 85 }, { n: "IPA", v: 86 }, { n: "B. Inggris", v: 84 }, { n: "IPS", v: 85 }], rata: 85.4 },
        { label: "Semester 6 (Kelas IX)",   mapel: [{ n: "B. Indonesia", v: 88 }, { n: "Matematika", v: 86 }, { n: "IPA", v: 87 }, { n: "B. Inggris", v: 85 }, { n: "IPS", v: 87 }], rata: 86.6 },
    ];
    return (
        <div>
            <Section title="Identitas Siswa" icon={<User size={16} color="#2563eb" />}>
                <Row label="Nama Lengkap" value={alumni.name} />
                <Row label="NIS / NISN"   value={`${alumni.nis} / ${alumni.nisn || "-"}`} mono />
                <Row label="Kelas"        value={alumni.class} />
                <Row label="Tahun Lulus"  value={alumni.year} />
            </Section>

            <Section title="Ringkasan Akademik" icon={<BarChart2 size={16} color="#2563eb" />}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    {[
                        { label: "Rata-rata Umum",    value: alumni.nilaiRataRata || "84.6", color: "#2563eb", bg: "#dbeafe" },
                        { label: "Semester Terbaik",  value: "86.6",                          color: "#15803d", bg: "#dcfce7" },
                        { label: "Total Semester",    value: "6",                             color: "#7c3aed", bg: "#f5f3ff" },
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
                {semesters.map((sem, si) => (
                    <div key={si} style={{ marginBottom: "1rem", background: "#f9fafb", borderRadius: 10, padding: "0.75rem", border: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151" }}>{sem.label}</span>
                            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", background: "#dbeafe", padding: "0.1rem 0.5rem", borderRadius: 5 }}>Rata: {sem.rata}</span>
                        </div>
                        {sem.mapel.map((m, mi) => <NilaiBar key={mi} label={m.n} nilai={m.v} />)}
                    </div>
                ))}
            </Section>
        </div>
    );
}

// ─── RAPOR ───────────────────────────────────────────────────

function RaporDetail({ alumni }: { alumni: any }) {
    const raporData = [
        { kelas: "VII A", tahun: "2021/2022", waliKelas: "Ibu Siti Rahayu, S.Pd", mapel: [
            { n: "Pend. Agama Islam", v: 85, kkm: 75 }, { n: "PKn", v: 82, kkm: 75 },
            { n: "B. Indonesia", v: 87, kkm: 75 },      { n: "Matematika", v: 78, kkm: 70 },
            { n: "IPA", v: 80, kkm: 72 },               { n: "IPS", v: 83, kkm: 72 },
            { n: "B. Inggris", v: 76, kkm: 70 },        { n: "Seni Budaya", v: 88, kkm: 75 },
            { n: "Penjaskes", v: 85, kkm: 75 },         { n: "Prakarya", v: 84, kkm: 75 },
        ], hadir: 216, sakit: 2, izin: 1, alfa: 0, sikap: "Baik", kelakuan: "Baik", kerajinan: "Baik" },
    ];
    const r = raporData[0];
    const rata = (r.mapel.reduce((s, m) => s + m.v, 0) / r.mapel.length).toFixed(1);
    return (
        <div>
            <Section title="Identitas Siswa" icon={<User size={16} color="#7c3aed" />}>
                <Row label="Nama Lengkap" value={alumni.name} />
                <Row label="NIS / NISN"   value={`${alumni.nis} / ${alumni.nisn || "-"}`} mono />
                <Row label="Kelas"        value={r.kelas} />
                <Row label="Tahun Ajaran" value={r.tahun} />
                <Row label="Wali Kelas"   value={r.waliKelas} />
            </Section>

            <Section title="Rekap Kehadiran" icon={<Calendar size={16} color="#7c3aed" />}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
                    {[
                        { label: "Hadir",  value: r.hadir, color: "#15803d", bg: "#dcfce7" },
                        { label: "Sakit",  value: r.sakit, color: "#2563eb", bg: "#dbeafe" },
                        { label: "Izin",   value: r.izin,  color: "#ca8a04", bg: "#fef9c3" },
                        { label: "Alfa",   value: r.alfa,  color: "#dc2626", bg: "#fee2e2" },
                    ].map((item, i) => (
                        <div key={i} style={{ textAlign: "center", padding: "0.6rem", background: item.bg, borderRadius: 8, border: `1px solid ${item.color}33` }}>
                            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: item.color }}>{item.value}</div>
                            <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>{item.label}</div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Penilaian Sikap" icon={<CheckCircle size={16} color="#7c3aed" />}>
                <Row label="Sikap Spritual" value={r.sikap} />
                <Row label="Kelakuan"       value={r.kelakuan} />
                <Row label="Kerajinan"      value={r.kerajinan} />
            </Section>

            <Section title="Nilai Per Mata Pelajaran" icon={<BarChart2 size={16} color="#7c3aed" />}>
                {r.mapel.map((m, i) => (
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
                    "{alumni.name} merupakan siswa yang aktif dan rajin dalam mengikuti kegiatan belajar mengajar. Perlu ditingkatkan kemampuan Matematika."
                </div>
            </Section>
        </div>
    );
}

// ─── EXPORT: SWITCHER ─────────────────────────────────────────

const typeConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    Ijazah:    { label: "📜 Ijazah",         color: "#15803d", bg: "#f0fdf4", icon: <GraduationCap size={16} color="#15803d" /> },
    SKHU:      { label: "📋 SKHU",            color: "#92400e", bg: "#fffbeb", icon: <Award size={16} color="#92400e" /> },
    Transkrip: { label: "📊 Transkrip Nilai", color: "#1e40af", bg: "#eff6ff", icon: <BarChart2 size={16} color="#1e40af" /> },
    Rapor:     { label: "📚 Rapor",           color: "#6d28d9", bg: "#faf5ff", icon: <BookOpen size={16} color="#6d28d9" /> },
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
                {alumni.type === "SKHU"      && <SKHUDetail      alumni={alumni} />}
                {alumni.type === "Transkrip" && <TranskripDetail alumni={alumni} />}
                {alumni.type === "Rapor"     && <RaporDetail     alumni={alumni} />}
            </div>
        </div>
    );
}
