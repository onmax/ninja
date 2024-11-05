<script lang="ts" setup>
import type { QueryBuilderWhere } from '@nuxt/content'

definePageMeta({
  title: 'Blog',
  middleware: 'auth',
})

const selectedCategory = useRouteQuery<string>('categoria', '')

const search = useRouteQuery<string>('busqueda')
const { data: searchResults, execute: executeSearch } = useFetch('/api/search', { query: { query: search }, method: 'get', immediate: false, watch: false })
watchDebounced([search], () => executeSearch(), { debounce: 500 })

const { data: list, status } = await useAsyncData(
  'blogPosts',
  async () => {
    const query = queryContent('/blog')
    const where: QueryBuilderWhere = {}
    if (selectedCategory.value)
      where.categories = { $in: selectedCategory.value }
    if (searchResults.value)
      where.slug = { $in: searchResults.value.map(article => article.post.slug) }

    return query.where(where).find()
  },
  { watch: [selectedCategory] },
)
</script>

<template>
  <NuxtLayout>
    <div flex="~ items-center gap-16 wrap">
      <Input v-model="search" icon="ph:magnifying-glass" placeholder="Buscar..." flex-1 />
      <Select v-model="selectedCategory" flex-1 :options="Object.values(categories)" :value-label="c => categories[c as keyof typeof categories]?.label || ''" :value-key="c => c.slug">
        <template #option="{ option }">
          <span>{{ option.label }}</span>
        </template>
      </Select>
    </div>
    <div grid="~ md:cols-2 lg:cols-5 gap-16" mt-24>
      <div v-if="status !== 'success'">
        Cargando...
      </div>
      <NuxtLink v-for="article in list" v-else :key="article._path" :to="article._path" grid="~ cols-1 rows-1" un-children="row-span-full col-span-full" group of-hidden rounded-8 p-2>
        <NuxtImg :src="article.imageUrl" rounded-8 object-cover :alt="article.title" loading="lazy" />
        <div h-6lh h-full rounded-b-8 bg-gradient="to-t from-slate-900 to-transparent group-hover:to-slate-900/40" />
        <div self-end p-16 text-white font-bold>
          <h2>{{ article.title }}</h2>
        </div>
        <div flex="~ wrap gap-8 justify-end" m-8>
          <Category v-for="category in article.categories" :key="category.slug" op="9a" :category variant="outline" />
        </div>
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>
