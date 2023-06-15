import { presetThemeDefault } from '@anu-vue/preset-theme-default'
import { presetAnu } from 'anu-vue'
import {
  defineConfig,

  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,

  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  // ...unoConfig,
  content: {
    pipeline: {
      include: [/.*\/anu-vue\.js(.*)?$/, /^.*\.vue$/, /^.*\.md$/],
    },
  },

  safelist: [
    'i-carbon:screen',
    'i-carbon:minimize',
    'i-carbon:maximize',
    'i-carbon:information-disabled',
  ],

  presets: [
    presetIcons({
      extraProperties: {
        display: 'inline-flex',
      },
    }),
    presetAttributify(),
    presetTypography(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        lato: 'Lato',
      },
    }),
    presetUno(),
    presetAnu(),
    presetThemeDefault(),
  ],

  transformers: [transformerDirectives(), transformerVariantGroup(), transformerCompileClass()],
})
