"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
    // Ganti dengan Client ID Anda atau ambil dari env
    const clientId = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}
