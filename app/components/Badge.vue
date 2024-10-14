<script setup lang="ts">
const { variant = 'default' } = defineProps<{
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}>()
</script>

<template>
  <div
    flex="~ items-center"
    rounded-full px-8 py-2 text-12 font-medium transition-colors
    outline="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    :class="{
      'bg-primary text-primary-foreground hocus:bg-primary/80 border-transparent': variant === 'default',
      'bg-secondary text-secondary-foreground hocus:bg-secondary/80 border-transparent': variant === 'secondary',
      'bg-destructive text-destructive-foreground hocus:bg-destructive/80 border-transparent': variant === 'destructive',
      'text-foreground': variant === 'outline',
    }"
  >
    <slot />
  </div>
</template>
