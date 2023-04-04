import {
  addComponentsDir,
  addImportsDir,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'

import { logger } from './utils/logger'

export default defineNuxtModule({
  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)

    logger.info('Adding composables')
    try {
      addImportsDir(resolve('composables'))
    }
    catch (e) {
      logger.error('Failed to add composables', e)
    }

    logger.info('Adding components')
    try {
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
