<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { LANGUAGE_STORAGE_KEY } from '../i18n'
import type { Theme } from '../theme'
import { initTheme, setTheme } from '../theme'

const props = defineProps<{
  totalCards: number
  ownedCards: number
}>()

const { t, locale } = useI18n()

const currentTheme = ref<Theme>('light')

const summaryText = computed(() =>
  t('header.summary', {
    owned: props.ownedCards,
    total: props.totalCards,
  }),
)

function switchLanguage(lang: 'en' | 'ja') {
  locale.value = lang
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  }
}

function switchTheme(theme: Theme) {
  currentTheme.value = theme
  setTheme(theme)
}

onMounted(() => {
  currentTheme.value = initTheme()
})
</script>

<template>
  <header class="app-header">
    <div class="titles">
      <h1 class="title">
        {{ t('app.title') }}
      </h1>
      <p class="summary">
        {{ summaryText }}
      </p>
    </div>

    <div class="controls">
      <div class="language-toggle" aria-label="Language">
        <label class="visually-hidden">{{ t('header.language_label') }}</label>
        <select
          class="lang-select"
          :value="locale"
          @change="(e) => switchLanguage((e.target as HTMLSelectElement).value as 'en' | 'ja')"
        >
          <option value="en">{{ t('header.language_en') }}</option>
          <option value="ja">{{ t('header.language_ja') }}</option>
        </select>
      </div>

      <div class="theme-toggle" aria-label="Theme">
        <button
          type="button"
          class="pill-button"
          :class="{ active: currentTheme === 'light' }"
          @click="switchTheme('light')"
        >
          ☀️
        </button>
        <button
          type="button"
          class="pill-button"
          :class="{ active: currentTheme === 'dark' }"
          @click="switchTheme('dark')"
        >
          🌙
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 1.25rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, rgba(246, 191, 38, 0.12), rgba(56, 189, 248, 0.14));
  border: 1px solid rgba(148, 163, 184, 0.4);
  backdrop-filter: blur(10px);
}

.titles {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.title {
  font-size: 1.4rem;
  font-weight: 700;
}

.summary {
  font-size: 0.9rem;
  opacity: 0.85;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.language-toggle,
.theme-toggle {
  display: inline-flex;
  padding: 2px;
  border-radius: 999px;
  background-color: rgba(15, 23, 42, 0.08);
}

.pill-button {
  border: none;
  background: transparent;
  color: inherit;
  font-size: 0.8rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background-color 0.15s ease-out,
    color 0.15s ease-out;
}

.pill-button.active {
  background-color: rgba(15, 23, 42, 0.9);
  color: #f9fafb;
}

.pill-button:not(.active):hover {
  background-color: rgba(15, 23, 42, 0.12);
}

.lang-select {
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.7);
  padding: 0.25rem 0.6rem;
  background-color: rgba(15, 23, 42, 0.02);
  color: inherit;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 640px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
