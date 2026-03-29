'use client';

import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function AuthButton() {
  const { data: session, isPending } = authClient.useSession();
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isHindi = i18n.language === 'hi';

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/"
    });
  };

  const handleLogout = async () => {
    await authClient.signOut();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isPending) return <div className="w-[30px] h-[30px] rounded-full bg-white/10 animate-pulse" />;

  if (!session) {
    return (
      <button
        onClick={handleLogin}
        className="bg-[#E8620A] hover:bg-[#D4560A] text-white px-[16px] py-[7px] rounded-[6px] text-[13px] font-semibold border-none transition-all duration-[150ms] ease-in-out active:scale-[0.98]"
      >
        {isHindi ? "लॉगिन" : "Login"}
      </button>
    );
  }

  // Extract first name
  const firstName = session.user.name?.split(' ')[0] || (isHindi ? 'यूजर' : 'User');

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-full transition-all focus:outline-none"
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || "User Profile"}
            width={30}
            height={30}
            className="w-[30px] h-[30px] rounded-full border-[2px] border-white/30 object-cover"
          />
        ) : (
          <div className="w-[30px] h-[30px] rounded-full bg-[#1B3A6B] text-white flex items-center justify-center border-[2px] border-white/30 text-[12px] font-bold">
            {session.user.name?.charAt(0) || 'U'}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 min-w-[160px] bg-white rounded-[8px] border border-[#DDE1E9] shadow-[0_4px_16px_rgba(0,0,0,0.10)] py-[4px] z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="px-[16px] py-[10px] border-b border-[#EEF0F4]">
            <p className="text-[13px] font-semibold text-[#0F1923]">{firstName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-[16px] py-[10px] text-[13px] font-medium text-[#DC2626] hover:bg-[#FFF5F5] transition-colors text-left"
          >
            <LogOut size={14} />
            {isHindi ? "लॉगआउट" : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}
