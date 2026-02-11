export type LocalizedText = {
  en: string
  ja: string
}

export type Subset = {
  id: string
  name: LocalizedText
}

export type Set = {
  id: string
  name: LocalizedText
  subsets?: Subset[]
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

