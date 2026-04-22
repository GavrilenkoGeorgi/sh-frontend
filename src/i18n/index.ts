import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import en from './en.json'
import uk from './uk.json'
import de from './de.json'
import he from './he.json'

export const supportedLanguages = ['en', 'uk', 'de', 'he'] as const
export type SupportedLanguage = (typeof supportedLanguages)[number]
const rtlLanguages = new Set(['he'])

const getLanguageBase = (language: string | undefined): string =>
  language?.split('-')[0] ?? 'en'

const syncDocumentLanguage = (language: string | undefined): void => {
  const normalizedLanguage = getLanguageBase(language)

  document.documentElement.lang = normalizedLanguage
  document.documentElement.dir = rtlLanguages.has(normalizedLanguage)
    ? 'rtl'
    : 'ltr'
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      uk: { translation: uk },
      de: { translation: de },
      he: { translation: he }
    },
    supportedLngs: [...supportedLanguages],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    fallbackLng: 'en',
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  })

syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language)
i18n.on('languageChanged', syncDocumentLanguage)

export default i18n
