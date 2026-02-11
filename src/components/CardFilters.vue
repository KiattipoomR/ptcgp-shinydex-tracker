<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  searchQuery: string
  missingOnly: boolean
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:missingOnly', value: boolean): void
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
</style>

