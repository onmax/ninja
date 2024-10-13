<template>
  <button
    bg="primary hocus:primary/90" inline-flex="~ items-center justify-center" rounded-2 px-16 py-8 text-12 text-primary-foreground font-medium transition-colors hocus:outline-none un-disabled="pointer-events-none op-50"
    ring="offset-background hocus:1.5  hocus:ring hocus:offset-2"
  >
    <slot />
  </button>
</template>
