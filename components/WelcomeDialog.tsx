'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { authClient } from '@/lib/auth-client';
import { X, Lock } from 'lucide-react';
import Image from 'next/image';

export default function WelcomeDialog() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const isHindi = i18n.language === 'hi';

  useEffect(() => {
    const hasVisited = document.cookie.split('; ').find(row => row.startsWith('ss_visited='));
    if (!hasVisited) {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    document.cookie = "ss_visited=true; max-age=" + (365 * 24 * 60 * 60) + "; path=/";
    setIsOpen(false);
  };

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/"
    });
    handleDismiss();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={handleDismiss} 
      />
      
      {/* Dialog Container */}
      <div className="relative bg-white rounded-[12px] max-w-[400px] w-full overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500 border border-[#EEF0F4]">
        
        {/* TOP SECTION */}
        <div className="bg-[#1B3A6B] p-[28px_32px_24px] relative">
          <Image 
            src="/sarkari-saathi-logo.png" 
            alt="Sarkari Saathi" 
            height={36} 
            width={150}
            className="h-[36px] w-auto object-contain block mb-[16px]"
          />
          
          <h2 className="text-[20px] font-bold text-white leading-tight mb-[6px] font-[var(--font-sora)]">
            {isHindi ? "सरकारी साथी में आपका स्वागत है" : "Welcome to Sarkari Saathi"}
          </h2>
          
          <p className="text-[13px] text-white/60 font-normal">
            {isHindi ? "सरकारी सेवाएं, अब सरल।" : "Government services, simplified."}
          </p>

          <button 
            onClick={handleDismiss}
            className="absolute top-[16px] right-[16px] text-white/50 hover:text-white/90 p-1 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* BOTTOM SECTION */}
        <div className="bg-white p-[24px_32px_28px]">
          
          {/* Row 1 — Login option */}
          <div className="flex items-center justify-between py-[14px] border-bottom border-b border-[#EEF0F4]">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold tracking-[1.5px] text-[#15803D] uppercase mb-[2px]">
                {isHindi ? "अनुशंसित" : "RECOMMENDED"}
              </span>
              <p className="text-[14px] font-semibold text-[#0F1923]">
                {isHindi ? "Google से जारी रखें" : "Continue with Google"}
              </p>
              <p className="text-[12px] text-[#4A5568] font-normal">
                {isHindi ? "प्रतिदिन 10 फ्री प्रॉम्प्ट प्राप्त करें" : "Get 10 free prompts every day"}
              </p>
            </div>
            
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 bg-[#1B3A6B] hover:bg-[#15306A] text-white px-[16px] py-[8px] rounded-[6px] text-[13px] font-semibold transition-all shadow-sm"
            >
              <GoogleIcon />
              {isHindi ? "लॉगिन" : "Login"}
            </button>
          </div>

          {/* Row 2 — Guest option */}
          <div className="flex items-center justify-between py-[14px]">
            <div className="flex flex-col">
              <p className="text-[14px] font-medium text-[#4A5568]">
                {isHindi ? "बिना लॉगिन जारी रखें" : "Continue without login"}
              </p>
              <p className="text-[12px] text-[#8896A5] font-normal">
                {isHindi ? "प्रतिदिन 5 फ्री प्रॉम्प्ट" : "5 free prompts per day"}
              </p>
            </div>
            
            <button
              onClick={handleDismiss}
              className="px-[16px] py-[8px] rounded-[6px] text-[13px] font-medium text-[#4A5568] border border-[#DDE1E9] hover:border-[#1B3A6B] hover:text-[#1B3A6B] transition-all"
            >
              {isHindi ? "जारी रखें" : "Continue"}
            </button>
          </div>

          {/* Bottom disclaimer */}
          <div className="flex items-center justify-center gap-[6px] mt-4 text-[11px] text-[#8896A5] font-medium">
            <Lock size={11} className="shrink-0" />
            <span>{isHindi ? "100% सुरक्षित · केवल आधिकारिक डेटा" : "100% Secure · Official Data Only"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M47.532 24.5528C47.532 22.883 47.3862 21.288 47.1192 19.752H24.3032V28.8456H37.3352C36.7725 31.8744 35.0604 34.4376 32.4836 36.1584V42.1752H40.3358C44.9254 37.9512 47.532 31.7232 47.532 24.5528Z" fill="#4285F4"/>
    <path d="M24.3031 48.0001C30.7831 48.0001 36.2163 45.8593 40.3357 42.1753L32.4835 36.1585C30.3015 37.6177 27.5491 38.4913 24.3031 38.4913C18.0494 38.4913 12.7533 34.2649 10.8601 28.5865H2.74414V34.8777C6.70814 42.7481 14.8647 48.0001 24.3031 48.0001Z" fill="#34A853"/>
    <path d="M10.8601 28.5864C10.3756 27.1416 10.1026 25.5912 10.1026 24.0001C10.1026 22.4089 10.3756 20.8584 10.8601 19.4137V13.1225H2.74414C1.10774 16.3897 0.175781 20.0881 0.175781 24.0001C0.175781 27.9121 1.10774 31.6105 2.74414 34.8777L10.8601 28.5864Z" fill="#FBBC05"/>
    <path d="M24.3031 9.50882C27.8344 9.50882 30.9996 10.7233 33.4891 13.0849L40.5173 6.05652C36.2043 2.30412 30.7783 0 24.3031 0C14.8647 0 6.70814 5.25192 2.74414 13.1225L10.8601 19.4137C12.7533 13.7353 18.0494 9.50882 24.3031 9.50882Z" fill="#EA4335"/>
  </svg>
);
