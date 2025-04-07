<template>
	<ol class="breadcrumb">
		<li v-for="(segment, index) in pathSegments" :key="index" class="breadcrumb-item">
			<router-link :to="segmentsToPath(index + 1)"> /{{ segment }} </router-link>
		</li>
	</ol>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const pathSegments = computed(() => {
	if (route.path === '/') return ['home']
	return route.path.substring(1).split('/')
})

const segmentsToPath = (numSegments: number) => {
	const segments = pathSegments.value.slice(0, numSegments)
	return `/${segments.join('/')}`
}
</script>

<style scoped lang="scss">
@use '../css/_variables.scss' as *;

.breadcrumb {
	list-style: none;
	padding: 0;
	margin: 0;
	display: inline-flex;
	font-size: 0.875rem;

	.breadcrumb-item {
		position: relative;
		color: hsla(var(--subtext0) / 1);
		background: hsla(var(--surface0) / 0.4);
		text-decoration: none;
		transition: $transition;
		padding: 0.25rem 0.5rem;

		&:hover {
			background: hsla(var(--surface0) / 0.6);
			text-decoration: none;
			a {
				text-decoration: none;
			}
		}

		&:last-child {
			background: hsla(var(--surface0) / 0.9);
		}
		&:not(:last-child) {
			&::after {
				content: '';
				display: inline-block;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: -1px;
				width: 1px;
				height: 75%;
				background: hsla(var(--surface0) / 1);
				z-index: 2;
			}
		}
	}

	a {
		text-decoration: none;
		color: inherit;
	}
	a:hover {
		text-decoration: underline;
	}
}
</style>
