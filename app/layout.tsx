import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AboutDialog } from "@/components/AboutDialog";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DRAWWW TIME",
  description: "A simple drawing app for the web.",
  keywords: ["drawing", "canvas", "art", "sketch", "pressure sensitivity", "web app"],
  authors: [{ name: "Jonathan Myers" }],
  openGraph: {
    title: "DRAWWW TIME",
    description: "A simple drawing app for the web.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "DRAWWW TIME - A simple drawing app for the web",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DRAWWW TIME",
    description: "A simple drawing app for the web.",
    images: ["/opengraph-image.png"],
    creator: "@jnthnmyrs",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        {children}
        <Toaster />
        <div className="whitespace-nowrap fixed bottom-0 right-0 w-fit">
          <AboutDialog />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
