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
import { presetThemeDefault } from '@anu-vue/preset-theme-default'
import { presetAnu } from 'anu-vue'

export default defineConfig({
  // ...unoConfig,

  include: [/.*\/anu-vue\.js(.*)?$/, /^.*\.vue$/, /^.*\.md$/],

  presets: [
    presetIcons(),
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
