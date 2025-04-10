<script setup lang="ts">
import ContentCard from '@/components/card/ContentCard.vue'
import ContentGrid from '@/components/card/ContentGrid.vue'
import SelectMenu from '@/components/SelectMenu.vue'
import { useProjectsStore } from '@/stores/projects'
import { computed, onMounted, ref } from 'vue'

const projectsStore = useProjectsStore()
const selectedFilter = ref('all')
const loading = ref(true)

const filterOptions = [
	{ value: 'all', label: 'all projects' },
	{ value: 'active', label: 'active' },
	{ value: 'archived', label: 'archived' },
]

const filteredProjects = computed(() => {
	const allProjects = projectsStore.projectsMetadata
	if (selectedFilter.value === 'all') return allProjects
	return allProjects.filter((project) => project.status === selectedFilter.value)
})

onMounted(async () => {
	loading.value = true
	await projectsStore.fetchProjectsMetadata()
	loading.value = false
})
</script>

<template>
	<div class="header">
		<div class="title">
			<h1>projects</h1>
			<p>things i've built or am building.</p>
		</div>
		<SelectMenu v-model="selectedFilter" :options="filterOptions" />
	</div>
	<hr />

	<div v-if="loading">loading projects...</div>
	<TransitionGroup name="projects-grid" tag="div" v-else-if="filteredProjects.length">
		<ContentGrid>
			<ContentCard
				v-for="project in filteredProjects"
				:key="project.slug"
				:title="project.title"
				:description="project.description"
				:link="`/projects/${project.slug}`"
				:meta="{
					status: project.status,
					tech: project.tech,
				}"
			/>
		</ContentGrid>
	</TransitionGroup>
	<div v-else>
		<p>no projects found matching that filter.</p>
	</div>
</template>

<style scoped lang="scss">
@use '@/css/_variables.scss' as *;

.header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 1rem;

	.title {
		h1 {
			margin: 0;
		}
		p {
			margin: 0;
		}
	}
}

.projects-grid-move,
.projects-grid-enter-active,
.projects-grid-leave-active {
	transition: all $transition;
}

.projects-grid-leave-active {
	z-index: 0;
	position: absolute;
}

.projects-grid-enter-from,
.projects-grid-leave-to {
	opacity: 0;
	transform: scale(0.95);
}

:deep(.project-card) {
	min-height: 100%;
	width: 100%;
}
</style>
