import {
  addComponentsDir,
  addImportsDir,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'

// import { logger } from './utils'

export default defineNuxtModule({
  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)

    console.log('Adding composables')
    try {
      addImportsDir(resolve('composables'))
    }

    catch (e) {
      logger.error('Failed to add composables', e)
    }

    console.log('Adding components')
    try {
      await addComponentsDir({
        path: resolve('components'),
        prefix: 'mapLibre',
        global: true,
      })
    }
    catch (e) {
      console.log('Failed to add components', e)
    }
  },
})
