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
    <Button type="submit" flex="~ items-baseline gap-6">
      Enviar
      <Icon name="ph:arrow-elbow-down-left-duotone" relative bottom--2 />
    </Button>
  </form>
</template>
