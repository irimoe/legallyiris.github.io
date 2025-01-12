import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project } from '@/types/Projects'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])

  const loadProjects = () => {
    const projectFiles = import.meta.glob('../content/projects/*/index.md', {
      query: '?raw',
      import: 'default',
      eager: true,
    })

    const metaFiles = import.meta.glob('../content/projects/*/meta.json', {
      eager: true,
    })

    const screenshotFiles = import.meta.glob('../content/projects/*/screenshots/*.{png,jpg,webp}', {
      eager: true,
      import: 'default',
    })

    const loadedProjects = Object.entries(projectFiles).map(([path, content]) => {
      const [, frontmatter, ...contentParts] = (content as string).split('---')
      const markdown = contentParts.join('---').trim()

      const frontmatterData = Object.fromEntries(
        frontmatter
          .trim()
          .split('\n')
          .map((line: string) => {
            const [key, ...valueParts] = line.split(':')
            return [key.trim(), valueParts.join(':').trim()]
          }),
      )

      const projectSlug = path.split('/').slice(-2)[0]

      const screenshots = Object.entries(screenshotFiles)
        .filter(([path]) => path.includes(`/${projectSlug}/`))
        .map(([path, moduleUrl]) => ({
          url: moduleUrl as string,
          alt: path.split('/').pop()?.split('.')[0] || '',
        }))

      const metaPath = path.replace('index.md', 'meta.json')
      const meta = metaFiles[metaPath] as Project

      return {
        ...meta,
        ...frontmatterData,
        content: markdown,
        slug: projectSlug,
        screenshots,
      } as Project
    })

    projects.value = loadedProjects.sort((a, b) => {
      const statusOrder = { active: 0, maintained: 1, archived: 2 }
      return statusOrder[a.status] - statusOrder[b.status]
    })
  }

  const getProjectBySlug = (slug: string) => {
    return projects.value.find((project) => project.slug === slug)
  }

  return {
    projects,
    loadProjects,
    getProjectBySlug,
  }
})
