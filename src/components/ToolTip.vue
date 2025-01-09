<template>
  <div class="tooltip-container">
    <slot :show="show" :hide="hide"></slot>
    <div class="tooltip" :class="{ visible: isVisible }">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  text: string
}>()

const isVisible = ref(false)
let showTimeout: number | null = null

const show = () => {
  if (showTimeout) return
  showTimeout = window.setTimeout(() => {
    isVisible.value = true
    showTimeout = null
  }, 200)
}

const hide = () => {
  if (showTimeout) {
    window.clearTimeout(showTimeout)
    showTimeout = null
  }
  isVisible.value = false
}
</script>

<style scoped lang="scss">
@use '../css/_variables.scss' as *;

.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;

  background: hsla(var(--surface0) / 0.5);
  border: 1px solid hsla(var(--overlay2) / 0.5);
  color: hsla(var(--text) / 0.9);
  backdrop-filter: blur(0.25rem);

  opacity: 0;
  bottom: calc(100%);

  visibility: hidden;
  transition: $transition;

  &.visible {
    bottom: calc(100% + 0.5rem);
    opacity: 1;
    visibility: visible;
  }
}
</style>
