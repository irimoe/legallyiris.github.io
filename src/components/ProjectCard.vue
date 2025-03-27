<script setup lang="ts">
import type { Project } from "@/types/Projects";
import { computed } from "vue";

const props = defineProps<{
	project: Project;
}>();

const statusColor = computed(() => {
	switch (props.project.status) {
		case "active":
			return "var(--green)";
		case "maintained":
			return "var(--blue)";
		case "archived":
			return "var(--subtext0)";
	}

	return "var(--subtext0)";
});
</script>

<template>
  <RouterLink :to="`/projects/${project.slug}`" class="project-card">
    <div class="project-header">
      <h2>{{ project.title }}</h2>
      <div class="status" :style="{ '--status-color': statusColor }">
        {{ project.status }}
      </div>
    </div>
    <p>{{ project.description }}</p>
    <div class="tech-stack">
      <span v-for="tech in project.tech" :key="tech" class="tech">{{ tech }}</span>
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
@use '../css/_variables.scss' as *;

.project-card {
  display: block;
  padding: 1rem;
  border-radius: 0.5rem;
  background: hsla(var(--mantle) / 0.6);
  border: 1px solid hsla(var(--overlay0) / 0.5);
  text-decoration: none;
  color: inherit;
  transition: $transition;

  &:hover {
    background: hsla(var(--mantle) / 1);
    border-color: hsla(var(--overlay0) / 0.8);

    h3 {
      color: hsla(var(--text) / 1);
    }
  }

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;

    h2 {
      margin: 0;
      font-size: 1.25rem;
      color: hsla(var(--subtext0) / 1);
      transition: $transition;
    }

    .status {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      background: hsla(var(--status-color) / 0.1);
      color: hsl(var(--status-color));
      border: 1px solid hsla(var(--status-color) / 0.2);
    }
  }

  p {
    margin: 0;
    margin-bottom: 0.5rem;
    color: hsla(var(--subtext0) / 0.8);
    font-size: 0.875rem;
  }

  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;

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
</style>
