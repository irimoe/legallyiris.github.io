import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project, ProjectMetadata } from '@/types/Projects'

export const useProjectsStore = defineStore('projects', () => {
	const projectsMetadata = ref<ProjectMetadata[]>([])
	const projectsCache = ref<Map<string, Project>>(new Map()) // cache for full project data

	async function fetchProjectsMetadata(): Promise<void> {
		if (projectsMetadata.value.length > 0) return // already loaded

		try {
			const response = await fetch('/api/projects')
			if (!response.ok) throw new Error(`http error: ${response.status}`)
			const data = (await response.json()) as ProjectMetadata[]
			projectsMetadata.value = data
		} catch (error) {
			console.error('failed to fetch projects metadata:', error)
			projectsMetadata.value = [] // clear on error
		}
	}

	async function fetchProjectBySlug(slug: string): Promise<Project | null> {
		if (projectsCache.value.has(slug)) {
			return projectsCache.value.get(slug)!
		}

		try {
			const response = await fetch(`/api/projects/${slug}`)
			if (!response.ok) {
				if (response.status === 404) return null // not found is expected
				throw new Error(`http error: ${response.status}`)
			}
			const data = (await response.json()) as Project
			projectsCache.value.set(slug, data) // cache the fetched project
			return data
		} catch (error) {
			console.error(`failed to fetch project ${slug}:`, error)
			return null
		}
	}

	// helper to construct asset url
	function getAssetUrl(projectSlug: string, assetFilename: string): string {
		return `/api/assets/projects/${projectSlug}/${assetFilename}`
	}

	return {
		projectsMetadata,
		fetchProjectsMetadata,
		fetchProjectBySlug,
		getAssetUrl,
	}
})
