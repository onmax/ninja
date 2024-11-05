import { env } from 'node:process'
import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-02',
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
    'radix-vue/nuxt',
    'nuxt-auth-utils',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/test-utils/module',
    '@vueuse/motion/nuxt',
  ],

  css: [
    '@unocss/reset/tailwind-compat.css',
  ],

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {
    ai: true,
    database: true,
    // vectorize: {
    //   posts: {
    //     dimensions: 768, // @cf/baai/bge-base-en-v1.5
    //     metric: 'cosine',
    // metadataIndexes: {
    //   filename: 'string',
    //   headers: 'string',
    // },
    //   },
    // },
  },

  routeRules: {
    '/blog/**': { prerender: true },
  },

  nitro: {
    experimental: {
      tasks: true,
    },
  },

  watch: ['server/**/*'],

  colorMode: {
    classSuffix: '',
  },

  features: {
    // For UnoCSS
    inlineStyles: false,
  },

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    openaiApiKey: env.NUXT_OPENAI_API_KEY,
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
