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
    <div className="flex items-center text-[13px] font-medium text-[var(--text-secondary)]">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 transition-all hover:text-[var(--text-primary)] ${currentLanguage === 'en' ? 'text-[var(--text-primary)] font-bold' : ''}`}
      >
        EN
      </button>
      <span className="text-[var(--text-tertiary)] h-3 w-[1px] bg-[var(--border)]"></span>
      <button
        onClick={() => changeLanguage('hi')}
        className={`px-2 py-1 transition-all hover:text-[var(--text-primary)] ${currentLanguage === 'hi' ? 'text-[var(--text-primary)] font-bold' : ''}`}
      >
        हि
      </button>
    </div>
  );
}
