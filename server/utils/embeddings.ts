interface SearchOptions {
  limit?: number
}

export async function searchChunks(text: string, options: SearchOptions = {}) {
  const { limit = 10 } = options

  const index = hubVectorize('chunks')
  const queryVector = await hubAI().run('@cf/baai/bge-large-en-v1.5', { text }).then(res => res.data.at(0)!)
  const { matches } = await index.query(queryVector, { topK: limit })

  const chunkMatches = await useDrizzle().query.chunks.findMany({
    where: (chunks, { inArray }) => inArray(chunks.id, matches.map(match => match.id)),
    with: {
      post: {
        columns: {
          slug: true,
        },
      },
    },
  })

  const chunkMatchesWithScore = chunkMatches.map((chunk) => {
    const match = matches.find(match => match.id === chunk.id)
    return { ...chunk, score: match!.score }
  })

  return chunkMatchesWithScore.sort((a, b) => b.score - a.score)
}
