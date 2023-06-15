import type { IUser, IUserTokensData } from '~/types'

export const authorizationStoreKey = 'authorization' as const

export const useAuthorizationStore = defineStore('authorization', () => {
  const access_token = useCookie<string | null>('X-Access-Token')
  const refresh_token = useCookie<string | null>('X-Refresh-Token')

  const current = ref<IUser | null>(null)

  function setCookie(userTokensData?: IUserTokensData) {
    access_token.value = userTokensData?.access_token || null
    refresh_token.value = userTokensData?.refresh_token || null
  }

  return {
    access_token,
    refresh_token,
    current,

    setCookie,
  }
})
