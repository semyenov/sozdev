export default eventHandler(async (event) => {
  event.context.testServer = 'test-server'
  // console.log('event.context', event.context)

  const headers = getHeaders(event)
  const cookie = parseCookies(event)
  // console.log('headers', headers)
  // console.log('cookie', cookie)
  // const data = await ofetch('http://tsc_devcontainer-app-1:8080/objects/items')
  // console.log('data', data)

  // const logger = useConsola('server/middleware/test')
  // logger.success('Test server middleware loaded')
})
