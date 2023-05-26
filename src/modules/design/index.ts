import { addComponentsDir, createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule<{}>({
  meta: {
    name: 'design',
    configKey: 'design',
  },

  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // addPluginTemplate({
    //   filename: 'unocss.mjs',
    //   getContents: () => {
    //     const lines = [
    //       'import \'@unocss/reset/tailwind.css\'',
    //       'import \'uno.css\'',
    //       'export default defineNuxtPlugin(() => {})',
    //     ]
    //     return lines.join('\n')
    //   },
    // })

    nuxt.options.css.push(resolve('assets/styles/simplebar.postcss'))

    // await addComponent({
    //   name: 'SimpleBar',
    //   filePath: 'simplebar-vue/dist/simplebar-vue.esm.js',
    //   global: true,
    // })

    await addComponentsDir({
      path: resolve('components'),
      prefix: 'ui',
      watch: true,
      global: true,
    })

    // await addComponentsDir({
    //   path: resolve('../../components/objects/detail'),
    //   watch: true,
    //   global: true,
    // })

    // console.log(nuxt)

    // const { config: unoConfig } = await loadConfig<UserConfig>(
    //   process.cwd(),
    //   { configFile: resolve('uno.config.ts') },
    //   [{ files: ['uno.config'] }],
    //   options,
    // )

    // if (
    //   nuxt.options.postcss.plugins.cssnano
    //   && unoConfig.transformers?.some(
    //     t =>
    //       t.name === '@unocss/transformer-directives' && t.enforce !== 'pre',
    //   )
    // ) {
    //   const preset = nuxt.options.postcss.plugins.cssnano.preset
    //   nuxt.options.postcss.plugins.cssnano = {
    //     preset: [
    //       preset?.[0] || 'default',
    //       Object.assign(preset?.[1] || {}, {
    //         mergeRules: false,
    //         normalizeWhitespace: false,
    //         discardComments: false,
    //       }),
    //     ],
    //   }
    // }

    // nuxt.options.postcss.plugins['postcss-current-selector']
    //   = postcssCurrentSelector()
    // nuxt.options.postcss.plugins['postcss-nested'] = postcssNested()
    // nuxt.options.postcss.plugins['postcss-nested-ancestors']
    //   = postcssNestedAncestors()

    // nuxt.hook('vite:extend', ({ config }) => {
    //   config.plugins = config.plugins || []
    //   config.plugins.unshift(...VitePlugin({}, unoConfig))
    // })

    // if (nuxt.options.dev) {
    //   nuxt.hook('devtools:customTabs', (tabs) => {
    //     tabs.push({
    //       title: 'UnoCSS',
    //       name: 'unocss',
    //       icon: '/__unocss/favicon.svg',
    //       view: {
    //         type: 'iframe',
    //         src: '/__unocss/',
    //       },
    //     })
    //   })
    // }
  },
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    design?: {}
  }
  interface NuxtOptions {
    design?: {}
  }
}
