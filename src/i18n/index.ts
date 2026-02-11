import { createI18n } from 'vue-i18n'
import en from './en.json'
import ja from './ja.json'

export const LANGUAGE_STORAGE_KEY = 'shinydex:language'

function resolveInitialLocale(): 'en' | 'ja' {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored === 'en' || stored === 'ja') {
      return stored
    }

    if (typeof navigator !== 'undefined') {
      const lang = navigator.language.toLowerCase()
      if (lang.startsWith('ja')) return 'ja'
    }
  }

  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: resolveInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    ja,
  },
})

