import type { LocaleObject } from 'vue-i18n-routing'

export const DEFAULT_LANGUAGE = 'ru'

export const LOCALES: {
  [key: string]: LocaleObject
} = {
  en: {
    code: 'en',
    iso: 'en-US',
    name: 'English',
    file: 'en.json',
    available: true,
  },
  ru: {
    code: 'ru',
    iso: 'ru-RU',
    name: 'Русский',
    file: 'ru.json',
    available: true,
  },
}

export const AVIALABLE_LOCALES = [
  ...Object.keys(LOCALES).filter((item) => LOCALES[item].available),
]

export const LOCALES_LIST = [
  ...Object.keys(LOCALES).reduce(
    (prev, cur) => [...prev, LOCALES[cur]],
    [] as LocaleObject[]
  ),
]
export const DEFAULT_LOCALE = LOCALES[DEFAULT_LANGUAGE]
