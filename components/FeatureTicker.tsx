'use client';

export default function FeatureTicker() {
  const items = [
    "✦ 30+ Indian States Covered",
    "· Aadhaar Update Guide",
    "· PAN Card Application",
    "· Driving License Guide",
    "· PM Kisan Registration",
    "· Ayushman Bharat Card",
    "· PM Awas Yojana",
    "· PM Ujjwala Yojana",
    "· PM Vishwakarma Scheme",
    "· Fasal Bima Yojana",
    "· Jan Dhan Account",
    "· Ration Card Apply",
    "· Zero Agent Fees",
    "· Hindi + English Support"
  ];

  return (
    <div className="bg-[var(--surface-3)] h-[48px] overflow-hidden flex items-center border-y border-[var(--border)]">
      <div className="ticker-track flex items-center gap-8 whitespace-nowrap px-8">
        {/* First set of items */}
        {items.map((item, index) => (
          <span key={`ticker-1-${index}`} className="text-[13px] font-medium text-[var(--text-secondary)] flex items-center gap-8">
            {item}
          </span>
        ))}
        {/* Second set of items for seamless loop */}
        {items.map((item, index) => (
          <span key={`ticker-2-${index}`} className="text-[13px] font-medium text-[var(--text-secondary)] flex items-center gap-8">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
