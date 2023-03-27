import { throttle } from '@antfu/utils'
import { useStorage } from '@vueuse/core'

import type {
  WinBoxComponent,
  WinBoxElement,
  WinBoxParams,
  WinBoxWindow,
} from '../types'

export const winboxWindowsStorageKey = 'winbox-windows' as const
export const winboxWindows = useStorage<Map<string, WinBoxWindow>>(
  winboxWindowsStorageKey,
  new Map()
)

export const winboxCursor = ref<string>()

export function winboxRegister(
  root: HTMLElement,
  mount: HTMLElement,
  params: WinBoxParams,
  component?: WinBoxComponent
) {
  let winbox: WinBox
  let winboxEl: WinBoxElement

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
    class: ['simple', 'wb-right', 'no-move', 'border-r-none'],
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

  if (winboxParams.tether) {
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
    if (
      !winboxWindow.value ||
      !winboxWindow.value.state ||
      winboxWindow.value.state.minimized ||
      winboxWindow.value.state.fullscreen
    ) {
      return
    }

    const state = winboxWindow.value.state

    const maxWidth =
      window.innerWidth -
      convertUnits('width', winboxParams.right) -
      convertUnits('width', winboxParams.left)

    const maxHeight =
      window.innerHeight -
      convertUnits('height', winboxParams.top) -
      convertUnits('height', winboxParams.bottom)

    const minWidth = convertUnits('width', winboxParams.minwidth)
    const minHeight = convertUnits('height', winboxParams.minheight)

    if (state.maximized) {
      nextTick(() => {
        if (!winboxEl || !winboxEl.winbox) {
          return
        }

        winboxEl.winbox.resize(
          Math.max(maxWidth, minWidth),
          Math.max(maxHeight, minHeight),
          true
        )
        winboxEl.winbox.maximize(true)
      })

      return
    }

    if (winboxParams.tether) {
      if (winboxParams.tether.includes('left')) {
        state.x = convertUnits('width', winboxParams.left)

        if (winboxParams.tether.includes('top')) {
          state.y = convertUnits('height', winboxParams.top)

          if (winboxParams.tether.includes('bottom')) {
            state.height = window.innerHeight
            winbox.resize(undefined, state.height)
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
          state.y = typeof winboxParams.top === 'number' ? winboxParams.top : 0

          if (winboxParams.tether.includes('bottom')) {
            state.height = window.innerHeight
            winbox.resize(undefined, state.height)
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
    state.minimized = true

    return !!onminimize && onminimize.call(this)
  }

  winboxParams.onmaximize = function (flag = true) {
    if (!winboxWindow.value || !winboxWindow.value.state) {
      return
    }

    const state = winboxWindow.value.state
    state.maximized = flag

    return !!onmaximize && onmaximize.call(this, flag)
  }

  winboxParams.onrestore = function () {
    if (!winboxWindow.value || !winboxWindow.value.state) {
      return
    }

    const state = winboxWindow.value.state
    state.maximized = false
    state.minimized = false

    resizeEventListener()

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

    const minWidth = convertUnits('width', winboxParams.minwidth)
    const minHeight = convertUnits('height', winboxParams.minheight)

    nextTick(() => {
      if (!state || state.minimized) {
        return
      }

      state.height = Math.max(height, minHeight)
      state.width = Math.max(width, minWidth)
    })

    return !!onresize && onresize.call(this, width, height)
  }

  winboxParams.onmove = function (x, y) {
    if (!winboxWindow.value || !winboxWindow.value.state) {
      return
    }

    const state = winboxWindow.value.state

    nextTick(() => {
      if (!state || state.minimized) {
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

    state.minimized = false
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
    component,
    state: {
      x: winbox.body.parentElement?.offsetLeft || 0,
      y: winbox.body.parentElement?.offsetTop || 0,
      width: winbox.body.parentElement?.clientWidth || 0,
      height: winbox.body.parentElement?.clientHeight || 0,
      maximized: winboxParams.maximized || winbox.max,
      minimized: winboxParams.minimized || false,
      fullscreen: false,
      active: true,
    },
  })

  if (winboxParams.maximized && !winboxParams.minimized) {
    winbox.maximize(winboxParams.maximized)
  }
  if (winboxParams.minimized) {
    winbox.minimize(winboxParams.minimized)
  }

  window.addEventListener('resize', resizeEventListener)
  document.addEventListener('fullscreenchange', fullscreenEventListener)

  winboxEl = document.getElementById(winboxParams.id) as HTMLElement & {
    winbox?: WinBox
  }
  const winboxHeaderEl = winboxEl.querySelector('.wb-drag')!.parentElement

  const { isDragging, position } = useDraggable(winboxHeaderEl, {
    preventDefault: false,
  })

  watch([isDragging, position], ([flag, { x, y }]) => {
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
    state.x = x
    state.y = y

    if (!winboxParams.tether) {
      winboxEl.winbox.move(x, y)

      return
    }

    if (winboxParams.tether.includes('right')) {
      state.x = window.innerWidth - state.width
    }

    if (winboxParams.tether.includes('left')) {
      state.x = convertUnits('width', winboxParams.left)
    }

    if (winboxParams.tether.includes('top')) {
      state.y = convertUnits('height', winboxParams.top)
    }

    winboxEl.winbox.move(state.x, state.y)
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

    if (state.minimized) {
      winboxEl.winbox.minimize(false)
    }

    winboxEl.winbox.focus()
  })

  resizeEventListener()

  return winbox
}
