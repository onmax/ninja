<script lang="ts" setup>
import { NuxtLink } from '#components'

const { category, asLink, op = 'ff' } = defineProps<{ category: Category, asLink?: boolean, variant?: 'default' | 'secondary' | 'destructive' | 'outline', op: string }>()

const to = computed(() => {
  if (!asLink)
    return
  return { name: 'blog', query: { categoria: category.slug } }
})
</script>

<template>
  <component :is="asLink ? NuxtLink : 'div'" :to>
    <Badge :style="`--c: ${category.color}; background-color: ${category.color}${op}`" ring="$c 1.5" text="12 white" :variant>
      {{ category.label }}
    </Badge>
  </component>
</template>
