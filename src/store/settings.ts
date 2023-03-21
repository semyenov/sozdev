import { RemovableRef, useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'

import type { WinBoxParams } from '~/store/winbox'

export const settingsStoreKey = 'mouse' as const

export const useSettingsStore = defineStore(settingsStoreKey, () => {
  const winboxParams = ref<WinBoxParams>({
    title: '123231',
    top: 0,
    bottom: 0,
    left: 44,
    right: 0,
    border: 0,
    width: 550,
    height: '100%',
    minwidth: 500,
    class: ['simple', 'wb-right', 'no-move', 'border-r-none'],
    tether: ['right', 'top', 'bottom'],
    needSave: true,
  })

  return {
    winboxParams,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMouseStore, import.meta.hot))
}
