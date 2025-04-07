import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface PathHit {
	path: string
	hits: number
}

export interface DailyUnique {
	path: string
	date: string
	unique_visits: number
}

export interface AnalyticsData {
	hits: PathHit[]
	uniques: DailyUnique[]
}

export const useAnalyticsStore = defineStore('analytics', () => {
	const analyticsData = ref<AnalyticsData | null>(null)
	const loading = ref(false)
	const error = ref<string | null>(null)

	async function fetchAnalyticsData(): Promise<void> {
		loading.value = true
		error.value = null
		analyticsData.value = null // clear previous data

		try {
			const response = await fetch('/api/analytics')
			if (!response.ok) throw new Error(`http error: ${response.status}`)
			const data = (await response.json()) as AnalyticsData
			analyticsData.value = data
		} catch (err) {
			console.error('failed to fetch analytics data:', err)
			error.value = err instanceof Error ? err.message : 'failed to fetch analytics'
		} finally {
			loading.value = false
		}
	}

	return {
		analyticsData,
		loading,
		error,
		fetchAnalyticsData,
	}
})
