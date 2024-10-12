import TurndownService from 'turndown'
import { parseDocument } from 'htmlparser2'
import { writeFile, mkdir } from "fs/promises"
import select from 'css-select'

export default defineTask({
  meta: {
    name: "scraper",
    description: "Run the scraper",
  },
  async run() {
    console.log("Running Scraper");
    const folder = 'content/blog'
    
    await mkdir(folder, { recursive: true })
    
    for await (const post of getPost()) {
      console.log(`Writing ${post.slug}.md`)
      const filePath = `${folder}/${post.slug}.md`
      await writeFile(filePath, post.markdown)
    }
    return { result: "Success" };
  },
});

async function parsePost(link: string) {
  const res = await fetch(link)
  const html = await res.text()
  const dom = parseDocument(html);

  const slug = link.split('/').at(-2)
  const name = select('h1', dom)[0]?.children[0]?.data || ''
  const imageUrl = select('meta[property="og:image"]', dom)[0]?.attribs.content || ''
  const imageFilename = imageUrl.split('/').at(-1)
  const published = select('meta[property="article:published_time"]', dom)[0]?.attribs.content || ''
  const modified = select('meta[property="article:modified_time"]', dom)[0]?.attribs.content || ''

  const contentElement = select('.entry-content', dom)[0]
  const raw = new TurndownService().turndown(contentElement ? contentElement.children.map((child: any) => child.data || '').join('') : '')
  const md = raw
    .split('.autoPodcast ul li a img{width:50px}')[0]
    .replaceAll(/▼|▲/g, '')
    .replaceAll(/javascript:void\(0\)/g, '') // TODO Find a way to remove this
    .trim()
  
  const frontmatter = {
    title: `"${name.replace(/"/g, '\"')}"`,
    image: imageFilename,
    imageURL: imageUrl,
    published,
    modified,
    slug
  }
  const frontmatterStr = Object.entries(frontmatter).map(([key, value]) => `${key}: ${value}`).join('\n')
  const markdown = `---\n${frontmatterStr}\n---\n\n${md}`

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
    const dom = parseDocument(html);
    const links = select('.elementor-widget-container > div > article > a', dom)
    if (links.length === 0) break
    for (const link of links) {
      yield parsePost(link.attribs.href)
    }
  }
}