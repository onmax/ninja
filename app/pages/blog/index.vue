<script lang="ts" setup>
definePageMeta({
  title: 'Blog',
})

const selectedCategory = useRouteQuery<string>('categoria', '')

const { data: list } = await useAsyncData(
  'blogPosts',
  async () => {
    let query = queryContent('/blog')
    if (selectedCategory.value) {
      query = query.where({ categories: { $in: selectedCategory.value } })
    }
    return query.find()
  },
  { watch: [selectedCategory] },
)
</script>

<template>
  <NuxtLayout>
    <div my-32>
      <Select v-model="selectedCategory" :options="categories" :value-label="c => categories.find(({ slug }) => slug === c)?.label || ''" :value-key="c => c.slug">
        <template #option="{ option }">
          <span>{{ option.label }}</span>
        </template>
      </Select>
    </div>
    <div grid="~ md:cols-2 lg:cols-3 gap-16">
      <NuxtLink v-for="article in list" :key="article._path" :to="article._path" grid="~ cols-1 rows-1" un-children="row-span-full col-span-full" group of-hidden rounded-8 p-2>
        <NuxtImg :src="article.imageURL" rounded-8 object-cover :alt="article.title" />
        <div h-6lh h-full rounded-b-8 bg-gradient="to-t from-slate-900 to-transparent group-hover:to-slate-900/40" />
        <div self-end p-16 text-white font-bold>
          <h2>{{ article.title }}</h2>
        </div>
        <div flex="~ wrap gap-8 justify-end" m-8>
          <Category v-for="category in article.categories" :key="category.slug" op="9a" :category="categories.find(c => c.slug === category)!" variant="outline" />
        </div>
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>
