'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FAQ {
  q_en: string;
  q_hi: string;
  a_en: string;
  a_hi: string;
}

const faqsByService: Record<string, FAQ[]> = {
  'ration_card': [
    {
      q_en: 'What if the name on Aadhaar and Ration Card don\'t match?',
      q_hi: 'अगर आधार और राशन कार्ड पर नाम अलग हो तो क्या करें?',
      a_en: 'First correct the name on either Aadhaar or Ration Card so both match. Correcting Aadhaar is easier — visit myaadhaar.uidai.gov.in. For Ration Card name change, you need an affidavit and Gazette Notification.',
      a_hi: 'पहले आधार या राशन कार्ड में से किसी एक में नाम सुधरवाएं ताकि दोनों मैच करें। राशन कार्ड में नाम बदलने के लिए शपथ पत्र (affidavit) और Gazette Notification की जरूरत होती है। आधार में नाम बदलना आसान है — myaadhaar.uidai.gov.in पर जाएं।'
    },
    {
      q_en: 'Can tenants apply for a Ration Card?',
      q_hi: 'क्या किराएदार राशन कार्ड बनवा सकते हैं?',
      a_en: 'Yes, tenants can apply for a Ration Card. A registered rent agreement or landlord NOC letter along with an electricity/water bill works as residence proof.',
      a_hi: 'हाँ, किराएदार भी राशन कार्ड बनवा सकते हैं। इसके लिए registered rent agreement या मकान मालिक का NOC letter + बिजली बिल/पानी बिल निवास प्रमाण के रूप में काम आता है।'
    },
    {
      q_en: 'How to add a new member to an existing Ration Card?',
      q_hi: 'राशन कार्ड में नए सदस्य का नाम कैसे जोड़ें?',
      a_en: 'For a newborn or newly married member — submit a Birth Certificate or Marriage Certificate at your local Food Supply Office. Most states allow this online too.',
      a_hi: 'नवजात शिशु या शादी के बाद आई बहू का नाम जोड़ने के लिए — जन्म प्रमाण पत्र या विवाह प्रमाण पत्र के साथ अपने क्षेत्र के Food Supply Office में आवेदन करें। ज्यादातर राज्यों में यह ऑनलाइन भी होता है।'
    },
    {
      q_en: 'How many members can be on one Ration Card?',
      q_hi: 'राशन कार्ड में कितने सदस्य हो सकते हैं?',
      a_en: 'Under NFSA, all family members can be on one card — there is no limit. Every member\'s Aadhaar must be linked to the card.',
      a_hi: 'NFSA के तहत परिवार के सभी सदस्य एक ही कार्ड में हो सकते हैं — कोई सीमा नहीं है। हर सदस्य का आधार कार्ड लिंक होना जरूरी है।'
    },
    {
      q_en: 'How long does it take to get the card after applying?',
      q_hi: 'आवेदन करने के बाद कितने दिन में कार्ड मिलता है?',
      a_en: 'Usually 30–45 days. After field verification, the DSO/BSO approves and issues the card. Keep your acknowledgement number to track status.',
      a_hi: 'आमतौर पर 30-45 दिन लगते हैं। Field verification के बाद DSO/BSO approval होती है फिर कार्ड जारी होता है। अपना acknowledgement number संभालकर रखें — उससे status track कर सकते हैं।'
    },
    {
      q_en: 'Can one family have two Ration Cards?',
      q_hi: 'क्या एक परिवार के दो राशन कार्ड हो सकते हैं?',
      a_en: 'No — one family gets one card. If a family has separated into two households, a new card can be made but the members must first be removed from the old card.',
      a_hi: 'नहीं — एक परिवार का एक ही राशन कार्ड होता है। अगर परिवार अलग रहने लगा है (बेटे की अलग family) तो नया कार्ड बनवाया जा सकता है, पर पुराने कार्ड से उन सदस्यों का नाम हटाना होगा।'
    }
  ],
  'aadhaar_update': [
    {
      q_en: 'My mobile number is not linked to Aadhaar — how do I get OTP?',
      q_hi: 'मोबाइल नंबर आधार से लिंक नहीं है तो क्या OTP कैसे मिलेगा?',
      a_en: 'If your mobile is not linked, online update is not possible. You must visit the nearest Aadhaar Seva Kendra (ASK) where biometric (fingerprint/iris) verification is done. Book an appointment at appointments.uidai.gov.in.',
      a_hi: 'अगर मोबाइल नंबर आधार से लिंक नहीं है तो online update नहीं होगा। आपको नजदीकी Aadhaar Seva Kendra (ASK) जाना होगा जहाँ biometric (fingerprint/iris) से verify होगा। appointments.uidai.gov.in पर appointment बुक करें।'
    },
    {
      q_en: 'How long does an Aadhaar update take?',
      q_hi: 'आधार अपडेट में कितना समय लगता है?',
      a_en: 'Online update (myaadhaar.uidai.gov.in): 5–7 working days. At Aadhaar Seva Kendra: up to 90 days for biometric updates. Track status using your SRN at uidai.gov.in.',
      a_hi: 'Online update (myaadhaar.uidai.gov.in): 5-7 कार्यदिवस। Aadhaar Seva Kendra पर जाकर: 90 दिन तक (biometric update)। SRN नंबर से uidai.gov.in पर status track करें।'
    },
    {
      q_en: 'Which documents are accepted for address change in Aadhaar?',
      q_hi: 'आधार में पता बदलने के लिए कौन सा document चलता है?',
      a_en: 'Electricity bill, water bill, bank statement, registered rent agreement, Voter ID, Passport, Driving Licence — any one. Utility bills must not be older than 3 months.',
      a_hi: 'बिजली बिल, पानी बिल, बैंक स्टेटमेंट, registered rent agreement, voter ID, पासपोर्ट, driving licence — इनमें से कोई एक। Document 3 महीने से पुराना नहीं होना चाहिए (utility bills के लिए)।'
    },
    {
      q_en: 'Can the date of birth in Aadhaar be changed more than once?',
      q_hi: 'क्या आधार में DOB एक बार से ज्यादा बदल सकते हैं?',
      a_en: 'No — date of birth can only be changed once in Aadhaar. Make sure you have the correct Birth Certificate or School Certificate before requesting the change.',
      a_hi: 'नहीं — आधार में date of birth सिर्फ एक बार बदली जा सकती है। बदलाव से पहले सुनिश्चित करें कि आपके पास सही Birth Certificate या School Certificate है।'
    },
    {
      q_en: 'Where can I find the nearest Aadhaar Seva Kendra?',
      q_hi: 'Aadhaar Seva Kendra कहाँ मिलेगा?',
      a_en: 'Go to appointments.uidai.gov.in → Locate Enrolment & Update Centre → enter your PIN code. You can find the nearest ASK address and book an appointment from the same page.',
      a_hi: 'appointments.uidai.gov.in पर जाएं → Locate Enrolment & Update Centre → अपना पिनकोड डालें। यहाँ से नजदीकी ASK का पता और appointment booking दोनों होता है।'
    },
    {
      q_en: 'How do I get an acknowledgement for my Aadhaar update?',
      q_hi: 'आधार अपडेट की receipt/acknowledgement कैसे मिलेगी?',
      a_en: 'After an online update you receive an SRN (Service Request Number) — screenshot it or note it down. Use it at uidai.gov.in to check the status of your update.',
      a_hi: 'Online update के बाद एक SRN (Service Request Number) मिलता है — उसे screenshot लें या note करें। इसी से आप uidai.gov.in पर जाकर अपने update का status check कर सकते हैं।'
    }
  ],
  'pan_card': [
    {
      q_en: 'What is the difference between a free instant e-PAN and NSDL physical PAN?',
      q_hi: 'Free वाला instant e-PAN और NSDL वाले PAN में क्या फर्क है?',
      a_en: 'Instant e-PAN (free at incometax.gov.in) is a PDF issued immediately — legally valid everywhere including bank KYC and income tax. NSDL/UTIITSL gives a physical plastic card for ₹107 delivered in 15–20 days. For most purposes, e-PAN is enough.',
      a_hi: 'Instant e-PAN (incometax.gov.in पर मुफ्त) एक PDF होता है जो तुरंत मिलता है और legally valid है — income tax, bank KYC, सभी जगह काम आता है। NSDL/UTIITSL वाला physical plastic card है जो ₹107 में 15-20 दिन में घर आता है। ज्यादातर कामों के लिए e-PAN काफी है।'
    },
    {
      q_en: 'Is it mandatory to link PAN with Aadhaar?',
      q_hi: 'PAN और Aadhaar link करना जरूरी है क्या?',
      a_en: 'Yes — if you file income tax or do financial transactions, PAN-Aadhaar linking is mandatory. Without linking, your PAN may become inoperative. Linking is free at incometax.gov.in.',
      a_hi: 'हाँ — अगर आप income tax filer हैं या financial transactions करते हैं तो PAN-Aadhaar linking अनिवार्य है। बिना linking के PAN inoperative हो सकता है। Linking free है — incometax.gov.in पर करें।'
    },
    {
      q_en: 'What if I accidentally have two PAN cards?',
      q_hi: 'दो PAN card हो जाएं तो क्या करें?',
      a_en: 'Holding two PANs is illegal with a fine up to ₹10,000. If you have two by mistake, surrender one using the surrender form at an NSDL or UTIITSL office immediately.',
      a_hi: 'दो PAN रखना illegal है और ₹10,000 तक जुर्माना हो सकता है। अगर गलती से दो बन गए हैं तो एक surrender करना होगा। Surrender form NSDL या UTIITSL office में submit करें।'
    },
    {
      q_en: 'How to get a PAN card for a minor (under 18)?',
      q_hi: 'Minor (18 साल से कम) का PAN card कैसे बनेगा?',
      a_en: 'A minor\'s PAN is applied through a parent or guardian. Fill Form 49A with guardian details. When the minor turns 18, the PAN must be updated with their own details.',
      a_hi: 'Minor का PAN card उनके parent/guardian के माध्यम से बनता है। Form 49A में guardian की details भरें। 18 साल होने पर PAN update करवाना होता है।'
    },
    {
      q_en: 'PAN has wrong name but Aadhaar has correct name — what to do?',
      q_hi: 'PAN card पर गलत नाम है पर Aadhaar पर सही है — क्या करें?',
      a_en: 'Fill the Correction form on NSDL portal. Upload Aadhaar as the supporting document. Pay ₹110 fee. Corrected card arrives in 15 days.',
      a_hi: 'NSDL portal पर Correction form भरें। Supporting document में Aadhaar card upload करें। ₹110 fee pay करें। 15 दिन में corrected card आ जाएगा।'
    },
    {
      q_en: 'Can I open a bank account without a PAN card?',
      q_hi: 'क्या बिना PAN के bank account खुल सकता है?',
      a_en: 'Yes — by submitting Form 60 you can open a bank account without PAN. However PAN is mandatory for transactions above ₹50,000, fixed deposits, and property deals. Better to get one soon.',
      a_hi: 'हाँ — Form 60 भरकर bank account खुल सकता है अगर PAN नहीं है। लेकिन ₹50,000 से ज्यादा का transaction, FD, property deal के लिए PAN अनिवार्य है। जल्द बनवा लेना बेहतर है।'
    }
  ]
};

