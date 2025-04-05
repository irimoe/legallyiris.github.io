import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const CONTENT_DIR = join(process.cwd(), 'content')

// --- Types ---

interface BaseMetadata {
  title: string
  description: string
}

interface PostMetadata extends BaseMetadata {
  /** expects iso date string */
  date: string
}

interface ProjectMetadata extends BaseMetadata {
  status: 'active' | 'archived'
  tech: string[]
  links: {
    source: string
    website?: string | null
  }
}

interface ContentItem {
  slug: string
  content: string
  assets: string[]
}

export type Post = PostMetadata & ContentItem
export type Project = ProjectMetadata & ContentItem

type ContentType = 'posts' | 'projects'
type Metadata = PostMetadata | ProjectMetadata

// --- Helper Functions ---

async function safeReadDir(path: string, silentlyFail = false): Promise<string[]> {
  try {
    return await readdir(path)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'enoent') {
      return []
    }
    if (!silentlyFail) console.error(`error reading directory ${path}:`, error)
    throw error
  }
}

// --- Generic Content Fetching ---

async function getContentList<T extends BaseMetadata>(
  type: ContentType,
): Promise<(T & { slug: string })[]> {
  const dir = join(CONTENT_DIR, type)
  const slugs = await safeReadDir(dir)

  const items = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const metadataPath = join(dir, slug, 'metadata.json')
        const metadataContent = await readFile(metadataPath, 'utf-8')
        const metadata = JSON.parse(metadataContent) as T
        return { slug, ...metadata }
      } catch (error) {
        console.error(`error processing metadata for ${type}/${slug}:`, error)
        return null
      }
    }),
  )

  const validItems = items.filter((item) => item !== null) as (T & { slug: string })[]

  // sort posts by date (desc), projects by title (asc)
  if (type === 'posts') {
    validItems.sort((a, b) => {
      const dateA = (a as unknown as PostMetadata).date
      const dateB = (b as unknown as PostMetadata).date
      return dateA && dateB ? new Date(dateB).getTime() - new Date(dateA).getTime() : 0
    })
  } else if (type === 'projects') {
    validItems.sort((a, b) => a.title.localeCompare(b.title))
  }

  return validItems
}

async function getContentItem<T extends BaseMetadata>(
  type: ContentType,
  slug: string,
): Promise<(T & ContentItem) | null> {
  const itemDir = join(CONTENT_DIR, type, slug)
  const metadataPath = join(itemDir, 'metadata.json')
  const contentPath = join(itemDir, 'content.md')
  const assetsDir = join(itemDir, 'assets')

  try {
    const metadataContent = await readFile(metadataPath, 'utf-8')
    const metadata = JSON.parse(metadataContent) as T
    const content = await readFile(contentPath, 'utf-8')
    let assets: string[] = []

    try {
      assets = await safeReadDir(assetsDir, true)
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'enoent') {
        assets = []
      }
    }

    return {
      slug,
      ...metadata,
      content,
      assets,
    }
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'enoent') {
      // file not found is expected, don't log as error, return null
      return null
    }
    console.error(`error fetching content item ${type}/${slug}:`, error)
    return null // other errors
  }
}

// --- Exported Functions ---

export function getPosts(): Promise<(PostMetadata & { slug: string })[]> {
  return getContentList<PostMetadata>('posts')
}

export function getPost(slug: string): Promise<Post | null> {
  return getContentItem<PostMetadata>('posts', slug) as Promise<Post | null>
}

export function getProjects(): Promise<(ProjectMetadata & { slug: string })[]> {
  return getContentList<ProjectMetadata>('projects')
}

export function getProject(slug: string): Promise<Project | null> {
  return getContentItem<ProjectMetadata>('projects', slug) as Promise<Project | null>
}
