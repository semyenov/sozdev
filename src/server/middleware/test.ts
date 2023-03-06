import { useLogger } from '@nuxt/kit'

export default eventHandler((_event) => {
  const logger = useLogger('server/middleware/test')
  logger.success('Test server middleware loaded')
})
