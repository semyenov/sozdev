import { acceptHMRUpdate, defineStore } from 'pinia'
import type { IUser } from '~/types'

export const authorizationStoreKey = 'authorization' as const
export const useAuthorizationStore = defineStore('authorization', () => {
  const authorization = ref<string | null>(null)
  const current = ref<IUser | null>(null)

  return {
    authorization,
    current,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useAuthorizationStore, import.meta.hot)
  )
}
