import consolaGlobalInstance from 'consola'

export const useLogger = (tag?: string) =>
  !tag
    ? consolaGlobalInstance
    : consolaGlobalInstance.create({ defaults: { tag } })
