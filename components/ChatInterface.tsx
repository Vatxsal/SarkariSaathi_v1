'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Loader2, Landmark, ArrowLeft, SendHorizontal } from 'lucide-react';
import { detectIntent } from '@/lib/gemini';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function ChatInterface() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent | string) => {
    const isString = typeof e === 'string';
    if (!isString && e) e.preventDefault();

    const userMsg = (isString ? e : input.trim()).replace(/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/gu, '').trim();
    if (!userMsg || isLoading) return;

    if (!isString) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const state = localStorage.getItem('selectedState') || 'Not mentioned';

    try {
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY === 'your_key_here') {
        throw new Error("API_KEY_MISSING");
      }

      const data = await detectIntent(userMsg, state, i18n.language);

      if (data) {
        if (data.service && data.subcase && data.state && data.confidence > 0.6) {
          const serviceName = data.service.replace(/_/g, ' ');
          const subcaseName = data.subcase.replace(/_/g, ' ');
          setMessages(prev => [...prev, {
            role: 'bot',
            content: `${t('redirecting')} ${serviceName} (${subcaseName}) in ${data.state}. ${t('redirecting_suffix')}`
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
      let errorMsg = `${t('chat_error')} ${error.message || 'Unknown error'}`;

      if (error.message === 'API_KEY_MISSING') {
        errorMsg = t('api_key_missing');
      }

      setMessages(prev => [...prev, { role: 'bot', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    t('chat.suggestion_1'),
    t('chat.suggestion_2'),
    t('chat.suggestion_3')
  ];

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden animate-fade-in relative z-10">
      <div className="bg-[#0F3380] p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-white" />
          </Link>
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border-2 border-white shrink-0">
            <Landmark size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-base leading-none text-white">{t('chat.assistant_title')}</h2>
              <span className="text-[11px] font-normal opacity-80 text-white leading-none">({t('chat.assistant_name')})</span>
            </div>
            <p className="text-[12px] opacity-75 text-white leading-tight mt-1">{t('chat.help_subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">{t('chat.online_status')}</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F7F8FA]">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-full py-10 space-y-8 animate-fade-in">
            <h3 className="text-[16px] font-medium text-[#1A1A2E] text-center">{t('chat.welcome_message')}</h3>

            <div className="flex flex-col gap-3 w-full max-w-sm">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(s)}
                  className="bg-white border border-[#E2E8F0] rounded-full px-5 py-3 text-[14px] text-[#1A1A2E] text-left hover:border-[#1B4FA8] hover:bg-[#E8F0FD] hover:shadow-sm transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div
              className={`max-w-[85%] p-4 text-[15px] leading-relaxed shadow-sm transition-all duration-200 ${msg.role === 'user'
                  ? 'bg-[#1B4FA8] text-white rounded-[16px_16px_4px_16px]'
                  : 'bg-white border border-[#E2E8F0] text-[#1A1A2E] rounded-[16px_16px_16px_4px]'
                }`}
            >
              <p className={`whitespace-pre-wrap leading-[1.6] ${msg.role === 'user' ? 'text-white' : 'text-[#1A1A2E]'}`} style={{ color: msg.role === 'user' ? '#FFFFFF' : undefined }}>
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-[16px_16px_16px_4px] shadow-sm flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#1B4FA8] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-[#1B4FA8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-[#1B4FA8] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-[13px] text-[#4A5568] font-medium">{t('chat.thinking')}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-[#E2E8F0] space-y-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1 group focus-glow rounded-xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.input_placeholder')}
              className="w-full bg-white border-[1.5px] border-[#E2E8F0] rounded-xl px-4 py-3 text-base text-[#1A1A2E] placeholder:text-[#4A5568]/50 focus:border-[#1B4FA8] outline-none transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`w-[48px] h-[48px] rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 shadow-sm ${!input.trim()
                ? 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                : 'bg-[#E07B00] text-white hover:bg-[#c66c00] active:scale-95'
              }`}
          >
            <SendHorizontal size={22} strokeWidth={2.5} />
          </button>
        </form>
        <p className="text-center text-[12px] text-[#4A5568] font-medium tracking-wide">
          {t('chat.official_sources')}
        </p>
      </div>
    </div>
  );
}
