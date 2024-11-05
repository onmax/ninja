<script setup lang="ts">
defineProps<{ icon: string }>()
const value = defineModel<string>()
</script>

<template>
  <div relative flex="~ items-center">
    <input
      v-model="value" type="text" v-bind="$attrs"
      h-40 w-full flex border="~ input" rounded-6 bg-background px-12 py-8 text="12 placeholder:muted-foreground" ring="offset-background hocus:2 hocus:offset-2 hocus:ring" disabled:cursor-not-allowed disabled:op-50 hocus:outline-none :class="{ 'pl-32': icon }"
    >
    <span v-if="icon" absolute start-0 inset-y-0 flex="~ items-center justify-center" px-8>
      <Icon :name="icon" size-18 text-muted-foreground />
    </span>
  </div>
</template>
