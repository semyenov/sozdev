import { acceptHMRUpdate, defineStore } from 'pinia'

export const mouseStoreKey = 'mouse' as const
export const useMouseStore = defineStore('mouse', useMouse)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMouseStore, import.meta.hot))
}
