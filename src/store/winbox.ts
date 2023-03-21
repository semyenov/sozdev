import { acceptHMRUpdate, defineStore } from 'pinia'
import type WinBox from 'winbox'

import { useWinbox } from '../composables/useWinbox'

export interface IWindowInfo {
  x: number
  y: number
  width: number
  height: number
  fullscreen: boolean
  minimized: boolean
  maximized: boolean
  active: boolean
  needSave?: boolean
}

export type WinBoxParamsTether = 'right' | 'left' | 'top' | 'bottom'

export type WinBoxParams = WinBox.Params & {
  tether?: WinBoxParamsTether[]
  needSave?: boolean
  maximized?: boolean
  minimized?: boolean
}

export const winboxStoreKey = 'winbox' as const

export const useWinboxStore = defineStore('winbox', () => {
  const mouse = useMouse()

  const windows = ref<Map<string, IWindowInfo>>(new Map())
  const cursor = ref<string>()
  const idContainer = ref<string>(winboxStoreKey)

  const winboxParams = ref<WinBoxParams>({
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

  const { register } = useWinbox(windows, cursor)

  return {
    register,
    windows,
    mouse,

    winboxParams,
    idContainer,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWinboxStore, import.meta.hot))
}
