'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Landmark, ArrowLeft, SendHorizontal, Lock, Zap, LogIn, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useStateContext } from '@/context/StateContext';

interface Message {
  role: 'user' | 'bot';
  content: string;
  type?: 'text' | 'limit_reached' | 'redirect';
  data?: any;
}

interface LimitInfo {
  allowed: boolean;
  remaining: number;
  limit: number;
  isLoggedIn: boolean;
  reset_at: string;
}

export default function ChatInterface() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [limitInfo, setLimitInfo] = useState<LimitInfo | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const searchParams = useSearchParams();
  const isHindi = i18n.language === 'hi';

  const { data: session } = authClient.useSession();
  const { selectedState } = useStateContext();

  const fetchLimit = async () => {
    try {
      const res = await fetch('/api/check-prompt-limit', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setLimitInfo(data);
      }
    } catch (e) {
      console.error("Failed to fetch limit", e);
    }
  };

  useEffect(() => {
    fetchLimit();
    
    // Read 'q' parameter from URL and pre-fill input
    const q = searchParams.get('q');
    if (q) {
      setInput(decodeURIComponent(q));
      // Focus after a short delay to ensure DOM is ready
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchParams]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent | string) => {
    const isString = typeof e === 'string';
    if (!isString && e) e.preventDefault();

    const userMsg = (isString ? e : input.trim()).replace(/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/gu, '').trim();
    if (!userMsg || isLoading || (limitInfo && !limitInfo.allowed)) return;

    setIsLoading(true);
    if (!isString) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg, type: 'text' }]);

    try {
        const limitCheck = await fetch('/api/check-prompt-limit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
            credentials: 'include'
        });
        const limitData = await limitCheck.json();
        setLimitInfo(limitData);

        if (!limitData.allowed) {
            setMessages(prev => [...prev, 
              {
                role: 'bot',
                content: '',
                type: 'limit_reached',
                data: limitData
              }
            ]);
            setIsLoading(false);
            return;
        }
    } catch (err) {
        console.error("Limit check error:", err);
    }

    const state = selectedState || 'Not mentioned';

    try {
      const detectRes = await fetch('/api/detect-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userQuery: userMsg, userState: state, currentLang: i18n.language })
      });
      
      if (!detectRes.ok) throw new Error("GEMINI_ERROR");
      const data = await detectRes.json();

      if (data) {
        if (data.service && data.subcase && data.state && data.confidence > 0.6) {
          const serviceName = data.service.replace(/_/g, ' ');
          const subcaseName = data.subcase.replace(/_/g, ' ');
          
          setMessages(prev => [...prev, {
            role: 'bot',
            content: '',
            type: 'redirect',
            data: { serviceName, subcaseName, state: data.state, service: data.service, subcase: data.subcase }
          }]);

          setTimeout(() => {
            router.push(`/guide/${data.service}/${data.subcase}/${encodeURIComponent(data.state)}`);
          }, 2000);
        } else {
          setMessages(prev => [...prev, { role: 'bot', content: data.message || t('couldnt_catch') }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'bot', content: t('trouble_processing') }]);
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'bot', content: t('chat_error') + " " + (error.message || 'Unknown error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (msg: Message, i: number) => {
    if (msg.type === 'limit_reached') {
        const { isLoggedIn, reset_at } = msg.data;
        const resetTimeStr = new Date(reset_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return (
          <div className="space-y-4">
            <p className="font-bold text-[var(--error)] text-lg">
                {isLoggedIn ? t('chat.limit_user_title') : t('chat.limit_guest_title')}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
                {isLoggedIn ? t('chat.limit_user_body') : t('chat.limit_guest_body')}
            </p>
            {!isLoggedIn && (
                <button
                    onClick={() => authClient.signIn.social({ provider: 'google', callbackURL: '/chat' })}
                    className="flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-[6px] text-sm font-bold hover:bg-[var(--accent-hover)] transition-all shadow-md active:scale-95"
                >
                    <LogIn size={18} />
                    {t('welcome.cta_login')}
                </button>
            )}
            <div className="pt-2 border-t border-[var(--border)]">
              <p className="text-[11px] text-[var(--text-tertiary)] font-bold uppercase tracking-wider flex items-center gap-2">
                  <Zap size={12} className="text-[var(--accent)]" />
                  {t('chat.reset_at', { time: resetTimeStr })}
              </p>
            </div>
          </div>
        );
    }

    if (msg.type === 'redirect') {
        const { serviceName, subcaseName, state } = msg.data;
        return (
            <div className="leading-relaxed">
                {t('redirecting')} <span className="font-bold">{serviceName}</span> (<span className="text-[var(--primary)]">{subcaseName}</span>) in <span className="font-bold italic">{state}</span>. {t('redirecting_suffix')}
            </div>
        );
    }

    return <div className="whitespace-pre-wrap leading-[1.6]">{msg.content}</div>;
  };

  const suggestionsRaw = t('chat_suggestions.chips', { returnObjects: true });
  const suggestions = (Array.isArray(suggestionsRaw) ? (suggestionsRaw as string[]) : []).slice(0, 14);

  return (
    <div className="flex flex-col h-[650px] bg-[var(--surface)] rounded-[12px] border border-[var(--border)] shadow-[var(--shadow-mid)] overflow-hidden animate-fade-in relative z-10 max-w-5xl mx-auto">
      {/* Chat Header */}
      <div className="bg-[var(--primary)] p-4 text-white flex items-center justify-between shadow-md h-[72px]">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-white" />
          </Link>
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shrink-0">
            <Landmark size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-base leading-none text-white font-display uppercase tracking-wider text-xs">{t('chat.assistant_title')}</h2>
              <span className="text-[11px] font-normal opacity-60 text-white leading-none">({t('chat.assistant_name')})</span>
            </div>
            <p className="text-[12px] opacity-75 text-white leading-tight mt-1">{t('chat.help_subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-[4px] border border-white/10">
          <div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">{t('chat.online_status')}</span>
        </div>
      </div>

      {/* Chat Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--surface-2)]">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-full py-10 space-y-8 animate-fade-in">
             <div className="w-16 h-16 bg-[var(--primary)]/5 rounded-2xl flex items-center justify-center border border-[var(--primary)]/10">
                <Shield size={32} className="text-[var(--primary)]" />
             </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] text-center font-display">{t('chat.welcome_message')}</h3>

            <div className="w-full max-w-lg">
              <p className="text-xs font-bold text-[var(--text-tertiary)] mb-4 uppercase tracking-[2px] text-center">{isHindi ? "कुछ प्रश्न पूछें:" : "Suggested Questions"}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!!(limitInfo && !limitInfo.allowed)}
                    onClick={() => handleSubmit(s)}
                    className="flex-shrink-0 bg-white border border-[var(--border)] rounded-[6px] px-4 py-3 text-sm text-[var(--text-secondary)] font-medium text-left hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/[0.04] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[var(--shadow-low)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            {msg.role === 'user' ? (
              <div className="max-w-[80%] p-3 px-4 text-[15px] leading-relaxed shadow-[var(--shadow-low)] transition-all bg-[var(--primary)] text-white rounded-[12px_12px_2px_12px] font-medium">
                {renderMessage(msg, i)}
              </div>
            ) : (
              <div className="max-w-[85%] flex items-start gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[var(--primary)]/5 border border-[var(--primary)]/10 flex items-center justify-center shrink-0 mt-1">
                   <Landmark size={14} className="text-[var(--primary)]" />
                </div>
                <div className="p-3 px-4 text-[15px] leading-relaxed shadow-[var(--shadow-low)] transition-all bg-white border border-[var(--border)] text-[var(--text-primary)] rounded-[12px_12px_12px_2px]">
                  {renderMessage(msg, i)}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in items-start gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[var(--primary)]/5 border border-[var(--primary)]/10 flex items-center justify-center shrink-0">
                <Landmark size={14} className="text-[var(--primary)]" />
            </div>
            <div className="bg-white border border-[var(--border)] p-4 rounded-[12px_12px_12px_2px] shadow-[var(--shadow-low)] flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-[13px] text-[var(--text-secondary)] font-medium">{t('chat.thinking')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-[var(--surface)] border-t border-[var(--border)] space-y-4">
        {limitInfo && (
            <div className="flex justify-center">
                <span className={`text-[11px] font-medium px-3 py-1 rounded-[4px] tracking-wide flex items-center gap-1.5 ${limitInfo.remaining === 0 ? 'bg-red-50 text-[var(--error)]' : 'bg-[var(--surface-3)] text-[var(--text-secondary)] border border-[var(--border)]'}`}>
                    {limitInfo.remaining}/20 prompts left
                </span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto w-full">
          <div className="relative flex-1 group rounded-[8px] bg-[var(--surface-2)]">
            <input
              ref={inputRef}
              type="text"
              value={input}
              disabled={limitInfo?.allowed === false}
              onChange={(e) => setInput(e.target.value)}
              placeholder={limitInfo?.allowed === false ? (isHindi ? "दैनिक सीमा समाप्त" : "Daily limit reached") : t('chat.input_placeholder')}
              className="w-full bg-white border border-[var(--border)] rounded-[8px] px-4 py-3 text-[var(--text-base)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all duration-200 disabled:bg-[var(--surface-2)] disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim() || limitInfo?.allowed === false}
            className={`px-6 rounded-[8px] font-bold text-sm tracking-wide transition-all duration-200 shrink-0 shadow-[var(--shadow-low)] flex items-center gap-2 ${!input.trim() || limitInfo?.allowed === false
                ? 'bg-[var(--border)] text-[var(--text-tertiary)] cursor-not-allowed'
                : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-95'
              }`}
          >
            {isHindi ? "सेंड" : "Send"}
            <SendHorizontal size={18} />
          </button>
        </form>
        <p className="text-center text-[11px] text-[var(--text-tertiary)] font-medium">
          {t('chat.official_sources')}
        </p>
      </div>
    </div>
  );
}

const Shield = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </svg>
);
