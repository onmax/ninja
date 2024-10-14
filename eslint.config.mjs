// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    formatters: true,
    unocss: true,
    vue: true,
    typescript: true,
    ignores: ['content', 'auth.d.ts'],
  }),
)
