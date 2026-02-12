import { createI18n } from 'vue-i18n'
import en from '@/i18n/en.json'
import ja from '@/i18n/ja.json'
import { LANGUAGE_STORAGE_KEY, WebLocale } from '@/data/constants'

function resolveInitialLocale(): WebLocale {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as WebLocale | null
  if (stored && Object.values(WebLocale).includes(stored)) {
    return stored
  }

  const lang = (navigator.language.split('-')[0] ?? '') as WebLocale
  if (lang && Object.values(WebLocale).includes(lang)) return lang

  return WebLocale.English
}

export const i18n = createI18n({
  legacy: false,
  locale: resolveInitialLocale(),
  fallbackLocale: WebLocale.English,
  messages: {
    en,
    ja,
  },
})
