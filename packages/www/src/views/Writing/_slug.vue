<script setup lang="ts">
import ShareButton from '@/components/ShareButton.vue'
import SkeletonPost from '@/components/SkeletonPost.vue'

import { usePostsStore } from '@/stores/posts'
import type { Post } from '@/types/Posts'
import { renderMarkdown } from '@/utils/markdown'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const postsStore = usePostsStore()
const renderedContent = ref('')
const post = ref<Post | null>(null)
const loading = ref(true)
const notFound = ref(false)

const shareUrl = computed(() => window.location.href)

async function loadPost(slug: string) {
	loading.value = true
	notFound.value = false
	renderedContent.value = ''
	post.value = null

	const fetchedPost = await postsStore.fetchPostBySlug(slug)

	if (fetchedPost) {
		post.value = fetchedPost
		renderedContent.value = renderMarkdown(post.value.content)
		document.title = post.value.title ? `${post.value.title} - iris` : 'post - iris'
		notFound.value = false
	} else {
		post.value = null
		notFound.value = true
		document.title = 'post not found - iris'
	}
	loading.value = false
}

onMounted(() => {
	loadPost(route.params.slug as string)
})

watch(
	() => route.params.slug,
	(newSlug) => {
		if (newSlug) {
			loadPost(newSlug as string)
		}
	},
)
</script>

<template>
	<SkeletonPost v-if="loading" />

	<article v-else-if="post" class="post">
		<header>
			<div class="post-header">
				<h1>{{ post.title }}</h1>
				<ShareButton :title="post.title" :url="shareUrl" />
			</div>
			<div class="post-meta">
				<time :datetime="post.date">{{ new Date(post.date).toLocaleDateString() }}</time>
			</div>
		</header>
		<hr />
		<div class="post-content" v-html="renderedContent"></div>
	</article>
	<div v-else-if="notFound">
		<h2>post not found</h2>
		<p>sorry, couldn't find that post.</p>
		<router-link to="/writing">back to writing index</router-link>
	</div>
	<div v-else>
		<h2>error loading post</h2>
		<p>something went wrong trying to fetch the post.</p>
	</div>
</template>

<style scoped lang="scss">
@use '../../css/variables.scss' as *;

.post {
	header {
		.post-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 1rem;

			h1 {
				margin: 0;
				font-size: 2rem;
			}
		}

		.post-meta {
			font-size: 0.875rem;
			color: hsla(var(--subtext0) / 0.8);
			display: flex;
			gap: 1rem;
			margin-top: 0.5rem;
		}
	}
}

.post-content {
	font-size: 1rem;
	line-height: 1.7;

	:deep(h2) {
		margin: 2rem 0 1rem;
		font-size: 1.5rem;
	}

	:deep(p) {
		margin: 1rem 0;
	}

	:deep(pre) {
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		white-space: pre-wrap;
		max-width: 100%;
		background: hsla(var(--mantle) / 1);
		border: 1px solid hsla(var(--overlay0) / 0.5);
		transition:
			background $transition,
			border-color $transition;
	}

	:deep(code) {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.9em;
		max-width: 100%;
	}

	:deep(p code) {
		background: hsla(var(--mantle) / 0.5);
		padding: 0.2em 0.4em;
		border-radius: 0.25rem;
		font-size: 0.9em;
	}
}
</style>
