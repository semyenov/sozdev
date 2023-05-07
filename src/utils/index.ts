import { hasOwnProperty } from '@antfu/utils'

import type { PublicRuntimeConfig, RuntimeConfig } from 'nuxt/schema'

export * from './virtual'

export const logger = useLogger()

export function getRuntimeConfigKey<T extends Extract<keyof RuntimeConfig, keyof PublicRuntimeConfig>>(key: T) {
  const runtimeConfig = useRuntimeConfig()

  if (!hasOwnProperty(runtimeConfig, key)) {
    if (!hasOwnProperty(runtimeConfig.public, key)) {
      logger.error(`Missing config key "${key}"`)
      return
    }

    return runtimeConfig.public[key]
  }

  return runtimeConfig[key]
}

export function validateUuid(str: string) {
  const chars = '0123456789abcdef'
  const regex = createRegExp(
    charIn(chars)
      .times(8)
      .at.lineStart()
      .and(exactly('-'))
      .and(
        charIn(chars)
          .times(4)
          .and(exactly('-'))
          .and(
            charIn(chars)
              .times(4)
              .and(exactly('-'))
              .and(
                charIn(chars)
                  .times(4)
                  .and(exactly('-'))
                  .and(charIn(chars).times(12).at.lineEnd()),
              ),
          ),
      ),
  )

  return regex.test(str)
}

export function castArray<T>(arr: T | T[]) {
  return Array.isArray(arr) ? arr : [arr]
}

export function stringToColor(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash)

  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF
    colour += (`00${value.toString(16)}`).slice(-2)
  }
  return colour
}
