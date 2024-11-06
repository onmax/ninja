<script setup lang="ts">
const { user } = useUserSession()

const { clear: logout } = useUserSession()

const route = useRoute()
// const isBlogPost = computed(() => route.path.startsWith('/blog/'))
const title = route.meta.title as string

if (title) {
  useHead({
    title,
    meta: [{ property: 'og:title', content: title }],
  })
}

const showAside = useLocalStorage<boolean>('show-aside', true)

const options = [
  // { label: string, href: string, icon: string }}
  { label: 'Cerrar sesión', onClick: () => {
    logout()
    navigateTo('/')
  }, icon: 'ph:sign-out-duotone' },
]
</script>

<template>
  <!-- <div flex="~ col" min-h-screen bg-background text-foreground font-sans>
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
  </div> -->
  <div flex="~" relative h-screen>
    <aside bg="#fafafa" :class="showAside ? 'w-256' : 'w-0'" relative transition-width>
      <div :class="showAside ? 'left-0' : 'left--256'" flex="~ col" absolute h-full w-256 p-16 transition-left>
        <NuxtLink to="/" p-8>
          <Logo />
        </NuxtLink>

        <div mt-12 flex="~ col gap-4">
          <div text="12 [#3f3f46]/70" mb-4 shrink-0 px-2 px-4 font-medium outline-none>
            Plataforma
          </div>

          <NuxtLink to="/chat" flex="~ items-center gap-8" un-text="[#3F3F46]" hocus:bg="[#F4F4F5]" rounded-8 p-4>
            <Icon name="ph:chat-duotone" relative />
            Chat
          </NuxtLink>

          <NuxtLink to="/blog" flex="~ items-center gap-8" un-text="[#3F3F46]" hocus:bg="[#F4F4F5]" rounded-8 p-4>
            <Icon name="ph:newspaper-duotone" relative />
            Blog
          </NuxtLink>

          <NuxtLink to="/conversaciones" flex="~ items-center gap-8" un-text="[#3F3F46]" hocus:bg="[#F4F4F5]" rounded-8 p-4>
            <Icon name="ph:chat-dots-duotone" relative />
            Conversaciones
          </NuxtLink>
        </div>

        <div mt-auto w-full>
          <div text="12 yellow-8" roudned-2 mb-16 bg-yellow-1 px-8 py-4 font-bold>
            Esta plataforma no está asociada con Pau Ninja
          </div>
          <Dropdown :options>
            <div flex="~ gap-8" rounded-6>
              <NuxtImg v-if="user?.avatar" :src="user?.avatar" size-32 rounded-8 />
              <div flex="~ col items-start">
                <span truncate font-semibold lh-none>
                  {{ user?.username }}
                </span>
                <span text="12 [#3f3f46]/70" truncate>
                  {{ user?.email }}
                </span>
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
    </aside>
    <div flex-1 of-y-auto>
      <header flex="~ items-center" p-14>
        <button bg="transparent hocus:accent" flex="~ items-center justify-center" mr-16 aspect-1 size-28 h-max rounded-6 p-4 @click="showAside = !showAside">
          <Icon name="ph:sidebar-simple-duotone" shrink-0 text-16 />
        </button>
        <div mx-0 mr-20 h-16 w-1 shrink-0 bg-border />
        <!-- <template v-if="isBlogPost">
          <NuxtLink to="/blog" line-clamp-1 text-foreground font-normal>
            Blog
          </NuxtLink>
          <Icon name="ph:caret-right-bold" relative bottom--2 mx-8 text-10 text-foreground op-70 />
        </template> -->
        <p line-clamp-1 text-foreground font-normal>
          {{ title }}
        </p>
        <div flex-1 />
        <slot name="header-end" />
      </header>
      <main v-bind="$attrs" p-24>
        <slot />
      </main>
    </div>
  </div>
</template>

<style>
body {
  main,
  header > div {
    margin: 0 auto;
  }
}
</style>
