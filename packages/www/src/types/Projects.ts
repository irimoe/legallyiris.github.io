export interface ProjectMetadata {
	slug: string
	title: string
	description: string
	status: 'active' | 'archived' // assuming api provides this based on previous content.ts structure
	tech: string[]
	links: {
		source?: string
		website?: string | null
	}
}

export interface Project extends ProjectMetadata {
	content: string // raw markdown content
	assets: string[] // list of filenames in the assets folder
}
