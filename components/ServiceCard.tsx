'use client';

import Link from 'next/link';
import { LucideIcon, ShoppingBag, Fingerprint, CreditCard, Car, Landmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const icons: Record<string, LucideIcon> = {
  'ration_card': ShoppingBag,
  'aadhaar_update': Fingerprint,
  'pan_card': CreditCard,
  'driving_license': Car,
  'govt_schemes': Landmark,
};

interface ServiceCardProps {
  id: string;
  slug: string;
  name_en: string;
  name_hi: string;
  description: string;
  iconName: string;
  query: string;
}

export default function ServiceCard({ slug, name_en, name_hi, description, query }: ServiceCardProps) {
  const { i18n } = useTranslation();
  const Icon = icons[slug] || Landmark;
  const isHindi = i18n.language === 'hi';

  return (
    <Link
      href={`/ask?q=${encodeURIComponent(query)}`}
      className="card-service flex flex-col items-start group relative"
    >
      {/* Icon Box */}
      <div className="w-[36px] h-[36px] bg-[var(--primary)] bg-opacity-[0.08] rounded-[8px] flex items-center justify-center shrink-0">
        <Icon className="text-[var(--primary)]" size={20} />
      </div>

      <div className="mt-4 flex-1">
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--text-primary)] leading-tight">
          {isHindi ? name_hi : name_en}
        </h3>
        <p className="text-[var(--text-sm)] text-[var(--text-secondary)] mt-1.5 line-clamp-2 font-body font-normal">
          {description}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-1 text-[var(--text-sm)] font-medium text-[var(--accent)] group-hover:gap-2 transition-all">
        {isHindi ? 'गाइड देखें' : 'View Guide'} <span>→</span>
      </div>
    </Link>
  );
}
