import type { NuxtI18nOptions } from '@nuxtjs/i18n'
import { DATE_FORMATS } from './date-formats'
import { AVIALABLE_LOCALES, DEFAULT_LANGUAGE, LOCALES_LIST } from './locales'
import { NUMBER_FORMATS } from './number-formats'

const settingsI18n: NuxtI18nOptions = {
  defaultLocale: DEFAULT_LANGUAGE,
  locales: LOCALES_LIST,
  lazy: true,
  langDir: '../i18n/translations',
  strategy: 'no_prefix',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
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
