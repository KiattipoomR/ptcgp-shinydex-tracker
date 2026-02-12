import { WebLocale } from './index'

export type Set = {
  id: string
  name: LocalizedText
  subsets?: Subset[]
  index?: number
}

export type Subset = {
  id: string
  name: LocalizedText
}

export type Card = {
  id: number
  setId: string
  subsetId?: string
  rarity: string
  pokedexNumber: number
  imageUrl: string
  name: LocalizedText
}

export type CardKeyParts = {
  setId: string
  subsetId?: string
  id: number
}

export type LocalizedText = Record<Exclude<WebLocale, WebLocale.English>, string> &
  Record<WebLocale.English, string>
