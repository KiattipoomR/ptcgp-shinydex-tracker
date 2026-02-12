<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/AppHeader.vue'
import SetPicker from '@/components/SetPicker.vue'
import CardFilters from '@/components/CardFilters.vue'
import CardGrid from '@/components/CardGrid.vue'
import { cards, getLocalizedName, makeCardKey, sets } from '@/data'
import type { Card } from '@/data/types'
import { useCollectionStore } from '@/stores/collection'
import type { WebLocale } from './data/constants'

const collection = useCollectionStore()
const { locale } = useI18n()

const selectedSetId = ref<string>('all')
const selectedSubsetId = ref<string>('all')
const searchQuery = ref<string>('')
const missingOnly = ref<boolean>(false)

const selectedRarity = ref<string>('all')
const sortBy = ref<string>('pokedex')
const sortDir = ref<'asc' | 'desc'>('asc')

const filteredCards = computed<Card[]>(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const currentLocale = locale.value as WebLocale
  const filtered = cards.filter((card) => {
    if (selectedSetId.value !== 'all' && card.setId !== selectedSetId.value) {
      return false
    }

    if (selectedSubsetId.value !== 'all' && card.subsetId !== selectedSubsetId.value) {
      return false
    }

    if (query) {
      const name = getLocalizedName(card.name, currentLocale)
      const matchesName = name.includes(query)
      const matchesDex = card.pokedexNumber.toString().includes(query)
      if (!matchesName && !matchesDex) {
        return false
      }
    }

    if (selectedRarity.value && selectedRarity.value !== 'all') {
      if (card.rarity !== selectedRarity.value) return false
    }

    const key = makeCardKey({
      setId: card.setId,
      subsetId: card.subsetId,
      id: card.id,
    })
    const owned = collection.isOwnedByKey(key)

    if (missingOnly.value && owned) {
      return false
    }

    return true
  })

  // Sorting
  const rarityOrder = Array.from(new Set(cards.map((c) => c.rarity))).sort()

  // Map setId -> set index for set sorting (fallback to 0)
  const setIndexMap = new Map<string, number>(
    sets.map((s, i) => [s.id, typeof s.index === 'number' ? s.index : i]),
  )

  const sorted = filtered.slice().sort((a, b) => {
    let cmp = 0
    if (sortBy.value === 'pokedex') {
      cmp = a.pokedexNumber - b.pokedexNumber
    } else if (sortBy.value === 'set') {
      const aSet = setIndexMap.get(a.setId) ?? 0
      const bSet = setIndexMap.get(b.setId) ?? 0
      if (aSet !== bSet) return aSet - bSet
      // if same set, fall back to card id
      cmp = a.id - b.id
    } else if (sortBy.value === 'rarity') {
      const ai = rarityOrder.indexOf(a.rarity)
      const bi = rarityOrder.indexOf(b.rarity)
      cmp = ai - bi
    }

    return sortDir.value === 'asc' ? cmp : -cmp
  })

  return sorted
})

const gridItems = computed(() =>
  filteredCards.value.map((card) => {
    const storageKey = makeCardKey({
      setId: card.setId,
      subsetId: card.subsetId,
      id: card.id,
    })

    return {
      card,
      storageKey,
      owned: collection.isOwnedByKey(storageKey),
    }
  }),
)

const rarityOptions = computed(() => {
  return Array.from(new Set(cards.map((c) => c.rarity))).sort()
})

const totalCards = computed(() => cards.length)
const ownedCards = computed(() => {
  return cards.reduce((count, card) => {
    const key = makeCardKey({
      setId: card.setId,
      subsetId: card.subsetId,
      id: card.id,
    })
    return collection.isOwnedByKey(key) ? count + 1 : count
  }, 0)
})

function handleToggleOwned(key: string) {
  collection.toggleOwnedByKey(key)
}
</script>

<template>
  <div class="layout">
    <AppHeader :total-cards="totalCards" :owned-cards="ownedCards" />

    <section class="controls">
      <SetPicker
        :sets="sets"
        v-model:selected-set-id="selectedSetId"
        v-model:selected-subset-id="selectedSubsetId"
        :current-locale="locale as WebLocale"
      />

      <CardFilters
        v-model:search-query="searchQuery"
        v-model:missing-only="missingOnly"
        :rarity-options="rarityOptions"
        v-model:selected-rarity="selectedRarity"
        v-model:sort-by="sortBy"
        v-model:sort-dir="sortDir"
      />
    </section>

    <section class="grid-section">
      <CardGrid :items="gridItems" @toggle-owned="handleToggleOwned" />
    </section>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 1rem 2rem;
  max-width: 1120px;
  margin: 0 auto;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.grid-section {
  min-height: 200px;
}
</style>
