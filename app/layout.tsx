import type { Metadata } from "next";
import Script from 'next/script';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import Navigation from "./components/Navigation";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aetechlabs.com'),
  title: "AETech Research Labs Limited - Engineering Tomorrow's Solutions",
  description: "Innovation-driven technology company committed to researching, developing, and deploying advanced solutions across software engineering, artificial intelligence, data systems, and integrated technologies.",
  keywords: "AETech, Research Labs, Software Development, AI Solutions, Data Engineering, IT Consulting, Technology Advisory, Innovation, Africa",
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  openGraph: {
    title: "AETech Research Labs Limited",
    description: "Engineering Tomorrow's Solutions - Advanced technology solutions for businesses across Africa and beyond",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'AETech Research Labs Limited Logo'
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AETech Research Labs Limited",
    description: "Engineering Tomorrow's Solutions - Advanced technology solutions for businesses across Africa and beyond",
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google tag (gtag.js) - Global site tag for Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-B8LHFL56CT"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-B8LHFL56CT');`}
        </Script>

        <ThemeProvider>
          <Navigation />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
