'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  return (
    <footer className="bg-[#0F3380] text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏛️</span>
              <h3 className="text-white font-semibold text-lg">SarkariSaathi</h3>
            </div>
            <p className="text-[#DBEAFE] text-sm leading-relaxed">
              {isHindi 
                ? 'सरकारी सेवाओं के लिए स्पष्ट, सुलभ मार्गदर्शन के साथ भारतीय नागरिकों को सशक्त बनाना। हम आपको बिना बिचौलियों के नौकरशाही नेविगेट करने में मदद करते हैं।' 
                : 'Empowering Indian citizens with clear, accessible guidance for government services. We help you navigate bureaucracy without middlemen.'}
            </p>
          </div>
          <div className="flex flex-col md:items-end gap-3">
            <h4 className="text-white font-medium mb-1">{isHindi ? 'त्वरित लिंक' : 'Quick Links'}</h4>
            <Link href="/reminders" className="text-sm text-[#DBEAFE] hover:text-white hover:underline transition-all">
              {t('reminders')}
            </Link>
            <Link href="/chat" className="text-sm text-[#DBEAFE] hover:text-white hover:underline transition-all">
              {t('ask_button')}
            </Link>
            <a href="mailto:report@sarkarisaathi.in" className="text-sm text-[#FFF3E0] font-medium hover:underline transition-all">
              {t('report_outdated')}
            </a>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-[#DBEAFE] text-[13px] leading-relaxed max-w-3xl mx-auto italic">
            {isHindi 
              ? 'भारत सरकार से संबद्ध नहीं है। जानकारी शैक्षिक उद्देश्यों के लिए आधिकारिक पोर्टलों से प्राप्त की गई है।' 
              : 'Not affiliated with the Government of India. Information is sourced from official portals for educational purposes.'}
            <br />
            <span className="mt-2 block font-normal opacity-80">
              © 2026 SarkariSaathi — {isHindi ? 'विश्वसनीय नागरिक मार्गदर्शक' : 'Trusted Civic Guide'}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
