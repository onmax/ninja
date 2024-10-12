<script setup lang="ts">
useColorMode()
</script>

<template>
  <div flex="~ col">
    <header>
      Ninja
    </header>

    <main v-bind="$attrs">
      <slot />
    </main>
  </div>
</template>

<style>
body {
  --uno: 'bg-slate-900';

  main {
    width: clamp(calc(100vh - 64px), 74ch, 1280px);
    margin: 0 auto;
  }
}
</style>
