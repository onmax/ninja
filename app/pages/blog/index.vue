<template>
  <NuxtLayout grid="~ md:cols-2 lg:cols-3 gap-16">
    <ContentList
      v-slot="{ list }"
      path="/"
    >
      <NuxtLink
        v-for="article in list"
        :key="article._path"

        of-hidden rounded-8 p-2
        :to="article._path"
        grid="~ cols-1 rows-1"
        un-children="row-span-full col-span-full"
      >
        <NuxtImg
          :src="article.imageURL"
          rounded-8
          object-cover
          :alt="article.title"
        />
        <div

          h-6lh h-full rounded-b-8
          bg-gradient="to-t from-slate-900 to-transparent"
        />
        <div

          self-end p-16 text-white font-bold
        >
          <h2>{{ article.title }}</h2>
        </div>
      </NuxtLink>
    </ContentList>
  </NuxtLayout>
</template>
