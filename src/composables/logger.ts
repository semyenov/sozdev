import consolaGlobalInstance from 'consola'

export function useLogger(tag?: string) {
  return !tag
    ? consolaGlobalInstance
    : consolaGlobalInstance.create({ defaults: { tag } })
}
