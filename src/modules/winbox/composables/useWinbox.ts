import { isClient } from '@vueuse/core'

import type { WinBoxComponent, WinBoxParams } from '../types'
import { winboxCursor, winboxWindows } from '../utils/winbox'

export function useWinbox(id: string) {
  const window = computed(() => {
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
    window,
    open: (params: WinBoxParams, component: WinBoxComponent) =>
      winboxWindows.value.set(id, {
        component,
        params,
      }),
  }
}

const keys = useMagicKeys()
const shiftLeftArrowKey = keys['Shift+<']
const shiftRightArrowKey = keys['Shift+>']

watch(shiftLeftArrowKey, (flag) => {
  if (flag) {
    const ids = [...winboxWindows.value.keys()]
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
    const ids = [...winboxWindows.value.keys()]
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
