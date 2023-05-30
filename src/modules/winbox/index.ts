import {
  addComponentsDir,
  addImportsDir,
  addPlugin,
  createResolver,
  defineNuxtModule,
  // useLogger,
} from '@nuxt/kit'

// const logger = useLogger('modules/winbox')

export default defineNuxtModule({
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.css.push(resolve('assets/styles/winbox.postcss'))

    // logger.info('Adding plugin')
    try {
      addPlugin({
        src: resolve('plugins/winbox.ts'),
        mode: 'client',
      })
    }
    catch (e) {
      // logger.error('Failed to add plugin', e)
    }

    // logger.info('Adding composables')
    try {
      addImportsDir(resolve('composables'))
    }
    catch (e) {
      // logger.error('Failed to add composables', e)
    }

    // logger.info('Adding components')
    try {
      await addComponentsDir({
        path: resolve('components'),
        prefix: 'winbox',
        global: true,
      })
    }
    catch (e) {
      // logger.error('Failed to add components', e)
    }
  },
})
