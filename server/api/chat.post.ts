import { defineLazyEventHandler } from '#imports'
import { createOpenAI } from '@ai-sdk/openai'
import { convertToCoreMessages, streamText } from 'ai'
import consola from 'consola'
import { safeParse } from 'valibot'
import { ChatSchema, systemPrompt } from '../utils/chat'

export default defineLazyEventHandler(() => {
  const apiKey = useRuntimeConfig().openaiApiKey
  if (!apiKey)
    throw new Error('Missing OpenAI API key')
  const openai = createOpenAI({ apiKey })
  consola.info('OpenAI API key loaded')

  return defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    if (!session.user)
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'You need to be logged in to access this resource' })

    const { output: body, issues: bodyIssues } = await readValidatedBody(event, body => safeParse(ChatSchema, body))
    if (bodyIssues)
      throw createError({ statusCode: 400, statusMessage: 'Invalid newsletter signup data', message: JSON.stringify(bodyIssues) })

    consola.info('Received chat message', body)
    const lastMessage = body.messages.at(-1)!.content

    const chunks = await searchChunks(lastMessage)

    const chatContext = chunks.map(chunk => `<${chunk.headers?.at(-1)}>${chunk.content}</${chunk.headers?.at(-1)}>`).join('\n')

    body.messages.push({ role: 'user', content: chatContext })
    consola.info('Sending chat message', body.messages)

    const result = await streamText({ model: openai('gpt-4-turbo'), messages: convertToCoreMessages([{ role: 'assistant', content: systemPrompt }, ...body.messages]) })
    return result.toDataStreamResponse()
  })
})