export default function FAQSection({ serviceSlug }: { serviceSlug: string }) {
  const { t, i18n } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isHindi = i18n.language === 'hi';
  
  const faqs = faqsByService[serviceSlug] || [];

  if (faqs.length === 0) return null;

  return (
    <section className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <h2 className="text-[var(--text-xl)] font-bold text-[var(--text-primary)] font-display uppercase tracking-wider text-xs">{t('faq_title')}</h2>
        <div className="h-[1px] flex-1 bg-[var(--border)]"></div>
      </div>

      <div className="bg-white rounded-[12px] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-low)]">
        {faqs.map((faq, i) => (
          <div key={i} className={i !== faqs.length - 1 ? 'border-b border-[var(--border)]' : ''}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-start gap-4 p-5 text-left hover:bg-[var(--surface-3)]/40 transition-all group"
            >
              <div className="w-5 h-5 bg-[var(--primary)]/[0.08] text-[var(--primary)] rounded-full flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                  <HelpCircle size={12} strokeWidth={3} />
              </div>
              <span className="text-[15px] font-bold text-[var(--text-primary)] leading-relaxed flex-1">
                {isHindi ? faq.q_hi : faq.q_en}
              </span>
              <div className={`transition-transform duration-300 mt-1 ${openIndex === i ? 'rotate-180' : ''}`}>
                <ChevronDown size={18} className="text-[var(--text-tertiary)]" />
              </div>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-500 linear ${
                openIndex === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-5 pt-0 pl-14 text-[14px] text-[var(--text-secondary)] leading-[1.7] font-medium font-body bg-[var(--surface-3)]/20">
                {isHindi ? faq.a_hi : faq.a_en}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
