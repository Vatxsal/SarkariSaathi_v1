'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import StateSelector from './StateSelector';
import LanguageToggle from './LanguageToggle';
import AuthButton from './AuthButton';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-[100] bg-[var(--primary)] h-[56px] flex items-center shadow-lg border-b border-white/5">
      <nav aria-label="Main navigation" className="max-w-7xl mx-auto px-4 w-full h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Image 
            src="/sarkari-saathi-logo.png"
            alt="Sarkari Saathi - Free Government Services Guide India"
            width={32}
            height={32}
            priority
            className="w-8 h-8 rounded-lg object-contain"
          />
          <span className="text-xl font-bold text-white tracking-tight font-display transition-colors">
            {t('title')}
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8 mx-auto">
          <Link href="/" className="text-white text-[13px] font-bold uppercase tracking-widest hover:text-[var(--accent)] border-b-2 border-transparent hover:border-[var(--accent)] transition-all py-1">
            {t('home')}
          </Link>
          <Link href="/ask" className="text-white text-[13px] font-bold uppercase tracking-widest hover:text-[var(--accent)] border-b-2 border-transparent hover:border-[var(--accent)] transition-all py-1">
            {t('ask_button')}
          </Link>
          <Link href="/reminders" className="text-white text-[13px] font-bold uppercase tracking-widest hover:text-[var(--accent)] border-b-2 border-transparent hover:border-[var(--accent)] transition-all py-1">
            {t('reminders')}
          </Link>
          <Link href="/csc-locator" className="text-white text-[13px] font-bold uppercase tracking-widest hover:text-[var(--accent)] border-b-2 border-transparent hover:border-[var(--accent)] transition-all py-1">
            {t('csc_locator')}
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-5">
          <StateSelector />
          <div className="h-4 w-[1px] bg-white/20"></div>
          <LanguageToggle />
          <AuthButton />
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-3">
          <AuthButton />
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 text-white bg-white/10 rounded-[6px] hover:bg-white/20 transition-all border border-white/10"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[56px] bg-[var(--primary)] z-[99] flex flex-col p-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-6">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="text-white text-lg font-bold uppercase tracking-widest border-b border-white/10 pb-4"
            >
              {t('home')}
            </Link>
            <Link 
              href="/ask" 
              onClick={() => setIsMenuOpen(false)}
              className="text-white text-lg font-bold uppercase tracking-widest border-b border-white/10 pb-4"
            >
              {t('ask_button')}
            </Link>
            <Link 
              href="/reminders" 
              onClick={() => setIsMenuOpen(false)}
              className="text-white text-lg font-bold uppercase tracking-widest border-b border-white/10 pb-4"
            >
              {t('reminders')}
            </Link>
            <Link 
              href="/csc-locator" 
              onClick={() => setIsMenuOpen(false)}
              className="text-white text-lg font-bold uppercase tracking-widest border-b border-white/10 pb-4"
            >
              {t('csc_locator')}
            </Link>
          </div>

          <div className="mt-auto pt-10 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest">Preferences</p>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-[10px] border border-white/10">
                <span className="text-white text-xs font-bold uppercase tracking-wider">{t('select_state')}</span>
                <StateSelector />
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-[10px] border border-white/10">
                <span className="text-white text-xs font-bold uppercase tracking-wider">{i18n.language === 'hi' ? 'भाषा' : 'Language'}</span>
                <LanguageToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
