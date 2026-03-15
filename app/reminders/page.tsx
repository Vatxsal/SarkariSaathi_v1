'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Trash2, Calendar, Hash, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Reminder {
  id: number;
  service: string;
  number: string;
  date: string;
  reminderDate: string;
}

export default function RemindersPage() {
  const { t } = useTranslation();
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('ss_reminders') || '[]');
    setReminders(saved);
  }, []);

  const deleteReminder = (id: number) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    localStorage.setItem('ss_reminders', JSON.stringify(updated));
  };

  const getUrgencyColor = (reminderDate: string) => {
    const now = new Date();
    const due = new Date(reminderDate);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '#DC2626'; // Red (Overdue)
    if (diffDays <= 3) return '#E07B00'; // Saffron (Due soon)
    return '#138808'; // Green (On track)
  };

  const getServiceColor = (service: string) => {
    const s = service.toLowerCase();
    if (s.includes('ration')) return '#E07B00';
    if (s.includes('aadhaar')) return '#1B4FA8';
    if (s.includes('pan')) return '#138808';
    return '#1B4FA8';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-[#E8F0FD] rounded-full transition-all text-[#1B4FA8]">
          <ArrowLeft size={24} />
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A2E]">{t('reminders_title')}</h1>
          <p className="text-[#4A5568] text-sm">{t('reminders_subtitle')}</p>
        </div>
      </div>

      {reminders.length === 0 ? (
        <div className="bg-white rounded-[12px] p-20 text-center border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="w-24 h-24 bg-[#F7F8FA] rounded-full flex items-center justify-center mx-auto text-[#1B4FA8]/20">
            <Bell size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#1A1A2E]">{t('no_reminders')}</h2>
            <p className="text-[#4A5568] max-w-sm mx-auto">{t('no_reminders_desc')}</p>
          </div>
          <Link href="/chat" className="btn-primary px-10 py-3 inline-block">
            {t('start_checking')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reminders.map((r) => {
            const urgencyColor = getUrgencyColor(r.reminderDate);
            const serviceColor = getServiceColor(r.service);
            
            return (
              <div key={r.id} className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col" style={{ borderLeft: `5px solid ${urgencyColor}` }}>
                <div className="p-6 space-y-6 flex-1">
                  <div className="flex justify-between items-start">
                    <span 
                      className="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider text-white"
                      style={{ backgroundColor: serviceColor }}
                    >
                      {r.service.split(' - ')[0]}
                    </span>
                    <button 
                      onClick={() => deleteReminder(r.id)}
                      className="p-2 text-[#4A5568] opacity-30 hover:opacity-100 hover:text-red-600 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[12px] text-[#4A5568] font-medium flex items-center gap-1.5 uppercase">
                      <Hash size={14} /> {t('app_no_label')}
                    </p>
                    <p className="text-xl font-mono font-bold text-[#1A1A2E] tracking-tight">{r.number}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pb-4">
                    <div className="space-y-1">
                      <p className="text-[11px] text-[#4A5568] font-bold uppercase opacity-60">{t('saved_on')}</p>
                      <div className="flex items-center gap-1.5 text-sm text-[#1A1A2E] font-medium">
                        <Calendar size={14} className="text-[#1B4FA8]" />
                        <span>{r.date}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase opacity-60" style={{ color: urgencyColor }}>{t('follow_up')}</p>
                      <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: urgencyColor }}>
                        <Bell size={14} />
                        <span>{r.reminderDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#F7F8FA] border-t border-[#E2E8F0] flex gap-3">
                  <a 
                    href={`https://www.google.com/search?q=track+${r.service.toLowerCase()}+status`}
                    target="_blank"
                    className="flex-1 text-center bg-[#1B4FA8] text-white py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#0F3380] transition-all"
                  >
                    {t('track_status_btn')}
                  </a>
                  <button 
                    onClick={() => deleteReminder(r.id)}
                    className="flex-1 text-center border border-[#138808] text-[#138808] py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#138808] hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={14} /> {t('resolved_btn')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-[#FFF3E0] p-6 rounded-[12px] border-l-4 border-[#E07B00]">
        <h3 className="font-bold text-[#8a4a00] mb-2 flex items-center gap-2">
          <Bell size={18} /> {t('privacy_info_title')}
        </h3>
        <p className="text-[14px] text-[#8a4a00] opacity-90 leading-relaxed">
          {t('privacy_info_desc')}
        </p>
      </div>
    </div>
  );
}
