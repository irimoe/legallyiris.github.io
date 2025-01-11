<script setup lang="ts">
import { ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faShare } from '@fortawesome/free-solid-svg-icons'
import Tooltip from './ToolTip.vue'

const props = defineProps<{
  title: string
  url: string
}>()

const shareData = computed(() => ({
  title: props.title,
  url: props.url,
  text: `Check out "${props.title}"`,
}))

const canShare = computed(() => {
  if (!navigator.share) return false
  return true
})

const showCopied = ref(false)

const share = async () => {
  if (canShare.value) {
    try {
      await navigator.share(shareData.value)
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error sharing:', err)
      }
    }
  } else {
    await navigator.clipboard.writeText(props.url)
    showCopied.value = true
    setTimeout(() => {
      showCopied.value = false
    }, 2000)
  }
}
</script>

<template>
  <Tooltip :text="showCopied ? 'Copied!' : canShare ? 'Share' : 'Copy link'">
    <template #default="{ show, hide }">
      <button
        class="share-button"
        @click="share"
        @mouseenter="show"
        @mouseleave="hide"
        @focus="show"
        @blur="hide"
      >
        <FontAwesomeIcon :icon="faShare" />
      </button>
    </template>
  </Tooltip>
</template>

<style scoped lang="scss">
@use '../css/_variables.scss' as *;

.share-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0.5rem;
  border-radius: 50%;
  background: hsla(var(--surface0) / 0.5);
  color: hsla(var(--text) / 1);
  border: 2px solid hsla(var(--text) / 0.1);
  cursor: pointer;
  outline: none;
  transition: $transition;

  &:hover,
  &:focus-visible {
    background: hsla(var(--surface0) / 0.7);
    border: 2px solid hsla(var(--pink) / 0.7);
  }

  &:active {
    background: hsla(var(--surface0) / 1);
    border: 2px solid hsla(var(--pink) / 0.8);
    scale: 0.95;
  }
}
</style>
