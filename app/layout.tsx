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
    process.env.NEXT_PUBLIC_SITE_URL || 
    'https://sarkari-saathi.vercel.app'
  ),
  title: {
    default: 'Sarkari Saathi — Free Government Services Guide India',
    template: '%s | Sarkari Saathi'
  },
  description: 'Sarkari Saathi helps Indian citizens apply for Aadhaar update, PAN card, ration card, driving license and government schemes like PM Kisan, Ayushman Bharat — free, no agents, in Hindi and English.',
  keywords: [
    'aadhaar update online',
    'pan card apply india',
    'ration card apply online',
    'driving license apply online india',
    'government services india',
    'sarkari yojana',
    'pm kisan registration',
    'ayushman bharat card',
    'pm ujjwala yojana',
    'government schemes india 2025',
    'sarkari saathi',
    'sarkarisaathi',
    'how to apply government services india',
    'free government help india',
    'no agent government services',
  ],
  authors: [{ name: 'Sarkari Saathi' }],
  creator: 'Sarkari Saathi',
  publisher: 'Sarkari Saathi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    alternateLocale: 'hi_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Sarkari Saathi',
    title: 'Sarkari Saathi — Free Government Services Guide India',
    description: 'Apply for Aadhaar, PAN, Ration Card, Driving License & Government Schemes — Free, No Agents, Hindi + English.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sarkari Saathi - Free Government Services Guide',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sarkari Saathi — Free Government Services Guide India',
    description: 'Apply for Aadhaar, PAN, Ration Card, DL & Govt Schemes free. No agents needed.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
  verification: {
    google: 'ADD_YOUR_GOOGLE_VERIFICATION_CODE_HERE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
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
