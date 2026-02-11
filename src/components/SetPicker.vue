<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Set } from '../data/types'

const props = defineProps<{
  sets: Set[]
  selectedSetId: string
  selectedSubsetId: string
  currentLocale: 'en' | 'ja'
}>()

const emit = defineEmits<{
  (e: 'update:selectedSetId', value: string): void
  (e: 'update:selectedSubsetId', value: string): void
}>()

const { t } = useI18n()

const subsetOptions = computed(() => {
  const set = props.sets.find((s) => s.id === props.selectedSetId)
  return set?.subsets ?? []
})

function onSetChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = target.value
  emit('update:selectedSetId', value)
  emit('update:selectedSubsetId', 'all')
}

function onSubsetChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:selectedSubsetId', target.value)
}

function localizedName(name: { en: string; ja: string }) {
  return props.currentLocale === 'ja' ? name.ja : name.en
}
</script>

<template>
  <div class="set-picker">
    <label class="field">
      <span class="label">
        {{ t('sets.all') }}
      </span>
      <select class="select" :value="selectedSetId" @change="onSetChange">
        <option value="all">
          {{ t('sets.all') }}
        </option>
        <option v-for="set in sets" :key="set.id" :value="set.id">
          {{ localizedName(set.name) }}
        </option>
      </select>
    </label>

    <label class="field" v-if="subsetOptions.length > 0">
      <span class="label">
        {{ t('sets.subset_all') }}
      </span>
      <select class="select" :value="selectedSubsetId" @change="onSubsetChange">
        <option value="all">
          {{ t('sets.subset_all') }}
        </option>
        <option
          v-for="subset in subsetOptions"
          :key="subset.id"
          :value="subset.id"
        >
          {{ localizedName(subset.name) }}
        </option>
      </select>
    </label>
  </div>
</template>

<style scoped>
.set-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 180px;
}

.label {
  font-size: 0.8rem;
  opacity: 0.85;
}

.select {
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.7);
  padding: 0.4rem 0.75rem;
  background-color: rgba(15, 23, 42, 0.02);
  color: inherit;
}
</style>

