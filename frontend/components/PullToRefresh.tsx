"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";

const THRESHOLD = 80;       // px ditarik sebelum trigger refresh
const MAX_PULL = 120;       // px maksimum visual bisa ditarik
const INDICATOR_SIZE = 48;  // px

export default function PullToRefresh() {
    const [pullY, setPullY] = useState(0);       // seberapa jauh ditarik (0 – MAX_PULL)
    const [isPulling, setIsPulling] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [triggered, setTriggered] = useState(false); // sudah melewati threshold?

    const startYRef = useRef<number>(0);
    const isPullingRef = useRef(false);

    // Tutup jika layar di-scroll bukan dari paling atas
    const getScrollTop = () =>
        document.querySelector(".admin-main")?.scrollTop ??
        window.scrollY ??
        0;

    // ── TOUCH EVENTS ─────────────────────────────────────────────
    const onTouchStart = useCallback((e: TouchEvent) => {
        if (getScrollTop() > 0) return;
        startYRef.current = e.touches[0].clientY;
        isPullingRef.current = true;
        setIsPulling(true);
    }, []);

    const onTouchMove = useCallback((e: TouchEvent) => {
        if (!isPullingRef.current) return;
        const delta = e.touches[0].clientY - startYRef.current;
        if (delta <= 0) { setPullY(0); setTriggered(false); return; }
        // Gunakan resistance agar semakin sulit ditarik
        const resistance = Math.min(delta * 0.5, MAX_PULL);
        setPullY(resistance);
        setTriggered(resistance >= THRESHOLD);
    }, []);

    const onTouchEnd = useCallback(() => {
        if (!isPullingRef.current) return;
        isPullingRef.current = false;
        setIsPulling(false);
        if (triggered) {
            setIsRefreshing(true);
            setPullY(INDICATOR_SIZE);
            setTimeout(() => window.location.reload(), 500);
        } else {
            setPullY(0);
            setTriggered(false);
        }
    }, [triggered]);

    // ── MOUSE EVENTS (web desktop drag) ──────────────────────────
    const onMouseDown = useCallback((e: MouseEvent) => {
        if (getScrollTop() > 0) return;
        startYRef.current = e.clientY;
        isPullingRef.current = true;
        setIsPulling(true);
    }, []);

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (!isPullingRef.current) return;
        const delta = e.clientY - startYRef.current;
        if (delta <= 0) { setPullY(0); setTriggered(false); return; }
        // Hanya aktif jika klik + drag dari dekat tepi atas
        if (startYRef.current > 160) { isPullingRef.current = false; setIsPulling(false); setPullY(0); return; }
        const resistance = Math.min(delta * 0.5, MAX_PULL);
        setPullY(resistance);
        setTriggered(resistance >= THRESHOLD);
    }, []);

    const onMouseUp = useCallback(() => {
        if (!isPullingRef.current) return;
        isPullingRef.current = false;
        setIsPulling(false);
        if (triggered) {
            setIsRefreshing(true);
            setPullY(INDICATOR_SIZE);
            setTimeout(() => window.location.reload(), 500);
        } else {
            setPullY(0);
            setTriggered(false);
        }
    }, [triggered]);

    useEffect(() => {
        const opts: AddEventListenerOptions = { passive: true };

        // Touch (mobile + web mobile emulation)
        window.addEventListener("touchstart", onTouchStart, opts);
        window.addEventListener("touchmove", onTouchMove, opts);
        window.addEventListener("touchend", onTouchEnd, opts);

        // Mouse (web desktop – drag dari atas)
        window.addEventListener("mousedown", onMouseDown, opts);
        window.addEventListener("mousemove", onMouseMove, opts);
        window.addEventListener("mouseup", onMouseUp, opts);

        return () => {
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [onTouchStart, onTouchMove, onTouchEnd, onMouseDown, onMouseMove, onMouseUp]);

    // Tidak perlu render apa-apa jika tidak sedang ditarik
    if (!isPulling && pullY === 0 && !isRefreshing) return null;

    const progress = Math.min(pullY / THRESHOLD, 1); // 0 – 1
    const opacity = Math.min(pullY / 30, 1);
    const scale = 0.5 + progress * 0.5;
    const rotation = isRefreshing ? undefined : progress * 300;

    return (
        <div
            style={{
                position: "fixed",
                top: 70, // tepat di bawah header
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                zIndex: 9999,
                pointerEvents: "none",
                transition: isPulling ? "none" : "opacity 0.3s ease",
                opacity,
                paddingTop: `${Math.max(0, pullY - INDICATOR_SIZE / 2)}px`,
            }}
        >
            <div
                style={{
                    width: INDICATOR_SIZE,
                    height: INDICATOR_SIZE,
                    background: "white",
                    borderRadius: "50%",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${triggered ? "var(--header-bg)" : "#e5e7eb"}`,
                    transform: `scale(${scale})`,
                    transition: isPulling ? "border-color 0.2s ease" : "all 0.3s ease",
                }}
            >
                <RefreshCw
                    size={20}
                    color={triggered ? "var(--header-bg)" : "#9ca3af"}
                    style={{
                        animation: isRefreshing ? "ptr-spin 0.6s linear infinite" : "none",
                        transform: isRefreshing ? undefined : `rotate(${rotation}deg)`,
                        transition: isPulling ? "color 0.2s ease" : undefined,
                    }}
                />
            </div>

            {/* Label hint */}
            {pullY > 40 && !isRefreshing && (
                <div style={{
                    position: "absolute",
                    top: `${Math.max(0, pullY - INDICATOR_SIZE / 2) + INDICATOR_SIZE + 8}px`,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: triggered ? "var(--header-bg)" : "#6b7280",
                    background: "white",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "color 0.2s ease",
                    whiteSpace: "nowrap",
                }}>
                    {triggered ? "Lepaskan untuk memuat ulang" : "Tarik untuk memuat ulang"}
                </div>
            )}

            {isRefreshing && (
                <div style={{
                    position: "absolute",
                    top: `${INDICATOR_SIZE + 8}px`,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--header-bg)",
                    background: "white",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    whiteSpace: "nowrap",
                }}>
                    Memuat ulang...
                </div>
            )}

            <style>{`
                @keyframes ptr-spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
