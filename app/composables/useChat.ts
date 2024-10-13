import type { ChatMessages } from '~~/server/util/chat'
import consola from 'consola'

export enum ChatState {
  Idle = 'idle',
  Streaming = 'streaming',
  Error = 'error',
}

export function useChat() {
  const state = ref<ChatState>(ChatState.Idle)
  const error = ref<string>()
  const messages = ref<ChatMessages>([])
  const userInput = ref<string>('Hola!')

  async function* chatGen(messages: ChatMessages): AsyncGenerator<string, void, unknown> {
    state.value = ChatState.Streaming
    const response = await $fetch('/api/chat', { method: 'POST', body: { messages }, responseType: 'stream' })

    let buffer = ''
    const reader = (response as ReadableStream)
      .pipeThrough(new TextDecoderStream())
      .getReader()

    while (true) {
      const { value, done } = await reader.read()

      if (done) {
        if (buffer.trim()) {
          consola.warn('Stream ended with unparsed data:', buffer)
        }
        return
      }

      buffer += value
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice('data: '.length).trim()
          if (data === '[DONE]')
            return

          try {
            const jsonData = JSON.parse(data)
            if (jsonData.response) {
              yield jsonData.response
            }
          }
          catch (parseError) {
            consola.error('Error parsing JSON:', parseError)
          }
        }
      }
    }
  }

  async function chat() {
    messages.value.push({ role: 'user', content: userInput.value })
    userInput.value = ''
    state.value = ChatState.Streaming

    try {
      const response = chatGen(messages.value)
      messages.value.push({ role: 'assistant', content: '' })
      for await (const chunk of response)
        messages.value.at(-1)!.content += chunk
    }
    catch (error) {
      consola.error('Error sending message:', error)
      state.value = ChatState.Error
    }
    finally {
      state.value = ChatState.Idle
    }
  }

  return {
    messages,
    chat,
    state,
    error,
    userInput,
  }
}
