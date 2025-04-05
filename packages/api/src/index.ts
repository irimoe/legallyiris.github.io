import { Elysia, t } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { contentRoutes } from './routes/contentRoutes'
import { join } from 'path'
import { recordVisit } from './analytics'
import { analyticsRoutes } from './routes/analyticsRoutes'

const DIST_PATH = join(import.meta.dir, '..', '..', 'www', 'dist')
const SPA_FALLBACK_PATH = join(DIST_PATH, 'index.html')
console.log(SPA_FALLBACK_PATH)
const apiRoutes = new Elysia({ prefix: '/api' })
  .get('/', () => 'hi from @web/api!')
  .use(contentRoutes)
  .use(analyticsRoutes)

const app = new Elysia()

  .onRequest(({ server, request }) => {
    const url = new URL(request.url)
    const path = url.pathname

    let clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      server?.requestIP(request) ||
      'unknown'

    if (typeof clientIp === 'object' && 'address' in clientIp) {
      clientIp = clientIp.address
    }

    recordVisit(path, typeof clientIp === 'string' ? clientIp : 'unknown')
  })
  .onError(({ code, error, set, path }) => {
    let status: number = 500
    let message: string = 'internal server error'

    switch (code) {
      case 'NOT_FOUND':
        status = 404
        message = path?.startsWith('/api/') ? 'api resource not found' : 'resource not found'
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

    console.log(`falling back to SPA @ ${url}`)
    return Bun.file(SPA_FALLBACK_PATH)
  })

  .use(apiRoutes)

  .use(
    // @ts-expect-error: what
    staticPlugin({
      assets: DIST_PATH,
      prefix: '/',
      alwaysStatic: true,
    }),
  )
  .listen(3000)

const url = `http://${app.server?.hostname}:${app.server?.port}`
console.log(`@web/api running on ${url}`)
