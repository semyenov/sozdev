import { transformShortVmodel } from '@vue-macros/short-vmodel'
import { resolve } from 'pathe'

import {
  availableLocales,
  datetimeFormats,
  defaultLocale,
  locales,
  numberFormats,
  onLanguageSwitched,
} from './src/i18n'

const rootDir = resolve(__dirname)
const srcDir = resolve(rootDir, 'src')

const appDir = resolve(srcDir, 'app')
const assetsDir = resolve(srcDir, 'assets')
const publicDir = resolve(srcDir, 'public')
const componentsDir = resolve(srcDir, 'components')

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  srcDir,
  appDir,
  alias: {
    'assets': assetsDir,
    'public': publicDir,

    '~': srcDir,
    '~~': rootDir,
  },

  telemetry: false,

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

    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },

  runtimeConfig: {
    apiUri: 'http://localhost:3000/api',

    public: {
      apiUri: '/api',
    },
  },

  components: {
    dirs: [
      {
        enabled: true,
        global: true,
        isAsync: true,

        pathPrefix: true,
        prefix: 'winbox',

        path: resolve(componentsDir, 'winbox'),
      },
      {
        enabled: true,
        pathPrefix: true,
        path: componentsDir,
      },
    ],
  },

  imports: {
    dirs: ['store', 'composables', 'utils'],
    collectMeta: true,

    addons: {
      vueTemplate: true,
    },
  },

  typescript: {
    shim: false,
    strict: true,
  },

  vue: {
    compilerOptions: {
      nodeTransforms: [
        transformShortVmodel({ prefix: '::' }),
      ],
    },
  },

  build: {
    transpile: [
      ({ isDev }) => !isDev && 'flexsearch',
      ({ isDev }) => isDev && '@deck.gl/layers',
      ({ isDev }) => isDev && '@deck.gl/mapbox',
    ],
  },

  css: [
    '@unocss/reset/antfu.css',
    'uno.css',

    'assets/styles/main.postcss',
    'assets/styles/datepicker.postcss',
    'assets/styles/maplibre.postcss',
  ],

  // Modules configuration

  modules: [
    '~/modules/test/index',
    '~/modules/winbox/index',
    '~/modules/map/index',
    '~/modules/design/index',

    '@nuxt/image-edge',
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

  image: {
    provider: 'unsplash',
    unsplash: {
      // baseURL: 'https://source.unsplash.com',
      // preset: 'default',
      modifiers: {
        width: (value: number) => `w:${value}`,
        height: (value: number) => `h:${value}`,
        format: (value: string) => `fm:${value}`,
        quality: (value: number) => `q:${value}`,
        fit: (value: string) => `fit:${value}`,
        dpr: (value: number) => `dpr:${value}`,
      },
    },
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      'xxl': 1536,
      '2xl': 1536,
    },
    // presets: {
    //   default: {
    //     modifiers: {
    //       width: 500,
    //       height: 500,
    //       format: 'jpg',
    //       quality: 75,
    //       fit: 'cover',
    //       dpr: 2,
    //     },
    //   },
    // },
  },

  pinia: {
    autoImports: [
      'defineStore',
      ['defineStore', 'definePiniaStore'],
      'storeToRefs',
    ],
  },

  i18n: {
    defaultLocale,
    locales,

    lazy: true,
    strategy: 'no_prefix',
    langDir: 'i18n/locales',
    onLanguageSwitched,

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
