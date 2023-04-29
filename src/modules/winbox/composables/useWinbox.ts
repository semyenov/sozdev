import { isClient } from '@vueuse/core'

import {
  winboxWindowsParamsStorage,
  winboxWindowsStateStorage,
} from '../utils/winbox'

import type { WinBoxParams } from '../types'

export function useWinbox(id: string) {
  return {
    winboxWindow: computed(() => {
      if (!isClient || !winboxWindowsStateStorage.value.has(id))
        return

      const winboxEl = document.getElementById(id) as HTMLElement & {
        winbox?: WinBox
      }

      return {
        state: winboxWindowsStateStorage.value.get(id),
        winbox: winboxEl?.winbox,
        openFlag: winboxEl?.winbox !== undefined,
      }
    }),
    createWindow: (params: WinBoxParams) => {
      winboxWindowsParamsStorage.value.set(id, params)
    },
  }
}
