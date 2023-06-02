export default defineEventHandler(async (event) => {
  console.log('auth.event')
  const cookie = parseCookies(event)

  const access_token = getCookie(event, 'X-Access-Token')
  console.log('cookie', access_token)

  if (!access_token)
    return null

  return {
    access_token,
    // refresh_token: cookie['X-Refresh-Token'],
  }
  // const token = await $fetch<IUserTokensData>('http://tsc_devcontainer-app-1:8080/users/current/refresh_token', {
  //   method: 'GET',
  //   body: {
  //     refreshToken: cookie.refreshToken,
  //   },
  // })
  const token = await fetchWithEvent(event, 'http://tsc_devcontainer-app-1:8080/users/current/refresh_token')

  // console.log('token refresh', token.body)

  return token
})
