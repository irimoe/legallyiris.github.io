<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { onMounted } from 'vue'
import SelectMenu from '@/components/SelectMenu.vue'

const themeStore = useThemeStore()
const themeOptions = [
  { value: 'latte', label: 'latte' },
  { value: 'frappe', label: 'frappe' },
  { value: 'macchiato', label: 'macchiato' },
  { value: 'mocha', label: 'mocha' },
]

onMounted(() => {
  themeStore.initializeTheme()
})
</script>

<template>
  <SelectMenu :options="themeOptions" v-model="themeStore.theme" />
</template>
