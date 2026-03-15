'use client';

import { useState } from 'react';
import { Bookmark, Save } from 'lucide-react';
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
    <div className="bg-white rounded-[12px] border border-[#E2E8F0] border-l-[4px] border-l-[#1B4FA8] p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <Bookmark size={20} className="text-[#1B4FA8]" />
        <h3 className="text-[17px] font-semibold text-[#1A1A2E]">{t('track_app_title')}</h3>
      </div>
      
      <p className="text-[#4A5568] text-[14px] font-normal leading-relaxed">
        {t('track_app_desc')}
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={appNumber}
          onChange={(e) => setAppNumber(e.target.value)}
          placeholder={t('app_number_placeholder')}
          className="flex-1 border-[1.5px] border-[#E2E8F0] rounded-[8px] px-[14px] py-[10px] text-[15px] text-[#1A1A2E] placeholder:text-[#9CA3AF] focus:border-[#1B4FA8] focus:shadow-[0_0_0_3px_rgba(27,79,168,0.12)] outline-none transition-all"
        />
        <button
          onClick={handleSave}
          className="bg-[#E07B00] text-white font-semibold text-[14px] rounded-[8px] px-[18px] py-[10px] hover:bg-[#c56e00] transition-all flex items-center gap-2 shrink-0 active:scale-95"
        >
          {saved ? (
            <span className="text-white">{t('saved_toast')}</span>
          ) : (
            <>
              <Save size={18}/> 
              <span>{t('save_button')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
