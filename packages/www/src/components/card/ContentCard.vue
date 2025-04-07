<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  description: string
  link: string
  meta?: {
    date?: string
    readingTime?: string
    status?: 'active' | 'maintained' | 'archived'
    tech?: string[]
  }
}>()

const statusColor = computed(() => {
  if (!props.meta?.status) return ''

  switch (props.meta.status) {
    case 'active':
      return 'var(--green)'
    case 'maintained':
      return 'var(--blue)'
    case 'archived':
      return 'var(--subtext0)'
    default:
      return 'var(--subtext0)'
  }
})
</script>

<template>
  <div class="card">
    <div class="card__header">
      <RouterLink :to="link" class="card__header-link">
        <h3>{{ title }}</h3>
      </RouterLink>

      <div
        v-if="meta?.status"
        class="card__header-status"
        :style="{ '--status-color': statusColor }"
      >
        <span class="visually-hidden">Status:</span> {{ meta.status }}
      </div>
    </div>

    <p class="card__description">{{ description }}</p>

    <div v-if="meta?.date || meta?.readingTime" class="card__meta" aria-label="Post details">
      <time v-if="meta.date">
        <span class="visually-hidden">published:</span> {{ meta.date }}
      </time>
      <span class="card-meta__reading-time" v-if="meta.readingTime" aria-label="time to read">{{
        meta.readingTime
      }}</span>
    </div>

    <div v-if="meta?.tech?.length" class="card__meta__tech-stack" aria-label="Technologies used">
      <span class="visually-hidden">Technologies used:</span>
      <span v-for="tech in meta.tech" :key="tech" class="card__meta__tech-stack__item">{{
        tech
      }}</span>
    </div>

    <RouterLink :to="link" class="card__overlay-link" aria-hidden="true" tabindex="-1"></RouterLink>
  </div>
</template>

<style scoped lang="scss">
@use '@/css/_variables.scss' as *;

.card {
  position: relative;
  display: block;
  padding: 1rem;
  border-radius: 0.5rem;
  background: hsla(var(--mantle) / 0.6);
  border: 1px solid hsla(var(--overlay0) / 0.5);
  text-decoration: none;
  color: inherit;
  outline: 2px solid transparent;
  transition: $transition;

  &__overlay-link {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;

    a {
      outline: none;
    }

    h3 {
      margin: 0;
      font-size: 1.25rem;
      color: hsla(var(--subtext0) / 1);
      transition: $transition;
    }

    &-status {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      background: hsla(var(--status-color) / 0.1);
      color: hsl(var(--status-color));
      border: 1px solid hsla(var(--status-color) / 0.2);
    }
  }

  &__description {
    margin: 0;
    margin-bottom: 0.5rem;
    color: hsla(var(--subtext0) / 1);
    font-size: 0.875rem;
  }

  &__meta {
    font-size: 0.75rem;
    color: hsla(var(--subtext0) / 0.8);
    display: flex;
    gap: 1rem;
    margin: 0.25rem 0;

    &__tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;

      &__item {
        font-size: 0.75rem;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        background: hsla(var(--mauve) / 0.1);
        color: hsl(var(--mauve));
        border: 1px solid hsla(var(--mauve) / 0.2);
        user-select: none;
      }
    }
  }

  &:hover {
    background: hsla(var(--base) / 1);
    border-color: hsla(var(--overlay0) / 0.8);
    h3 {
      color: hsla(var(--text) / 1);
    }
  }

  &:active {
    background: hsla(var(--base) / 0.65);
    border-color: hsla(var(--overlay0) / 0.65);
  }

  &:has(*:focus-visible) {
    outline: 2px solid hsla(var(--blue) / 1);
    outline-offset: 2px;
  }
}
</style>
