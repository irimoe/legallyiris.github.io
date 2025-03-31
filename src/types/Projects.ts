export interface Project {
	slug: string
	title: string
	description: string
	status: 'active' | 'maintained' | 'archived'
	tech: string[]
	links: {
		source?: string
		website?: string
	}
	content: string
	screenshots: {
		url: string
		alt: string
	}[]
}
