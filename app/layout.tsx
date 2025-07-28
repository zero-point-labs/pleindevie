import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PrivacyNotice } from "@/components/ui/privacy-notice";
import { ConsentManager } from "@/components/ui/consent-manager";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home Renovation Services | Transform Your Space",
  description: "Professional home renovation services. Kitchen remodels, bathroom upgrades, and complete home transformations. Get your free quote today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* GA4 scripts now injected dynamically after user consent via useAnalytics */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* GDPR Compliance Components */}
        <PrivacyNotice />
        <ConsentManager />
        <Footer />
      </body>
    </html>
  );
}
