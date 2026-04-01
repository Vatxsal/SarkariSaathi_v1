'use client';

export default function NationalTicker() {
  const slogans = [
    " सत्यमेव जयते",
    " वन्दे मातरम्",
    " जय हिन्द",
    " सारे जहाँ से अच्छा हिन्दोस्ताँ हमारा",
    " मेरा भारत महान",
    " जय जवान जय किसान",
    " अतुल्य भारत",
    " भारत माता की जय",
    " वसुधैव कुटुम्बकम्"
  ];

  // Duplicate to ensure it's long enough to wrap without gaps on extra wide screens
  const items = [...slogans, ...slogans];

  return (
    <div className="h-[40px] overflow-hidden flex items-center border-b border-[var(--border)] relative bg-gradient-to-r from-[#FF9933]/40 via-white to-[#138808]/40">
      <div className="ticker-track flex items-center gap-12 whitespace-nowrap px-8 relative z-10 w-max">
        {/* First set of items */}
        {items.map((item, index) => (
          <span key={`ticker-1-${index}`} className="text-[14px] font-bold text-[var(--primary)] tracking-wider flex items-center gap-12">
            {item}
          </span>
        ))}
        {/* Second set of items for seamless loop */}
        {items.map((item, index) => (
          <span key={`ticker-2-${index}`} className="text-[14px] font-bold text-[var(--primary)] tracking-wider flex items-center gap-12">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
