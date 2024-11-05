<script setup lang="ts">
const { loggedIn } = useUserSession()
// const colorMode = useColorMode()

watch(loggedIn, () => {
  if (loggedIn.value) {
    navigateTo('/blog')
  }
}, { immediate: true })

// useHead({
//   htmlAttrs: { lang: 'en' },
//   link: [{ rel: 'icon', href: '/icon.png' }]
// })

// useSeoMeta({
//   viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
//   title: 'Atidone',
//   description:
//     'A Nuxt demo hosted with edge-side rendering, authentication and queyring a Cloudflare D1 database',
//   ogImage: '/social-image.png',
//   twitterImage: '/social-image.png',
//   twitterCard: 'summary_large_image'
// })
</script>

<template>
  <NuxtLayout name="login" />
</template>
