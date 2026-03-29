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
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Landmark
} from 'lucide-react';
import Link from 'next/link';

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

        if (exactData) {
          setGuideData(exactData);
          setIsFallback(false);
        } else {
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
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--primary)] border-t-transparent"></div>
    </div>
  );

  if (!guideData) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
      <AlertCircle size={48} className="mx-auto text-[var(--text-tertiary)]" />
      <h2 className="text-2xl font-bold font-display">Guide Not Found</h2>
      <p className="text-[var(--text-secondary)]">We don't have this specific guide in our database yet. Try searching for another service.</p>
      <Link href="/" className="bg-[var(--primary)] text-white px-8 py-3 rounded-[8px] mt-4 inline-block font-bold">Go Home</Link>
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
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
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
    <div className="bg-[var(--surface-2)] min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold mb-6 hover:text-[var(--accent)] transition-colors text-sm">
            <ArrowLeft size={16} /> {t('back_button')}
          </Link>

          <div className="bg-white p-6 md:p-8 rounded-[12px] border border-[var(--border)] shadow-[var(--shadow-low)] animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-[var(--primary)]/[0.08] text-[var(--primary)] text-[11px] font-bold px-3 py-1 rounded-[4px] uppercase tracking-widest">{guideData.state}</span>
                  <span className="bg-[var(--accent)]/[0.08] text-[var(--accent)] text-[11px] font-bold px-3 py-1 rounded-[4px] uppercase tracking-widest">{serviceName}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] leading-tight font-display">
                  {subcaseName}
                </h1>
                <p className="text-[var(--text-tertiary)] flex items-center gap-2 text-xs font-medium">
                  <Clock size={14} /> {t('last_verified')}: {guideData.last_verified_date}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="bg-[var(--surface-3)] p-4 rounded-[8px] border border-[var(--border)] flex items-center gap-3 min-w-[160px]">
                  <Wallet className="text-[var(--primary)]" size={20} />
                  <div>
                    <p className="text-[10px] text-[var(--text-tertiary)] uppercase font-bold tracking-wider">{t('fee_label')}</p>
                    <p className="text-base font-bold text-[var(--text-primary)]">{fee}</p>
                  </div>
                </div>
                <div className="bg-[var(--surface-3)] p-4 rounded-[8px] border border-[var(--border)] flex items-center gap-3 min-w-[160px]">
                  <Calendar className="text-[var(--success)]" size={20} />
                  <div>
                    <p className="text-[10px] text-[var(--text-tertiary)] uppercase font-bold tracking-wider">{t('timeline_label')}</p>
                    <p className="text-base font-bold text-[var(--text-primary)]">{guideData.timeline_days} {t('days')}</p>
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
            <div className="bg-[var(--surface)] border border-[var(--warning)] border-l-[4px] p-5 rounded-[8px] flex items-start gap-4 shadow-[var(--shadow-low)]">
              <AlertCircle className="text-[var(--warning)] shrink-0 mt-0.5" size={24} />
              <div>
                <p className="text-[var(--text-primary)] font-bold text-sm tracking-wide">{t('fallback_title')}</p>
                <p className="text-[14px] text-[var(--text-secondary)] mt-1 leading-relaxed font-medium">
                  {t('fallback_desc_1')} <strong>{decodeURIComponent(params.state)}</strong> {t('fallback_desc_2')} <strong>{guideData.state}</strong>{isHi ? t('fallback_desc_suffix') : ''}.
                </p>
              </div>
            </div>
          )}

          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-[var(--text-xl)] font-bold text-[var(--text-primary)] font-display uppercase tracking-wider text-sm">{t('steps_title')}</h2>
              <div className="h-[1px] flex-1 bg-[var(--border)]"></div>
            </div>
            <GuideSteps steps={steps} />
          </section>

          {formFields && formFields.length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-[var(--text-xl)] font-bold text-[var(--text-primary)] font-display uppercase tracking-wider text-sm">{t('form_help_title')}</h2>
                <div className="h-[1px] flex-1 bg-[var(--border)]"></div>
              </div>
              <div className="space-y-2">
                {formFields.map((field: any, i: number) => (
                  <div key={i} className="bg-white rounded-[8px] border border-[var(--border)] overflow-hidden transition-all hover:border-[var(--primary)] shadow-[var(--shadow-low)]">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === field.field ? null : field.field)}
                      className="w-full flex items-center justify-between p-4 px-5 text-left transition-colors"
                    >
                      <span className="font-bold text-[var(--text-primary)] text-[15px]">{field.field}</span>
                      {openAccordion === field.field ? <ChevronUp size={18} className="text-[var(--primary)]" /> : <ChevronDown size={18} className="text-[var(--text-tertiary)]" />}
                    </button>
                    {openAccordion === field.field && (
                      <div className="p-5 pt-1 text-[14px] text-[var(--text-secondary)] border-t border-[var(--surface-2)] animate-fade-in leading-relaxed bg-[var(--surface-3)]/30">
                        {field.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CSC Centre Support */}
          <div className="bg-[var(--primary)] p-8 rounded-[12px] text-white shadow-[var(--shadow-mid)] overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-10 -mr-10 -mt-10">
                <Landmark size={240} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row gap-6">
                <div className="w-14 h-14 bg-white/10 rounded-[12px] flex items-center justify-center shrink-0 border border-white/10">
                    <MapPin size={28} />
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg font-display">{t('csc_help_title')}</h3>
                        <p className="text-white/80 text-sm leading-relaxed max-w-xl">
                            {t('csc_help_desc')}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                        <button
                            onClick={() => window.open(`https://www.google.com/maps/search/Jan+Seva+Kendra+CSC+near+me+${guideData.state}`, '_blank')}
                            className="bg-[var(--accent)] text-white px-6 py-3 rounded-[8px] font-bold text-sm shadow-lg hover:bg-[var(--accent-hover)] transition-all"
                        >
                            {t('find_csc_near_me')}
                        </button>
                        <a href="https://locator.csccloud.in/" target="_blank" className="text-white/60 text-xs font-bold hover:text-white uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                            {t('official_csc_locator')} <ExternalLink size={12} />
                        </a>
                    </div>
                </div>
            </div>
          </div>

          <FAQSection serviceSlug={params.service} />

          {/* Warning Card */}
          <div className="bg-white border border-[var(--border)] p-6 rounded-[12px] shadow-[var(--shadow-low)]">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-[var(--warning)]/[0.08] text-[var(--warning)] rounded-[8px] flex items-center justify-center shrink-0">
                  <AlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-[var(--text-primary)] text-base">{t('fee_info_title')}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
                  {t('fee_info_note')} <span className="text-[var(--text-primary)] font-bold">{fee}</span>. {t('fee_info_warning')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
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

          <div className="bg-white rounded-[12px] border border-[var(--border)] p-6 shadow-[var(--shadow-low)] space-y-6">
            <h3 className="text-[var(--text-lg)] font-bold text-[var(--text-primary)] font-display uppercase tracking-wider text-xs">{t('where_to_visit')}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[var(--primary)]/[0.08] rounded-[8px] flex items-center justify-center text-[var(--primary)] shrink-0">
                  <MapPin size={20} />
                </div>
                <p className="text-sm text-[var(--text-primary)] leading-relaxed font-bold mt-1">
                  {guideData.office_name}
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => findNearestOffice(guideData.office_name, guideData.state)}
                    className="w-full flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--text-primary)] py-3 rounded-[8px] font-bold text-xs uppercase tracking-widest hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all bg-[var(--surface-2)]"
                  >
                    {t('find_nearest_office')}
                  </button>

                  {params.service === 'aadhaar_update' && (
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/search/Aadhaar+Seva+Kendra+near+me+${guideData.state}`, '_blank')}
                      className="w-full flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--text-primary)] py-3 rounded-[8px] font-bold text-xs uppercase tracking-widest hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all bg-[var(--surface-2)]"
                    >
                      {t('find_aadhaar_kendra')}
                    </button>
                  )}

                  {params.service === 'pan_card' && (
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/search/NSDL+PAN+centre+near+me+${guideData.state}`, '_blank')}
                      className="w-full flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--text-primary)] py-3 rounded-[8px] font-bold text-xs uppercase tracking-widest hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all bg-[var(--surface-2)]"
                    >
                      {t('find_pan_centre')}
                    </button>
                  )}
              </div>
            </div>

            <div className="h-[1px] bg-[var(--border)] w-full"></div>

            <div className="space-y-3">
              {guideData.portal_url && (
                <a
                  href={guideData.portal_url}
                  target="_blank"
                  className="w-full bg-[var(--primary)] py-4 text-white rounded-[8px] font-bold text-sm flex items-center justify-center gap-3 transition-all hover:bg-[var(--primary-hover)] shadow-[var(--shadow-mid)]"
                >
                  {t('view_portal')} <ExternalLink size={18} />
                </a>
              )}

              <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-[var(--text-tertiary)] hover:text-[var(--primary)] uppercase tracking-widest transition-colors py-2">
                <Share2 size={14} /> {t('share_guide_label')}
              </button>
            </div>
          </div>

          <ReminderTracker serviceName={`${serviceName} - ${subcaseName}`} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="bg-[var(--surface-3)] border border-[var(--border)] p-5 rounded-[12px] flex items-center justify-center gap-3">
             <ShieldCheck size={18} className="text-[var(--success)]" />
             <span className="text-[var(--text-xs)] font-bold text-[var(--text-secondary)] uppercase tracking-[2px]">Trust-First Government Data Verification</span>
          </div>
      </div>
    </div>
  );
}
