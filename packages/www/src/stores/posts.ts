import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Post, PostMetadata } from '@/types/Posts'

export const usePostsStore = defineStore('posts', () => {
	const postsMetadata = ref<PostMetadata[]>([])
	const postsCache = ref<Map<string, Post>>(new Map()) // cache for full post data

	async function fetchPostsMetadata(): Promise<void> {
		if (postsMetadata.value.length > 0) return // already loaded

		try {
			const response = await fetch('/api/posts')
			if (!response.ok) throw new Error(`http error: ${response.status}`)
			const data = (await response.json()) as PostMetadata[]
			postsMetadata.value = data
		} catch (error) {
			console.error('failed to fetch posts metadata:', error)
			postsMetadata.value = [] // clear on error
		}
	}

	async function fetchPostBySlug(slug: string): Promise<Post | null> {
		if (postsCache.value.has(slug)) {
			return postsCache.value.get(slug)!
		}

		try {
			const response = await fetch(`/api/posts/${slug}`)
			if (!response.ok) {
				if (response.status === 404) return null // not found is expected
				throw new Error(`http error: ${response.status}`)
			}
			const data = (await response.json()) as Post
			postsCache.value.set(slug, data) // cache the fetched post
			return data
		} catch (error) {
			console.error(`failed to fetch post ${slug}:`, error)
			return null
		}
	}

	return {
		postsMetadata,
		fetchPostsMetadata,
		fetchPostBySlug,
	}
})
