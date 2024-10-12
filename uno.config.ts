import { presetRemToPx } from '@unocss/preset-rem-to-px'
import transformerDirectives from '@unocss/transformer-directives'
import { defineConfig, presetAttributify, presetIcons, presetTypography, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetRemToPx({ baseFontSize: 4 }),
    presetAttributify(),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
