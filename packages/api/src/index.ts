import { Elysia, t } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { getPosts, getPost, getProjects, getProject } from './content'
import { join } from 'node:path'

const CONTENT_DIR = join(process.cwd(), 'content')
const DIST_PATH = join(import.meta.dir, '..', '..', 'www', 'dist')
const SPA_FALLBACK_PATH = join(DIST_PATH, 'index.html')

const slugParamsSchema = t.Object({ slug: t.String() })
const assetParamsSchema = t.Object({
  type: t.Union([t.Literal('posts'), t.Literal('projects')]),
  slug: t.String(),
  file: t.String(),
})

const contentRoutes = new Elysia({ prefix: '/api' })
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

const app = new Elysia()
  .onRequest(({ request }) => {
    console.log(`${request.method} ${new URL(request.url).pathname}`)
  })
  .onError(({ code, error, set, path }) => {
    let status: number = 500
    let message: string = 'internal server error'

    switch (code) {
      case 'NOT_FOUND':
        status = 404
        message = 'resource not found'
        break
      case 'VALIDATION':
        status = 400
        message = error?.message ?? 'validation failed'
        break
      case 'PARSE':
        status = 400
        message = 'invalid request body format'
        break
      case 'INTERNAL_SERVER_ERROR':
        status = 500
        message = 'an unexpected server error occurred'
        break
    }

    console.error(
      `error: ${path} (${status} ${code}) - ${message}`,
      error instanceof Error ? error.message : error,
    )

    set.status = status
    if (path.startsWith('/api')) {
      set.headers['content-type'] = 'application/json'
      return { status, message }
    }

    return Bun.file(SPA_FALLBACK_PATH)
  })

  .get('/api', () => 'hi from @web/api!')
  .use(contentRoutes)

  .use(
    // @ts-expect-error: what
    staticPlugin({
      assets: DIST_PATH,
      prefix: '/',
      alwaysStatic: false,
      noExtension: true,
    }),
  )
  .get('*', () => Bun.file(SPA_FALLBACK_PATH))

  .listen(3000)

const url = `http://${app.server?.hostname}:${app.server?.port}`
console.log(`@web/api running on ${url}`)
