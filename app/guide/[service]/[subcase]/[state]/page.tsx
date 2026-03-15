'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import GuideSteps from '@/components/GuideSteps';
import DocumentChecklist from '@/components/DocumentChecklist';
import ReminderTracker from '@/components/ReminderTracker';
import FAQSection from '@/components/FAQSection';
import {
  ExternalLink,
  MapPin,
  Wallet,
  Calendar,
  Clock,
  Share2,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function GuidePage({ params }: { params: { service: string, subcase: string, state: string } }) {
  const { t, i18n } = useTranslation();
  const [guideData, setGuideData] = useState<any>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGuide() {
      try {
        const decodedState = decodeURIComponent(params.state);

        console.log('=== GUIDE PAGE DEBUG ===');
        console.log('URL params:', { service: params.service, subcase: params.subcase, state: decodedState });
        console.log('Supabase query being run:', {
          subcase_slug: params.subcase,
          service_slug: params.service,
          state: decodedState
        });

        // FIXED QUERY: filters by ALL THREE — service slug, subcase slug, AND state.
        // Without the service slug filter, 'correction' matched both ration_card
        // and pan_card and returned ration_card (inserted first in DB).
        const { data: exactData, error: exactError } = await supabase
          .from('guides')
          .select(`
            *,
            subcase:subcases!inner(
              slug,
              name_en,
              name_hi,
              service:services!inner(slug, name_en, name_hi)
            )
          `)
          .eq('state', decodedState)
          .eq('subcase.slug', params.subcase)
          .eq('subcase.service.slug', params.service)
          .maybeSingle();

        console.log('Raw Supabase response (exact):', exactData);
        console.log('subcase.slug returned:', exactData?.subcase?.slug);
        console.log('Service from join:', exactData?.subcase?.service?.slug);
        if (exactError) console.error('Supabase exact query error:', exactError);

        // Safety check: reject data if the service slug doesn't match URL
        const serviceFromGuide = exactData?.subcase?.service?.slug;
        if (exactData && serviceFromGuide && serviceFromGuide !== params.service) {
          console.error(
            'SERVICE MISMATCH — URL says:', params.service,
            'but guide data is for:', serviceFromGuide,
            '— discarding result'
          );
          setGuideData(null);
          setIsFallback(false);
          setLoading(false);
          return;
        }

        if (exactData) {
          setGuideData(exactData);
          setIsFallback(false);
        } else {
          // Fallback: same service + same subcase, any state
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('guides')
            .select(`
              *,
              subcase:subcases!inner(
                slug,
                name_en,
                name_hi,
                service:services!inner(slug, name_en, name_hi)
              )
            `)
            .eq('subcase.slug', params.subcase)
            .eq('subcase.service.slug', params.service)
            .limit(1)
            .maybeSingle();

          console.log('Raw Supabase response (fallback):', fallbackData);
          if (fallbackError) console.error('Supabase fallback query error:', fallbackError);

          if (fallbackData) {
            setGuideData(fallbackData);
            setIsFallback(true);
          }
        }
      } catch (err) {
        console.error('Error fetching guide:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGuide();
  }, [params]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B4FA8]"></div>
    </div>
  );

  if (!guideData) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
      <AlertCircle size={48} className="mx-auto text-[#4A5568]" />
      <h2 className="text-2xl font-bold">Guide Not Found</h2>
      <p className="text-[#4A5568]">We don't have this specific guide in our database yet. Try searching for another service.</p>
      <Link href="/" className="btn-primary px-8 py-2 mt-4 inline-block">Go Home</Link>
    </div>
  );

  const isHi = i18n.language === 'hi';
  const serviceName = isHi ? guideData.subcase.service.name_hi : guideData.subcase.service.name_en;
  const subcaseName = isHi ? guideData.subcase.name_hi : guideData.subcase.name_en;
  const documents = isHi ? guideData.documents_hi : guideData.documents_en;
  const steps = isHi ? guideData.steps_hi : guideData.steps_en;
  const fee = isHi ? guideData.fee_hi : guideData.fee_en;
  const formFields = isHi ? guideData.form_fields_hi : guideData.form_fields_en;

  const handleShare = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const shareUrl = `${baseUrl}/guide/${params.service}/${params.subcase}/${encodeURIComponent(guideData.state)}`;

    if (navigator.share) {
      navigator.share({
        title: `Guide for ${serviceName} in ${guideData.state}`,
        url: shareUrl,
      });
    }
  };

  const findNearestOffice = (officeName: string, state: string) => {
    const query = encodeURIComponent(`${officeName} near me ${state}`);
    const mapsUrl = `https://www.google.com/maps/search/${query}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="bg-[#F7F8FA] min-h-screen">
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#1B4FA8] font-medium mb-6 hover:underline transition-all">
            <ArrowLeft size={16} /> {t('back_button')}
          </Link>

          <div className="bg-white p-6 md:p-10 rounded-[12px] border border-[#E2E8F0] border-l-[6px] border-l-[#1B4FA8] shadow-sm animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-[#E8F0FD] text-[#1B4FA8] text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{guideData.state}</span>
                  <span className="bg-[#E8F5E9] text-[#138808] text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{serviceName}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] leading-tight">
                  {subcaseName}
                </h1>
                <p className="text-[#4A5568] flex items-center gap-2 text-sm italic">
                  <Clock size={14} /> {t('last_verified')}: {guideData.last_verified_date}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="bg-[#F7F8FA] p-4 rounded-xl border border-[#E2E8F0] flex items-center gap-3 min-w-[140px]">
                  <Wallet className="text-[#1B4FA8]" size={20} />
                  <div>
                    <p className="text-[11px] text-[#4A5568] uppercase font-bold">{t('fee_label')}</p>
                    <p className="text-base font-bold text-[#1A1A2E]">{fee}</p>
                  </div>
                </div>
                <div className="bg-[#F7F8FA] p-4 rounded-xl border border-[#E2E8F0] flex items-center gap-3 min-w-[140px]">
                  <Calendar className="text-[#138808]" size={20} />
                  <div>
                    <p className="text-[11px] text-[#4A5568] uppercase font-bold">{t('timeline_label')}</p>
                    <p className="text-base font-bold text-[#1A1A2E]">{guideData.timeline_days} {t('days')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          {isFallback && (
            <div className="bg-[#FFF3E0] border-l-4 border-[#E07B00] p-5 rounded-r-xl flex items-start gap-4">
              <AlertCircle className="text-[#E07B00] shrink-0 mt-0.5" size={24} />
              <div>
                <p className="text-[#8a4a00] font-bold text-[16px]">{t('fallback_title')}</p>
                <p className="text-[14px] text-[#8a4a00] opacity-90 leading-relaxed">
                  {t('fallback_desc_1')} <strong>{decodeURIComponent(params.state)}</strong> {t('fallback_desc_2')} <strong>{guideData.state}</strong>{t('language') === 'हिन्दी' ? t('fallback_desc_suffix') : ''}.
                </p>
              </div>
            </div>
          )}

          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-[20px] font-semibold text-[#1A1A2E]">{t('steps_title')}</h2>
              <div className="h-[1px] flex-1 bg-[#E2E8F0]"></div>
            </div>
            <GuideSteps steps={steps} />
          </section>

          {formFields && formFields.length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-[20px] font-semibold text-[#1A1A2E]">{t('form_help_title')}</h2>
                <div className="h-[1px] flex-1 bg-[#E2E8F0]"></div>
              </div>
              <div className="space-y-3">
                {formFields.map((field: any, i: number) => (
                  <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === field.field ? null : field.field)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F7F8FA] transition-colors"
                    >
                      <span className="font-semibold text-[#1A1A2E]">{field.field}</span>
                      {openAccordion === field.field ? <ChevronUp size={20} className="text-[#1B4FA8]" /> : <ChevronDown size={20} className="text-[#1B4FA8]" />}
                    </button>
                    {openAccordion === field.field && (
                      <div className="p-5 pt-0 text-[15px] text-[#4A5568] border-t border-[#F7F8FA] animate-fade-in leading-relaxed">
                        {field.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="bg-[#FFF3E0] border-l-4 border-[#E07B00] p-6 rounded-xl space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#E07B00] shrink-0 shadow-sm font-bold text-xl">📍</div>
              <div className="space-y-2">
                <h3 className="font-bold text-[#8a4a00] text-[17px]">{t('csc_help_title')}</h3>
                <p className="text-[#8a4a00] text-[15px] leading-relaxed">
                  {t('csc_help_desc')}
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button
                    onClick={() => window.open(`https://www.google.com/maps/search/Jan+Seva+Kendra+CSC+near+me+${guideData.state}`, '_blank')}
                    className="bg-[#E07B00] text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md hover:bg-[#c66c00] transition-all"
                  >
                    {t('find_csc_near_me')}
                  </button>
                  <a href="https://locator.csccloud.in/" target="_blank" className="text-[#8a4a00] text-sm font-semibold hover:underline">
                    {t('official_csc_locator')}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <FAQSection serviceSlug={params.service} />

          <div className="bg-[#FFF3E0] border-l-4 border-[#E07B00] p-6 rounded-xl">
            <div className="flex gap-4">
              <Wallet className="text-[#E07B00] shrink-0" size={24} />
              <div className="space-y-2">
                <h3 className="font-bold text-[#8a4a00] text-[17px]">{t('fee_info_title')}</h3>
                <p className="text-[#8a4a00] text-[15px] leading-relaxed">
                  {t('fee_info_note')} {fee}. {t('fee_info_warning')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <DocumentChecklist
            documents={documents}
            serviceName={serviceName}
            subcaseName={subcaseName}
            serviceSlug={params.service}
            subcaseSlug={params.subcase}
            state={guideData.state}
            fee_en={guideData.fee_en}
            fee_hi={guideData.fee_hi}
            timeline_days={guideData.timeline_days}
          />

          <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-6 shadow-sm space-y-6">
            <h3 className="text-[18px] font-bold text-[#1A1A2E]">{t('where_to_visit')}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#E8F0FD] rounded-lg flex items-center justify-center text-[#1B4FA8] shrink-0">
                  <MapPin size={22} />
                </div>
                <p className="text-[15px] text-[#4A5568] leading-relaxed font-medium">
                  {guideData.office_name}
                </p>
              </div>

              <button
                onClick={() => findNearestOffice(guideData.office_name, guideData.state)}
                className="w-full flex items-center justify-center gap-2 border-[1.5px] border-[#1B4FA8] text-[#1B4FA8] py-2.5 rounded-lg font-bold text-sm hover:bg-[#E8F0FD] transition-all"
              >
                {t('find_nearest_office')}
              </button>

              {params.service === 'aadhaar_update' && (
                <button
                  onClick={() => window.open(`https://www.google.com/maps/search/Aadhaar+Seva+Kendra+near+me+${guideData.state}`, '_blank')}
                  className="w-full flex items-center justify-center gap-2 border-[1.5px] border-[#1B4FA8] text-[#1B4FA8] py-2.5 rounded-lg font-bold text-sm hover:bg-[#E8F0FD] transition-all"
                >
                  {t('find_aadhaar_kendra')}
                </button>
              )}

              {params.service === 'pan_card' && (
                <button
                  onClick={() => window.open(`https://www.google.com/maps/search/NSDL+PAN+centre+near+me+${guideData.state}`, '_blank')}
                  className="w-full flex items-center justify-center gap-2 border-[1.5px] border-[#1B4FA8] text-[#1B4FA8] py-2.5 rounded-lg font-bold text-sm hover:bg-[#E8F0FD] transition-all"
                >
                  {t('find_pan_centre')}
                </button>
              )}
            </div>

            <div className="h-[1px] bg-[#E2E8F0] w-full"></div>

            <div className="space-y-4">
              {guideData.portal_url && (
                <a
                  href={guideData.portal_url}
                  target="_blank"
                  className="btn-primary w-full py-4 text-white hover:shadow-lg flex items-center justify-center gap-3 transition-all"
                >
                  {t('view_portal')} <ExternalLink size={18} />
                </a>
              )}

              <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#1B4FA8] hover:underline py-2">
                <Share2 size={16} /> {t('share_guide_label')}
              </button>
            </div>
          </div>

          <ReminderTracker serviceName={`${serviceName} - ${subcaseName}`} />
        </div>
      </div>
    </div>
  );
}
