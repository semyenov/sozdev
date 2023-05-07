// @ts-expect-error missing type
import postcssCurrentSelector from 'postcss-current-selector' // @ts-expect-error missing type
import postcssNestedAncestors from 'postcss-nested-ancestors'
import postcssNested from 'postcss-nested'
import { transformShortVmodel } from '@vue-macros/short-vmodel'
import { resolve } from 'pathe'

import {
  defaultLocale,
  locales,
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

  runtimeConfig: {
    apiUri: 'http://localhost:3000/api',

    public: {
      apiUri: '/api',
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

    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
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
    collectMeta: true,

    addons: {
      vueTemplate: true,
    },
  },

  typescript: {
    shim: false,
    strict: true,
    typeCheck: true,
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
    // '~/modules/test/index',
    '~/modules/winbox/index',
    '~/modules/map/index',
    '~/modules/design/index',

    '@anu-vue/nuxt',
    '@unocss/nuxt',
    '@nuxt/image-edge',
    '@nuxt/content',
    'magic-regexp/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/emotion',
    '@vue-macros/nuxt',
    '@vueuse/motion/nuxt',
    'nuxt-typed-router',
    // 'nuxt-component-meta',

    '@nuxt/devtools',
  ],

  // componentMeta: {
  //   globalsOnly: true,
  // },

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
