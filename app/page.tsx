'use client';

import { useTranslation } from 'react-i18next';
import ServiceCard from '@/components/ServiceCard';
import { Search } from 'lucide-react';
import Link from 'next/link';
import '@/lib/i18n';

export default function Home() {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const services = [
    {
      id: '1',
      slug: 'ration_card',
      name_en: 'Ration Card',
      name_hi: 'राशन कार्ड',
      description_en: 'Apply for new ration card, corrections, or report lost card.',
      description_hi: 'नया कार्ड बनवाना है, सुधार करना है या खोया कार्ड?',
      icon_name: 'container',
      avg_time: '30'
    },
    {
      id: '2',
      slug: 'aadhaar_update',
      name_en: 'Aadhaar Update',
      name_hi: 'आधार अपडेट',
      description_en: 'Correct name, date of birth, address, or update mobile number.',
      description_hi: 'पता, नाम, मोबाइल नंबर या जन्म तिथि अपडेट करें',
      icon_name: 'fingerprint',
      avg_time: '15'
    },
    {
      id: '3',
      slug: 'pan_card',
      name_en: 'PAN Card',
      name_hi: 'पैन कार्ड',
      description_en: 'New PAN card application, corrections, or reprinting.',
      description_hi: 'नया पैन बनवाएं, खोया पैन पाएं, या गलती सुधारें',
      icon_name: 'credit-card',
      avg_time: '10'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative bg-[linear-gradient(135deg,#0F3380_0%,#1B4FA8_100%)] pt-16 pb-24 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
            <span>🇮🇳 {t('hero_badge')}</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-[38px] md:text-[48px] font-bold text-white leading-[1.3] font-devanagari">
              {t('hero_title')}
            </h1>
            <p className="text-[16px] md:text-[18px] text-[#DBEAFE] max-w-2xl mx-auto font-normal leading-[1.6]">
              {t('tagline')}
            </p>
          </div>

          <div className="max-w-[600px] mx-auto">
            <Link
              href="/chat"
              className="flex items-center bg-white rounded-[10px] shadow-2xl transition-all h-[54px] overflow-hidden focus-glow"
            >
              <div className="pl-5 pr-3">
                <Search size={20} className="text-[#4A5568]" />
              </div>
              <span className="flex-1 text-left text-[#4A5568] text-[15px] opacity-70 truncate">
                {t('search_placeholder')}
              </span>
              <div className="bg-[#E07B00] text-white h-full px-8 flex items-center justify-center font-bold text-[16px] active:scale-[0.98] transition-transform">
                {t('ask_button')}
              </div>
            </Link>

            <div className="mt-8 flex flex-col items-center gap-4">
              <span className="text-[#DBEAFE] text-[13px] font-medium">{t('or_choose_directly')}</span>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label_hi: "🌾 राशन कार्ड", label_en: "🌾 Ration Card", slug: "ration_card" },
                  { label_hi: "🪪 आधार अपडेट", label_en: "🪪 Aadhaar Update", slug: "aadhaar_update" },
                  { label_hi: "🪙 पैन कार्ड", label_en: "🪙 PAN Card", slug: "pan_card" }
                ].map((btn) => (
                  <Link
                    key={btn.slug}
                    href={`/chat?service=${btn.slug}`}
                    className="bg-white text-[#1B4FA8] px-5 py-2.5 rounded-full text-[14px] font-bold border border-white/30 hover:scale-[1.03] transition-all shadow-sm"
                  >
                    {isHindi ? btn.label_hi : btn.label_en}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]" style={{ lineHeight: 0, border: 'none' }}>
          <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ display: 'block', marginBottom: '-2px' }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.43,147.3,126,211,110.13,254.35,103.24,282.77,75.44,321.39,56.44Z" fill="#F7F8FA"></path>
          </svg>
        </div>
      </section>

      <div style={{ padding: '32px 24px 0 24px', marginTop: 0, border: 'none' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: '800px', margin: '0 auto' }} className="promise-grid">
          {[
            {
              emoji: '🆓',
              title: isHindi ? 'हमेशा मुफ्त' : 'Always free',
              desc: isHindi ? 'कोई शुल्क नहीं। कोई दलाल नहीं।' : 'No charges. No middlemen. Ever.',
            },
            {
              emoji: '🏛️',
              title: isHindi ? 'सिर्फ सरकारी जानकारी' : 'Official sources only',
              desc: isHindi ? 'हर गाइड सरकारी पोर्टल से सत्यापित।' : 'Every guide verified from govt portals.',
            },
            {
              emoji: '🤝',
              title: isHindi ? 'आपकी भाषा में' : 'In your language',
              desc: isHindi ? 'हिंदी या अंग्रेजी — जो आप चाहें।' : 'Hindi or English — whichever you prefer.',
            },
          ].map((p, i) => (
            <div
              key={i}
              className="promise-col"
              style={{ textAlign: 'center', padding: '0 40px' }}
            >
              <span style={{ fontSize: '28px', display: 'block', marginBottom: '10px' }}>{p.emoji}</span>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A2E', marginBottom: '4px' }}>{p.title}</p>
              <p style={{ fontSize: '13px', fontWeight: 400, color: '#4A5568', lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full py-16 space-y-24 pb-32">
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <h2 className="text-[20px] font-bold text-[#1A1A2E] whitespace-nowrap">{t('popular_services')}</h2>
            <div className="h-[1px] flex-1 bg-[#E2E8F0]"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <ServiceCard
                key={s.id}
                id={s.id}
                slug={s.slug}
                name_en={s.name_en}
                name_hi={s.name_hi}
                description={isHindi ? s.description_hi : s.description_en}
                iconName={s.icon_name}
                avgTime={s.avg_time}
              />
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <h2 className="text-[20px] font-bold text-[#1A1A2E] whitespace-nowrap">{t('how_it_works')}</h2>
            <div className="h-[1px] flex-1 bg-[#E2E8F0]"></div>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-[18px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-[#DBEAFE]"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {[
                {
                  num: "1",
                  title: t('how_step_1_title'),
                  desc: t('how_step_1_desc')
                },
                {
                  num: "2",
                  title: t('how_step_2_title'),
                  desc: t('how_step_2_desc')
                },
                {
                  num: "3",
                  title: t('how_step_3_title'),
                  desc: t('how_step_3_desc')
                }
              ].map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center space-y-4">
                  <div className="w-9 h-9 rounded-full bg-[#1B4FA8] text-white flex items-center justify-center font-bold text-base z-10 shadow-sm">
                    {step.num}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[17px] font-bold text-[#1A1A2E]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-[#4A5568] text-[13px] leading-relaxed max-w-[200px]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
