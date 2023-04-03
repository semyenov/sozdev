import { isClient, useMagicKeys } from '@vueuse/core'

import type { WinBoxParams } from '#build/winbox'
import { winboxCursor, winboxWindows } from '../utils/winbox'

export function useWinbox(id: string) {
  const winboxWindow = computed(() => {
    if (!winboxWindows.value.has(id)) {
      return
    }

    const winboxEl =
      isClient &&
      (document.getElementById(id) as HTMLElement & { winbox?: WinBox })

    return {
      ...winboxWindows.value.get(id),
      winbox: winboxEl ? winboxEl.winbox : undefined,
    }
  })

  return {
    winboxWindow,
    createWindow: (params: WinBoxParams) =>
      winboxWindows.value.set(id, {
        params,
      }),
  }
}

const keys = useMagicKeys()
const shiftLeftArrowKey = keys['Shift+<']
const shiftRightArrowKey = keys['Shift+>']

watch(shiftLeftArrowKey, (flag) => {
  if (flag) {
    const ids = Array.from(winboxWindows.value.keys())
    const currentIndex = ids.findIndex((key) => key === winboxCursor.value) - 1

    if (currentIndex > -2) {
      winboxCursor.value = ids[currentIndex]

      return
    }

    if (ids.length > 0) {
      winboxCursor.value = ids[ids.length - 1]
    }
  }
})

watch(shiftRightArrowKey, (flag) => {
  if (flag) {
    const ids = Array.from(winboxWindows.value.keys())
    const currentIndex = ids.findIndex((key) => key === winboxCursor.value) + 1

    if (currentIndex > 0 && currentIndex < ids.length) {
      winboxCursor.value = ids[currentIndex]

      return
    }

    if (ids.length > 0) {
      winboxCursor.value = ids[0]
    }
  }
})