<script setup lang="ts">
const { loggedIn } = useUserSession()
if (!loggedIn.value)
  navigateTo('/')
</script>

<template>
  <NuxtLayout mt-auto>
    <ChatPanel />
  </NuxtLayout>
</template>
