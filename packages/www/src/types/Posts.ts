export interface PostMetadata {
	title: string
	description: string
	date: string // iso date string
	slug: string
}

export interface Post extends PostMetadata {
	content: string // raw markdown content
	assets: string[] // list of filenames in the assets folder
}
