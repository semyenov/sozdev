import type { LocaleObject } from 'vue-i18n-routing'

const localesList: {
  [key: string]: LocaleObject
} = {
  en: {
    code: 'en',
    iso: 'en-US',
    name: 'English',
    file: 'en.yaml',
    available: true,
  },
  ru: {
    code: 'ru',
    iso: 'ru-RU',
    name: 'Русский',
    file: 'ru.yaml',
    available: true,
  },
  ua: {
    code: 'uk',
    iso: 'uk-UA',
    name: 'Українська',
    file: 'uk.yaml',
    available: true,
  },
}

const dateFormat = {
  full: {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  },
  short: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  short_long: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },

  medium: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  },
  long: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
  },
  month: {
    month: 'numeric',
  },
  hour: { hour: 'numeric' },
  minute: { minute: 'numeric' },

  timeShort: {
    hour: 'numeric',
    minute: 'numeric',
  },
  timeLong: {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  },
}

const numberFormat = {
  USD: {
    style: 'currency',
    currency: 'USD',
  },
  EUR: {
    style: 'currency',
    currency: 'EUR',
  },
  JPY: {
    style: 'currency',
    currency: 'JPY',
  },
  CAD: {
    style: 'currency',
    currency: 'CAD',
  },
  AUD: {
    style: 'currency',
    currency: 'AUD',
  },
  SGD: {
    style: 'currency',
    currency: 'SGD',
  },
  GBP: {
    style: 'currency',
    currency: 'GBP',
  },
  RUB: {
    style: 'currency',
    currency: 'RUB',
  },
  decimal: {
    style: 'decimal',
  },
}

export const defaultLocale = 'ru'

export const availableLocales = [
  ...Object.keys(localesList).filter((item) => localesList[item].available),
]

export const locales = [
  ...Object.keys(localesList).reduce(
    (prev, cur) => [...prev, localesList[cur]],
    [] as LocaleObject[]
  ),
]

export const datetimeFormats = Object.freeze({
  ...Object.keys(locales).reduce((acc, l) => ({ ...acc, [l]: dateFormat }), {}),
})

export const numberFormats = Object.freeze({
  ...Object.keys(locales).reduce(
    (acc, l) => ({ ...acc, [l]: numberFormat }),
    {}
  ),
})
