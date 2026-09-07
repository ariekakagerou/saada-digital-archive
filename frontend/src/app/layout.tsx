import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalOfflineIndicator from "../components/GlobalOfflineIndicator";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister";
import Providers from "../components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#2E7D32",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // user-scalable=0
};

export const metadata: Metadata = {
  title: "SAADA (Sistem Arsip Alumni Digital Assa'adah)",
  description: "Sistem Digitalisasi Arsip Alumni",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <Providers>
          <ServiceWorkerRegister />
          <GlobalOfflineIndicator />
          {children}
        </Providers>
      </body>
    </html>
  );
}
