<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { faMap } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { usePostsStore } from '@/stores/posts'
import { useProjectsStore } from '@/stores/projects'

const projectsStore = useProjectsStore()
const postsStore = usePostsStore()

const isExpanded = ref(false)
const expandedSections = ref(new Set<string>())

const toggleSection = (path: string) => {
  if (expandedSections.value.has(path)) expandedSections.value.delete(path)
  else expandedSections.value.add(path)
}

const routes = computed(() => [
  { name: 'home', path: '/home' },
  {
    name: 'writing',
    path: '/writing',
    children: postsStore.postsMetadata.map((post) => ({
      name: post.title,
      path: `/writing/${post.slug}`,
    })),
  },
  {
    name: 'projects',
    path: '/projects',
    children: projectsStore.projectsMetadata.map((project) => ({
      name: project.title,
      path: `/projects/${project.slug}`,
    })),
  },
  { name: 'uses', path: '/uses' },
  {
    name: 'system',
    path: '/system',
    children: [{ name: 'switch', path: '/system/switch' }],
  },
  { name: 'analytics', path: '/analytics' },
])

onMounted(async () => {
  await postsStore.fetchPostsMetadata()
  await projectsStore.fetchProjectsMetadata()
})
</script>

<template>
  <div class="sitemap-wrapper">
    <button class="toggle" @click="isExpanded = !isExpanded">
      <FontAwesomeIcon :icon="faMap" />
      <span>{{ isExpanded ? 'hide' : 'show' }} sitemap</span>
    </button>

    <nav class="sitemap" :class="{ expanded: isExpanded }" aria-label="Site map">
      <div v-for="route in routes" :key="route.path" class="sitemap-section">
        <div class="section-header">
          <RouterLink :to="route.path" class="sitemap-link main">{{ route.name }}</RouterLink>
          <button v-if="route.children" class="section-toggle" @click="toggleSection(route.path)">
            {{ expandedSections.has(route.path) ? '−' : '+' }}
          </button>
        </div>
        <div
          v-if="route.children"
          class="sitemap-children"
          :class="{ hidden: !expandedSections.has(route.path) }"
        >
          <RouterLink
            v-for="child in route.children"
            :key="child.path"
            :to="child.path"
            class="sitemap-link sub"
          >
            {{ child.name }}
          </RouterLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped lang="scss">
@use '@/css/_variables.scss' as *;

.toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: hsla(var(--subtext0) / 1);
  background-color: hsla(var(--subtext0) / 0.1);
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.75rem;

  &:hover {
    color: hsla(var(--text) / 1);
  }
}

.sitemap {
  display: none;
  flex-direction: column;
  gap: 0.5rem;

  &.expanded {
    display: flex;
    margin-top: 0.25rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .section-toggle {
    background: none;
    border: none;
    color: hsla(var(--subtext0) / 0.8);
    cursor: pointer;
    padding: 0 0.5rem;
    font-size: 0.75rem;

    &:hover {
      color: hsla(var(--text) / 1);
    }
  }

  .sitemap-children.hidden {
    display: none;
  }

  &-section {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &-children {
    padding-left: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .sitemap-link {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    color: hsla(var(--subtext0) / 0.8);
    text-decoration: none;
    border-radius: 0.25rem;
    transition: $transition;

    &.main {
      font-weight: 600;
      color: hsla(var(--text) / 0.9);
    }

    &.sub {
      font-size: 0.7rem;
    }

    &:hover {
      color: hsla(var(--text) / 1);
      background: hsla(var(--surface0) / 0.5);
    }

    &.router-link-active {
      color: hsla(var(--blue) / 1);
      background: hsla(var(--blue) / 0.1);
    }
  }
}
</style>
