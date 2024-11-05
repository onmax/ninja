<template>
  <AuroraBg>
    <div
      v-motion
      :initial="{ opacity: 0, y: 40 }"
      :visible="{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        },
      }"
      relative p-32
    >
      <Logo mb-8 w-max md:mx-auto md:mb-32 />
      <div flex="~ col items-center justify-center gap-16" max-w-660>
        <div text="md:center 32 md:48 foreground" font-bold>
          Interactúa y descrube todo el conocimiento de Pau Ninja
        </div>
        <div py-16 text="20 foreground/80 md:center" font-extralight>
          Chatea con el blog de Pau Ninja como si fuera ChatGPT
        </div>
      </div>
      <Button href="/auth/discord" variant="default" mt-64 w-max text-foreground transition-colors md:mx-auto>
        <Icon name="ph:discord-logo-duotone" mr-8 text-18 op-85 />
        Iniciar sesión con Discord
      </Button>
      <p text="md:center foreground/70 12 pretty" mt-8 max-w-280 md:mx-auto>
        Necesitas ser miembro de la comunidad de <NuxtLink
          external href="https://sociedad.ninja" underline target="_blank"
        >
          Sociedad Ninja
        </NuxtLink> para acceder a esta plataforma
      </p>
    </div>
  </AuroraBg>
</template>
