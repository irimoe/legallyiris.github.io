<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { RouterLink } from 'vue-router'

const postsStore = usePostsStore()
const posts = computed(() => postsStore.posts)
postsStore.loadPosts()
</script>

<template>
  <main class="page">
    <h2>writing</h2>
    <p>i write about things that interest me sometimes</p>
    <hr />

    <div class="posts" v-if="posts.length">
      <article v-for="post in posts" :key="post.slug" class="post-preview">
        <RouterLink :to="`/writing/${post.slug}`">
          <h3>{{ post.title }}</h3>
        </RouterLink>
        <div class="post-meta">
          <time>{{ new Date(post.date).toLocaleDateString() }}</time>
          <span>{{ post.readingTime }}</span>
        </div>
        <p>{{ post.description }}</p>
      </article>
    </div>
    <div v-else>
      <h3>no posts found</h3>
      <p>check back later.</p>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use '../css/variables.scss' as *;

.posts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.post-preview {
  padding: 1rem;
  border-radius: 0.5rem;
  background: hsla(var(--mantle) / 0.6);
  border: 1px solid hsla(var(--overlay0) / 0.5);
  transition:
    background $transition,
    border-color $transition;

  h3 {
    margin: 0;
    font-size: 1.25rem;
  }

  .post-meta {
    font-size: 0.75rem;
    color: hsla(var(--subtext0) / 0.8);
    display: flex;
    gap: 1rem;
    margin: 0.25rem 0;
  }

  &:hover {
    background: hsla(var(--mantle) / 1);
    border-color: hsla(var(--overlay0) / 0.8);
  }
}
</style>
