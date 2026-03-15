'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StateContextType {
  selectedState: string;
  setSelectedState: (state: string) => void;
}

const StateContext = createContext<StateContextType>({
  selectedState: '',
  setSelectedState: () => {},
});

export function StateProvider({ children }: { children: ReactNode }) {
  const [selectedState, setSelectedStateRaw] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('selectedState');
    if (saved) {
      setSelectedStateRaw(saved);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'selectedState') {
        setSelectedStateRaw(e.newValue || '');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setSelectedState = (state: string) => {
    setSelectedStateRaw(state);
    localStorage.setItem('selectedState', state);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <StateContext.Provider value={{ selectedState, setSelectedState }}>
      {children}
    </StateContext.Provider>
  );
}

export const useStateContext = () => useContext(StateContext);
