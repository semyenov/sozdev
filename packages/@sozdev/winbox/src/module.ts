import {
  addComponentsDir,
  addImportsDir,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
  useLogger,
} from '@nuxt/kit'

const logger = useLogger('@sozdev/winbox')

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'winbox',
    configKey: 'winbox',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(_, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    addTemplate({
      filename: 'winbox.d.ts',
      src: resolve('./winbox.d.ts'),
    })

    nuxt.hooks.hook('prepare:types', ({ references }) => {
      references.push({
        path: resolve(nuxt.options.buildDir, 'winbox.d.ts'),
      })
    })

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
        global: true,
        path: resolve('./runtime/components'),
      })
    } catch (e) {
      logger.error('Failed to add components', e)
    }
  },
})
