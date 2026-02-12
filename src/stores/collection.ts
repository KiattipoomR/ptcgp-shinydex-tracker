import { defineStore } from 'pinia'

import { makeCardKey } from '@/data'
import type { CardKeyParts } from '@/data/types'

import { STORAGE_KEY } from './constants'

type OwnedByKey = Record<string, boolean>

export const loadOwned = (): OwnedByKey => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return {}

    const out: OwnedByKey = {}
    parsed.forEach((key: string) => {
      out[key] = true
    })

    return out
  } catch {
    // ignore parsing errors and fall back to empty
  }

  return {}
}

export const saveOwned = (data: OwnedByKey) => {
  try {
    const keys = Object.keys(data).filter((k) => data[k])
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
  } catch {
    // ignore write errors
  }
}

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    ownedByKey: loadOwned() as OwnedByKey,
  }),
  actions: {
    isOwnedByParts(parts: CardKeyParts): boolean {
      const key = makeCardKey(parts)
      return this.ownedByKey[key] ?? false
    },
    isOwnedByKey(key: string): boolean {
      return this.ownedByKey[key] ?? false
    },
    toggleOwnedByKey(key: string) {
      const current = this.ownedByKey[key] ?? false
      this.ownedByKey[key] = !current
      saveOwned(this.ownedByKey)
    },
  },
})
