'use client';

import { useTranslation } from 'react-i18next';
import { MapPin, ExternalLink, Info, Landmark, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CSCLocator() {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const findCSCNearMe = () => {
    const savedState = typeof window !== 'undefined' ? localStorage.getItem('selectedState') || '' : '';
    const query = encodeURIComponent(`Jan Seva Kendra CSC near me ${savedState}`);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  return (
    <div className="bg-[var(--surface-2)] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[var(--primary)]/[0.08] rounded-[16px] flex items-center justify-center text-[var(--primary)] mx-auto shadow-[var(--shadow-low)]">
            <Landmark size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] leading-tight font-display">
            {t('csc_page_title')}
          </h1>
          <p className="text-[var(--text-secondary)] text-[16px] leading-relaxed font-medium max-w-xl mx-auto">
            {t('csc_page_desc')}
          </p>
        </div>

        <div className="bg-white rounded-[12px] border border-[var(--border)] p-8 shadow-[var(--shadow-mid)] space-y-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 opacity-[0.03] -mr-12 -mt-12 pointer-events-none">
                <Landmark size={240} />
           </div>

          <div className="space-y-4 relative z-10">
            <button 
                onClick={findCSCNearMe}
                className="w-full bg-[var(--accent)] text-white h-[64px] rounded-[8px] font-bold text-lg flex items-center justify-center gap-3 hover:bg-[var(--accent-hover)] transition-all shadow-[var(--shadow-mid)] active:scale-[0.98]"
            >
                <MapPin size={24} />
                {t('open_google_maps')}
            </button>
            <p className="text-center text-[11px] text-[var(--text-tertiary)] font-bold uppercase tracking-widest">
                Recommended for form submissions
            </p>
          </div>

          <div className="h-[1px] bg-[var(--border)] w-full"></div>

          <div className="space-y-6 relative z-10">
            <h2 className="text-xs font-bold text-[var(--text-primary)] font-display uppercase tracking-[3px] flex items-center gap-2">
              <Info className="text-[var(--primary)]" size={16} />
              {t('csc_services_title')}
            </h2>
            <div className="bg-[var(--surface-3)]/50 p-6 rounded-[8px] border border-[var(--border)]">
              <p className="text-[var(--text-secondary)] leading-relaxed font-bold text-sm">
                {t('csc_services_list')}
              </p>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
             <a 
              href="https://locator.csccloud.in/" 
              target="_blank" 
              className="w-full flex items-center justify-center gap-3 text-[var(--text-primary)] font-bold border border-[var(--border)] h-[56px] rounded-[8px] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] bg-[var(--surface-2)]"
            >
              <span className="text-sm uppercase tracking-widest">{t('official_csc_locator')}</span> 
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="bg-white border border-[var(--border)] p-6 rounded-[12px] shadow-[var(--shadow-low)]">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-[var(--warning)]/[0.08] text-[var(--warning)] rounded-[8px] flex items-center justify-center shrink-0">
                  <AlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-wider">{i18n.language === 'hi' ? 'महत्वपूर्ण सूचना' : 'Important Notice'}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium italic">
                  {t('csc_note')}
                </p>
              </div>
            </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--text-tertiary)] font-bold uppercase tracking-[2px]">
             <ShieldCheck size={14} className="text-[var(--success)]" />
             Official Information Network
        </div>
      </div>
    </div>
  );
}

const AlertCircle = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
);
