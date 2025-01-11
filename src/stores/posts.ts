import { defineStore } from 'pinia'
import { ref } from 'vue'
import { calculateReadingTime } from '@/utils/readingTime'
import type { Post } from '@/types/Posts'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<Post[]>([])

  const loadPosts = async () => {
    const postFiles = import.meta.glob('../content/posts/*.md', {
      eager: true,
      as: 'raw',
    })

    const loadedPosts = Object.entries(postFiles).map(([path, content]) => {
      const [, frontmatter, ...contentParts] = content.split('---')
      const markdown = contentParts.join('---').trim()

      const frontmatterData = Object.fromEntries(
        frontmatter
          .trim()
          .split('\n')
          .map((line) => {
            const [key, ...valueParts] = line.split(':')
            return [key.trim(), valueParts.join(':').trim()]
          }),
      )

      return {
        ...frontmatterData,
        content: markdown,
        slug: path.split('/').pop()?.replace('.md', ''),
        readingTime: calculateReadingTime(markdown),
      } as Post
    })

    posts.value = loadedPosts
      .filter((post) => !post.draft)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const getPostBySlug = (slug: string) => {
    return posts.value.find((post) => post.slug === slug)
  }

  return {
    posts,
    loadPosts,
    getPostBySlug,
  }
})
