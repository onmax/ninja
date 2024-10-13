import { presetRemToPx } from '@unocss/preset-rem-to-px'
import transformerDirectives from '@unocss/transformer-directives'
import { defineConfig, presetAttributify, presetIcons, presetTypography, presetUno } from 'unocss'
import presetAnimations from 'unocss-preset-animations'
import { presetShadcn } from 'unocss-preset-shadcn'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetRemToPx({ baseFontSize: 4 }),
    presetAttributify(),
    presetTypography(),
    presetAnimations(),
    presetShadcn({
      color: 'slate',
      darkSelector: '.dark',
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],

  variants: [
    (matcher) => {
      if (!matcher.startsWith('hocus:'))
        return matcher
      return {
        matcher: matcher.replace(/^hocus:/, ''),
        selector: s => `${s}:hover, ${s}:focus-visible`,
      }
    },
  ],
  theme: {
    fontFamily: {
      sans: ['Geist-Regular'],
      mono: ['var(--font-geist-mono)'],
    },
  },
})
