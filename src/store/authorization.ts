import type { IUser, IUserTokensData } from '~/types'

export const authorizationStoreKey = 'authorization' as const

export const useAuthorizationStore = defineStore('authorization', () => {
  const authorization = useCookie<string | null>('X-Access-Token')
  const current = ref<IUser | null>(null)
  // const access_token = useCookie<string | null>('X-Access-Token')
  const refresh_authorization = useCookie<string | null>('X-Refresh-Token')
  function setCookie(tokens?: IUserTokensData) {
    authorization.value = tokens?.access_token || null
    refresh_authorization.value = tokens?.refresh_token || null
  }

  return {
    authorization,
    current,
    refresh_authorization,
    setCookie,
  }
})
