"use client";

import GuideContent from "../../../components/GuideContent";
import Link from "next/link";
import { ArrowLeft, Home, ArrowRight } from "lucide-react";

export default function PublicGuidePage() {
    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg-main)" }} suppressHydrationWarning>

            {/* 1. Public Header Navigation */}
            <header style={{
                background: "var(--header-bg)",
                height: "70px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 5%",
                color: "white"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ background: "white", padding: "6px", borderRadius: "8px", display: "flex" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--header-bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                    </div>
                    <div>
                        <h1 style={{ fontSize: "1.1rem", fontWeight: "700", lineHeight: "1.2" }}>SAADA (Sistem Arsip Alumni ASSA'ADAH)</h1>
                        <p style={{ fontSize: "0.8rem", opacity: 0.9 }}>Madrasah Tsanawiyah</p>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", opacity: 0.9 }}>
                        <Home size={18} /> Beranda
                    </Link>
                    <Link href="/login" className="btn" style={{ background: "white", color: "var(--header-bg)", padding: "0.4rem 1rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        Masuk <ArrowRight size={16} />
                    </Link>
                </div>
            </header>

            <GuideContent />

            {/* Footer */}
            <footer style={{ textAlign: "center", padding: "2rem", background: "white", borderTop: "1px solid #f3f4f6", color: "#9ca3af", fontSize: "0.9rem" }}>
                © 2026 <strong>SAADA (Sistem Arsip Alumni ASSA'ADAH)</strong> | Prototipe Penelitian Skripsi MTS
            </footer>

        </div>
    );
}
