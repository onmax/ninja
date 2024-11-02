import { readdir, readFile } from 'node:fs/promises'
import consola from 'consola'
import { join } from 'pathe'
import { folder } from '../utils/content'

export default defineTask({
  meta: {
    name: 'vectorize:seed',
    description: 'Generate text embeddings vectors',
  },
  async run() {
    consola.info('Running Vectorize seed task...')

    const chunks = await getMarkdownChunks()
    const chunksCount = chunks.length

    // process in chunks of 100 as that's the maximum supported by workers ai
    const INCREMENT_AMOUNT = 100

    const totalBatches = Math.ceil(chunksCount / INCREMENT_AMOUNT)
    consola.info(`Total items: ${chunksCount} (${totalBatches} batches)`)

    const ai = hubAI()

    for (let i = 0; i < chunksCount; i += INCREMENT_AMOUNT) {
      consola.info(`⏳ Processing items ${i} - ${i + INCREMENT_AMOUNT}...`)

      const selectedChunks = chunks.slice(i, i + INCREMENT_AMOUNT)
      const embedding = await ai.run('@cf/baai/bge-base-en-v1.5', { text: selectedChunks.map(chunk => chunk.content) })
      const vectors = embedding.data
      selectedChunks.forEach((chunk, i) => chunk.embedding = vectors[i])

      await hubVectorize('posts').insert(
        selectedChunks.map(({ filename, headers, embedding, category }, j) => ({
          id: i * j,
          values: embedding,
          namespace: category || 'misc',
          metadata: { filename, headers: JSON.stringify(headers) },
        })),
      )

      consola.info(`✅ Processed items ${i} - ${i + INCREMENT_AMOUNT}...`)
    }

    return { result: 'success' }
  },
})

interface Chunk {
  content: string
  headers: [string] /* h1 */ | [string, string] /* h1, h2 */ | [string, string, string] /* h1,h2,h3 */ | [string, string, string, string] /* h1,h2,h3,h4 */
  filename: string
  embedding?: number[]
  category?: string
}

async function getMarkdownChunks(): Promise<Chunk[]> {
  const filePaths = await readdir(folder)
  const filesContent = await Promise.all(
    filePaths
      .filter(file => file.endsWith('.md'))
      .map(async filePath => ({
        content: await readFile(join(folder, filePath), 'utf-8'),
        filename: filePath,
      })),
  )

  return filesContent.flatMap(({ content, filename }) => {
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
    const categoriesStr = frontmatterMatch
      ? frontmatterMatch[1].split('\n')
        .find(line => line.startsWith('category:'))
        ?.split(':')[1]
        ?.trim() || '[]'
      : '[]'
    const category = JSON.parse(categoriesStr).at(0)

    // Remove frontmatter
    const cleanContent = content.replace(/^---[\s\S]*?---\n/, '')
    const lines = cleanContent.split('\n')

    let currentHeaders: string[] = []
    const chunks: Chunk[] = []
    let currentContent: string[] = []

    for (const line of lines) {
      const headerMatch = line.match(/^(#{1,4})\s+(.+)$/)

      if (headerMatch) {
        // If we have accumulated content, save it as a chunk
        if (currentContent.length > 0) {
          chunks.push({
            headers: currentHeaders.slice(0, 4) as Chunk['headers'],
            content: currentContent.join('\n').trim(),
            filename,
            category,
          })
          currentContent = []
        }

        const level = headerMatch[1].length - 1
        const headerText = headerMatch[2].trim()

        // Update headers array at the correct level
        currentHeaders[level] = headerText
        // Clear any sub-headers
        currentHeaders = currentHeaders.slice(0, level + 1)
      }
      else if (line.trim()) {
        currentContent.push(line)
      }
    }

    // Don't forget the last chunk
    if (currentContent.length > 0) {
      chunks.push({
        headers: currentHeaders.slice(0, 4) as Chunk['headers'],
        content: currentContent.join('\n').trim(),
        filename,
        category,
      })
    }

    return chunks
  })
}
