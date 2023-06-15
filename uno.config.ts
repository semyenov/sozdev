import { presetThemeDefault } from '@anu-vue/preset-theme-default'
import { presetAnu } from 'anu-vue'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
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
    'i-ph:minus',
    'i-ph:plus',
    'i-ph:browser',
    'i-ph:x',
  ],

  presets: [
    presetIcons({
      extraProperties: {
        display: 'inline-flex',
      },
    }),
    presetAttributify(),
    presetTypography(),
    // presetWebFonts({
    //   provider: 'google',
    //   fonts: {
    //     lato: 'Lato',
    //   },
    // }),
    presetUno(),
    presetAnu(),
    presetThemeDefault(),
  ],

  transformers: [transformerDirectives(), transformerVariantGroup(), transformerCompileClass()],
})
