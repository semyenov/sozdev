export * from './virtual'

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
                  .and(charIn(chars).times(12).at.lineEnd())
              )
          )
      )
  )

  return regex.test(str)
}

export function castArray<T>(arr: T | T[]) {
  return Array.isArray(arr) ? arr : [arr]
}
