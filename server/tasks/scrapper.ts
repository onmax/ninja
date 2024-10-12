import TurndownService from 'turndown'
import { JSDOM } from "jsdom"
import { writeFile, mkdir } from "fs/promises"

export default defineTask({
  meta: {
    name: "scrapper",
    description: "Run the scrapper",
  },
  async run() {
    console.log("Running Scrapper");
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
  const dom = new JSDOM(html);

  const slug = link.split('/').at(-2)
  const name = (dom.window.document.querySelector('h1') as HTMLElement).textContent
  const imageUrl = dom.window.document.querySelector('meta[property="og:image"]')?.getAttribute('content') || ''
  const imageFilename = imageUrl.split('/').at(-1)
  const published = dom.window.document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') || ''
  const modified = dom.window.document.querySelector('meta[property="article:modified_time"]')?.getAttribute('content') || ''

  const content = dom.window.document.querySelector('.entry-content') as HTMLElement
  const raw = new TurndownService().turndown(content.innerHTML)
  const md = raw
    .split('.autoPodcast ul li a img{width:50px}')[0]
    .replaceAll(/▼|▲/g, '')
    .replaceAll(/javascript:void\(0\)/g, '') // TODO Find a way to remove this
    .trim()
  
  // const _audioLink = md.split('\n', 2)[0] || ''
  // const audioLink = _audioLink.match(/\((.*?)\)/)?.[1] || ''

  const frontmatter = {
    title: `"${name?.replace(/"/g, '\\"')}"`,
    image: imageFilename,
    imageURL: imageUrl,
    published,
    modified,
    // audioLink,
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
 * the links we want to keep with document.querySelectorAll('.elementor-widget-container>div>article>a').map(a => a.href)
 * 
 * The moment we don't have any more links, we stop the loop. We yield the links we found one-by-one.
 */
async function* getPost(): AsyncGenerator<any, void, void> {
  const url = 'https://pau.ninja/blog'

  let i = 1

  while (true) {
    const res = await fetch(`${url}/${i++}`)
    const html = await res.text()
    const dom = new JSDOM(html);
    const links = dom.window.document.querySelectorAll('.elementor-widget-container>div>article>a') as NodeListOf<HTMLLinkElement>
    if (links.length === 0) break
    for (const link of links) {
      yield parsePost(link.href)
    }
  }
}

