import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Alter {
	id: string
	name: string
	pronouns: string
	role: string
	description: string | null
	avatar_url: string | null
}

export interface FrontingState {
	alters: Alter[]
	timestamp: number
}

export const useFrontingStore = defineStore('fronting', () => {
	const frontingState = ref<FrontingState | null>(null)
	const allAlters = ref<Alter[]>([])
	const loading = ref(false)
	const error = ref<string | null>(null)

	async function fetchFrontingState() {
		loading.value = true
		error.value = null

		try {
			const response = await fetch('/api/system/fronting')
			if (!response.ok) throw new Error(`http error: ${response.status}`)
			frontingState.value = await response.json()
		} catch (err) {
			console.error('failed to fetch fronting state:', err)
			error.value = err instanceof Error ? err.message : 'unknown error'
		} finally {
			loading.value = false
		}
	}

	async function fetchAllAlters() {
		try {
			const response = await fetch('/api/system/alters')
			if (!response.ok) throw new Error(`http error: ${response.status}`)
			allAlters.value = await response.json()
		} catch (err) {
			console.error('failed to fetch alters:', err)
		}
	}

	async function updateFronting(alterIds: string[], token: string) {
		loading.value = true
		error.value = null

		try {
			const response = await fetch('/api/system/fronting', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ alterIds, token }),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error || `http error: ${response.status}`)
			}

			frontingState.value = await response.json()
			return true
		} catch (err) {
			console.error('failed to update fronting:', err)
			error.value = err instanceof Error ? err.message : 'unknown error'
			return false
		} finally {
			loading.value = false
		}
	}

	return {
		frontingState,
		allAlters,
		loading,
		error,
		fetchFrontingState,
		fetchAllAlters,
		updateFronting,
	}
})
