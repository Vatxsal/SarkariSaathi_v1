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
    return <div className="h-8 w-32 bg-white/10 rounded-[20px]" />;
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-[20px] border transition-all duration-200 cursor-pointer ${
        (isOpen || isFocused)
          ? 'bg-white/20 border-white ring-2 ring-white/10' 
          : 'bg-transparent border-white/30 hover:border-white/60'
      }`}>
        <MapPin size={14} className="shrink-0 text-white" />
        
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
          className="bg-transparent text-[13px] font-medium focus:outline-none text-white w-20 md:w-28 placeholder:text-white/60"
        />

        <div className="flex items-center">
          {selectedState || searchTerm ? (
            <button 
              onClick={handleClear} 
              className="p-0.5 hover:bg-white/10 rounded-full transition-colors"
              title="Clear selection"
            >
              <X size={12} className="text-white/80 hover:text-white" />
            </button>
          ) : (
            <ChevronDown size={12} className="text-white/60" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-[8px] shadow-[var(--shadow-high)] border border-[var(--border)] overflow-hidden z-[100] min-w-[200px]">
          <div className="max-h-64 overflow-y-auto py-1">
            {filteredStates.length > 0 ? (
              filteredStates.map((state) => (
                <button
                  key={state}
                  onClick={() => handleSelect(state)}
                  className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-[var(--surface-2)] transition-colors flex items-center justify-between group ${selectedState === state ? 'bg-[var(--surface-3)] text-[var(--primary)] font-semibold' : 'text-[var(--text-primary)] font-medium'}`}
                >
                  {state}
                  {selectedState === state && <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></div>}
                </button>
              ))
            ) : (
              <div className="px-4 py-4 text-[12px] text-[var(--text-secondary)] text-center italic">
                {t('no_state_found')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
