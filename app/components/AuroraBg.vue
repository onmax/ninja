<template>
  <div flex="~ col md:justify-center md:items-center" relative h-screen bg-zinc-50 text-slate-950 dark:bg-zinc-900>
    <div absolute inset-0 of-hidden>
      <div pointer-events-none absolute inset--10 op-60 blur-12 will-change-transform class="aurora-gradient-animation" />
    </div>
    <slot />
  </div>
</template>

<style scoped>
.aurora-gradient-animation {
  --aurora: repeating-linear-gradient(
    100deg,
    theme('colors.blue.500') 10%,
    theme('colors.indigo.500') 15%,
    theme('colors.blue.300') 20%,
    theme('colors.violet.300') 25%,
    theme('colors.blue.400') 30%
  );
  background-image: var(--aurora);
  background-position:
    50% 50%,
    50% 50%;
  background-size: 300%, 200%;
  mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);
  animation: animate-aurora 60s linear infinite;

  .dark & {
    --aurora: repeating-linear-gradient(100deg, #000 0%, #000 7%, transparent 10%, transparent 12%, #000 16%);
  }
}

@keyframes animate-aurora {
  0% {
    background-position:
      50% 50%,
      50% 50%;
  }
  100% {
    background-position:
      350% 50%,
      350% 50%;
  }
}
</style>
