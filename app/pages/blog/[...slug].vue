<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
})

const { page } = useContent()

const options = [
  { label: 'Leer original', href: `https://pau.ninja/${page.value.slug}`, icon: 'ph:presentation-duotone' },
]
</script>

<template>
  <NuxtLayout>
    <template #header-end>
      <Dropdown :options>
        <Icon name="ph:dots-three-outline-vertical-duotone" />
      </Dropdown>
    </template>
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
