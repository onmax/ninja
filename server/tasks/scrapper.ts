import type { DomElement, Element } from 'domhandler'
import type { NewChunk } from '../utils/drizzle'
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import consola from 'consola'
import select from 'css-select'
import { parseDocument } from 'htmlparser2'
import { $fetch } from 'ofetch'
import TurndownService from 'turndown'
import { stringify as stringifyYaml } from 'yaml'

const shouldVectorize = true
const force = true

const debugSlugs: string[] = [
  // '10-consejos-para-no-procrastinar',
  // 'causas-de-la-procrastinacion',
  // 'como-ser-mas-productivo',
  // 'aprender-a-organizarse',
  // 'como-crear-un-habito',
  // 'disciplina-es-igual-a-libertad',
]

const folder = 'content/blog'

type BlogPostProperties = Pick<NewPostRecord, 'modifiedAt' | 'publishedAt' | 'scrappedAt'> & {
  title: string
  subtitle: string
  url: string
  slug: string
  categories: string[]
  image?: string
  imageUrl: string
  audioLink?: string
  bibliography: string[]
}

export type BlogPostPropertiesStringified = {
  [K in keyof BlogPostProperties]: string | undefined
}

const getSlug = (link: string) => link.split('/').at(-2)!

export default defineTask({
  meta: {
    name: 'scraper',
    description: 'Run the scraper',
  },
  async run() {
    if (!import.meta.dev)
      throw createError('This task is only available in development mode')

    consola.log('Running Scrapper')

    await mkdir(folder, { recursive: true })
    let counter = 0

    for await (const postLink of getPosts()) {
      const slug = getSlug(postLink)
      try {
        const postRecord = await useDrizzle().select().from(tables.postRecord).where(eq(tables.postRecord.slug, slug)).get()
        const alreadyStoredTimestamps = postRecord && !force ? { publishedAt: postRecord?.publishedAt, modifiedAt: postRecord?.modifiedAt } : undefined
        const post = await parsePost(postLink, { alreadyStoredTimestamps })
        if (!post) {
          consola.warn(`We already have ${slug} up-to-date. Skipping...`)
          continue
        }
        const { content, chunks, frontmatter } = post
        const { categories, modifiedAt, publishedAt, scrappedAt } = frontmatter

        if (shouldVectorize) {
          const category = categories.at(0) || 'none'
          const newPostRecord: NewPostRecord = { modifiedAt, publishedAt, scrappedAt, slug, category }

          const postRecordExists = !!postRecord?.id
          consola.info(`Processing ${slug}: ${postRecordExists ? 'updating' : 'inserting'} record and vectors`)

          // Update or insert post record
          const { id: postRecordId } = postRecordExists
            ? await useDrizzle().update(tables.postRecord).set(newPostRecord).where(eq(tables.postRecord.slug, slug)).returning({ id: tables.postRecord.id }).then(res => res[0])
            : await useDrizzle().insert(tables.postRecord).values(newPostRecord).returning({ id: tables.postRecord.id }).then(res => res[0])
          if (!postRecordId || postRecordId === -1)
            throw new Error(`Error updating/inserting post record for slug: ${slug}`)

          consola.info(`Post record for ${slug} ${postRecordExists ? 'updated' : 'inserted'}`)
          // Insert chunks with error handling
          const storedChunks = await Promise.all(chunks.map(async (chunk, i) => {
            const storedChunk = await useDrizzle().select().from(tables.chunks).where(and(eq(tables.chunks.headers, chunk.headers!), eq(tables.chunks.content, chunk.content))).get()
            if (storedChunk) {
              consola.info(`Headers and content for ${slug} chunk ${i + 1}/${chunks.length} already exist, but content is different. Updating...`)
              return storedChunk
            }
            else {
              consola.info(`Generating vector for ${slug} chunk ${i + 1}/${chunks.length}`)
              const vectors = await hubAI().run('@cf/baai/bge-large-en-v1.5', { text: chunks.map(chunk => chunk.content) }).then(res => res.data!)
              const newChunk = await useDrizzle().insert(tables.chunks).values({ ...chunk, embedding: vectors[i], postRecordId }).returning().then(res => res[0])
              return newChunk
            }
          }))

          await hubVectorize('chunks').upsert(storedChunks.map(({ id, embedding }) => ({ id, values: embedding!, metadata: { slug } })))
          const filePath = `${folder}/${slug}.md`
          await writeFile(filePath, content)
          consola.info(`Successfully processed ${slug}: updated record and vectors. Writed ./content/blog/${slug}.md\n-------------------`)
        }

        counter++
      }
      catch (error) {
        consola.error(`Failed to process ${slug}:`, error)
        throw error
      }
    }

    consola.info(`Scraped ${counter} posts`)
    return { result: 'Success' }
  },
})

