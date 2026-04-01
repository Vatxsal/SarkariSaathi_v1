'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const services = [
    { name: isHindi ? 'राशन कार्ड' : 'Ration Card', query: 'Ration+card+ke+liye+kaise+apply+karein' },
    { name: isHindi ? 'आधार अपडेट' : 'Aadhaar Update', query: 'Aadhaar+mein+address+update+karna+hai' },
    { name: isHindi ? 'पैन कार्ड' : 'PAN Card', query: 'Naya+PAN+card+kaise+banaye' },
    { name: isHindi ? 'ड्राइविंग लाइसेंस' : 'Driving License', query: 'Driving+license+kaise+banaye' },
    { name: isHindi ? 'सरकारी योजनाएं' : 'Government Schemes', query: 'Kaun+si+sarkari+yojana+mere+liye+hai' },
  ];

  return (
    <footer className="bg-[#0F1923] text-white/55 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Column 1 — Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group mb-2">
              <Image 
                src="/sarkari-saathi-logo.png"
                alt="Sarkari Saathi Logo"
                width={80}
                height={80}
                className="w-14 h-14 md:w-16 md:h-16 object-contain scale-110"
              />
              <span className="text-xl font-bold text-white tracking-tight font-display">
                सरकारी साथी
              </span>
            </Link>
            <p className="text-[13px] leading-relaxed max-w-xs">
              {isHindi 
                ? 'आधिकारिक सरकारी गाइडेंस, सभी भारतीयों के लिए मुफ्त।' 
                : 'Official government guidance, free for all Indians.'}
            </p>
            <p className="text-[11px] font-medium opacity-60">
              {isHindi 
                ? 'किसी भी सरकारी निकाय से संबद्ध नहीं है।' 
                : 'Not affiliated with any government body.'}
            </p>
          </div>

          {/* Column 2 — Services */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider">
              {isHindi ? 'सेवाएँ' : 'Services'}
            </h4>
            <ul className="flex flex-col gap-2">
              {services.map((service, idx) => (
                <li key={idx}>
                  <Link 
                    href={`/ask?q=${service.query}`} 
                    className="text-[13px] hover:text-white transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Support */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider">
              {isHindi ? 'सहायता' : 'Support'}
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/csc-locator" className="text-[13px] hover:text-white transition-colors">
                  {isHindi ? 'CSC लोकेटर' : 'CSC Locator'}
                </Link>
              </li>
              <li>
                <Link href="/reminders" className="text-[13px] hover:text-white transition-colors">
                  {isHindi ? 'रिमाइंडर' : 'Reminders'}
                </Link>
              </li>
              <li>
                <Link href="/ask" className="text-[13px] hover:text-white transition-colors">
                  {isHindi ? 'एक सवाल पूछें' : 'Ask a Question'}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-medium">
            © 2026 Sarkari Saathi. {isHindi ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4 text-[11px] font-medium">
            <Link href="/privacy" className="hover:text-white transition-colors">
              {isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}
            </Link>
            <span className="opacity-20">·</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              {isHindi ? 'उपयोग की शर्तें' : 'Terms of Use'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
