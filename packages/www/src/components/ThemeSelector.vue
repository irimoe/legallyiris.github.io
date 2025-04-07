<script setup lang="ts">
import { faPalette } from '@fortawesome/free-solid-svg-icons'
import { onMounted } from 'vue'

import SelectMenu from '@/components/SelectMenu.vue'
import { useThemeStore } from '@/stores/theme'

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
	<SelectMenu
		:options="themeOptions"
		v-model="themeStore.theme"
		:activeOnHover="true"
		:icon="faPalette"
		ariaLabel="Theme Selector"
	/>
</template>
