<script setup lang="ts">
defineEmits<{ (e: 'submit'): void }>()
const input = defineModel<string>()
</script>

<template>
  <form border="~ input" ring="offset-background focus-within:ring focus-within:2 focus-within:offset-2" bg="background" text="14 placeholder:text-muted-foreground" flex="~ items-end gap-16" rounded-8 p-6 focus-within:outline-none @submit.prevent="$emit('submit')">
    <textarea
      v-model="input"
      placeholder="Escribe un mensaje..."
      style="field-sizing: content;" un-disabled="cursor-not-allowed op-50" max-h-16lh min-h-1lh w-full flex-1 resize-none bg-transparent px-12 py-6 outline-none
    />
    <Button type="submit" :disabled="!input">
      Enviar
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" relative bottom--2 ml-4 size-14><polyline points="9 10 4 15 9 20" /><path d="M20 4v7a4 4 0 0 1-4 4H4" /></svg>
    </Button>
  </form>
</template>
