import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PrivacyNotice } from "@/components/ui/privacy-notice";
import { ConsentManager } from "@/components/ui/consent-manager";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsProvider } from "@/components/layout/AnalyticsProvider";

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
  keywords: [
    "home renovation",
    "kitchen remodel", 
    "bathroom renovation",
    "home improvement",
    "construction",
    "contractor"
  ],
  openGraph: {
    title: "Home Renovation Services | Transform Your Space",
    description: "Professional home renovation services. Kitchen remodels, bathroom upgrades, and complete home transformations. Get your free quote today!",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Home Renovation Services | Transform Your Space",
    description: "Professional home renovation services. Kitchen remodels, bathroom upgrades, and complete home transformations. Get your free quote today!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
              });
            `,
          }}
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                send_page_view: false,
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnalyticsProvider />
        {children}
        {/* GDPR Compliance Components */}
        <PrivacyNotice />
        {/* Footer links already exist; ensure ToS link present via Footer component */}
        <ConsentManager />
        <Footer />
      </body>
    </html>
  );
}
