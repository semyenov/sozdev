// Adds the components and composables directories to the Nuxt project.
// The components will be globally available, and the composables will be
// globally available as well.

import {
  addComponentsDir,
  addImportsDir,
  createResolver,
  defineNuxtModule,
  useLogger,
} from '@nuxt/kit'

const logger = useLogger('modules/winbox')

export default defineNuxtModule({
  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)

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
