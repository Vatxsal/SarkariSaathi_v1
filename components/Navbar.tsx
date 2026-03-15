'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import StateSelector from './StateSelector';
import LanguageToggle from './LanguageToggle';
export default function Navbar() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 bg-[#0F3380] border-b border-[#1B4FA8]">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏛️</span>
          <span className="text-[18px] font-semibold text-white tracking-tight">सरकारी साथी <span className="text-primary-tint opacity-80 border-l border-white/20 ml-2 pl-2 text-sm font-normal hidden sm:inline">SarkariSaathi</span></span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6 mr-4">
            <Link href="/" className="text-white text-[14px] hover:underline transition-all">{t('home')}</Link>
            <Link href="/chat" className="text-white text-[14px] hover:underline transition-all">{t('ask_button')}</Link>
            <Link href="/reminders" className="text-white text-[14px] hover:underline transition-all">{t('reminders')}</Link>
            <Link href="/csc-locator" className="text-white text-[14px] hover:underline transition-all">{t('csc_locator')}</Link>
          </div>
          <div className="flex items-center gap-3">
            <StateSelector />
            <LanguageToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
