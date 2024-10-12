import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-30',
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },

  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@nuxt/content',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/image',
    'nuxt-auth-utils',
  ],

  css: [
    '@unocss/reset/tailwind-compat.css',
  ],

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {},

  nitro: {
    experimental: {
      tasks: true,
    },
  },

  colorMode: {
    classSuffix: '',
  },

  features: {
    // For UnoCSS
    inlineStyles: false,
  },

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    public: {
      // Can be overridden by NUXT_PUBLIC_HELLO_TEXT environment variable
      helloText: 'Hello from the Edge 👋',
    },
  },

  // https://eslint.nuxt.com
  eslint: {
    config: {
      standalone: false,
    },
  },

  // https://devtools.nuxt.com
  devtools: { enabled: true },
})
