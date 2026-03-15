'use client';

import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import '../lib/i18n';

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-white/10 border border-white text-white px-4 py-1.5 rounded-full hover:bg-white hover:text-[#0F3380] transition-all text-[13px] font-semibold tracking-wide"
    >
      <Languages size={14} />
      <span>{i18n.language === 'en' ? 'हिन्दी' : 'English'}</span>
    </button>
  );
}
