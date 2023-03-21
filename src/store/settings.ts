import { acceptHMRUpdate, defineStore } from 'pinia'

import type { TWinboxParamsKeys, WinBoxParams } from '../types/winbox'

export const settingsStoreKey = 'settings' as const

type TPickWinboxParams = Pick<WinBoxParams, TWinboxParamsKeys>

interface IWinboxParams {
  page: TPickWinboxParams
  detail: TPickWinboxParams
}

const winboxParams: IWinboxParams = {
  detail: {
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
  },
  page: {},
}

export const useSettingsStore = defineStore(settingsStoreKey, () => {
  function getWinboxParams(type: string) {}

  return {
    winboxParams,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMouseStore, import.meta.hot))
}
