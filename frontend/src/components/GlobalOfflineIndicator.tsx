"use client";

import { useEffect, useState } from "react";
import { WifiOff, X } from "lucide-react";

export default function GlobalOfflineIndicator() {
    const [isOffline, setIsOffline] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showDebug, setShowDebug] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Initial check
        setIsOffline(!navigator.onLine);

        const handleOnline = () => {
            console.log("Browser went ONLINE");
            setIsOffline(false);
        };
        const handleOffline = () => {
            console.log("Browser went OFFLINE");
            setIsOffline(true);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // For testing simulation if browser events don't fire
    const toggleSimulation = () => {
        setIsOffline(!isOffline);
    };

    if (!mounted) return <div style={{ display: "none" }} aria-hidden="true" suppressHydrationWarning />;

    if (!isOffline) {
        return (
            /* Debug helper hidden in production, shows up only if you know where to click or for testing */
            <div
                onClick={() => setShowDebug(!showDebug)}
                style={{ position: "fixed", bottom: 0, right: 0, width: "10px", height: "10px", opacity: 0, cursor: "pointer", zIndex: 100000 }}
                suppressHydrationWarning
            >
                {showDebug && (
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleSimulation(); }}
                        style={{ position: "absolute", bottom: "20px", right: "20px", padding: "5px 10px", background: "#334155", color: "white", borderRadius: "5px", fontSize: "10px", border: "none" }}
                    >
                        Simulasi Offline
                    </button>
                )}
            </div>
        );
    }

    return (
        <div
            id="offline-banner"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: "45px",
                background: "#dc2626",
                color: "white",
                zIndex: 100000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.95rem",
                fontWeight: "700",
                gap: "1rem",
                boxShadow: "0 4px 15px rgba(220, 38, 38, 0.4)",
                transition: "all 0.3s ease"
            }}
            suppressHydrationWarning
        >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <WifiOff size={20} className="animate-pulse" />
                <span>Koneksi Terputus: Sistem berjalan dalam Mode Terbatas (Offline)</span>
            </div>

            <button
                onClick={() => setIsOffline(false)}
                style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    color: "white",
                    borderRadius: "4px",
                    padding: "2px 8px",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    marginLeft: "1rem"
                }}
            >
                Tutup
            </button>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideInDown {
                    from { transform: translateY(-100%); }
                    to { transform: translateY(0); }
                }
                #offline-banner {
                    animation: slideInDown 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}} />
        </div>
    );
}
