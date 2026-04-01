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
    <header className="sticky top-0 z-[100] bg-white h-[72px] flex items-center shadow-sm border-b border-[var(--border)]">
      <nav aria-label="Main navigation" className="max-w-7xl mx-auto px-4 w-full h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Image 
            src="/sarkari-saathi-logo.png"
            alt="Sarkari Saathi - Free Government Services Guide India"
            width={64}
            height={64}
            priority
            className="w-12 h-12 md:w-[52px] md:h-[52px] object-contain scale-110"
          />
          <span className="text-xl font-bold text-[var(--text-primary)] tracking-tight font-display transition-colors">
            {t('title')}
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8 mx-auto">
          <Link href="/" className="text-[var(--text-secondary)] text-[13px] font-bold uppercase tracking-widest hover:text-[var(--primary)] border-b-2 border-transparent hover:border-[var(--primary)] transition-all py-1">
            {t('home')}
          </Link>
          <Link href="/ask" className="text-[var(--text-secondary)] text-[13px] font-bold uppercase tracking-widest hover:text-[var(--primary)] border-b-2 border-transparent hover:border-[var(--primary)] transition-all py-1">
            {t('ask_button')}
          </Link>
          <Link href="/reminders" className="text-[var(--text-secondary)] text-[13px] font-bold uppercase tracking-widest hover:text-[var(--primary)] border-b-2 border-transparent hover:border-[var(--primary)] transition-all py-1">
            {t('reminders')}
          </Link>
          <Link href="/csc-locator" className="text-[var(--text-secondary)] text-[13px] font-bold uppercase tracking-widest hover:text-[var(--primary)] border-b-2 border-transparent hover:border-[var(--primary)] transition-all py-1">
            {t('csc_locator')}
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-5">
          <StateSelector />
          <div className="h-4 w-[1px] bg-[var(--border)]"></div>
          <LanguageToggle />
          <AuthButton />
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-3">
          <AuthButton />
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 text-[var(--text-primary)] bg-black/5 rounded-[6px] hover:bg-black/10 transition-all border border-black/10"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[72px] bg-white z-[99] flex flex-col p-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-6">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="text-[var(--text-primary)] text-lg font-bold uppercase tracking-widest border-b border-[var(--border)] pb-4"
            >
              {t('home')}
            </Link>
            <Link 
              href="/ask" 
              onClick={() => setIsMenuOpen(false)}
              className="text-[var(--text-primary)] text-lg font-bold uppercase tracking-widest border-b border-[var(--border)] pb-4"
            >
              {t('ask_button')}
            </Link>
            <Link 
              href="/reminders" 
              onClick={() => setIsMenuOpen(false)}
              className="text-[var(--text-primary)] text-lg font-bold uppercase tracking-widest border-b border-[var(--border)] pb-4"
            >
              {t('reminders')}
            </Link>
            <Link 
              href="/csc-locator" 
              onClick={() => setIsMenuOpen(false)}
              className="text-[var(--text-primary)] text-lg font-bold uppercase tracking-widest border-b border-[var(--border)] pb-4"
            >
              {t('csc_locator')}
            </Link>
          </div>

          <div className="mt-auto pt-10 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-[var(--text-tertiary)] text-[11px] font-bold uppercase tracking-widest">Preferences</p>
              <div className="flex items-center justify-between p-4 bg-[var(--surface-2)] rounded-[10px] border border-[var(--border)]">
                <span className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider">{t('select_state')}</span>
                <StateSelector />
              </div>
              <div className="flex items-center justify-between p-4 bg-[var(--surface-2)] rounded-[10px] border border-[var(--border)]">
                <span className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider">{i18n.language === 'hi' ? 'भाषा' : 'Language'}</span>
                <LanguageToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
