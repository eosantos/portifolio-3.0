import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from '@/i18n/locales/en/translation.json';
import translationPT from '@/i18n/locales/pt/translation.json';

const resources = {
  pt: { translation: translationPT },
  en: { translation: translationEN }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'pt', // idioma padrão
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
