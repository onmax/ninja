<script setup lang="ts">
const { chat, messages, userInput } = useChat()
</script>

<template>
  <pre bg-slate-200>
    {{ messages }}
  </pre>

  <form @submit.prevent="() => chat()">
    <textarea v-model="userInput" />
    <button>Send</button>
  </form>
</template>
