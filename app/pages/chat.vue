<script setup lang="ts">
definePageMeta({
  title: 'Chat',
})

const { loggedIn } = useUserSession()
if (!loggedIn.value)
  navigateTo('/')
</script>

<template>
  <NuxtLayout mt-auto>
    <ChatPanel />
  </NuxtLayout>
</template>
