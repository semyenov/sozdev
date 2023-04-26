// import { availableLocales, datetimeFormats, defaultLocale, locales, numberFormats, onLanguageSwitched } from '~/i18n'

// import { defineI18nConfig } from '@nuxtjs/i18n/dist/runtime/composables'

import { availableLocales, datetimeFormats, defaultLocale, numberFormats } from '~/i18n'

export default defineI18nConfig(_nuxt => ({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  availableLocales,
  numberFormats,
  datetimeFormats,
}),
)

// export default defineI18nConfig(_nuxt => ({
//   legacy: false,

//   defaultLocale,
//   locales,

//   lazy: true,
//   strategy: 'no_prefix',
//   langDir: 'i18n/locales',
//   onLanguageSwitched,

//   detectBrowserLanguage: {
//     useCookie: true,
//     cookieKey: 'X-Locale',
//     redirectOn: 'root',
//   },

//   vueI18n: {
//     legacy: false,
//     locale: defaultLocale,
//     fallbackLocale: defaultLocale,
//     availableLocales,
//     numberFormats,
//     datetimeFormats,
//   },
// }))
