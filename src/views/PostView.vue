<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { renderMarkdown } from '@/utils/markdown'

const route = useRoute()
const postsStore = usePostsStore()
const renderedContent = ref('')
const post = ref(null)

onMounted(async () => {
  await postsStore.loadPosts()
  post.value = postsStore.getPostBySlug(route.params.slug as string)
  if (post.value) renderedContent.value = renderMarkdown(post.value.content)
})
</script>

<template>
  <main class="page">
    <article v-if="post" class="post">
      <header>
        <h1>{{ post.title }}</h1>
        <div class="post-meta">
          <time>{{ new Date(post.date!).toLocaleDateString() }}</time>
          <span>~{{ post.readingTime }}</span>
        </div>
      </header>
      <hr />
      <div class="post-content" v-html="renderedContent"></div>
    </article>
    <div v-else>
      <h2>Post not found</h2>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use '../css/variables.scss' as *;

.post {
  header {
    h1 {
      margin: 0;
      font-size: 2rem;
    }

    .post-meta {
      font-size: 0.875rem;
      color: hsla(var(--subtext0) / 0.8);
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
    }
  }
}

.post-content {
  font-size: 1rem;
  line-height: 1.7;

  :deep(h2) {
    margin: 2rem 0 1rem;
    font-size: 1.5rem;
  }

  :deep(p) {
    margin: 1rem 0;
  }

  :deep(pre) {
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    white-space: pre-wrap;
    max-width: 100%;
    background: hsla(var(--mantle) / 1);
    border: 1px solid hsla(var(--overlay0) / 0.5);
    transition:
      background $transition,
      border-color $transition;
  }

  :deep(code) {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9em;
    max-width: 100%;
  }

  :deep(p code) {
    background: hsla(var(--mantle) / 0.5);
    padding: 0.2em 0.4em;
    border-radius: 0.25rem;
    font-size: 0.9em;
  }
}
</style>
