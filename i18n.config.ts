import { availableLocales, datetimeFormats, defaultLocale, numberFormats } from './src/i18n'

import type { I18nOptions } from '@nuxtjs/i18n/dist/runtime/composables'

export default {
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  availableLocales,
  numberFormats,
  datetimeFormats,
  pluralizationRules: {
    ru: (choice: number, choicesLength: number) => {
      if (choice === 0)
        return 0

      const teen = choice > 10 && choice < 20
      const endsWithOne = choice % 10 === 1
      if (!teen && endsWithOne)
        return 1

      if (!teen && choice % 10 >= 2 && choice % 10 <= 4)
        return 2

      return choicesLength < 4 ? 2 : 3
    },
  },
} as I18nOptions
