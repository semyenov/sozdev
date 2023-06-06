import { ApiClient } from '~/api/client'
import type { IUser, IUserTokensData } from '~/types'

export const authorizationStoreKey = 'authorization' as const

export const useAuthorizationStore = defineStore('authorization', () => {
  const authorization = ref<string | null>(null)
  const current = ref<IUser | null>(null)
  const access_token = useCookie('X-Access-Token')
  const refresh_token = useCookie('X-Refresh-Token')
  const client = new ApiClient({ baseURL: getRuntimeConfigKey('apiUri') })
  function setCookie(tokens?: IUserTokensData) {
    access_token.value = tokens?.access_token || null
    refresh_token.value = tokens?.refresh_token || null
  }

  // async function login(body: IUserLoginInput) {

  // }

  return {
    authorization,
    current,
    access_token,
    refresh_token,
    setCookie,
  }
})
