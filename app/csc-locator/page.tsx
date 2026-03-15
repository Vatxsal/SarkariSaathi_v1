'use client';

import { useTranslation } from 'react-i18next';
import { MapPin, ExternalLink, Info } from 'lucide-react';

export default function CSCLocator() {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const findCSCNearMe = () => {
    const savedState = localStorage.getItem('selectedState') || '';
    const query = encodeURIComponent(`Jan Seva Kendra CSC near me ${savedState}`);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  return (
    <div className="bg-[#F7F8FA] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#E8F0FD] rounded-full flex items-center justify-center text-[#1B4FA8] mx-auto shadow-sm">
            <MapPin size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[#1A1A2E] leading-tight">
            {t('csc_page_title')}
          </h1>
          <p className="text-[#4A5568] text-[16px] leading-relaxed">
            {t('csc_page_desc')}
          </p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-8 shadow-sm space-y-8">
          <button 
            onClick={findCSCNearMe}
            className="w-full bg-[#1B4FA8] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#0F3380] transition-all shadow-lg active:scale-[0.98]"
          >
            <MapPin size={24} />
            {t('open_google_maps')}
          </button>

          <div className="h-[1px] bg-[#E2E8F0] w-full"></div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
              <Info className="text-[#1B4FA8]" size={22} />
              {t('csc_services_title')}
            </h2>
            <div className="bg-[#F7F8FA] p-6 rounded-xl border border-[#E2E8F0]">
              <p className="text-[#4A5568] leading-relaxed font-medium">
                {t('csc_services_list')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
             <a 
              href="https://locator.csccloud.in/" 
              target="_blank" 
              className="w-full flex items-center justify-center gap-2 text-[#1B4FA8] font-semibold hover:underline border-[1.5px] border-[#1B4FA8] py-4 rounded-xl transition-all"
            >
              {t('official_csc_locator')} <ExternalLink size={18} />
            </a>
          </div>
        </div>

        <div className="bg-[#FFF3E0] border-l-4 border-[#E07B00] p-6 rounded-xl">
           <p className="text-[#8a4a00] text-sm font-medium leading-relaxed italic">
             {t('csc_note')}
           </p>
        </div>
      </div>
    </div>
  );
}
