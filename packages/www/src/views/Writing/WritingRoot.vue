<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { usePostsStore } from '@/stores/posts'
import ContentCard from '@/components/card/ContentCard.vue'
import ContentGrid from '@/components/card/ContentGrid.vue'

const postsStore = usePostsStore()
const posts = computed(() => postsStore.postsMetadata)
const loading = ref(true)

onMounted(async () => {
	loading.value = true
	await postsStore.fetchPostsMetadata()
	loading.value = false
})
</script>

<template>
	<h1>writing</h1>
	<p>i write about things that interest me sometimes</p>
	<hr />

	<div v-if="loading">loading posts...</div>
	<ContentGrid v-else-if="posts.length">
		<ContentCard
			v-for="post in posts"
			:key="post.slug"
			:title="post.title"
			:description="post.description"
			:link="`/writing/${post.slug}`"
			:meta="{ date: new Date(post.date).toLocaleDateString() }"
		/>
	</ContentGrid>
	<div v-else>
		<h3>no posts found</h3>
		<p>check back later, or maybe the api is down?</p>
	</div>
</template>

<style scoped lang="scss">
@use '../../css/variables.scss' as *;
</style>
