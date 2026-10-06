'use client';

import i18n from '@/i18n';
import { createContext, useContext, useEffect, useState } from 'react';

interface LanguageContextProps {
  lang: 'pt' | 'en';
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  lang: 'pt',
  toggleLanguage: () => {}
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as 'pt' | 'en' | null;
    if (storedLang) {
      setLang(storedLang);
      i18n.changeLanguage(storedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'pt' ? 'en' : 'pt';
    setLang(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
