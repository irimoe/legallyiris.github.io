<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import ProjectCard from '@/components/ProjectCard.vue'

const projectsStore = useProjectsStore()
const projects = computed(() => projectsStore.projects)

onMounted(() => {
  projectsStore.loadProjects()
})
</script>

<template>
  <main class="page">
    <h2>projects</h2>
    <p>things i've built or am building.</p>
    <hr />

    <div class="projects" v-if="projects.length">
      <ProjectCard v-for="project in projects" :key="project.slug" :project="project" />
    </div>
    <div v-else>
      <p>no projects found.</p>
    </div>
  </main>
</template>

<style scoped lang="scss">
.projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
</style>
