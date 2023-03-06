import { LOCALES } from './locales'

const DEFAULT_FORMAT = {
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

export const NUMBER_FORMATS = Object.freeze({
  ...Object.keys(LOCALES).reduce(
    (acc, l) => ({ ...acc, [l]: DEFAULT_FORMAT }),
    {}
  ),
})
