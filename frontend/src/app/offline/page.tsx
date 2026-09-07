"use client";

import Link from "next/link";
import { WifiOff, RefreshCw, Home, FileText } from "lucide-react";

export default function OfflinePage() {
    const handleRetry = () => {
        if (typeof window !== "undefined") {
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4 text-center">
            <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-md rounded-2xl p-8 border border-slate-700 shadow-2xl">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 animate-pulse">
                    <WifiOff size={40} />
                </div>

                <h1 className="text-2xl font-bold mb-2 text-white">Anda Sedang Offline</h1>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Koneksi internet terputus atau server tidak terjangkau. Beberapa fitur interaktif membutuhkan koneksi aktif.
                </p>

                <div className="bg-slate-900/60 rounded-xl p-4 mb-6 text-left border border-slate-700/50">
                    <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Petunjuk:</h2>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                        <li>Periksa koneksi Wi-Fi atau data seluler Anda.</li>
                        <li>Halaman yang pernah Anda buka sebelumnya dapat tetap diakses dari cache.</li>
                        <li>Data baru akan diperbarui secara otomatis setelah koneksi terhubung kembali.</li>
                    </ul>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleRetry}
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
                    >
                        <RefreshCw size={18} />
                        Coba Muat Ulang
                    </button>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <Link
                            href="/"
                            className="py-2.5 px-3 bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition flex items-center justify-center gap-1.5 border border-slate-600/50"
                        >
                            <Home size={16} />
                            Halaman Utama
                        </Link>
                        <Link
                            href="/buku-induk"
                            className="py-2.5 px-3 bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition flex items-center justify-center gap-1.5 border border-slate-600/50"
                        >
                            <FileText size={16} />
                            Buku Induk
                        </Link>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-xs text-slate-500">
                SAADA - Sistem Digitalisasi Arsip Alumni ASSA'ADAH
            </p>
        </div>
    );
}
