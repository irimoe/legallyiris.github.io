import { join } from 'node:path'

import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { staticPlugin } from '@elysiajs/static'

import type { Post, Project } from './content'

import { recordVisit } from './analytics'
import { contentRoutes } from './routes/contentRoutes'
import { analyticsRoutes } from './routes/analyticsRoutes'
import { frontingRoutes } from './routes/frontingRoutes'
import { getPost, getProject } from './content'

import { config } from './config'

const DIST_PATH = join(config.workingDirectory, config.paths.dist)
const SPA_FALLBACK_PATH = join(DIST_PATH, 'index.html')
console.log(`          DIST PATH : ${DIST_PATH}`)
console.log(`  SPA FALLBACK PATH : ${SPA_FALLBACK_PATH}`)
console.log(`  WORKING DIRECTORY : ${config.workingDirectory}`)

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

async function generateHtmlWithMetaTags(metaTags: Record<string, string>, title: string) {
  const html = await Bun.file(SPA_FALLBACK_PATH).text()

  let modifiedHtml = html.replace(
    /<title>.*?<\/title>/,
    `<title>${escapeHtml(title)} - iris</title>`,
  )

  for (const [key, value] of Object.entries(metaTags)) {
    const isOgTag = key.startsWith('og:')
    const selector = isOgTag ? `<meta property="${key}"[^>]*>` : `<meta name="${key}"[^>]*>`

    const newTag = isOgTag
      ? `<meta property="${key}" content="${value}">`
      : `<meta name="${key}" content="${value}">`

    const regex = new RegExp(selector)

    if (regex.test(modifiedHtml)) modifiedHtml = modifiedHtml.replace(regex, newTag)
    else modifiedHtml = modifiedHtml.replace('</head>', `  ${newTag}\n  </head>`)
  }

  return modifiedHtml
}

async function handleContentPage<T extends Post | Project>({
  params,
  set,
  type,
  getter,
  baseImageUrl,
}: {
  params: { slug: string }
  set: { headers: Record<string, string> }
  type: 'posts' | 'projects'
  getter: (slug: string) => Promise<T | null>
  baseImageUrl?: string
}) {
  const content = await getter(params.slug)
  if (!content) return Bun.file(SPA_FALLBACK_PATH)

  const imageUrl =
    content.assets && content.assets.length > 0
      ? `https://iri.moe/api/assets/${type}/${content.slug}/${content.assets[0]}`
      : baseImageUrl || 'https://iri.moe/me.webp'

  const metaTags = {
    'og:title': escapeHtml(content.title),
    'og:description': escapeHtml(content.description),
    'og:type': type === 'posts' ? 'article' : 'website',
    'og:url': `https://iri.moe/${type === 'posts' ? 'writing' : 'projects'}/${content.slug}`,
    'og:image': imageUrl,
    'og:site_name': 'iri.moe!',
    'twitter:card': 'summary',
    'twitter:title': escapeHtml(content.title),
    'twitter:description': escapeHtml(content.description),
    'twitter:image': imageUrl,
    'theme-color': '#BCA6F7',
  }

  const modifiedHtml = await generateHtmlWithMetaTags(metaTags, content.title)

  set.headers['content-type'] = 'text/html'
  return modifiedHtml
}

const apiRoutes = new Elysia({ prefix: '/api' })
  .get('/', () => 'hi from @web/api!', {
    response: t.String(),
  })
  .use(contentRoutes)
  .use(analyticsRoutes)
  .use(frontingRoutes)

const app = new Elysia()
  .use(swagger({ path: '/api/docs' }))

  .onRequest(({ server, request }) => {
    const url = new URL(request.url)
    const path = url.pathname

    const doNotTrack = request.headers.get('dnt') === '1'

    if (!doNotTrack) {
      let clientIp =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        server?.requestIP(request) ||
        'unknown'

      if (typeof clientIp === 'object' && 'address' in clientIp) {
        clientIp = clientIp.address
      }

      recordVisit(path, typeof clientIp === 'string' ? clientIp : 'unknown')
    }
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

  .get('/writing/:slug', ({ params, set }) => {
    set.headers['content-type'] = 'text/html'
    return handleContentPage({
      params,
      set: { headers: set.headers as Record<string, string> },
      type: 'posts',
      getter: getPost,
    })
  })

  .get('/projects/:slug', ({ params, set }) => {
    set.headers['content-type'] = 'text/html'
    return handleContentPage({
      params,
      set: { headers: set.headers as Record<string, string> },
      type: 'projects',
      getter: getProject,
    })
  })

  .use(
    staticPlugin({
      assets: DIST_PATH,
      prefix: '/',
      alwaysStatic: true,
    }),
  )

  .listen(process.env.PORT || 3000)

const url = `http://${app.server?.hostname}:${app.server?.port}`
console.log(`   @web/api running : ${url}\n`)
