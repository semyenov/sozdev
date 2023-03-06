import type { NuxtI18nOptions } from '@nuxtjs/i18n'

import { AVIALABLE_LOCALES, DEFAULT_LANGUAGE, LOCALES_LIST } from './locales'
import { DATE_FORMATS } from './date-formats'
import { NUMBER_FORMATS } from './number-formats'

const settingsI18n: NuxtI18nOptions = {
  defaultLocale: DEFAULT_LANGUAGE,
  locales: LOCALES_LIST,

  lazy: true,
  strategy: 'no_prefix',
  langDir: 'locales',

  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'X-Locale',
    redirectOn: 'root',
  },

  vueI18n: {
    legacy: false,
    locale: DEFAULT_LANGUAGE,
    fallbackLocale: DEFAULT_LANGUAGE,
    availableLocales: AVIALABLE_LOCALES,
    numberFormats: NUMBER_FORMATS,
    datetimeFormats: DATE_FORMATS,
  },
}

export default settingsI18n
