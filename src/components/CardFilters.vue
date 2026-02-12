<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  searchQuery: string
  missingOnly: boolean
  rarityOptions?: string[]
  selectedRarity?: string
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:missingOnly', value: boolean): void
  (e: 'update:selectedRarity', value: string): void
  (e: 'update:sortBy', value: string): void
  (e: 'update:sortDir', value: 'asc' | 'desc'): void
}>()

const { t } = useI18n()

function onSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:searchQuery', target.value)
}

function onMissingToggle(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:missingOnly', target.checked)
}

function onResetSort() {
  emit('update:sortBy', 'pokedex')
  emit('update:sortDir', 'asc')
}
</script>

<template>
  <div class="filters">
    <label class="search">
      <span class="label">
        {{ t('filters.search_label') }}
      </span>
      <input
        class="input"
        type="text"
        :value="searchQuery"
        :placeholder="t('filters.search_placeholder')"
        @input="onSearchInput"
      />
    </label>

    <label class="checkbox">
      <input
        type="checkbox"
        class="checkbox-input"
        :checked="missingOnly"
        @change="onMissingToggle"
      />
      <span class="checkbox-label">
        {{ t('filters.missing_only') }}
      </span>
    </label>

    <label class="field">
      <span class="label">{{ t('filters.rarity_label') }}</span>
      <select
        class="select"
        :value="selectedRarity ?? 'all'"
        @change="(e) => emit('update:selectedRarity', (e.target as HTMLSelectElement).value)"
      >
        <option value="all">{{ t('filters.rarity_all') }}</option>
        <option v-for="r in rarityOptions ?? []" :key="r" :value="r">{{ r }}</option>
      </select>
    </label>

    <label class="field">
      <span class="label">{{ t('filters.sort_label') }}</span>
      <div style="display: flex; gap: 0.5rem; align-items: center">
        <select
          class="select"
          :value="sortBy ?? 'pokedex'"
          @change="(e) => emit('update:sortBy', (e.target as HTMLSelectElement).value)"
        >
          <option value="pokedex">{{ t('filters.sort_by_pokedex') }}</option>
          <option value="set">{{ t('filters.sort_by_set') }}</option>
          <option value="rarity" v-if="selectedRarity !== 'all'">
            {{ t('filters.sort_by_rarity') }}
          </option>
        </select>

        <select
          class="select"
          :value="sortDir ?? 'asc'"
          @change="
            (e) => emit('update:sortDir', (e.target as HTMLSelectElement).value as 'asc' | 'desc')
          "
        >
          <option value="asc">{{ t('filters.sort_dir_asc') }}</option>
          <option value="desc">{{ t('filters.sort_dir_desc') }}</option>
        </select>

        <button type="button" class="reset-button" @click="onResetSort">
          {{ t('filters.reset_sort') }}
        </button>
      </div>
    </label>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.search {
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.8rem;
  opacity: 0.85;
}

.input {
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.7);
  padding: 0.45rem 0.75rem;
  background-color: rgba(15, 23, 42, 0.02);
  color: inherit;
}

.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
}

.reset-button {
  border: none;
  background: transparent;
  color: inherit;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
}

.reset-button:hover {
  background-color: rgba(15, 23, 42, 0.06);
}
</style>
