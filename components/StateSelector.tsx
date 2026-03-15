'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, X, ChevronDown } from 'lucide-react';
import { allStates } from '@/lib/states';
import { useStateContext } from '@/context/StateContext';

export default function StateSelector() {
  const { t } = useTranslation();
  const { selectedState, setSelectedState } = useStateContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isFocused) {
      setSearchTerm(selectedState || '');
    }
  }, [selectedState, isFocused]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (state: string) => {
    setSelectedState(state);
    setSearchTerm(state);
    setIsOpen(false);
    setIsFocused(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedState('');
    setSearchTerm('');
    setIsOpen(false);
    setIsFocused(false);
  };

  const filteredStates = allStates
    .filter(state => {
      const s = state.toLowerCase();
      const t_val = searchTerm.toLowerCase();
      return s.startsWith(t_val) || s.includes(t_val);
    })
    .slice(0, 6);

  if (!mounted) {
    return <div className="h-10 w-32 bg-white/5 rounded-full" />;
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className={`flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border transition-all duration-300 ${
        (isOpen || isFocused)
          ? 'border-white ring-2 ring-white/10' 
          : 'border-white/20'
      }`}>
        <MapPin size={16} className="shrink-0 text-white/70" />
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          placeholder={t('select_state')}
          className="bg-transparent text-[14px] font-bold focus:outline-none text-white w-24 md:w-32 placeholder:text-white/50"
        />

        <div className="flex items-center ml-1">
          {selectedState || searchTerm ? (
            <button 
              onClick={handleClear} 
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              title="Clear selection"
            >
              <X size={14} className="text-white/70 hover:text-white" />
            </button>
          ) : (
            <ChevronDown size={14} className="text-white/40" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-[#E2E8F0] overflow-hidden z-[100] animate-fade-in min-w-[200px]">
          <div className="max-h-64 overflow-y-auto py-1">
            {filteredStates.length > 0 ? (
              filteredStates.map((state) => (
                <button
                  key={state}
                  onClick={() => handleSelect(state)}
                  className={`w-full text-left px-4 py-3 text-[14px] hover:bg-[#F7F8FA] transition-colors flex items-center justify-between group ${selectedState === state ? 'bg-[#E8F0FD] text-[#1B4FA8] font-bold' : 'text-[#1A1A2E] font-medium'}`}
                >
                  {state}
                  {selectedState === state && <div className="w-1.5 h-1.5 bg-[#1B4FA8] rounded-full"></div>}
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-[13px] text-[#4A5568] text-center italic">
                {t('no_state_found')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
