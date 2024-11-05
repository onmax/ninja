import consola from 'consola'
import { object, safeParse, string } from 'valibot'
import { searchChunks } from '../utils/embeddings'

const QuerySchema = object({
  query: string(),
})

export default defineEventHandler(async (event) => {
  const { output: query, success, issues } = await getValidatedQuery(event, query => safeParse(QuerySchema, query))
  consola.info('Query:', query)
  if (!success)
    throw createError({ message: 'Invalid query', statusCode: 400, cause: JSON.stringify(issues) })
  const chunks = await searchChunks(query.query)
  return chunks
})
