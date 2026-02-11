import setsJson from './sets.json'
import cardsJson from './cards.json'
import type { Card, CardKeyParts, Set } from './types'

export const sets = setsJson as Set[]
export const cards = cardsJson as Card[]

export function makeCardKey(parts: CardKeyParts): string {
  const base = parts.subsetId ?? parts.setId
  return `${base}-${parts.id}`
}

