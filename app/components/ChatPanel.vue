<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'

const { user } = useUserSession()
const { messages, input, handleSubmit } = useChat()
</script>

<template>
  <div flex="~ col" mt-auto h-full py-24>
    <div v-for="m in messages" :key="m.id" mt-16 :class="{ 'self-end': m.role === 'user' }" flex-1 whitespace-pre-wrap>
      <div v-if="m.role === 'assistant'" relative max-w-100ch max-w="[calc(100vw-16px)]" flex="~ items-end self-start gap-8">
        <div flex="~ items-center justify-center" relative size-40 shrink-0 of-hidden rounded-full bg-secondary text-14>
          🤖
        </div>
        <div max-w-full whitespace-pre-wrap break-words rounded-r-lg rounded-tl-lg bg-secondary p-16 text-14 text-secondary-foreground>
          {{ m.content }}
        </div>
      </div>
      <div v-else flex="~ items-end self-end gap-8" relative right-0 max-w-100ch>
        <div max-w-full whitespace-pre-wrap break-words rounded-l-lg rounded-tr-lg bg-primary p-16 text-14 text-primary-foreground>
          {{ m.content }}
        </div>
        <NuxtImg v-if="user?.avatar" :src="user?.avatar" size-40 rounded-full />
      </div>
    </div>

    <ChatInput v-model="input" mt-32 @submit="handleSubmit" />
  </div>
</template>
