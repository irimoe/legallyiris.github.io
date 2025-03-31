<script setup lang="ts">
import ProjectCard from '@/components/ProjectCard.vue'
import SelectMenu from '@/components/SelectMenu.vue'
import { useProjectsStore } from '@/stores/projects'
import { computed, onMounted, ref } from 'vue'

const projectsStore = useProjectsStore()
const selectedFilter = ref('all')

const filterOptions = [
	{ value: 'all', label: 'all projects' },
	{ value: 'active', label: 'active' },
	{ value: 'maintained', label: 'maintained' },
	{ value: 'archived', label: 'archived' },
]

const filteredProjects = computed(() => {
	const allProjects = projectsStore.projects
	if (selectedFilter.value === 'all') return allProjects
	return allProjects.filter((project) => project.status === selectedFilter.value)
})

onMounted(() => {
	projectsStore.loadProjects()
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

	<TransitionGroup name="projects-grid" tag="div" class="projects" v-if="filteredProjects.length">
		<ProjectCard v-for="project in filteredProjects" :key="project.slug" :project="project" />
	</TransitionGroup>
	<div v-else>
		<p>no projects found.</p>
	</div>
</template>

<style scoped lang="scss">
@use '@/css/variables.scss' as *;

.header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 1rem;

	.title {
		h2 {
			margin: 0;
		}
		p {
			margin: 0;
		}
	}
}

.projects {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 0.5rem;
	margin-top: 1rem;
}

.projects-grid-move {
	transition: all $transition;
}

.projects-grid-enter-active,
.projects-grid-leave-active {
	transition: all $transition;
}

.projects-grid-leave-active {
	z-index: 0;
	position: absolute;
}

.projects-grid-enter-from {
	opacity: 0;
	transform: scale(0.95);
}

.projects-grid-leave-to {
	opacity: 0;
	transform: scale(0.95);
}

:deep(.project-card) {
	min-height: 100%;
	width: 100%;
}
</style>
