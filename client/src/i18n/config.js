import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    resources: {
      de: {
        translations: require('./locales/de/translations.json'),
      },
      en: {
        translations: require('./locales/en/translations.json'),
      },
    },
    ns: ['translations'],
    defaultNS: 'translations',
  });

i18n.languages = ['de', 'en'];

export default i18n;
