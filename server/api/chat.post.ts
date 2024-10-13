import type { BaseAiTextGeneration } from '@cloudflare/workers-types'
import consola from 'consola'
import { safeParse } from 'valibot'
import { ChatSchema, systemPrompt } from '../util/chat'

export default defineEventHandler(async (event) => {
  const { output: body, issues: bodyIssues } = await readValidatedBody(event, body => safeParse(ChatSchema, body))
  if (bodyIssues)
    throw createError({ statusCode: 400, statusMessage: 'Invalid newsletter signup data', message: JSON.stringify(bodyIssues) })

  const config: BaseAiTextGeneration['inputs'] = {
    messages: [{ role: 'system', content: systemPrompt }, ...body.messages],
    // max_tokens: 1024,
    // temperature: 0.5,
    stream: true,
  }

  consola.info('Generating text with config:', JSON.stringify(config))
  const ai = hubAI()
  consola.info('Running AI model:', !!ai)

  try {
    const result = await ai.run('@cf/meta/llama-3.1-8b-instruct', config)
    return sendStream(event, result as ReadableStream)
  }
  catch (error) {
    consola.error(error)
    consola.info('Failed to generate text:', JSON.stringify(error))
    throw createError({
      statusCode: 500,
      statusMessage: 'Error processing request',
      cause: error,
    })
  }
})
