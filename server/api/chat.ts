import { createOpenAI } from '@ai-sdk/openai'
import { convertToCoreMessages, streamText } from 'ai'
import consola from 'consola'
import { safeParse } from 'valibot'
import { ChatSchema, systemPrompt } from '../util/chat'

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().openaiApiKey
  if (!apiKey)
    throw new Error('Missing OpenAI API key')
  const openai = createOpenAI({ apiKey })
  consola.info('OpenAI API key loaded')

  return defineEventHandler(async (event) => {
    const { output: body, issues: bodyIssues } = await readValidatedBody(event, body => safeParse(ChatSchema, body))
    if (bodyIssues)
      throw createError({ statusCode: 400, statusMessage: 'Invalid newsletter signup data', message: JSON.stringify(bodyIssues) })

    const result = await streamText({ model: openai('gpt-4-turbo'), messages: convertToCoreMessages([{ role: 'assistant', content: systemPrompt }, ...body.messages]) })
    return result.toDataStreamResponse()
  })
})
