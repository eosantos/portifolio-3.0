import i18n from '@/i18n';
import { createContext, useContext, useState } from 'react';

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

  const toggleLanguage = () => {
    const newLang = lang === 'pt' ? 'en' : 'pt';
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
