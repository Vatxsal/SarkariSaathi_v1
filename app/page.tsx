'use client';

import { useTranslation } from 'react-i18next';
import { Search, ShoppingBag, Fingerprint, CreditCard, Car, Landmark, Shield, MapPin, IndianRupee, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import '@/lib/i18n';
import WelcomeDialog from '@/components/WelcomeDialog';
import FeatureTicker from '@/components/FeatureTicker';
import NationalTicker from '@/components/NationalTicker';

export default function Home() {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const services = [
    {
      id: '1',
      slug: 'ration_card',
      name_en: 'Ration Card',
      name_hi: 'राशन कार्ड',
      description_en: 'Apply for new ration card, corrections, or report lost card.',
      description_hi: 'नया कार्ड बनवाना है, सुधार करना है या खोया कार्ड?',
      icon_name: 'shopping-bag',
      query: "Ration card ke liye kaise apply karein?"
    },
    {
      id: '2',
      slug: 'aadhaar_update',
      name_en: 'Aadhaar Update',
      name_hi: 'आधार अपडेट',
      description_en: 'Correct name, date of birth, address, or update mobile number.',
      description_hi: 'पता, नाम, मोबाइल नंबर या जन्म तिथि अपडेट करें',
      icon_name: 'fingerprint',
      query: "Aadhaar mein address update karna hai"
    },
    {
      id: '3',
      slug: 'pan_card',
      name_en: 'PAN Card',
      name_hi: 'पैन कार्ड',
      description_en: 'New PAN card application, corrections, or reprinting.',
      description_hi: 'नया पैन बनवाएं, खोया पैन पाएं, या गलती सुधारें',
      icon_name: 'credit-card',
      query: "Naya PAN card kaise banaye?"
    },
    {
      id: '4',
      slug: 'driving_license',
      name_en: 'Driving License',
      name_hi: 'ड्राइविंग लाइसेंस',
      description_en: 'Apply for learner license, permanent DL, or renewal.',
      description_hi: 'लर्नर लाइसेंस, स्थायी DL या नवीनीकरण के लिए आवेदन करें',
      icon_name: 'car',
      query: "Driving license kaise banaye?"
    },
    {
      id: '5',
      slug: 'govt_schemes',
      name_en: 'Government Schemes',
      name_hi: 'सरकारी योजनाएं',
      description_en: '10 Schemes including PM Kisan, Ayushman Bharat, Ujjwala, and more.',
      description_hi: '10 योजनाएं जैसे PM किसान, आयुष्मान भारत, उज्ज्वला, और बहुत कुछ।',
      icon_name: 'landmark',
      query: "Kaun si sarkari yojana mere liye hai?"
    }
  ];

  const schemes = [
    { name: "PM Kisan", benefit: "₹6,000/year direct to farmers", query: "PM Kisan mein registration kaise karein?" },
    { name: "Ayushman Bharat", benefit: "₹5 lakh free health cover", query: "Ayushman Bharat card kaise banaye?" },
    { name: "PM Ujjwala", benefit: "Free LPG gas connection", query: "PM Ujjwala yojana mein LPG kaise milega?" },
    { name: "PM Vishwakarma", benefit: "₹3L loan @ 5% for artisans", query: "PM Vishwakarma yojana ke liye kaise apply karein?" },
    { name: "PM Awas Yojana", benefit: "Housing subsidy for EWS/LIG", query: "PM Awas Yojana ke liye kaun eligible hai?" },
    { name: "Jan Dhan", benefit: "Zero balance bank account", query: "Jan Dhan account kaise kholein?" },
    { name: "PMJJBY", benefit: "₹2L life cover @ ₹436/year", query: "Jeevan Jyoti Bima Yojana kaise lein?" },
    { name: "PMSBY", benefit: "₹2L accident cover @ ₹20/year", query: "PM Suraksha Bima Yojana mein kaise join karein?" },
  ];

  return (
    <div className="flex flex-col min-h-screen font-body">
      <WelcomeDialog />

      {/* SECTION 2 — HERO */}
      <section className="bg-[linear-gradient(180deg,#1B3A6B_0%,#1a3560_100%)] pt-[80px] pb-[64px] md:pt-[80px] md:pb-[64px] px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-8 animate-fade-in">
          {/* Top Badge */}
          <div className="text-[11px] font-medium text-white/60 tracking-[2px] uppercase">
            FREE • NO MIDDLEMEN • IN YOUR LANGUAGE
          </div>

          {/* Main Heading */}
          <h1 className="text-white text-[30px] md:text-[38px] font-bold font-display leading-[1.2]">
            {isHindi ? "सरकारी काम,\nअब और भी आसान।" : "Government work,\nnow simple."}
          </h1>

          {/* Search Bar */}
          <div className="w-full max-w-2xl bg-white h-[52px] rounded-[8px] flex items-center px-4 shadow-[0_2px_12px_rgba(0,0,0,0.15)] overflow-hidden">
            <Search size={20} className="text-[var(--text-tertiary)] shrink-0" />
            <label htmlFor="main-search" className="sr-only">
              {isHindi ? "सरकारी सेवाओं की खोज करें" : "Search government services"}
            </label>
            <input 
              id="main-search"
              type="text"
              placeholder={isHindi ? "अपनी समस्या यहाँ लिखें..." : "Type your problem here..."}
              className="flex-1 bg-transparent border-none outline-none px-3 text-[var(--text-base)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            />
            <Link 
              href="/ask"
              className="bg-[var(--accent)] text-white h-[36px] px-6 rounded-[6px] text-sm font-semibold flex items-center justify-center hover:bg-[var(--accent-hover)] transition-all shrink-0"
            >
              Ask
            </Link>
          </div>

          {/* Quick Service Links */}
          <div className="flex flex-col items-center gap-4 w-full">
            <span className="text-[11px] text-white/55 uppercase font-medium tracking-wide">
              {isHindi ? "सीधे चुनें:" : "Or choose directly:"}
            </span>
            
            <div className="flex items-center gap-3 overflow-x-auto pb-2 w-full justify-start md:justify-center no-scrollbar">
              {[
                { label: "Ration Card", icon: ShoppingBag, query: "Ration card ke liye kaise apply karein?" },
                { label: "Aadhaar Update", icon: Fingerprint, query: "Aadhaar mein address update karna hai" },
                { label: "PAN Card", icon: CreditCard, query: "Naya PAN card kaise banaye?" },
                { label: "DL", icon: Car, query: "Driving license kaise banaye?" },
                { label: "Schemes", icon: Landmark, query: "Kaun si sarkari yojana mere liye hai?" }
              ].map((btn) => {
                const Icon = btn.icon;
                return (
                  <Link
                    key={btn.label}
                    href={`/ask?q=${encodeURIComponent(btn.query)}`}
                    className="flex items-center gap-2 border border-white/25 text-white bg-transparent px-4 py-2 rounded-[6px] text-sm font-medium whitespace-nowrap hover:bg-white hover:text-[var(--primary)] transition-all"
                  >
                    <Icon size={16} />
                    {btn.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — FEATURE TICKER */}
      <FeatureTicker />
      <NationalTicker />

      {/* SECTION 4 — SERVICES BENTO GRID */}
      <section className="bg-[var(--surface)] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#E8620A] tracking-[2px] uppercase">{isHindi ? "हम किसमें मदद करते हैं" : "WHAT WE HELP WITH"}</span>
              <h2 className="text-[var(--text-2xl)] md:text-[var(--text-3xl)] text-[var(--text-primary)] font-bold font-display leading-none">
                {isHindi ? "हमारी सेवाएँ" : "Our Services"}
              </h2>
            </div>
            <div className="hidden md:block text-xs font-medium text-[#8896A5]">
              5 {isHindi ? "सेवाएं" : "services"} • 30+ {isHindi ? "राज्य" : "states"} • {isHindi ? "मुफ्त" : "Free"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 h-auto lg:h-[480px]">
            {/* RATION CARD — Pos: R1C1, Large (2fr col equivalent in 4 col grid is col-span-2) */}
            <Link 
              href={`/ask?q=${encodeURIComponent("Ration card ke liye kaise apply karein?")}`}
              className="lg:col-span-2 lg:row-span-1 bg-white border border-[#DDE1E9] border-left-[4px] border-l-[#E8620A] rounded-[12px] p-7 flex flex-col group relative overflow-hidden transition-all duration-200 hover:bg-[#FAFAFA] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-[3px]"
            >
              <span className="text-[10px] font-bold text-[#E8620A] tracking-[1.5px] uppercase mb-2.5">GOVERNMENT SERVICE</span>
              <h3 className="text-xl font-bold text-[#0F1923] font-display mb-2">{isHindi ? "राशन कार्ड" : "Ration Card"}</h3>
              <p className="text-sm text-[#4A5568] leading-relaxed max-w-[340px] font-normal">{isHindi ? "नया कार्ड बनवाना है, सुधार करना है या खोया कार्ड?" : "Apply for new ration card, corrections, or report lost card."}</p>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span className="text-xs font-medium text-[#8896A5]">3 types • 28 states</span>
                <div className="w-8 h-8 rounded-full bg-[#F7F8FA] border border-[#DDE1E9] flex items-center justify-center transition-all duration-200 group-hover:bg-[#E8620A] group-hover:border-[#E8620A]">
                  <ArrowRight size={14} className="text-[#1B3A6B] group-hover:text-white" />
                </div>
              </div>
            </Link>

            {/* AADHAAR UPDATE — Pos: R1C2 (col 3) */}
            <Link 
              href={`/ask?q=${encodeURIComponent("Aadhaar mein address update karna hai")}`}
              className="lg:col-span-1 bg-white border border-[#DDE1E9] border-left-[4px] border-l-[#1B3A6B] rounded-[12px] p-7 flex flex-col group relative overflow-hidden transition-all duration-200 hover:bg-[#FAFAFA] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-[3px]"
            >
              <span className="text-[10px] font-bold text-[#1B3A6B] tracking-[1.5px] uppercase mb-2.5">GOVERNMENT SERVICE</span>
              <h3 className="text-xl font-bold text-[#0F1923] font-display mb-2">{isHindi ? "आधार अपडेट" : "Aadhaar Update"}</h3>
              <p className="text-sm text-[#4A5568] leading-relaxed line-clamp-2 font-normal">{isHindi ? "पता, नाम, मोबाइल नंबर या जन्म तिथि अपडेट करें" : "Correct name, date of birth, address, or update mobile number."}</p>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span className="text-xs font-medium text-[#8896A5]">Online in 30 mins</span>
                <div className="w-8 h-8 rounded-full bg-[#F7F8FA] border border-[#DDE1E9] flex items-center justify-center transition-all duration-200 group-hover:bg-[#1B3A6B] group-hover:border-[#1B3A6B]">
                  <ArrowRight size={14} className="text-[#1B3A6B] group-hover:text-white" />
                </div>
              </div>
            </Link>

            {/* PAN CARD — Pos: R1C3 (col 4) */}
            <Link 
              href={`/ask?q=${encodeURIComponent("Naya PAN card kaise banaye?")}`}
              className="lg:col-span-1 bg-white border border-[#DDE1E9] border-left-[4px] border-l-[#15803D] rounded-[12px] p-7 flex flex-col group relative overflow-hidden transition-all duration-200 hover:bg-[#FAFAFA] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-[3px]"
            >
              <span className="text-[10px] font-bold text-[#15803D] tracking-[1.5px] uppercase mb-2.5">GOVERNMENT SERVICE</span>
              <h3 className="text-xl font-bold text-[#0F1923] font-display mb-2">{isHindi ? "पैन कार्ड" : "PAN Card"}</h3>
              <p className="text-sm text-[#4A5568] leading-relaxed line-clamp-2 font-normal">{isHindi ? "नया पैन बनवाएं, खोया पैन पाएं, या गलती सुधारें" : "New PAN card application, corrections, or reprinting."}</p>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span className="text-xs font-medium text-[#8896A5]">Free e-PAN available</span>
                <div className="w-8 h-8 rounded-full bg-[#F7F8FA] border border-[#DDE1E9] flex items-center justify-center transition-all duration-200 group-hover:bg-[#15803D] group-hover:border-[#15803D]">
                  <ArrowRight size={14} className="text-[#1B3A6B] group-hover:text-white" />
                </div>
              </div>
            </Link>

            {/* DRIVING LICENSE — Pos: R2C1 (col 1-2) */}
            <Link 
              href={`/ask?q=${encodeURIComponent("Driving license kaise banaye?")}`}
              className="lg:col-span-2 bg-white border border-[#DDE1E9] border-left-[4px] border-l-[#7C3AED] rounded-[12px] p-7 flex flex-col group relative overflow-hidden transition-all duration-200 hover:bg-[#FAFAFA] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-[3px]"
            >
              <span className="text-[10px] font-bold text-[#7C3AED] tracking-[1.5px] uppercase mb-2.5">GOVERNMENT SERVICE</span>
              <h3 className="text-xl font-bold text-[#0F1923] font-display mb-2">{isHindi ? "ड्राइविंग लाइसेंस" : "Driving License"}</h3>
              <p className="text-sm text-[#4A5568] leading-relaxed line-clamp-2 font-normal">{isHindi ? "लर्नर लाइसेंस, स्थायी DL या नवीनीकरण के लिए आवेदन करें" : "Apply for learner license, permanent DL, or renewal."}</p>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span className="text-xs font-medium text-[#8896A5]">5 service types</span>
                <div className="w-8 h-8 rounded-full bg-[#F7F8FA] border border-[#DDE1E9] flex items-center justify-center transition-all duration-200 group-hover:bg-[#7C3AED] group-hover:border-[#7C3AED]">
                  <ArrowRight size={14} className="text-[#1B3A6B] group-hover:text-white" />
                </div>
              </div>
            </Link>

            {/* GOVT SCHEMES — Pos: R2C2 (col 3-4, wide) */}
            <Link 
              href={`/ask?q=${encodeURIComponent("Kaun si sarkari yojana mere liye hai?")}`}
              className="lg:col-span-2 bg-white border border-[#DDE1E9] border-left-[4px] border-l-[#D97706] rounded-[12px] p-7 flex flex-col group relative overflow-hidden transition-all duration-200 hover:bg-[#FAFAFA] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-[3px]"
            >
              <span className="text-[10px] font-bold text-[#D97706] tracking-[1.5px] uppercase mb-2.5">GOVERNMENT SERVICE</span>
              <h3 className="text-xl font-bold text-[#0F1923] font-display mb-2">{isHindi ? "सरकारी योजनाएं" : "Government Schemes"}</h3>
              <p className="text-sm text-[#4A5568] leading-relaxed line-clamp-2 font-normal">{isHindi ? "10 योजनाएं जैसे PM किसान, आयुष्मान भारत, उज्ज्वला, और बहुत कुछ।" : "10 Schemes including PM Kisan, Ayushman Bharat, Ujjwala, and more."}</p>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span className="text-xs font-medium text-[#8896A5]">10 schemes • All states</span>
                <div className="w-8 h-8 rounded-full bg-[#F7F8FA] border border-[#DDE1E9] flex items-center justify-center transition-all duration-200 group-hover:bg-[#D97706] group-hover:border-[#D97706]">
                  <ArrowRight size={14} className="text-[#1B3A6B] group-hover:text-white" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5 — HOW IT WORKS */}
      <section className="bg-[var(--surface-2)] py-20 px-4 border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Dashed Line (Desktop Only) */}
            <div className="hidden md:block absolute top-[16px] left-[15%] right-[15%] h-[1px] border-t-2 border-dashed border-[var(--border)]"></div>
            
            {[
              {
                title: isHindi ? "अपनी समस्या लिखें" : "Type Your Problem",
                desc: isHindi ? "हिंदी या अंग्रेजी में पूछें — सरकारी सेवाओं के बारे में कुछ भी" : "Ask in Hindi or English — anything about government services"
              },
              {
                title: isHindi ? "तुरंत जानकारी पाएं" : "Get Instant Guidance",
                desc: isHindi ? "AI आधिकारिक डेटा पढ़ता है और आपको स्टेप-बाय-स्टेप निर्देश देता है" : "AI reads official data and gives you step-by-step instructions"
              },
              {
                title: isHindi ? "आधिकारिक पोर्टल पर जाएँ" : "Go to Official Portal",
                desc: isHindi ? "हम आपको आपके विवरण के साथ सही सरकारी पोर्टल पर भेजते हैं" : "We redirect you to the correct government portal with your details ready"
              }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 relative z-10">
                <div className="w-[32px] h-[32px] rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {i + 1}
                </div>
                <div className="space-y-1">
                  <h3 className="text-[var(--text-base)] font-semibold text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="text-[var(--text-sm)] text-[var(--text-secondary)] leading-relaxed max-w-[280px]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — TRUST STATS BAR */}
      <section className="bg-[var(--primary)] py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {[
            { 
              icon: Shield, 
              title: isHindi ? "आधिकारिक डेटा केवल" : "Official Data Only", 
              desc: isHindi ? "आधिकारिक सरकारी पोर्टल से लिया गया" : "Sourced from govt.in portals" 
            },
            { 
              icon: MapPin, 
              title: isHindi ? "30+ राज्य कवर" : "30+ States Covered", 
              desc: isHindi ? "राज्य-विशिष्ट जानकारी" : "State-specific guidance" 
            },
            { 
              icon: IndianRupee, 
              title: isHindi ? "कोई एजेंट शुल्क नहीं" : "Zero Agent Fees", 
              desc: isHindi ? "नागरिकों के लिए हमेशा मुफ्त" : "Always free for citizens" 
            },
            { 
              icon: Lock, 
              title: isHindi ? "सुरक्षित और निजी" : "Safe & Private", 
              desc: isHindi ? "कोई संवेदनशील डेटा स्टोर नहीं" : "No sensitive data stored" 
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center group">
                <Icon size={20} className="text-white mb-2" />
                <div className="space-y-0.5">
                  <h4 className="text-base font-semibold text-white">
                    {stat.title}
                  </h4>
                  <p className="text-xs text-white/60 font-normal">
                    {stat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 7 — SCHEMES HIGHLIGHT */}
      <section className="bg-[var(--surface)] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-[var(--text-2xl)] font-bold text-[var(--text-primary)] font-display">
              {isHindi ? "सरकारी योजनाएं" : "Government Schemes"}
            </h2>
            <p className="text-[var(--text-base)] text-[var(--text-secondary)] mt-1 font-medium">
              {isHindi ? "पात्रता जाँचें और आवेदन करें — सभी आधिकारिक डेटा" : "Check eligibility and apply — all official data"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
            {schemes.map((scheme, i) => (
              <Link
                key={i}
                href={`/ask?q=${encodeURIComponent(scheme.query)}`}
                className="bg-white border border-[#DDE1E9] rounded-[10px] p-5 flex flex-col gap-1 transition-all duration-200 hover:border-[#E8620A] hover:shadow-[0_4px_12px_rgba(232,98,10,0.1)] hover:-translate-y-0.5 group cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-[#0F1923]">
                    {scheme.name}
                  </h4>
                  <span className="bg-[#FFF3E8] text-[#E8620A] text-[10px] font-bold px-2 py-0.5 rounded-[4px] uppercase tracking-wide shrink-0">
                    {isHindi ? "केंद्रीय योजना" : "Central Scheme"}
                  </span>
                </div>
                <p className="text-[11px] text-[#4A5568] font-normal leading-relaxed">
                  {scheme.benefit}
                </p>
                <div className="mt-auto pt-3 text-[11px] font-bold text-[var(--primary)] group-hover:text-[#E8620A] transition-colors flex items-center gap-1">
                  {isHindi ? "साथी से पूछें" : "Ask Saathi"} <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center">
            <Link 
              href={`/ask?q=${encodeURIComponent("Sarkari yojanaon ke baare mein batao")}`}
              className="bg-[var(--primary)] text-white font-bold text-sm rounded-[8px] px-7 py-3 hover:bg-[var(--primary-hover)] transition-all shadow-md active:scale-[0.98]"
            >
              {isHindi ? "सभी योजनाओं का पता लगाएं" : "Explore All Schemes"}
            </Link>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Sarkari Saathi",
            "alternateName": "सरकारी साथी",
            "url": process.env.NEXT_PUBLIC_SITE_URL,
            "description": "Free AI-powered guide for Indian government services — Aadhaar, PAN, Ration Card, Driving License, Government Schemes",
            "inLanguage": ["en-IN", "hi-IN"],
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL}/ask?q={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Sarkari Saathi",
              "url": process.env.NEXT_PUBLIC_SITE_URL,
              "logo": {
                "@type": "Organization",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL}/sarkari-saathi-logo.png`
              }
            }
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Aadhaar card mein address update kaise karein?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Aadhaar address update ke liye myaadhaar.uidai.gov.in par jaayein, Aadhaar-linked mobile OTP se login karein, Update Address Online select karein, naya pata darj karein aur POA document upload karein. Fee: June 2026 tak free, uske baad ₹75."
                }
              },
              {
                "@type": "Question", 
                "name": "PAN card apply kaise karein India mein?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Free instant e-PAN ke liye incometax.gov.in par jaayein. Physical PAN card ke liye onlineservices.nsdl.com par Form 49A bharein. Fee: Free e-PAN / ₹107 physical card."
                }
              },
              {
                "@type": "Question",
                "name": "Driving license kaise banaye online India mein?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Driving license ke liye sarathi.parivahan.gov.in par jaayein. Pehle Learner License (LL) ke liye apply karein — fee ₹150-200. Phir 30 din baad Permanent DL ke liye apply karein — fee ₹200-400."
                }
              },
              {
                "@type": "Question",
                "name": "PM Kisan registration kaise karein?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "PM Kisan registration ke liye pmkisan.gov.in par jaayein, Farmers Corner mein New Farmer Registration select karein. Aadhaar, bank passbook aur land records (khatoni) ki zaroorat hogi. e-KYC bhi zaroori hai."
                }
              },
              {
                "@type": "Question",
                "name": "Ayushman Bharat card kaise banaye?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "beneficiary.nha.gov.in par jaayein, mobile OTP se login karein, PMJAY select karein, apna naam search karein aur Aadhaar OTP se authenticate karein. Card turant PDF mein download hoga."
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}
