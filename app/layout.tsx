import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plein De Vie | Premium Barbershop in Nicosia, Cyprus",
  description: "Experience the art of grooming at Plein De Vie. Premium barbershop services including haircuts, beard trims, and luxury treatments in Lakatamia, Nicosia.",
  keywords: [
    "barbershop",
    "haircut", 
    "beard trim",
    "barber",
    "grooming",
    "Nicosia",
    "Cyprus",
    "Lakatamia",
    "Plein De Vie"
  ],
  openGraph: {
    title: "Plein De Vie | Premium Barbershop in Nicosia, Cyprus",
    description: "Experience the art of grooming at Plein De Vie. Premium barbershop services including haircuts, beard trims, and luxury treatments in Lakatamia, Nicosia.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Plein De Vie | Premium Barbershop in Nicosia, Cyprus",
    description: "Experience the art of grooming at Plein De Vie. Premium barbershop services including haircuts, beard trims, and luxury treatments in Lakatamia, Nicosia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
