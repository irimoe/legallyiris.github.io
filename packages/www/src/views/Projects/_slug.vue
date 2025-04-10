<script setup lang="ts">
import { faCode, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import ShareButton from '@/components/ShareButton.vue'
import SkeletonPost from '@/components/SkeletonPost.vue'
import ScreenshotGallery from '@/components/ScreenshotGallery.vue'

import type { Project } from '@/types/Projects'
import { renderMarkdown } from '@/utils/markdown'
import { useProjectsStore } from '@/stores/projects'

const route = useRoute()
const projectsStore = useProjectsStore()
const project = ref<Project | null>(null)
const renderedContent = ref('')
const loading = ref(true)
const notFound = ref(false)

const shareUrl = computed(() => window.location.href)

const screenshots = computed(() => {
	if (!project.value || !project.value.assets) return []

	return project.value.assets
		.filter((filename) => /\.(png|jpg|jpeg|webp|gif)$/i.test(filename))
		.map((filename) => ({
			url: projectsStore.getAssetUrl(project.value!.slug, filename),
			// TODO(CRITICAL): improve alt text.
			alt: filename.split('.')[0] || 'screenshot',
		}))
})

async function loadProject(slug: string) {
	loading.value = true
	notFound.value = false
	renderedContent.value = ''
	project.value = null

	const fetchedProject = await projectsStore.fetchProjectBySlug(slug)

	if (fetchedProject) {
		project.value = fetchedProject
		if (project.value?.content) {
			renderedContent.value = renderMarkdown(project.value.content)
		}
		document.title = project.value?.title ? `${project.value.title} - iris` : 'project - iris'
		notFound.value = false
	} else {
		project.value = null
		notFound.value = true
		document.title = 'project not found - iris'
	}

	loading.value = false
}

onMounted(() => {
	loadProject(route.params.slug as string)
})

watch(
	() => route.params.slug,
	(newSlug) => {
		if (newSlug && route.name === 'project') {
			loadProject(newSlug as string)
		}
	},
)
</script>

<template>
	<SkeletonPost v-if="loading" />

	<div v-else-if="project">
		<header class="project-header">
			<div class="title-row">
				<h1>{{ project.title }}</h1>
				<ShareButton :title="project.title" :url="shareUrl" />
			</div>

			<div class="links">
				<a
					v-if="project.links.source"
					:href="project.links.source"
					target="_blank"
					rel="noopener"
					@click.stop
				>
					<FontAwesomeIcon :icon="faCode" />
					source
				</a>
				<a
					v-if="project.links.website"
					:href="project.links.website"
					target="_blank"
					rel="noopener"
					@click.stop
				>
					<FontAwesomeIcon :icon="faGlobe" />
					website
				</a>
			</div>

			<div class="tech-stack">
				<span v-for="tech in project.tech" :key="tech" class="tech">{{ tech }}</span>
			</div>
		</header>

		<hr />

		<article v-html="renderedContent"></article>

		<ScreenshotGallery v-if="screenshots.length" :screenshots="screenshots" />
	</div>
	<div v-else-if="notFound">
		<h2>project not found</h2>
		<p>sorry, couldn't find that project.</p>
		<router-link to="/projects">back to projects index</router-link>
	</div>
	<div v-else>
		<h2>error loading project</h2>
		<p>something went wrong trying to fetch the project.</p>
	</div>
</template>

<style scoped lang="scss">
@use '../../css/_variables.scss' as *;

.project-header {
	.title-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;

		h1 {
			margin: 0;
			font-size: 2rem;
		}
	}

	.links {
		display: flex;
		margin-top: 0.5rem;
		gap: 0.25rem;

		a {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-size: 0.875rem;
			padding: 0.25rem 0.75rem;
			border-radius: 0.5rem;
			background: hsla(var(--blue) / 0.1);
			color: hsl(var(--blue));
			border: 1px solid hsla(var(--blue) / 0.2);
			text-decoration: none;
			transition: $transition;

			&:hover {
				background: hsla(var(--blue) / 0.2);
				border-color: hsla(var(--blue) / 0.3);
			}

			&:active {
				background: hsla(var(--blue) / 0.3);
				border-color: hsla(var(--blue) / 0.4);
				transform: scale(0.98);
			}
		}
	}

	.tech-stack {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin: 0.5rem 0;
		user-select: none;

		.tech {
			font-size: 0.75rem;
			padding: 0.125rem 0.375rem;
			border-radius: 0.25rem;
			background: hsla(var(--mauve) / 0.1);
			color: hsl(var(--mauve));
			border: 1px solid hsla(var(--mauve) / 0.2);
		}
	}
}

article {
	margin-bottom: 1rem;
	:deep(h2) {
		font-size: 1.5rem;
	}

	:deep(pre) {
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		white-space: pre-wrap;
		background: hsla(var(--mantle) / 1);
		border: 1px solid hsla(var(--overlay0) / 0.5);
	}

	:deep(code) {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.9em;
	}

	:deep(p code) {
		background: hsla(var(--mantle) / 0.5);
		padding: 0.2em 0.4em;
		border-radius: 0.25rem;
		font-size: 0.9em;
	}

	:deep(blockquote) {
		margin: 0 0 1rem 0;
		padding: 0.5rem 1rem;
		border-left: 4px solid hsl(var(--blue));
		background: hsla(var(--blue) / 0.1);
		color: hsl(var(--blue));
		border-radius: 0 0.5rem 0.5rem 0;
	}
}
</style>
