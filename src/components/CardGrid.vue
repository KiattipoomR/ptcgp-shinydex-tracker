<script setup lang="ts">
import type { Card } from '@/data/types'
import CardTile from '@/components/CardTile.vue'

defineProps<{
  items: {
    card: Card
    storageKey: string
    owned: boolean
  }[]
}>()

const emit = defineEmits<{
  (e: 'toggle-owned', key: string): void
}>()

function onToggle(key: string) {
  emit('toggle-owned', key)
}
</script>

<template>
  <div class="grid" v-if="items.length">
    <CardTile
      v-for="item in items"
      :key="item.storageKey"
      :card="item.card"
      :owned="item.owned"
      @toggle="onToggle(item.storageKey)"
    />
  </div>
  <p v-else class="empty">No cards match your filters.</p>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.empty {
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>
