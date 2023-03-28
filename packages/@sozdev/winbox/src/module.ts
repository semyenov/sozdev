import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addComponentsDir,
  addImportsDir,
} from '@nuxt/kit'

export * from './types.d'

import { logger } from './runtime/utils/logger'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@sozdev/winbox',
    configKey: 'winbox',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)

    try {
      addPlugin({
        src: resolve('./runtime/plugin'),
        mode: 'client',
      })
    } catch (e) {
      logger.error('Failed to add plugin', e)
    }

    try {
      addImportsDir(resolve('./runtime/composables'))
    } catch (e) {
      logger.error('Failed to add composables', e)
    }

    try {
      await addComponentsDir({
        path: resolve('./runtime/components'),
        prefix: 'winbox',
        global: true,
      })
    } catch (e) {
      logger.error('Failed to add components', e)
    }
  },
})
