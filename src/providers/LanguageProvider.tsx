'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type Language = 'pt' | 'en';
interface LangContextType {
  lang: Language;
  toggleLanguage: () => void;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const useLanguage = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider');
  return ctx;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    // tenta ler do localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lang');
      if (stored === 'en' || stored === 'pt') return stored;
    }
    return 'pt';
  });

  const toggleLanguage = () => {
    setLang((prev) => {
      const next = prev === 'pt' ? 'en' : 'pt';
      localStorage.setItem('lang', next);
      return next;
    });
  };

  return (
    <LangContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LangContext.Provider>
  );
}
