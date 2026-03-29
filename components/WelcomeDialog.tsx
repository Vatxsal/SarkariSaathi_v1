'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { authClient } from '@/lib/auth-client';
import { X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function WelcomeDialog() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const isHindi = i18n.language === 'hi';

  useEffect(() => {
    const hasVisited = document.cookie.split('; ').find(row => row.startsWith('ss_visited='));
    if (!hasVisited) {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    document.cookie = "ss_visited=true; max-age=" + (365 * 24 * 60 * 60) + "; path=/";
    setIsOpen(false);
  };

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/"
    });
    handleDismiss();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={handleDismiss} />
      
      <div className="relative bg-white rounded-[12px] shadow-[var(--shadow-high)] max-w-[440px] w-full overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500 border border-[var(--border)]">
        {/* Header Graphic */}
        <div className="bg-[var(--primary)] h-[120px] flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 flex items-center justify-center">
              <Shield size={160} />
           </div>
           <Shield size={48} className="text-[var(--accent)] relative z-10" />
        </div>

        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-white/70 hover:bg-white/10 p-1.5 rounded-full transition-colors z-[11]"
        >
          <X size={20} />
        </button>

        <div className="pt-8 pb-8 px-8 text-center">
          <h2 className="text-[var(--text-2xl)] font-bold text-[var(--text-primary)] leading-tight mb-3 font-display">
            {t('welcome.title')}
          </h2>
          
          <p className="text-[var(--text-base)] text-[var(--text-secondary)] font-medium leading-relaxed mb-8">
            {t('welcome.body')}
          </p>

          <div className="grid grid-cols-1 gap-4 mb-10">
            <div className="flex items-start gap-4 bg-[var(--surface-3)] border border-[var(--border)] p-4 rounded-[8px] text-left">
              <div className="w-10 h-10 bg-[var(--primary)] text-white rounded-[6px] flex items-center justify-center shrink-0">
                  <Zap size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">{t('welcome.login_benefit')}</p>
                <p className="text-[12px] text-[var(--text-secondary)] font-medium mt-0.5">Google Login required</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-[var(--surface-3)] border border-[var(--border)] p-4 rounded-[8px] text-left">
              <div className="w-10 h-10 bg-[var(--accent)] text-white rounded-[6px] flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">{t('welcome.guest_benefit')}</p>
                <p className="text-[12px] text-[var(--text-secondary)] font-medium mt-0.5">Daily free allowance</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white h-[56px] rounded-[8px] font-bold text-base shadow-[var(--shadow-mid)] transition-all active:scale-[0.98]"
            >
              {t('welcome.cta_login')}
            </button>
            
            <button
              onClick={handleDismiss}
              className="w-full text-[var(--primary)] h-[44px] text-sm font-bold hover:underline transition-all"
            >
              {t('welcome.cta_guest')}
            </button>
          </div>
        </div>

        <div className="bg-[var(--surface-2)] py-5 px-6 border-t border-[var(--border)]">
          <div className="flex items-center justify-center gap-2 text-[11px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">
            <ShieldCheck size={14} className="text-[var(--success)]" />
            100% Secure · Official Data Only
          </div>
        </div>
      </div>
    </div>
  );
}

const Shield = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </svg>
);
