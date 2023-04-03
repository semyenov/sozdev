import { isClient } from '@vueuse/core'
import type { WinBoxParams } from '../types'

import {
  winboxWindowsParamsStorage,
  winboxWindowsStateStorage,
} from '../utils/winbox'

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
        winbox: winboxEl ? winboxEl.winbox : undefined,
      }
    }),
    createWindow: (params: WinBoxParams) => {
      winboxWindowsParamsStorage.value.set(id, params)
    },
  }
}
