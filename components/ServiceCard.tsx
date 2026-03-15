'use client';

import Link from 'next/link';
import { LucideIcon, Container, Fingerprint, CreditCard } from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  container: Container,
  fingerprint: Fingerprint,
  'credit-card': CreditCard,
};

const serviceColors: Record<string, string> = {
  'ration_card': '#E07B00',
  'aadhaar_update': '#1B4FA8',
  'pan_card': '#138808',
};

interface ServiceCardProps {
  id: string;
  slug: string;
  name_en: string;
  name_hi: string;
  description: string;
  iconName: string;
  avgTime?: string;
}

import { useTranslation } from 'react-i18next';

export default function ServiceCard({ id, slug, name_en, name_hi, description, iconName, avgTime }: ServiceCardProps) {
  const { t, i18n } = useTranslation();
  const Icon = icons[iconName] || Container;
  const accentColor = serviceColors[slug] || '#1B4FA8';
  const isHindi = i18n.language === 'hi';

  return (
    <Link
      href={`/chat?service=${slug}`}
      className="group bg-white rounded-[12px] border border-[#E2E8F0] shadow-sm hover:shadow-[0_8px_24px_rgba(27,79,168,0.10)] hover:-translate-y-[3px] transition-all duration-200 overflow-hidden flex flex-col md:flex-row items-start relative"
      style={{ borderLeft: `4px solid ${accentColor}` }}
    >
      <div className="p-5 md:p-6 flex gap-5 w-full">
        <div className="shrink-0 mt-1" style={{ color: accentColor }}>
          <Icon size={32} strokeWidth={2} />
        </div>

        <div className="space-y-3 flex-1">
          <div>
            <h3 className="text-[17px] font-bold text-[#1A1A2E] leading-tight mb-1">
              {isHindi ? name_hi : name_en}
            </h3>
            <p className="text-[#4A5568] text-[14px] leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-[12px] font-medium text-[#4A5568] opacity-70 flex items-center gap-1">
              ⏱ ~{avgTime || '30'} {t('days')}
            </span>
            <span
              className="text-[13px] font-semibold flex items-center gap-1 transition-all group-hover:gap-2"
              style={{ color: accentColor }}
            >
              {isHindi ? 'देखें' : 'View'} <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
