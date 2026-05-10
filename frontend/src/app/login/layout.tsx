import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Masuk Petugas | SAADA",
    description: "Halaman akses petugas Sistem Arsip Alumni Digital Assa'adah",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
