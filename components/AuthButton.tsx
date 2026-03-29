'use client';

import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useTranslation } from "react-i18next";
import { LogOut, User, LogIn, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function AuthButton() {
  const { data: session, isPending } = authClient.useSession();
  const { t, i18n } = useTranslation();
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

  if (isPending) return <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />;

  if (!session) {
    return (
      <button
        onClick={handleLogin}
        className="flex items-center gap-1.5 bg-[var(--accent)] text-white px-3.5 py-1.5 rounded-[6px] text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-all active:scale-[0.98]"
      >
        <LogIn size={14} />
        {isHindi ? "लॉगिन" : "Login"}
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full transition-all border border-white/20 hover:border-white/40"
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || "User Profile"}
            width={28}
            height={28}
            className="w-7 h-7 rounded-full border border-white/10"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
        )}
        <ChevronDown size={12} className={`text-white/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-[8px] shadow-[var(--shadow-high)] border border-[var(--border)] overflow-hidden z-[100] animate-in fade-in zoom-in duration-200">
          <div className="p-3 border-b border-[var(--surface-3)] bg-[var(--surface-2)]">
            <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-0.5">Logged in as</p>
            <p className="text-[12px] font-semibold text-[var(--text-primary)] truncate">{session.user.email}</p>
          </div>
          <button
            className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <User size={15} />
            {isHindi ? "मेरा अकाउंट" : "My Account"}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium text-[var(--error)] hover:bg-red-50 transition-colors border-t border-[var(--surface-2)]"
          >
            <LogOut size={15} />
            {isHindi ? "लॉगआउट" : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}
