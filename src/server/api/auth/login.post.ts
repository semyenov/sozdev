import { ofetch } from 'ofetch'

import type { IUserTokensData } from '~/types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { data } = await ofetch<{ data: IUserTokensData }>('http://tsc_devcontainer-app-1:8080/users/current', {
    method: 'POST',
    body,
  })
  // console.log('login response', data)

  if (!data || !data.refresh_token || !data.access_token)
    return null
  setCookie(event, 'X-Refresh-Token', data.refresh_token, {
    httpOnly: true,
  })
  setCookie(event, 'X-Access-Token', data.access_token, {
    httpOnly: true,
  })
  event.context.access_token = data.access_token

  return data
})
