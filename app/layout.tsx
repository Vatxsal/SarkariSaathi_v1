import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import ClientI18nProvider from "@/components/ClientI18nProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StateProvider } from "@/context/StateContext";

const notoSans = Noto_Sans({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"],
  variable: "--font-noto-sans" 
});
const notoDevanagari = Noto_Sans_Devanagari({ 
  subsets: ["devanagari"], 
  weight: ["400", "500", "600"],
  variable: "--font-noto-devanagari" 
});

export const metadata: Metadata = {
  title: "SarkariSaathi | Your Government Service Navigator",
  description: "Navigate Indian government bureaucracy with free AI-powered guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} ${notoDevanagari.variable} font-sans bg-[#F7F8FA] min-h-screen flex flex-col`}>
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
