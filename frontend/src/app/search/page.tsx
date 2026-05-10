"use client";

import { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { 
    Search, Loader2, Sparkles, GraduationCap, 
    BookOpen, FileText, FileCheck, BarChart, 
    ChevronRight, ArrowRight
} from "lucide-react";
import Link from "next/link";

interface GlobalResult {
    id: string;
    name: string;
    type: "Buku Induk" | "Ijazah" | "Rapor" | "SKHU" | "Transkrip";
    score: number;
    identifier: string; // NISN or Filename
    link: string;
    details: string;
}

export default function GlobalSearchPage() {
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<GlobalResult[] | null>(null);

    const handleGlobalSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;
        
        setIsSearching(true);
        setResults(null);

        // Simulated Global Cross-Database Search
        setTimeout(() => {
            setIsSearching(false);
            setResults([
                { 
                    id: "1", 
                    name: "Ahmad Dahlan", 
                    type: "Buku Induk", 
                    score: 100, 
                    identifier: "0012345678", 
                    link: "/buku-induk",
                    details: "Alumni Angkatan 2020 • Status: Lengkap"
                },
                { 
                    id: "2", 
                    name: "Scan_Ijazah_Ahmad_D.pdf", 
                    type: "Ijazah", 
                    score: 92, 
                    identifier: "Verified by AI", 
                    link: "/dokumen-ijazah",
                    details: "Ditemukan pada arsip Ijazah digital"
                },
                { 
                    id: "3", 
                    name: "Rekap_Rapor_Ahmad.pdf", 
                    type: "Rapor", 
                    score: 88, 
                    identifier: "Semester 1-6", 
                    link: "/dokumen-rapor",
                    details: "Terdeteksi 1 dokumen nilai rapor"
                },
                { 
                    id: "4", 
                    name: "SKHU_Ahmad_Dahlan.jpg", 
                    type: "SKHU", 
                    score: 85, 
                    identifier: "Lulus 2020", 
                    link: "/dokumen-skhu",
                    details: "Arsip SKHU sementara"
                }
            ]);
        }, 1500);
    };

    const getIcon = (type: string) => {
        switch(type) {
            case "Buku Induk": return <BookOpen size={20} />;
            case "Ijazah": return <GraduationCap size={20} />;
            case "Rapor": return <FileText size={20} />;
            case "SKHU": return <FileCheck size={20} />;
            case "Transkrip": return <BarChart size={20} />;
            default: return <Search size={20} />;
        }
    };

    return (
        <div className="search-layout">
            <Sidebar />
            <main className="search-main">
                <div className="search-container">
                    {/* Hero Section */}
                    <header className="search-header">
                        <div className="search-badge">
                            <Sparkles size={14} />
                            <span>Powered by SAADA AI</span>
                        </div>
                        <h1>Pusat Pencarian Global</h1>
                        <p>Cari data alumni di seluruh modul (Buku Induk, Ijazah, Rapor, dll) dalam satu klik.</p>
                    </header>

                    {/* Universal Search Bar */}
                    <form onSubmit={handleGlobalSearch} className="global-search-bar glass">
                        <div className="input-wrapper">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder="Ketik nama alumni, NISN, atau nama berkas..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="search-submit-btn" disabled={isSearching || !query}>
                            {isSearching ? <Loader2 className="animate-spin" /> : "Cari Sekarang"}
                        </button>
                    </form>

                    {/* Search Results */}
                    <div className="results-wrapper">
                        {isSearching && (
                            <div className="searching-state">
                                <div className="scanner"></div>
                                <p>Sedang menelusuri seluruh basis data...</p>
                            </div>
                        )}

                        {results && (
                            <div className="results-list animate-fade-in">
                                <div className="results-info">
                                    <h3>Ditemukan {results.length} hasil untuk "{query}"</h3>
                                    <p>Hasil diurutkan berdasarkan tingkat kemiripan tertinggi.</p>
                                </div>

                                {results.map((item) => (
                                    <Link href={item.link} key={item.id} className="result-card glass">
                                        <div className={`result-type-icon ${item.type.toLowerCase().replace(" ", "-")}`}>
                                            {getIcon(item.type)}
                                        </div>
                                        <div className="result-content">
                                            <div className="result-top">
                                                <span className="category-tag">{item.type}</span>
                                                <span className="score-tag">{item.score}% Match</span>
                                            </div>
                                            <h4>{item.name}</h4>
                                            <p className="result-identifier">{item.identifier}</p>
                                            <p className="result-details">{item.details}</p>
                                        </div>
                                        <div className="result-action">
                                            <span>Buka</span>
                                            <ArrowRight size={18} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {!results && !isSearching && (
                            <div className="initial-state">
                                <div className="ghost-icon">🔍</div>
                                <h3>Siap Mencari?</h3>
                                <p>Gunakan nama lengkap atau nomor identitas untuk hasil terbaik.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <style jsx global>{`
                :root {
                    --bg-search: #f8fafc;
                    --primary-search: #1e293b;
                    --accent-search: #3b82f6;
                    --glass-search: rgba(255, 255, 255, 0.8);
                }

                .search-layout { display: flex; min-height: 100vh; background: var(--bg-search); }
                .search-main { flex: 1; margin-left: 280px; padding: 3rem; }
                .search-container { max-width: 900px; margin: 0 auto; }

                .search-header { text-align: center; margin-bottom: 3.5rem; }
                .search-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: #eff6ff; color: #2563eb; padding: 0.4rem 1rem; border-radius: 20px; font-weight: 750; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 1rem; border: 1px solid #dbeafe; }
                
                .search-header h1 { font-size: 3rem; font-weight: 850; color: #0f172a; margin: 0; letter-spacing: -1.5px; }
                .search-header p { color: #64748b; font-size: 1.1rem; margin-top: 0.5rem; max-width: 600px; margin-inline: auto; }

                .global-search-bar { background: white; padding: 0.75rem; border-radius: 20px; display: flex; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; transition: all 0.3s; }
                .global-search-bar:focus-within { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); transform: translateY(-2px); }
                
                .input-wrapper { flex: 1; display: flex; align-items: center; padding-left: 1.5rem; }
                .search-icon { color: #94a3b8; margin-right: 1rem; }
                .input-wrapper input { border: none; outline: none; width: 100%; font-size: 1.15rem; font-weight: 500; color: #1e293b; background: transparent; }
                
                .search-submit-btn { background: #0f172a; color: white; border: none; padding: 0.9rem 2rem; border-radius: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
                .search-submit-btn:hover { background: #1e293b; transform: scale(1.02); }
                .search-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .results-wrapper { margin-top: 4rem; }
                .results-info { margin-bottom: 2rem; }
                .results-info h3 { font-size: 1.25rem; font-weight: 800; color: #1e293b; margin: 0; }
                .results-info p { color: #94a3b8; font-size: 0.9rem; margin-top: 0.25rem; }

                .result-card { background: white; border: 1px solid #f1f5f9; padding: 1.5rem; border-radius: 20px; display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1rem; transition: all 0.2s; text-decoration: none; position: relative; overflow: hidden; }
                .result-card:hover { transform: translateX(8px); border-color: #3b82f6; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }

                .result-type-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
                .result-type-icon.buku-induk { background: #ecfdf5; color: #10b981; }
                .result-type-icon.ijazah { background: #fffbeb; color: #d97706; }
                .result-type-icon.rapor { background: #f5f3ff; color: #7c3aed; }
                .result-type-icon.skhu { background: #fef2f2; color: #dc2626; }
                .result-type-icon.transkrip { background: #f0f9ff; color: #0284c7; }

                .result-content { flex: 1; }
                .result-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
                .category-tag { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 6px; }
                .score-tag { font-size: 0.7rem; font-weight: 750; color: #10b981; }
                
                .result-content h4 { margin: 0; font-size: 1.1rem; font-weight: 800; color: #1e293b; }
                .result-identifier { font-size: 0.85rem; color: #64748b; font-weight: 600; margin: 2px 0; }
                .result-details { font-size: 0.8rem; color: #94a3b8; margin: 0; }

                .result-action { display: flex; align-items: center; gap: 0.5rem; color: #cbd5e1; font-weight: 700; font-size: 0.85rem; transition: color 0.2s; }
                .result-card:hover .result-action { color: #3b82f6; }

                .searching-state { text-align: center; padding: 4rem 0; color: #64748b; }
                .scanner { width: 100px; height: 4px; background: #e2e8f0; border-radius: 4px; margin: 0 auto 1.5rem; position: relative; overflow: hidden; }
                .scanner::after { content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 40px; background: #3b82f6; animation: scan-move 1.5s infinite linear; }
                
                @keyframes scan-move { 0% { left: -40px; } 100% { left: 100%; } }

                .initial-state { text-align: center; padding: 6rem 0; color: #94a3b8; }
                .ghost-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.3; }
                .initial-state h3 { font-weight: 800; color: #cbd5e1; }

                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                @media (max-width: 1024px) {
                    .search-main { margin-left: 0; padding: 1.5rem; padding-bottom: 5rem; }
                    .search-header h1 { font-size: 2.2rem; }
                    .global-search-bar { flex-direction: column; gap: 0.5rem; padding: 0.5rem; }
                    .input-wrapper { padding: 0.75rem; }
                    .search-submit-btn { width: 100%; }
                    .result-card { padding: 1rem; gap: 1rem; }
                    .result-action span { display: none; }
                }
            `}</style>
        </div>
    );
}
