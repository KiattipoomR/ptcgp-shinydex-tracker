import setsJson from '@/data/sets.json'
import cardsJson from '@/data/cards.json'
import type { Card, CardKeyParts, LocalizedText, Set } from '@/data/types'
import { WebLocale } from '@/data/constants'

export const sets = setsJson as Set[]
export const cards = cardsJson as Card[]

export const makeCardKey = (parts: CardKeyParts): string => {
  const base = parts.subsetId ?? parts.setId
  return `${base}-${parts.id}`
}

export const getLocalizedName = (name: LocalizedText, locale: WebLocale): string => {
  return name[locale] || name[WebLocale.English]
}
