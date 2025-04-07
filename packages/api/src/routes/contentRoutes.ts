import Elysia, { t } from 'elysia'
import { join } from 'path'
import { getPosts, getPost, getProjects, getProject } from '../content'

import { config } from '../config'
const CONTENT_DIR = join(config.workingDirectory, config.paths.content)

const slugParamsSchema = t.Object({ slug: t.String() })
const assetParamsSchema = t.Object({
  type: t.Union([t.Literal('posts'), t.Literal('projects')]),
  slug: t.String(),
  file: t.String(),
})

export const contentRoutes = new Elysia()
  .get('/posts', async () => getPosts())
  .get(
    '/posts/:slug',
    async ({ params, set }) => {
      const post = await getPost(params.slug)
      if (!post) {
        set.status = 404
        return { status: 404, message: 'post not found' }
      }
      return post
    },
    { params: slugParamsSchema },
  )

  .get('/projects', async () => getProjects())
  .get(
    '/projects/:slug',
    async ({ params, set }) => {
      const project = await getProject(params.slug)
      if (!project) {
        set.status = 404
        return { status: 404, message: 'project not found' }
      }
      return project
    },
    { params: slugParamsSchema },
  )

  .get(
    '/assets/:type/:slug/:file',
    async ({ params, set }) => {
      const { type, slug, file } = params

      if (slug.includes('..') || file.includes('..')) {
        set.status = 400
        return { status: 400, message: 'invalid path components' }
      }

      const filePath = join(CONTENT_DIR, type, slug, 'assets', file)
      const bunFile = Bun.file(filePath)

      if (!(await bunFile.exists())) {
        set.status = 404
        return { status: 404, message: 'asset not found' }
      }
      return bunFile
    },
    { params: assetParamsSchema },
  )
