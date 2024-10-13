<script setup lang="ts">
useColorMode()

// const { loggedIn, user, session, clear } = useUserSession()
const { loggedIn, user } = useUserSession()
</script>

<template>
  <div flex="~ col" min-h-screen bg-background text-foreground font-sans>
    <header bg="background/80" border="b border" sticky top-0 z-40 w-full py-12 backdrop-blur-lg>
      <div flex="~ items-center justify-between">
        <div>
          Ninja
        </div>
        <nav v-if="loggedIn" flex="md:~ gap-24 items-center gap-20 lg:gap-24" hidden text-14 font-500>
          <NuxtLink to="/blog">
            Blog
          </NuxtLink>
          <template v-if="loggedIn">
            <NuxtLink to="/chat">
              Chat
            </NuxtLink>
            <NuxtImg v-if="user?.avatar" :src="user?.avatar" size-40 rounded-full />
          </template>
          <NuxtLink v-else to="/auth/discord" text-foreground transition-colors>
            Login with Discord
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main v-bind="$attrs" mt-auto h-full>
      <slot />
    </main>
  </div>
</template>

<style>
body {
  main,
  header > div {
    width: clamp(calc(100vh - 64px), 74ch, 1280px);
    margin: 0 auto;
  }
}
</style>
