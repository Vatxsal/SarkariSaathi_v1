import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import ClientI18nProvider from "@/components/ClientI18nProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StateProvider } from "@/context/StateContext";

const interFont = Inter({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter" 
});

const soraFont = Sora({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora" 
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 
    'https://sarkari-saathi-v1.vercel.app'
  ),
  title: "SarkariSaathi | Your Government Service Navigator",
  description: "Official government work, now simple. Free guidance with no middlemen.",
  icons: {
    icon: '/sarkari-saathi-logo.png',
    shortcut: '/sarkari-saathi-logo.png',
    apple: '/sarkari-saathi-logo.png'
  },
  openGraph: {
    title: "SarkariSaathi | Your Government Service Navigator",
    description: "Official government work, now simple. Free guidance with no middlemen.",
    type: 'website',
    url: 'https://sarkarisaathi.in',
    images: [
      {
        url: '/sarkari-saathi-logo.png',
        width: 1200,
        height: 630,
        alt: 'Sarkari Saathi Logo'
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interFont.variable} ${soraFont.variable} font-sans bg-[var(--surface-2)] min-h-screen flex flex-col`}>
        <ClientI18nProvider>
          <StateProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </StateProvider>
        </ClientI18nProvider>
      </body>
    </html>
  );
}
