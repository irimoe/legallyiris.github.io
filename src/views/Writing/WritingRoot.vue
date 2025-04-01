<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { usePostsStore } from '@/stores/posts'
import ContentCard from '@/components/card/ContentCard.vue'
import ContentGrid from '@/components/card/ContentGrid.vue'

const postsStore = usePostsStore()
const posts = computed(() => postsStore.posts)
postsStore.loadPosts()
</script>

<template>
	<h1>writing</h1>
	<p>i write about things that interest me sometimes</p>
	<hr />

	<ContentGrid v-if="posts.length">
		<ContentCard
			v-for="post in posts"
			:key="post.slug"
			:title="post.title"
			:description="post.description"
			:link="`/writing/${post.slug}`"
			:meta="{
				date: new Date(post.date).toLocaleDateString(),
				readingTime: post.readingTime,
			}"
		/>
	</ContentGrid>
	<div v-else>
		<h3>no posts found</h3>
		<p>check back later.</p>
	</div>
</template>

<style scoped lang="scss">
@use '../../css/variables.scss' as *;
</style>
