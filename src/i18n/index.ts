import { createI18n } from 'vue-i18n'

import { WebLocale } from '@/data'
import { LANGUAGE_STORAGE_KEY } from '@/stores/constants'

import en from './json/en.json'
import ja from './json/ja.json'

const resolveInitialLocale = (): WebLocale => {
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
