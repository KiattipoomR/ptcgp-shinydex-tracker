import { defineStore } from 'pinia'
import type { CardKeyParts } from '@/data/types'
import { makeCardKey } from '@/data'
import { STORAGE_KEY } from '@/data/constants'

type OwnedByKey = Record<string, boolean>

function loadOwned(): OwnedByKey {
  if (typeof window === 'undefined') return {}

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      return parsed as OwnedByKey
    }
  } catch {
    // ignore parsing errors and fall back to empty
  }

  return {}
}

function saveOwned(data: OwnedByKey) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
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
