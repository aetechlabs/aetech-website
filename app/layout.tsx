import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AETech Research Labs Limited - Engineering Tomorrow's Solutions",
  description: "Innovation-driven technology company committed to researching, developing, and deploying advanced solutions across software engineering, artificial intelligence, data systems, and integrated technologies.",
  keywords: "AETech, Research Labs, Software Development, AI Solutions, Data Engineering, IT Consulting, Technology Advisory, Innovation, Africa",
  openGraph: {
    title: "AETech Research Labs Limited",
    description: "Engineering Tomorrow's Solutions - Advanced technology solutions for businesses across Africa and beyond",
    type: "website",
    locale: "en_US",
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
      </body>
    </html>
  );
}