const removeLinesContaining = [
  '/\\*! elementor - ',
  'data-mce-type="bookmark"',
]

interface Post {
  frontmatter: BlogPostProperties
  content: string
  chunks: NewChunk[]
}

interface ParsePostOptions {
  alreadyStoredTimestamps?: Pick<BlogPostProperties, 'publishedAt' | 'modifiedAt'>
}

export async function parsePost(link: string, options: ParsePostOptions = {}): Promise<Post | undefined> {
  // Fetch and parse the HTML
  consola.info('Fetching', link)
  const html = await $fetch(link, { parseResponse: txt => txt })
  const dom = parseDocument(html) as DomElement

  const _modifiedAt = (select('meta[property="article:modified_time"]', dom)[0] as DomElement)?.attribs?.content || ''
  const _publishedAt = (select('meta[property="article:published_time"]', dom)[0] as DomElement)?.attribs?.content || ''
  const modifiedAt = new Date(_modifiedAt)
  const isModifiedValid = modifiedAt instanceof Date && !Number.isNaN(modifiedAt.getTime())
  const publishedAt = new Date(_publishedAt)
  const hasModifiedAt = !Number.isNaN(modifiedAt.getTime())

  // First check if we have valid published dates to compare
  const samePublishedAt = options.alreadyStoredTimestamps?.publishedAt.getTime() === publishedAt.getTime()

  if (hasModifiedAt) {
    // If we have a new modified date, compare with stored one if it exists
    const sameModifiedAt = options.alreadyStoredTimestamps?.modifiedAt?.getTime() === modifiedAt.getTime()
    if (samePublishedAt && sameModifiedAt)
      return
  }
  else {
    // If no modified date, only check published date
    if (samePublishedAt) {
      return
    }
  }

  const turndownService = new TurndownService()
  const { audioLink, bibliography, md } = cleanUpMarkdown(turndownService.turndown(html))

  // Frontmatter
  const slug = getSlug(link)
  const title = (select('h1', dom)[0]?.children?.[0] as Element)?.data.trim().replace(/"/g, '\\"').trim() || ''
  const subtitle = (select('h1 .subtitulo', dom)[0]?.children?.[0] as Element)?.data.trim().replace(/"/g, '\\"').trim() || ''

  const imageUrl = (select('meta[property="og:image"]', dom)[0] as DomElement)?.attribs?.content || ''
  const image = imageUrl.split('/').at(-1)
  const url = `https://pau.ninja/${slug}`
  const categoryRe = /(?:Mira mis otros artículos sobre|O si quieres ser más específico):\s*((?:\[.*?\]\(https:\/\/pau\.ninja\/.*?\/\),?\s*)+)/g
  const categoryMatches = Array.from(md.matchAll(categoryRe))
  const categories: string[] = categoryMatches.map(match => match[1])
  const scrappedAt = new Date()

  const frontmatter: BlogPostProperties = { title, subtitle, url, slug, categories, image, imageUrl, publishedAt, modifiedAt, scrappedAt, audioLink, bibliography }

  const frontmatterStr = stringifyYaml({
    ...frontmatter,
    scrappedAt: scrappedAt.toISOString(),
    publishedAt: publishedAt.toISOString(),
    modifiedAt: isModifiedValid ? modifiedAt.toISOString() : undefined,
  })
  const content = `---\n${frontmatterStr}\n---\n\n${md}`

  const chunks = getMarkdownChunks(md, frontmatter)

  return { content, frontmatter, chunks }
}

function cleanUpMarkdown(md: string): { md: string, bibliography: string[], audioLink: string } {
  const lines = md.split('\n')
  const dateLineIndex = lines.findIndex(line => line.includes('📅 Actualizado'))
  if (dateLineIndex === -1)
    throw new Error('Could not find the line with the date')

  // Remove lines up to the date line
  md = lines
    .slice(dateLineIndex + 1)
    .filter(line => !removeLinesContaining.some(phrase => line.includes(phrase)))
    .join('\n')
    .trim()

  // Extract bibliography entries
  const bibliographyRe = /\*\s+\d+\s+([^\n]+)/g
  const bibliographyMatches = md.match(bibliographyRe) || []
  const bibliography = bibliographyMatches.map(entry => entry.replace(/\*\s+\d+\s+/, ''))
  for (const entry of bibliography) {
    md = md.replace(entry, '')
  }

  // Extract audio link
  const audioRe = /^\[.*\]\((https?:\/\/[^)]+)\)/g
  const audioLinkMatch = md.match(audioRe) || []
  const audioLink = audioLinkMatch.map(match => match.replace(audioRe, '$1'))[0]

  const crapAtTheEnd = /\n.*: fuentes, referencias y notas[\s\S]*/
  const crapAtTheEnd2 = /\nFuentes, referencias y notas[\s\S]*/
  const crapAtTheEnd3 = /\.autoPodcast ul li a img\{width:50px\}(.*)/s
  const toc = /Navega por el contenido\n\n\[Toggle\]\(#\)\n\n(\*.*\n(\s*\*.*\n)*)/g
  const h2Markup = /(.*)\n-+/g

  md = md
    .replace(toc, '')
    .replace(crapAtTheEnd, '')
    .replace(crapAtTheEnd2, '')
    .replace(crapAtTheEnd3, '')
    .replace(h2Markup, '## $1')
    .replace(audioRe, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\[(\d+)\]\(javascript:void\\\(0\\\)\)/g, '[ref-$1](#ref-$1){.ref}')
    .replace(/▲/g, '')
    .replace(/▼/g, '')
    .replace(/https:\/\/pau\.ninja\/(.*)\//g, './$1')
    .replace(/^\*\s+/gm, '- ')
    .trim()

  return { md, bibliography, audioLink }
}
function getMarkdownChunks(content: string, { title }: BlogPostProperties): NewChunk[] {
  const lines = content.split('\n')
  const chunks: NewChunk[] = []
  let currentSection: NewChunk | undefined
  let currentContent: string[] = []
  let currentHeadings: string[] = [title]

  for (const line of lines) {
    if (line.startsWith('#')) {
      // Save previous section if exists
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim()
        if (currentSection.content.length > 25) {
          const hash = createHash('md5').update(currentSection.content).digest('hex')
          chunks.push({ ...currentSection, hash })
        }
        currentContent = []
      }

      // Start new section
      const level = line.match(/^#+/)![0].length
      const heading = line.slice(level).trim()

      // Update headings array based on level
      currentHeadings = currentHeadings.slice(0, level - 1)
      currentHeadings[level - 1] = heading

      currentSection = { headers: currentHeadings.slice(0, level) as [string, string, string, string], content: '', hash: '' }
    }
    else if (currentSection) {
      currentContent.push(line)
    }
    else if (title) {
      // Create initial section for content before first heading
      currentSection = { headers: [title], hash: '', content: '' }
      if (line.trim())
        currentContent.push(line)
    }
  }

  // Add final section
  if (currentSection) {
    currentSection.content = currentContent.join('\n').trim()
    if (currentSection.content.length > 25) {
      const hash = createHash('md5').update(currentSection.content).digest('hex')
      chunks.push({ ...currentSection, hash })
    }
  }

  return chunks
}

async function* getPosts(): AsyncGenerator<string, void, void> {
  const url = 'https://pau.ninja'

  if (debugSlugs.length > 0) {
    consola.info(`Scrapping just ${debugSlugs}`)
    for (const slug of debugSlugs) {
      yield `${url}/${slug}/`
    }
    return
  }

  let pageNumber = 1

  while (true) {
    const pageUrl = `${url}/blog/${pageNumber++}`
    const html = await $fetch(pageUrl, { responseType: 'text' })
    const dom = parseDocument(html)
    const links = select('.elementor-widget-container > div > article > a', dom) as DomElement[]

    if (links.length === 0)
      break

    for (const link of links) {
      yield link.attribs!.href
    }
  }
}
