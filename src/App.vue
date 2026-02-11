<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHeader from './components/AppHeader.vue'
import SetPicker from './components/SetPicker.vue'
import CardFilters from './components/CardFilters.vue'
import CardGrid from './components/CardGrid.vue'
import { cards, makeCardKey, sets } from './data'
import type { Card } from './data/types'
import { useCollectionStore } from './stores/collection'

const collection = useCollectionStore()
const { locale } = useI18n()

const selectedSetId = ref<string>('all')
const selectedSubsetId = ref<string>('all')
const searchQuery = ref<string>('')
const missingOnly = ref<boolean>(false)

const filteredCards = computed<Card[]>(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const currentLocale = (locale.value === 'ja' ? 'ja' : 'en') as 'en' | 'ja'

  return cards.filter((card) => {
    if (selectedSetId.value !== 'all' && card.setId !== selectedSetId.value) {
      return false
    }

    if (
      selectedSubsetId.value !== 'all' &&
      card.subsetId !== selectedSubsetId.value
    ) {
      return false
    }

    if (query) {
      const name =
        currentLocale === 'ja' ? card.name.ja.toLowerCase() : card.name.en.toLowerCase()
      const matchesName = name.includes(query)
      const matchesDex = card.pokedexNumber.toString().includes(query)
      if (!matchesName && !matchesDex) {
        return false
      }
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
        :current-locale="(locale as 'en' | 'ja')"
      />

      <CardFilters
        v-model:search-query="searchQuery"
        v-model:missing-only="missingOnly"
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

