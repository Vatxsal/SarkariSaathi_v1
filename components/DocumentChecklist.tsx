'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Share2 } from 'lucide-react';

interface Props {
  documents: string[];
  serviceName: string;
  subcaseName: string;
  serviceSlug: string;
  subcaseSlug: string;
  state: string;
  fee_en: string;
  fee_hi: string;
  timeline_days: number;
}

export default function DocumentChecklist({
  documents,
  serviceName,
  subcaseName,
  serviceSlug,
  subcaseSlug,
  state,
  fee_en,
  fee_hi,
  timeline_days
}: Props) {
  const { t, i18n } = useTranslation();
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const isHindi = i18n.language === 'hi';

  const toggle = (i: number) => {
    setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${baseUrl}/guide/${serviceSlug}/${subcaseSlug}/${encodeURIComponent(state)}`;

  const handleWhatsAppShare = () => {
    const docList = documents.map(doc => `- ${doc}`).join('\n');

    const message = isHindi
      ? `*Sarkari Saathi — Free Government Guide*\n\n*[${serviceName}] | ${state}*\n*Fee:* ${fee_hi} | *Time:* ~${timeline_days} days\n\n*Documents required:*\n${docList}\n\n*View official guide:*\n${shareUrl}\n\n_Official data only. No middlemen._`
      : `*Sarkari Saathi — Free Government Guide*\n\n*[${serviceName}] | ${state}*\n*Fee:* ${fee_en} | *Time:* ~${timeline_days} days\n\n*Documents you need:*\n${docList}\n\n*For the complete step-by-step process, visit:*\n${shareUrl}\n\n_Free guidance. No middlemen. No charges._`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-[12px] border border-[var(--border)] p-6 shadow-[var(--shadow-low)] space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-bold text-[var(--text-primary)] font-display uppercase tracking-wider text-xs">
          {t('whatsapp_checklist_header')} {serviceName}
        </h3>
      </div>

      <div className="space-y-1">
        {documents.map((doc, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="w-full flex items-start gap-3 p-3 rounded-[8px] hover:bg-[var(--surface-3)] transition-all text-left font-medium active:scale-[0.99]"
          >
            <div className={`mt-0.5 w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 border-[1.5px] transition-all ${checked[i]
                ? 'bg-[var(--success)] border-[var(--success)] text-white'
                : 'bg-white border-[var(--border)] text-transparent'
              }`}>
              <Check size={14} strokeWidth={3} />
            </div>
            <span className={`text-[14px] leading-snug transition-all ${checked[i] ? 'text-[var(--text-tertiary)] line-through opacity-60' : 'text-[var(--text-primary)] font-bold'}`}>
              {doc}
            </span>
          </button>
        ))}
      </div>

      <div className="pt-2">
        <button
          onClick={handleWhatsAppShare}
          className="w-full bg-[#25D366] text-white h-[56px] rounded-[8px] font-bold text-sm tracking-wide flex items-center justify-center gap-3 hover:bg-[#128C7E] transition-all shadow-[var(--shadow-mid)] active:scale-[0.98]"
        >
          <WhatsAppIcon />
          <span>{isHindi ? 'WhatsApp पर चेकलिस्ट भेजें' : 'Share Checklist via WhatsApp'}</span>
        </button>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.301-.15-1.767-.872-2.04-.971-.272-.1-.47-.15-.667.15-.198.3-.763.971-.935 1.171-.172.199-.344.225-.645.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.499-1.784-1.675-2.083-.176-.3-.019-.462.13-.611.135-.134.301-.35.451-.525.151-.176.2-.301.301-.5.1-.199.05-.375-.025-.525-.075-.15-.667-1.611-.913-2.203-.239-.575-.483-.497-.667-.506-.172-.008-.369-.011-.566-.011-.197 0-.518.074-.789.373-.271.299-1.034 1.01-1.034 2.463 0 1.453 1.059 2.859 1.206 3.058.147.2 2.086 3.187 5.053 4.47.706.305 1.258.487 1.687.625.709.225 1.355.193 1.865.117.568-.085 1.767-.722 2.016-1.42.25-.698.25-1.295.175-1.42-.075-.125-.272-.199-.573-.349zM12 21.65c-1.583 0-3.132-.423-4.492-1.226l-.322-.19-3.337.875.89-3.253-.208-.331C3.73 16.143 3.085 14.108 3.085 12c0-4.915 4.001-8.915 8.915-8.915 2.381 0 4.621.927 6.307 2.613 1.686 1.686 2.613 3.926 2.613 6.302 0 4.916-4.001 8.915-8.915 8.915zM12 2.1c-5.462 0-9.9 4.438-9.9 9.9 0 1.744.456 3.447 1.321 4.956l-1.405 5.141 5.259-1.38c1.464.798 3.109 1.218 4.784 1.218 5.462 0 9.9-4.438 9.9-9.9C21.9 6.538 17.462 2.1 12 2.1z" />
    </svg>
  );
}
