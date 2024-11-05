<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <NuxtLayout>
    <ContentDoc v-slot="{ doc }">
      <article

        max-w-70ch prose prose-slate dark:prose-invert
      >
        <h1>{{ doc.title }}</h1>
        <ContentRenderer :value="doc" />
      </article>
    </ContentDoc>
  </NuxtLayout>
</template>
