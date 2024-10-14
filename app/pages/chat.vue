<script setup lang="ts">
const { loggedIn } = useUserSession()
if (!loggedIn)
  navigateTo('/')
</script>

<template>
  <NuxtLayout>
    <ChatPanel />
  </NuxtLayout>
</template>
