<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Card } from '@/data/types'
import { getLocalizedName } from '@/data'
import type { WebLocale } from '@/data/constants'

const props = defineProps<{
  card: Card
  owned: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

const { t, locale } = useI18n()

const displayName = computed(() => getLocalizedName(props.card.name, locale.value as WebLocale))

function onToggle(event?: Event) {
  if (event) event.stopPropagation()
  emit('toggle')
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('toggle')
  }
}
</script>

<template>
  <article
    :class="['card', { owned: owned, missing: !owned }]"
    role="button"
    :aria-pressed="owned"
    tabindex="0"
    @click="onToggle"
    @keydown="onKeyDown"
  >
    <div class="image-wrapper">
      <img :src="card.imageUrl" :alt="displayName" loading="lazy" />
      <span class="rarity-tag">
        {{ card.rarity }}
      </span>
    </div>

    <div class="content">
      <h3 class="name">
        {{ displayName }}
      </h3>
      <p class="meta">
        #{{ card.pokedexNumber }} · {{ card.setId
        }}<span v-if="card.subsetId"> / {{ card.subsetId }}</span>
      </p>

      <button
        type="button"
        class="owned-button"
        :class="{ owned }"
        @click.stop="onToggle"
        :aria-pressed="owned"
      >
        <span class="dot" />
        <span class="label">
          {{ owned ? t('collection.owned') : t('collection.not_owned') }}
        </span>
      </button>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background:
    radial-gradient(circle at top, rgba(251, 191, 36, 0.2), transparent),
    radial-gradient(circle at bottom, rgba(59, 130, 246, 0.18), transparent);
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
  cursor: pointer;
}

.image-wrapper {
  position: relative;
  aspect-ratio: 3 / 4;
  background: radial-gradient(circle, rgba(148, 163, 184, 0.3), transparent);
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.rarity-tag {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  background: rgba(15, 23, 42, 0.85);
  color: #f9fafb;
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
}

.owned-button {
  margin-top: 0.25rem;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.8);
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  background-color: rgba(15, 23, 42, 0.02);
  color: inherit;
  cursor: pointer;
  transition:
    background-color 0.15s ease-out,
    border-color 0.15s ease-out;
}

.card:focus {
  outline: 3px solid rgba(59, 130, 246, 0.18);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.card.missing {
  filter: grayscale(80%) contrast(0.9);
  opacity: 0.72;
}

.card.missing .rarity-tag {
  opacity: 0.7;
}

.card.missing .owned-button {
  opacity: 0.95;
}

.owned-button .dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background-color: rgba(248, 250, 252, 0.6);
}

.owned-button.owned {
  background-color: rgba(22, 163, 74, 0.16);
  border-color: rgba(34, 197, 94, 0.9);
}

.owned-button.owned .dot {
  background-color: rgba(34, 197, 94, 0.95);
}
</style>
