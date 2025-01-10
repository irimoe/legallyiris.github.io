<template>
  <div class="tooltip-container">
    <slot :show="show" :hide="hide" class="tooltip-slot" />
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
  padding: 0.25rem 0.5rem;
  border-radius: 50rem;
  font-size: 0.75rem;
  white-space: nowrap;

  background: hsl(var(--surface0));
  border: 1px solid hsla(var(--overlay2) / 0.5);
  color: hsla(var(--text) / 1);
  transform: translateX(-50%) scale(0.5) translateY(-200%);
  filter: blur(0.25rem);

  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: $transition;

  &.visible {
    transform: translateX(-50%) scale(1) translateY(-225%);
    filter: blur(0);
    opacity: 1;
    visibility: visible;
  }
}
</style>
