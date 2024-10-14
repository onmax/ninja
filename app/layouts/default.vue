<script setup lang="ts">
useColorMode()

// const { loggedIn, user, session, clear } = useUserSession()
const { loggedIn, user } = useUserSession()
</script>

<template>
  <div flex="~ col" min-h-screen bg-background text-foreground font-sans>
    <header bg="background/80" border="b border" sticky top-0 z-40 w-full py-20 backdrop-blur-lg>
      <div flex="~ items-center justify-between">
        <NuxtLink to="/" relative>
          <Icon name="game-icons:running-ninja" absolute bottom--8 text-40 op-40 />
          <span ml-52 mr-10 text-12 tracking-4 uppercase>
            Ninja
          </span>
          <Icon name="game-icons:running-ninja" absolute bottom--8 rotate-y-180 text-40 op-40 />
        </NuxtLink>
        <nav flex="~ gap-24 items-center gap-20 lg:gap-24" relative text-14 font-500>
          <NuxtLink to="/blog" flex="~ items-baseline gap-8">
            <Icon name="ph:newspaper-duotone" relative bottom--2 scale-120 />
            Blog
          </NuxtLink>
          <template v-if="loggedIn">
            <NuxtLink to="/chat" flex="~ items-baseline gap-8" mr-54>
              <Icon name="ph:chat-duotone" relative bottom--2 scale-120 />
              Chat
            </NuxtLink>
            <NuxtImg v-if="user?.avatar" :src="user?.avatar" absolute right-0 size-32 rounded-full />
          </template>
          <Button v-else href="/auth/discord" text-foreground transition-colors>
            <Icon name="ph:discord-logo-duotone" scale-120 />
            Iniciar sesión con Discord
          </Button>
        </nav>
      </div>
    </header>

    <main v-bind="$attrs">
      <slot />
    </main>
  </div>
</template>

<style>
body {
  main,
  header > div {
    width: clamp(200px, 74ch, calc(100vw - 64px));
    margin: 0 auto;
  }
}
</style>
