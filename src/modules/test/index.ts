import { createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'

const logger = useLogger('modules/test')

export default defineNuxtModule({
  setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    logger.success('Test module loaded')

    nuxt.hooks.hookOnce('nitro:build:before', (config) => {
      logger.info('Nitro preset', config.options.preset)
    })

    nuxt.hooks.hook('pages:extend', (pages) => {
      logger.info('Add test page', resolve(__dirname, 'pages/test.vue'))

      pages.push({
        name: 'test',
        path: '/test',
        file: resolve('pages', 'test.vue'),
      })
    })
  },
})
