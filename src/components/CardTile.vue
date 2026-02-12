<script setup lang="ts">
import { computed, ref } from 'vue'

import { useI18n } from 'vue-i18n'

import { getLocalizedName, getLocalizedSetName, WebLocale } from '@/data'
import type { Card } from '@/data/types'

const props = defineProps<{
  card: Card
  owned: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

const { locale } = useI18n()

const displayName = computed(() => getLocalizedName(props.card.name, locale.value as WebLocale))

const setNames = computed(() =>
  getLocalizedSetName(props.card.setId, locale.value as WebLocale, props.card.subsetId),
)

const imageError = ref(false)
const hasImage = computed(() => !!props.card.imageUrl && !imageError.value)

const onToggle = (event?: Event) => {
  if (event) event.stopPropagation()
  emit('toggle')
}
</script>

<template>
  <button
    :class="['card', { owned: owned, missing: !owned }]"
    role="button"
    :aria-pressed="owned"
    tabindex="0"
    @click="onToggle"
  >
    <div class="image-wrapper">
      <div class="image-container">
        <img
          v-if="hasImage"
          :src="card.imageUrl"
          :alt="displayName"
          loading="lazy"
          @error="imageError = true"
          @load="imageError = false"
        />

        <div v-else class="image-placeholder" aria-hidden="true">
          <div class="placeholder-inner">
            <span class="placeholder-diamond">✦</span>
          </div>
        </div>

        <div class="image-overlay" aria-hidden="true"></div>
        <span class="dex-badge">#{{ card.pokedexNumber }}</span>
        <span class="rarity-tag">
          {{ card.rarity }}
        </span>
      </div>
    </div>

    <div class="content">
      <h3 class="name">
        {{ displayName }}
      </h3>
      <p class="meta">
        <strong>{{ setNames.setName }}</strong>
        <span v-if="setNames.subsetName"> · {{ setNames.subsetName }}</span>
      </p>
    </div>
  </button>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: linear-gradient(135deg, var(--card-bg-top), var(--card-bg-bottom));
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
  cursor: pointer;
}

.image-wrapper {
  position: relative;
  aspect-ratio: 5 / 7;
  background: radial-gradient(circle, rgba(148, 163, 184, 0.06), transparent);
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  border-top-left-radius: 0.85rem;
  border-top-right-radius: 0.85rem;
  overflow: hidden;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-container img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: var(--card-overlay-gradient);
  opacity: 0;
  transition:
    opacity 0.18s ease,
    background-color 0.18s ease;
  z-index: 0;
}

.card:hover .image-overlay,
.card:focus .image-overlay {
  opacity: 1;
}

.card.owned .image-overlay {
  background: var(--card-owned-overlay), var(--card-overlay-gradient);
  opacity: 1;
}

.dex-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  padding: 0.08rem 0.35rem;
  border-radius: 0.35rem;
  font-size: 0.72rem;
  background: rgba(10, 10, 10, 0.5);
  color: var(--accent-yellow);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 3;
  pointer-events: none;
  font-weight: 800;
}

.image-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02));
  z-index: 1;
}

.placeholder-inner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-diamond {
  font-size: 28px;
  color: var(--placeholder-fg);
}

.rarity-tag {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  background: var(--rarity-tag-bg);
  color: var(--rarity-text);
}

.name {
  color: var(--color-heading);
}

.meta {
  color: var(--color-text);
}

.content {
  padding: 0.75rem 0.85rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.name {
  font-size: 0.95rem;
  font-weight: 600;
}

.meta {
  font-size: 0.8rem;
  opacity: 0.85;
  align-items: center;
}

.card:focus {
  outline: 3px solid var(--card-focus-outline);
  box-shadow: 0 6px 18px var(--card-hover-shadow-color);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px var(--card-hover-shadow-color);
}

.card.missing {
  filter: var(--card-missing-filter);
  opacity: 0.72;
}

.card.missing .rarity-tag {
  opacity: 0.7;
}
</style>
