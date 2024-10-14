import type { DomElement, Element } from 'domhandler'
import { mkdir, writeFile } from 'node:fs/promises'
import consola from 'consola'
import select from 'css-select'
import { parseDocument } from 'htmlparser2'
import TurndownService from 'turndown'

export default defineTask({
  meta: {
    name: 'scraper',
    description: 'Run the scraper',
  },
  async run() {
    if (!import.meta.dev)
      throw createError('This task is only available in development mode')

    consola.log('Running Scraper')
    const folder = 'content/blog'

    await mkdir(folder, { recursive: true })
    let counter = 0

    for await (const post of getPost()) {
      consola.log(`Writing ./content/blog/${post.slug}.md`)
      const filePath = `${folder}/${post.slug}.md`
      await writeFile(filePath, post.markdown)
      counter++
    }
    consola.info(`Scraped ${counter} posts`)
    return { result: 'Success' }
  },
})

const removeLinesContaining = [
  '/\\*! elementor - ',
  'data-mce-type="bookmark"',
]

async function parsePost(link: string) {
  const res = await fetch(link)
  const html = await res.text()
  const dom = parseDocument(html)

  const turndownService = new TurndownService()
  let md = turndownService.turndown(html)
  const lines = md.split('\n')
  const crap = lines.findIndex(line => line.includes('📅 Actualizado'))
  if (crap === -1)
    throw new Error('Could not find the line with the date')

  md = lines
    .slice(crap + 1)
    .filter(line => !removeLinesContaining.some(phrase => line.includes(phrase)))
    .join('\n')

  const bibliographyRe = /\*\s+\d+\s+([^\n]+)/g
  const match = md.match(bibliographyRe)

  const bibliographyEntries = match?.map(entry => entry.replace(/\*\s+\d+\s+/, '')) || []
  for (const entry of bibliographyEntries) {
    md = md.replaceAll(entry, '')
  }

  const audioRe = /^\[.*\]\((https?:\/\/[^)]+)\)/g
  const audioLink = (md.trimStart().match(audioRe) || []).map(match => match.replace(audioRe, '$1'))

  const slug = link.split('/').at(-2)
  const name = (select('h1', dom)[0]?.children[0] as Element)?.data.trim() || ''
  const imageUrl = (select('meta[property="og:image"]', dom)[0] as DomElement)?.attribs?.content || ''
  const imageFilename = imageUrl.split('/').at(-1)
  const published = (select('meta[property="article:published_time"]', dom)[0] as DomElement)?.attribs?.content || ''
  const modified = (select('meta[property="article:modified_time"]', dom)[0] as DomElement)?.attribs?.content || ''
  const url = `https://pau.ninja/${slug}`

  const categoryRe = /Mira mis otros artículos sobre: \[(.+)\]\(https:\/\/pau.ninja\/(.*)\/\)/
  const categoryMatch = categoryRe.exec(md) // Use exec to capture groups
  const categories = [
    { slug: categoryMatch?.[2] || 'sin-categoria', label: categoryMatch?.[1] || 'Sin categoría' },
  ]

  // Adjust regex to match multiple categories
  const categoriesExtraRe = /O si quieres ser más específico:((?:\s*\[.*?\]\(https:\/\/pau\.ninja\/.*?\/\),?)+)/
  const extraCategoriesMatch = categoriesExtraRe.exec(md)

  if (extraCategoriesMatch) {
    const individualCategoryRe = /\[(.*?)\]\(https:\/\/pau\.ninja\/(.*?)\/\)/g
    const additionalCategories = extraCategoriesMatch[1].matchAll(individualCategoryRe)
    for (const match of additionalCategories) {
      categories.push({ slug: match[2], label: match[1] })
    }
  }

  // remove everything from bliography to the end
  const crapAtTheEnd = /\nBibliografía: fuentes, referencias y notas[\s\S]*/

  // remove the table of contents
  const toc = /Navega por el contenido\n\n\[Toggle\]\(#\)\n\n(\*.*\n(\s*\*.*\n)*)/g

  const h2Markup = /(.*)\n-+/g

  // clean up the markdown
  md = md
    .replace(audioRe, '')
    .replace(toc, '')
    .replace(crapAtTheEnd, '')
    .replace(h2Markup, '## $1')
    .replaceAll(/\n{3,}/g, '\n\n')
    .replaceAll(/\[(\d+)\]\(javascript:void\\\(0\\\)\)/g, '[ref-$1](#ref-$1){.ref}')
    .replaceAll(/▲/g, '')
    .replaceAll(/▼/g, '')
    .replaceAll(/https:\/\/pau\.ninja\/(.*)\//g, './$1')
    .replaceAll(/^\*\s+/gm, '- ')
    .trim()

  const frontmatter = {
    title: `"${name.replace(/"/g, '\\"').trim()}"`,
    url,
    slug,
    categories: `\n${categories.map(({ slug, label }) => `  - slug: ${slug}\n    label: ${label}`).join('\n').trim()}`,
    image: imageFilename,
    imageURL: imageUrl,
    published,
    modified,
    scrappedAt: new Date().toISOString(),
    audioLink,
    bibliography: JSON.stringify(bibliographyEntries),
  }
  const frontmatterStr = Object.entries(frontmatter).map(([key, value]) => `${key}: ${value}`).join('\n')

  const markdown = `---\n${frontmatterStr}\n---\n${md}`

  return {
    slug,
    markdown,
  }
}

/**
 * Loop over https://pau.ninja/blog/{N}
 *
 * The return value is HTML, so we need to parse it, and select
 * the links we want to keep with css-select's select() method.
 *
 * The moment we don't have any more links, we stop the loop. We yield the links we found one-by-one.
 */
async function* getPost(): AsyncGenerator<any, void, void> {
  const url = 'https://pau.ninja/blog'

  let i = 1

  while (true) {
    const res = await fetch(`${url}/${i++}`)
    const html = await res.text()
    const dom = parseDocument(html)
    const links = select('.elementor-widget-container > div > article > a', dom) as DomElement[]
    if (links.length === 0)
      break
    for (const link of links) {
      yield parsePost(link.attribs!.href)
    }
  }
}
