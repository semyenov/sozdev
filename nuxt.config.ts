import { resolve } from 'pathe'
import {
  availableLocales,
  datetimeFormats,
  defaultLocale,
  locales,
  numberFormats,
} from './src/i18n'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  alias: {
    assets: resolve(__dirname, 'src', 'assets'),
    public: resolve(__dirname, 'src', 'public'),

    '~': resolve(__dirname, 'src'),
    '~~': resolve(__dirname),
  },

  telemetry: false,

  srcDir: resolve(__dirname, 'src'),
  appDir: resolve(__dirname, 'src', 'app'),
  app: {
    head: {
      charset: 'utf-8',
      title: 'A Better Nuxt 3 Starter',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
      ],
    },

    // pageTransition: {
    //   name: 'page',
    //   mode: 'out-in',
    // },
  },

  runtimeConfig: {
    public: {
      apiUri: '/api',
    },
  },

  components: {
    dirs: [
      {
        // path: `~/components/objects/detail/item`,
        path: resolve(__dirname, 'src', 'components', 'objects', 'detail'),
        // extensions: ['.vue'],
        prefix: 'ObjectsDetail',
        pathPrefix: true,
        global: true,
      },
      `~/components`,
    ],
  },

  imports: {
    dirs: ['store', 'composables', 'utils'],
    addons: { vueTemplate: true },
    collectMeta: true,
  },

  build: {
    transpile: [({ isDev }) => !isDev && 'flexsearch'],
  },

  css: [
    '@unocss/reset/antfu.css',

    'uno.css',

    'assets/styles/main.postcss',
    'assets/styles/winbox.postcss',
    'assets/styles/datepicker.postcss',
  ],

  // Modules configuration

  modules: [
    '~/modules/test/index',
    '~/modules/design/index',

    '@nuxt/content',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/emotion',
    '@vue-macros/nuxt',
    '@vueuse/motion/nuxt',
    'magic-regexp/nuxt',
    'nuxt-typed-router',

    '@nuxt/devtools',
  ],

  i18n: {
    defaultLocale,
    locales,

    lazy: true,
    strategy: 'no_prefix',
    langDir: 'i18n/locales',

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'X-Locale',
      redirectOn: 'root',
    },

    vueI18n: {
      legacy: false,
      locale: defaultLocale,
      fallbackLocale: defaultLocale,
      availableLocales,
      numberFormats,
      datetimeFormats,
    },
  },

  // https://content.nuxtjs.org/api/configuration
  content: {
    api: { baseURL: '/_content' },
  },

  nuxtTypedRouter: {
    experimentalPathCheck: true,
    plugin: true,

    strict: {
      NuxtLink: {
        strictRouteLocation: true,
        strictToArgument: true,
      },
      router: {
        strictRouteLocation: true,
        strictToArgument: true,
      },
    },
  },

  devtools: {
    enabled: true,
  },
})
