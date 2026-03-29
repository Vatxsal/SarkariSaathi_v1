'use client';

import { useState } from 'react';
import { Bookmark, Save, BellRing } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  serviceName: string;
}

export default function ReminderTracker({ serviceName }: Props) {
  const { t } = useTranslation();
  const [appNumber, setAppNumber] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!appNumber.trim()) return;
    
    const reminders = JSON.parse(localStorage.getItem('ss_reminders') || '[]');
    const newReminder = {
      id: Date.now(),
      service: serviceName,
      number: appNumber,
      date: new Date().toLocaleDateString(),
      reminderDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    };
    
    localStorage.setItem('ss_reminders', JSON.stringify([...reminders, newReminder]));
    setSaved(true);
    setAppNumber('');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-[12px] border border-[var(--border)] border-l-[4px] border-l-[var(--primary)] p-6 shadow-[var(--shadow-low)] space-y-5 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[var(--primary)]/[0.08] text-[var(--primary)] rounded-[6px] flex items-center justify-center shrink-0">
            <BellRing size={16} />
        </div>
        <h3 className="text-[var(--text-lg)] font-bold text-[var(--text-primary)] font-display uppercase tracking-wider text-xs">{t('track_app_title')}</h3>
      </div>
      
      <p className="text-[var(--text-secondary)] text-[14px] font-medium leading-relaxed">
        {t('track_app_desc')}
      </p>

      <div className="space-y-3">
        <input
          type="text"
          value={appNumber}
          onChange={(e) => setAppNumber(e.target.value)}
          placeholder={t('app_number_placeholder')}
          className="w-full bg-[var(--surface-3)] border border-[var(--border)] rounded-[8px] px-4 py-3.5 text-sm text-[var(--text-primary)] font-bold placeholder:text-[var(--text-tertiary)] placeholder:font-medium focus:border-[var(--primary)] focus:bg-white outline-none transition-all shadow-inner"
        />
        <button
          onClick={handleSave}
          className="w-full bg-[var(--accent)] text-white font-bold text-xs uppercase tracking-[2px] h-[48px] rounded-[8px] hover:bg-[var(--accent-hover)] transition-all flex items-center justify-center gap-2 shadow-[var(--shadow-mid)] active:scale-[0.98]"
        >
          {saved ? (
            <span className="flex items-center gap-2"><Save size={16} /> {t('saved_toast')}</span>
          ) : (
            <>
              <Save size={16}/> 
              <span>{t('save_button')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
