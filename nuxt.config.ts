import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'pathe'
import postcssCurrentSelector from 'postcss-current-selector'
import postcssNested from 'postcss-nested'
import postcssNestedAncestors from 'postcss-nested-ancestors'

import {
  defaultLocale,
  locales,
} from './src/i18n'

const rootDir = resolve(__dirname)
const srcDir = resolve(rootDir, 'src')

const appDir = resolve(srcDir, 'app')
// const assetsDir = resolve(srcDir, 'assets')
// const publicDir = resolve(srcDir, 'public')
const componentsDir = resolve(srcDir, 'components')

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  // ssr: false,

  srcDir,
  appDir,
  runtimeConfig: {
    apiUri: 'http://tsc_devcontainer-app-1:8080/',

    public: {
      apiUri: 'http://localhost:8080/',
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      title: 'A Better Nuxt 3 Starter',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=0',
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

  components: {
    dirs: [
      {
        enabled: true,
        global: true,
        prefetch: true,
        preload: true,

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
  },

  typescript: {
    shim: true,
    strict: true,
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        esModuleInterop: true,

        declaration: true,
      },
    },
  },

  build: {
    transpile: [
      'trpc-nuxt',
      ({ isDev }) => isDev && '@deck.gl/layers',
      ({ isDev }) => isDev && '@deck.gl/mapbox',
    ],
  },
  vite: {
    // resolve: {
    //   alias: [{ find: /^@deck.gl\/layers$/, replacement: '@deck.gl/layers/dist/esm' }, { find: /^@deck.gl\/core$/, replacement: '@deck.gl/core/dist/esm' }, { find: /^@deck.gl\/mapbox$/, replacement: '@deck.gl/mapbox/dist/esm' }],
    // },
    optimizeDeps: {
      // exclude: ['@deck.gl/layers', '@deck.gl/mapbox', '@deck.gl/core'],
      // include: ['@deck.gl/layers', '@deck.gl/mapbox', '@deck.gl/core'],
    },
    build: {
      rollupOptions: {

        // '@deck.gl/layers': '@deck.gl/layers/dist/esm',
        // '@deck.gl/mapbox': '@deck.gl/mapbox/dist/esm',
        // '@deck.gl/core': '@deck.gl/core/dist/esm',
      },
    },
  },

  postcss: {
    plugins: {
      'postcss-nested': postcssNested(),
      'postcss-current-selector': postcssCurrentSelector(),
      'postcss-nested-ancestors': postcssNestedAncestors(),
    },
  },

  css: [
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

    '@anu-vue/nuxt',
    '@unocss/nuxt',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@vueuse/motion/nuxt',
    'nuxt-typed-router',
    // 'trpc-nuxt',

    '@nuxt/devtools',
  ],

  anu: {
    themes: {
      light: {
        class: '',
        colors: {
          primary: '0, 0%, 60%',
          success: '94.5, 100%, 39.6%',
          info: '200.1, 100%, 54.3%',
          warning: '42.4, 100%, 50%',
          danger: '358.3, 100%, 64.9%',
        },
        cssVars: {
          'body-bg-c': '0,4.8%,95.9%',
          'surface-c': '0, 0%, 100%',
        },
      },
      dark: {
        class: 'dark',
        colors: {
          primary: '0, 0%, 10%',
          success: '94.5, 73%, 39.6%',
          info: '200.1, 73%, 54.3%',
          warning: '42.4, 73%, 50%',
          danger: '358.3, 73%, 64.9%',
        },
        cssVars: {
          'body-bg-c': 'var(--a-primary-hue), 15%, 5%',
          'surface-c': 'var(--a-primary-hue), 7%, 10%',
        },
      },
    },
  },

  pinia: {
    autoImports: [
      'defineStore',
      'storeToRefs',
    ],
  },

  // auth: {
  //   provider: {
  //     type: 'local',

  //   },
  //   isEnabled: true,
  //   baseURL: 'api/auth',
  //   globalAppMiddleware: true,

  // },

  i18n: {

    defaultLocale,
    locales,
    lazy: false,
    strategy: 'no_prefix',
    langDir: 'i18n/locales',

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'X-Locale',
      redirectOn: 'root',
    },
  },

  // https://content.nuxtjs.org/api/configuration
  // content: {
  //   api: {
  //     baseURL: '/_content',
  //   },
  // },

  nuxtTypedRouter: {
    // pathCheck: true,
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
