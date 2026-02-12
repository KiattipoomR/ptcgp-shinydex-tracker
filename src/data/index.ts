import cardsJson from './json/cards.json'
import setsJson from './json/sets.json'
import { type Card, type CardKeyParts, type LocalizedText, type Set } from './types'

export const sets = setsJson as Set[]
export const cards = cardsJson as Card[]

export enum WebLocale {
  English = 'en',
  Japanese = 'ja',
}

export enum WebTheme {
  Light = 'light',
  Dark = 'dark',
}

export const makeCardKey = (parts: CardKeyParts): string => {
  const base = parts.subsetId ?? parts.setId
  return `${base}-${parts.id}`
}

export const getLocalizedName = (name: LocalizedText, locale: WebLocale): string => {
  return name[locale] || name[WebLocale.English]
}

export const getLocalizedSetName = (setId: string, locale: WebLocale, subsetId?: string) => {
  const set = sets.find((s) => s.id === setId)
  const setName = set ? getLocalizedName(set.name, locale) : setId

  let subsetName: string | undefined = undefined
  if (subsetId && set && Array.isArray(set.subsets)) {
    const subset = set.subsets.find((ss) => ss.id === subsetId)
    if (subset) subsetName = getLocalizedName(subset.name, locale)
  }

  return { setName, subsetName }
}
