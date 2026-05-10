"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./splash.css";

export default function SplashScreen() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Start exit animation shortly before redirect
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3500);

    // Redirect
    const redirectTimer = setTimeout(() => {
      router.push("/login");
    }, 4000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  if (!mounted) return <div style={{ visibility: "hidden" }} aria-hidden="true" suppressHydrationWarning />;

  return (
    <div className={`splash-container ${isExiting ? "exiting" : ""}`} suppressHydrationWarning={true}>

      {/* Luxury Background Layers */}
      <div className="luxury-bg">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>
      </div>

      <div className="splash-content">
        {/* Premium Logo Section */}
        <div className="logo-section">
          <div className="logo-outer-ring"></div>
          <div className="logo-inner-hex">
             <img
              src="/logo-assaadah.jpg"
              alt="Logo Assa'adah"
              className="saada-main-logo"
            />
          </div>
        </div>

        {/* Text Branding Section */}
        <div className="branding-section">
          <h1 className="saada-title">
            <span className="letter">S</span>
            <span className="letter">A</span>
            <span className="letter">A</span>
            <span className="letter">D</span>
            <span className="letter">A</span>
          </h1>
          <div className="separator"></div>
          <p className="saada-full-name">
            Sistem Arsip Alumni Digital
          </p>
          <div className="academic-seal">MTs Assa'adah Sukaraja Bogor</div>
        </div>

        {/* Loading Indicator */}
        <div className="premium-loader">
          <div className="loader-bar"></div>
        </div>
      </div>

      <div className="splash-footer">
        <p>V 2.0 • Premium Digital Archive</p>
      </div>
    </div>
  );
}
