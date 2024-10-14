<script setup lang="ts">
import { NuxtLink } from '#components'

const { href, size = 'default', variant = 'default', to } = defineProps<{
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  href?: string
  to?: string
}>()

const cmp = computed(() => to ? NuxtLink : (href ? 'a' : 'button'))
</script>

<template>
  <component
    :is="cmp"
    :href
    flex="~ items-center justify-center gap-8" rounded-2 text-14 font-medium transition-colors hocus:outline-none un-disabled="pointer-events-none op-50"
    ring="offset-background hocus:1.5  hocus:ring hocus:offset-2"
    :class="{
      'bg-primary text-primary-foreground hocus:bg-primary/90': variant === 'default',
      'bg-destructive text-destructive-foreground hocus:bg-destructive/90': variant === 'destructive',
      'border border-input bg-background hocus:bg-accent hocus:text-accent-foreground': variant === 'outline',
      'bg-secondary text-secondary-foreground hocus:bg-secondary/80': variant === 'secondary',
      'hover:bg-accent hocus:text-accent-foreground': variant === 'ghost',
      'text-primary underline-offset-4 hocus:underline': variant === 'link',
      'h-36 px-16 py-8': size === 'default',
      'h-36 rounded-md px-12': size === 'sm',
      'h-44 rounded-md px-24': size === 'lg',
      'h-40 w-40': size === 'icon',
    }"
  >
    <slot />
  </component>
</template>
