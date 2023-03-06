import { LOCALES } from './locales'

const DEFAULT_FORMAT = {
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

export const DATE_FORMATS = Object.freeze({
  ...Object.keys(LOCALES).reduce(
    (acc, l) => ({ ...acc, [l]: DEFAULT_FORMAT }),
    {}
  ),
})
