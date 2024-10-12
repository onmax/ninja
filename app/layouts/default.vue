<script setup lang="ts">
useColorMode()

// const { loggedIn, user, session, clear } = useUserSession()
const { loggedIn, user } = useUserSession()
</script>

<template>
  <div flex="~ col">
    <header w-full bg-slate-800 py-12 text-white>
      <div flex="~ items-center justify-between">
        <div>
          Ninja
        </div>
        <div v-if="loggedIn" flex="~ gap-16 items-center">
          <NuxtLink to="/chat">
            Chat
          </NuxtLink>
          <NuxtImg v-if="user?.avatar" :src="user?.avatar" size-40 rounded-full />
        </div>
        <div v-else>
          <a href="/auth/discord">Login with Discord</a>
        </div>
      </div>
    </header>

    <main v-bind="$attrs">
      <slot />
    </main>
  </div>
</template>

<style>
body {
  --uno: 'bg-slate-900';

  main,
  header > div {
    width: clamp(calc(100vh - 64px), 74ch, 1280px);
    margin: 0 auto;
  }
}
</style>
