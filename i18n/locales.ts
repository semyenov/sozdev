interface ILocalesOption {
  name: string
  code: string
  iso: string
  file: string
  available?: true
}
interface ILocales {
  [key: string]: ILocalesOption
}

export const DEFAULT_LANGUAGE = 'ru'

export const LOCALES: ILocales = {
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
    name: 'Russia',
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
    [] as ILocalesOption[]
  ),
]
export const DEFAULT_LOCALE = LOCALES[DEFAULT_LANGUAGE]
