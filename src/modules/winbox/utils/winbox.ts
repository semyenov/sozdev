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
    height: '100%',
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
    if (!state.min && !state.max) {
      winbox.resize()
      winbox.move()
    }

    if (state.min) {
      winbox.minimize(state.min)
    }
    if (state.max) {
      winbox.maximize(state.max)
    }

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

    return !!onminimize && onmaximminimize.call(this)
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

    nextTick(resizeEventListener)

    return !!onrestore && onrestore.call(this)
  }

  winboxParams.onclose = function (forceFlag = false): boolean {
    winboxWindows.value.delete(winboxParams.id)
    window.removeEventListener('resize', resizeEventListener)
    document.removeEventListener('fullscreenchange', fullscreenEventListener)

    return !!onclose && onclose.call(this, forceFlag)
  }

  winboxParams.onresize = function (width, height) {
    nextTick(() => {
      if (!winboxWindow.value || !winboxWindow.value.state) {
        return
      }

      const state = winboxWindow.value.state
      if (!state.min && !state.max) {
        state.height = height
        state.width = width
      }
    })

    return !!onresize && onresize.call(this, height, width)
  }

  winboxParams.onmove = function (x, y) {
    nextTick(() => {
      if (!winboxWindow.value || !winboxWindow.value.state) {
        return
      }

      const state = winboxWindow.value.state

      if (!state.min && !state.max) {
        state.x = x
        state.y = y
      }
    })

    return !!onmove && onmove.call(this, x, y)
  }

  winboxParams.onfocus = function () {
    if (!winboxWindow.value || !winboxWindow.value.state) {
      return
    }

    const state = winboxWindow.value.state

    state.min = false
    state.active = true

    return !!onfocus && onfocus.call(this)
  }

  winboxParams.onblur = function () {
    if (!winboxWindow.value || !winboxWindow.value.state) {
      return
    }

    const state = winboxWindow.value.state
    state.active = false

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
      x: winbox.body.parentElement?.offsetLeft || 0,
      y: winbox.body.parentElement?.offsetTop || 0,
      width: winbox.body.parentElement?.clientWidth || 0,
      height: winbox.body.parentElement?.clientHeight || 0,
      max: winboxParams.max || false,
      min: winboxParams.min || false,
      fullscreen: false,
      active: true,
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
    if (
      flag ||
      !winboxWindow.value ||
      !winboxWindow.value.state ||
      !winboxEl ||
      !winboxEl.winbox
    ) {
      return
    }

    const state = winboxWindow.value.state
    if (!state.min && !state.max) {
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

      winboxEl.winbox.move(state.x, state.y)
    }
  })

  watch(winboxCursor, (cursor) => {
    if (
      !winboxWindow.value ||
      !winboxWindow.value.state ||
      !winboxEl ||
      !winboxEl.winbox ||
      cursor !== winboxParams.id
    ) {
      return
    }

    const state = winboxWindow.value.state

    if (state.min) {
      winboxEl.winbox.minimize(false)
    }

    winboxEl.winbox.focus()
  })

  resizeEventListener()

  return winbox
}
