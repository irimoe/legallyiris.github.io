<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const props = defineProps<{
  screenshots: { url: string; alt: string }[]
}>()
</script>

<template>
  <div class="screenshot-gallery">
    <div class="screenshot" v-for="screenshot in props.screenshots" :key="screenshot.url">
      <img :src="screenshot.url" :alt="screenshot.alt" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../css/_variables.scss' as *;

.screenshot-gallery {
  width: 100%;
  display: flex;
  overflow-x: auto;
  gap: 0.5rem;
  border-radius: 1rem;

  .screenshot {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    max-width: 100%;

    img {
      max-height: 468px;
      max-width: 100%;
      height: auto;
      width: auto;
      border-radius: 1rem;
      display: block;
    }
  }
}
</style>
