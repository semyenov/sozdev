import {
  addComponentsDir,
  addImportsDir,
  createResolver,
  defineNuxtModule,
  useLogger,
} from '@nuxt/kit'

const logger = useLogger('modules/map')

export default defineNuxtModule({
  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)

    try {
      logger.info('Adding composables')
      addImportsDir(resolve('composables'))
    }
    catch (e) {
      logger.error('Failed to add composables', e)
    }

    try {
      logger.info('Adding components')
      await addComponentsDir({
        path: resolve('components'),
        prefix: 'mapLibre',
        global: true,
      })
    }
    catch (e) {
      logger.error('Failed to add components', e)
    }
  },
})
