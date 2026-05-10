"use client";

import AdminLayout from "../../../../components/AdminLayout"; // Adjust path as needed
import GuideContent from "../../../../components/GuideContent";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminGuidePage() {
    const router = useRouter();

    return (
        <AdminLayout>
            {/* Admin specific header adjustment if needed, or rely on AdminLayout's header */}
            <div style={{ marginBottom: "1rem" }}>
                <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    <ArrowLeft size={16} /> Kembali
                </button>
            </div>

            {/* Reuse the content, but maybe we want to wrap it or just render it */}
            {/* GuideContent has a Hero section that might look odd inside the dashboard content area. 
                However, to handle "different appearance" simply, we can just render it. 
                If the user wants it to look Integrated, we might need to adjust GuideContent styles via props. 
                For now, let's render it as is. */}

            <div style={{ borderRadius: "16px", overflow: "hidden", background: "white", boxShadow: "var(--shadow-card)" }} suppressHydrationWarning>
                <GuideContent />
            </div>

        </AdminLayout>
    );
}
