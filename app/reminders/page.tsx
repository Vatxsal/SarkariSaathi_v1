'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Trash2, Calendar, Hash, ArrowLeft, CheckCircle, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

interface Reminder {
  id: number;
  service: string;
  number: string;
  date: string;
  reminderDate: string;
}

export default function RemindersPage() {
  const { t, i18n } = useTranslation();
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
    
    if (diffDays < 0) return 'var(--error)'; 
    if (diffDays <= 3) return 'var(--warning)'; 
    return 'var(--success)';
  };

  return (
    <div className="bg-[var(--surface-2)] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 bg-white border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all shadow-sm">
              <ArrowLeft size={20} />
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] font-display uppercase tracking-wider">{t('reminders_title')}</h1>
              <p className="text-[var(--text-tertiary)] text-xs font-bold uppercase tracking-widest">{t('reminders_subtitle')}</p>
            </div>
          </div>
          
          <div className="bg-[var(--primary)]/[0.08] text-[var(--primary)] px-4 py-2 rounded-full flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
               <ShieldCheck size={14} /> Local browser storage only
          </div>
        </div>

        {reminders.length === 0 ? (
          <div className="bg-white rounded-[12px] p-20 text-center border border-[var(--border)] shadow-[var(--shadow-low)] space-y-8 animate-fade-in max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-[var(--surface-3)] rounded-full flex items-center justify-center mx-auto text-[var(--text-tertiary)] opacity-30">
              <Bell size={40} />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] font-display">{t('no_reminders')}</h2>
              <p className="text-[var(--text-secondary)] font-medium max-w-sm mx-auto leading-relaxed">{t('no_reminders_desc')}</p>
            </div>
            <Link href="/" className="bg-[var(--primary)] text-white px-8 py-3.5 rounded-[8px] font-bold text-sm tracking-widest uppercase hover:bg-[var(--primary-hover)] transition-all shadow-[var(--shadow-mid)] inline-block">
              {t('start_checking')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reminders.map((r) => {
              const urgencyColor = getUrgencyColor(r.reminderDate);
              
              return (
                <div key={r.id} className="bg-white rounded-[12px] border border-[var(--border)] shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-mid)] hover:border-[var(--primary)] transition-all relative overflow-hidden flex flex-col group animate-in zoom-in-95 duration-500">
                  <div className="p-6 space-y-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">{r.service.split(' - ')[0]}</span>
                        <span className="text-xs font-bold text-[var(--text-primary)] max-w-[160px] truncate">{r.service.split(' - ')[1]}</span>
                      </div>
                      <button 
                        onClick={() => deleteReminder(r.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-tertiary)] opacity-40 hover:opacity-100 hover:bg-red-50 hover:text-[var(--error)] transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="h-[1px] bg-[var(--border)] w-full"></div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-[10px] text-[var(--text-tertiary)] font-bold uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                            <Hash size={12} /> {t('app_no_label')}
                            </p>
                            <p className="text-2xl font-mono font-bold text-[var(--text-primary)] tracking-tight leading-none">{r.number}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pb-2">
                            <div className="space-y-1">
                            <p className="text-[9px] text-[var(--text-tertiary)] font-bold uppercase tracking-widest opacity-60">{t('saved_on')}</p>
                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-bold">
                                <Calendar size={12} className="text-[var(--primary)]" />
                                <span>{r.date}</span>
                            </div>
                            </div>
                            <div className="space-y-1">
                            <p className="text-[9px] font-bold uppercase tracking-widest opacity-60" style={{ color: urgencyColor }}>{t('follow_up')}</p>
                            <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: urgencyColor }}>
                                <Bell size={12} />
                                <span>{r.reminderDate}</span>
                            </div>
                            </div>
                        </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[var(--surface-3)] border-t border-[var(--border)] flex gap-3">
                    <a 
                      href={`https://www.google.com/search?q=track+${r.service.toLowerCase()}+status`}
                      target="_blank"
                      className="flex-1 text-center bg-white border border-[var(--border)] text-[var(--text-primary)] py-3 rounded-[6px] text-[10px] font-bold uppercase tracking-widest hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all shadow-sm"
                    >
                      {t('track_status_btn')}
                    </a>
                    <button 
                      onClick={() => deleteReminder(r.id)}
                      className="flex-1 text-center bg-[var(--primary)] text-white py-3 rounded-[6px] text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--primary-hover)] transition-all shadow-[var(--shadow-low)] flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle size={14} /> {t('resolved_btn')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-white border border-[var(--border)] p-6 rounded-[12px] shadow-[var(--shadow-low)] max-w-3xl mx-auto">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-[var(--primary)]/[0.08] text-[var(--primary)] rounded-[8px] flex items-center justify-center shrink-0">
                  <Bell size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-wider">{t('privacy_info_title')}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
                  {t('privacy_info_desc')}
                </p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
