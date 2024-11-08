import { env } from 'node:process'
import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-05',
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
    kv: true,
    ai: true,
    database: true,
    vectorize: {
      chunks: {
        dimensions: 1024, // @cf/baai/bge-large-en-v1.5
        metric: 'euclidean',
        metadataIndexes: {
          slug: 'string',
        },
      },
    },
  },

  routeRules: {
    '/blog/**': { prerender: true },
  },

  nitro: {
    experimental: {
      tasks: true,
    },
    prerender: {
      crawlLinks: true,
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
    discordGuildId: env.NUXT_DISCORD_GUILD_ID,
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
