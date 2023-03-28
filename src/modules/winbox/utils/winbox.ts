import { throttle } from '@antfu/utils'
import { useStorage } from '@vueuse/core'

import type { WinBoxElement, WinBoxParams, WinBoxWindow } from '../types'

export const winboxWindowsStorageKey = 'winbox-windows' as const
export const winboxWindows = useStorage<Map<string, WinBoxWindow>>(
  winboxWindowsStorageKey,
  new Map()
)

export const winboxCursor = ref<string>()

export function winboxRegister(
  root: HTMLElement,
  mount: HTMLElement,
  params: WinBoxParams
) {
  let winbox: WinBox

  const winboxParams = {
    top: 0,
    bottom: 0,
    left: 44,
    right: 0,
    border: 0,
    width: 550,
    header: 45,
    minwidth: 500,
    class: ['simple'],
    tether: ['right', 'top', 'bottom'],

    ...params,
  }

  const winboxWindow = computed(() => winboxWindows.value.get(winboxParams.id))

  const {
    onclose,
    onresize,
    onmove,
    onfocus,
    onblur,
    onminimize,
    onmaximize,
    onrestore,
  } = winboxParams

  delete params.onclose
  delete params.onresize
  delete params.onmove
  delete params.onfocus
  delete params.onblur
  delete params.onminimize
  delete params.onmaximize
  delete params.onrestore

  winboxParams.maxwidth =
    window.innerWidth -
    convertUnits('width', winboxParams.right) -
    convertUnits('width', winboxParams.left)

  winboxParams.maxheight =
    window.innerHeight -
    convertUnits('height', winboxParams.top) -
    convertUnits('height', winboxParams.bottom)

  winboxParams.minwidth = convertUnits('width', winboxParams.minwidth)

  winboxParams.minheight = convertUnits('height', winboxParams.minheight)

  if (winboxParams.tether && winboxParams.tether.length > 0) {
    if (winboxParams.tether.includes('right')) {
      winboxParams.x = window.innerWidth
    }

    if (winboxParams.tether.includes('left')) {
      winboxParams.x = -convertUnits('width', winboxParams.width)
    }

    if (winboxParams.tether.includes('bottom')) {
      winboxParams.y = window.innerHeight
    }

    if (winboxParams.tether.includes('top')) {
      winboxParams.y = 0
    }
  }

  const fullscreenEventListener = (event: Event) => {
    const target = event.target as HTMLElement
    if (
      !winboxWindow.value ||
      !winboxWindow.value.state ||
      !target.isEqualNode(winbox.body)
    ) {
      return
    }

    winboxWindow.value.state.fullscreen = !winboxWindow.value.state.fullscreen
  }

  const resizeEventListener = throttle(50, () => {
    if (!winboxWindow.value || !winboxWindow.value.state) {
      return
    }

    const state = winboxWindow.value.state

    if (state.min) {
      winbox.minimize(state.min)
      return
    }
    if (state.max) {
      winbox.maximize(state.max)
      return
    }

    winbox.move(state.x, state.y)
    winbox.resize(state.width, state.height)

    if (winboxParams.tether && winboxParams.tether.length > 0) {
      if (winboxParams.tether.includes('left')) {
        state.x = convertUnits('width', winboxParams.left)

        if (winboxParams.tether.includes('top')) {
          state.y = convertUnits('height', winboxParams.top)

          if (winboxParams.tether.includes('bottom')) {
            state.height = window.innerHeight
            winbox.resize(state.width, state.height)
          }
        }

        winbox.move(state.x, state.y)

        return
      }

      if (winboxParams.tether.includes('right')) {
        state.x =
          window.innerWidth -
          state.width -
          convertUnits('width', winboxParams.right)

        if (winboxParams.tether.includes('top')) {
          state.y = convertUnits('height', winboxParams.top)

          if (winboxParams.tether.includes('bottom')) {
            state.height = window.innerHeight
            winbox.resize(state.width, state.height)
          }
        }

        winbox.move(state.x, state.y)
      }
    }
  })

  winboxParams.onminimize = function () {
    if (!winboxWindow.value || !winboxWindow.value.state) {
      return
    }

    const state = winboxWindow.value.state
    state.min = true

    return !!onminimize && onminimize.call(this)
  }

  winboxParams.onmaximize = function (flag = true) {
    if (!winboxWindow.value || !winboxWindow.value.state) {
      return
    }

    const state = winboxWindow.value.state
    state.max = flag

    return !!onmaximize && onmaximize.call(this, flag)
  }

  winboxParams.onrestore = function () {
    if (!winboxWindow.value || !winboxWindow.value.state) {
      return
    }

    const state = winboxWindow.value.state
    state.max = false
    state.min = false

    return !!onrestore && onrestore.call(this)
  }

  winboxParams.onclose = function (forceFlag = false): boolean {
    winboxWindows.value.delete(winboxParams.id)
    window.removeEventListener('resize', resizeEventListener)
    document.removeEventListener('fullscreenchange', fullscreenEventListener)

    return !!onclose && onclose.call(this, forceFlag)
  }

  winboxParams.onresize = function (width, height) {
    if (!winboxWindow.value || !winboxWindow.value.state) {
      return
    }

    const state = winboxWindow.value.state

    nextTick(() => {
      if (state.min || state.max) {
        return
      }

      state.height = height
      state.width = width
    })

    return !!onresize && onresize.call(this, width, height)
  }

  winboxParams.onmove = function (x, y) {
    if (!winboxWindow.value || !winboxWindow.value.state) {
      return
    }

    const state = winboxWindow.value.state

    nextTick(() => {
      if (state.min || state.max) {
        return
      }

      state.x = x
      state.y = y
    })

    return !!onmove && onmove.call(this, x, y)
  }

  winboxParams.onfocus = function () {
    if (!winboxWindow.value || !winboxWindow.value.state) {
      return
    }

    const state = winboxWindow.value.state
    state.min = false

    return !!onfocus && onfocus.call(this)
  }

  winboxParams.onblur = function () {
    if (!winboxWindow.value || !winboxWindow.value.state) {
      return
    }

    return !!onblur && onblur.call(this)
  }

  winbox = new window.WinBox({
    ...winboxParams,
    root,
    mount,
  })

  winboxWindows.value.set(winboxParams.id, {
    params,
    state: {
      x: winboxParams.x || 0,
      y: winboxParams.y || 0,
      width: typeof winboxParams.width === 'number' ? winboxParams.width : 0,
      height: typeof winboxParams.height === 'number' ? winboxParams.height : 0,
      max: winboxParams.max || false,
      min: winboxParams.min || false,
      fullscreen: winboxParams.fullscreen || false,
      hidden: winboxParams.hidden || false,
    },
  })

  window.addEventListener('resize', resizeEventListener)
  document.addEventListener('fullscreenchange', fullscreenEventListener)

  const winboxEl = document.getElementById(winboxParams.id) as WinBoxElement
  const winboxHeaderEl = winboxEl.querySelector('.wb-drag')!.parentElement!

  const { isDragging } = useDraggable(winboxHeaderEl, {
    preventDefault: false,
  })

  watch([isDragging], ([flag]) => {
    if (flag || !winboxWindow.value || !winboxWindow.value.state) {
      return
    }

    const state = winboxWindow.value.state
    if (state.min || state.max) {
      return
    }

    if (winboxParams.tether && winboxParams.tether.length > 0) {
      if (winboxParams.tether.includes('right')) {
        state.x = window.innerWidth - state.width
      }

      if (winboxParams.tether.includes('left')) {
        state.x = convertUnits('width', winboxParams.left)
      }

      if (winboxParams.tether.includes('top')) {
        state.y = convertUnits('height', winboxParams.top)
      }
    }

    winbox.move(state.x, state.y)
  })

  watch(winboxCursor, (cursor) => {
    if (
      !winboxWindow.value ||
      !winboxWindow.value.state ||
      cursor !== winboxParams.id
    ) {
      return
    }

    const state = winboxWindow.value.state

    if (state.min) {
      winbox.minimize(false)
    }

    winbox.focus()
  })

  resizeEventListener()

  return winbox
}
