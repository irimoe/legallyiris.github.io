import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'latte' | 'frappe' | 'macchiato' | 'mocha'

export const useThemeStore = defineStore('theme', () => {
	const theme = ref<Theme>('latte')

	const initializeTheme = () => {
		const savedTheme = localStorage.getItem('theme') as Theme | null
		if (savedTheme) {
			theme.value = savedTheme
			document.body.className = `theme-${theme.value}`
			return
		}

		if (window.matchMedia('(prefers-color-scheme: dark)').matches) theme.value = 'mocha'
		else theme.value = 'latte'
	}

	const systemThemeWatcher = window.matchMedia('(prefers-color-scheme: dark)')
	systemThemeWatcher.addEventListener('change', (e) => {
		if (!localStorage.getItem('theme')) {
			theme.value = e.matches ? 'mocha' : 'latte'
		}
	})

	watch(theme, (newTheme) => {
		document.body.className = `theme-${newTheme}`
		localStorage.setItem('theme', newTheme)
	})

	const setTheme = (newTheme: Theme) => {
		theme.value = newTheme
		document.body.className = `theme-${newTheme}`
		localStorage.setItem('theme', newTheme)
	}

	return {
		theme,
		setTheme,
		initializeTheme,
	}
})
