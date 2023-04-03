import {
  addComponentsDir,
  addImportsDir,
  addPlugin,
  createResolver,
  defineNuxtModule,
  useLogger,
} from '@nuxt/kit'

const logger = useLogger('winbox')

export default defineNuxtModule({
  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)

    logger.info('Adding plugin')
    try {
      addPlugin({
        src: resolve('plugins/winbox.ts'),
        mode: 'client',
      })
    } catch (e) {
      logger.error('Failed to add plugin', e)
    }

    logger.info('Adding composables')
    try {
      addImportsDir(resolve('composables'))
    } catch (e) {
      logger.error('Failed to add composables', e)
    }

    logger.info('Adding components')
    try {
      await addComponentsDir({
        path: resolve('components'),
        prefix: 'winbox',
        global: true,
      })
    } catch (e) {
      logger.error('Failed to add components', e)
    }
  },
})
