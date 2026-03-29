'use client';

import { useTranslation } from 'react-i18next';
import '../lib/i18n';

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const currentLanguage = i18n.language;

  return (
    <div className="flex items-center text-[13px] font-medium text-white/90">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 transition-all hover:text-white ${currentLanguage === 'en' ? 'text-white font-bold' : ''}`}
      >
        EN
      </button>
      <span className="text-white/30 h-3 w-[1px] bg-white/30"></span>
      <button
        onClick={() => changeLanguage('hi')}
        className={`px-2 py-1 transition-all hover:text-white ${currentLanguage === 'hi' ? 'text-white font-bold' : ''}`}
      >
        हि
      </button>
    </div>
  );
}
