import { objectPick } from '@antfu/utils'
import { useStorage } from '@vueuse/core'

import type { WinBoxParams, WinBoxState, WinBoxWindow } from '../types'

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
  let winboxDragEl: HTMLElement

  const {
    onclose,
    onresize,
    onmove,
    onfocus,
    onblur,
    onminimize,
    onmaximize,
    onrestore,
  } = params

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
    min: false,
    max: false,
    hidden: false,
    fullscreen: false,

    ...params,
  } as WinBoxParams

  winboxWindows.value.set(winboxParams.id, {
    params: winboxParams,
    state: {
      x: convertUnits('width', winboxParams.x),
      y: convertUnits('height', winboxParams.y),
      width: convertUnits('width', winboxParams.width),
      height: convertUnits('height', winboxParams.height),
      ...objectPick(winboxParams, ['max', 'min', 'hidden', 'fullscreen']),
    } as WinBoxState,
  })

  const winboxWindow = computed(() => winboxWindows.value.get(winboxParams.id)!)

  const s = computed(() => winboxWindow.value.state!)
  const p = computed(() => winboxWindow.value.params!)

  const fullscreenEventListener = (event: Event) => {
    const t = event.target as HTMLElement

    if (!t.isEqualNode(winbox.body)) {
      return
    }

    s.value.fullscreen = !s.value.fullscreen
  }

  const resizeEventListener = () => {
    if (s.value.min) {
      winbox.minimize(s.value.min)
      return
    }
    if (s.value.max) {
      winbox.maximize(s.value.max)
      return
    }

    p.value.top = convertUnits('height', winboxParams.top)
    p.value.bottom = convertUnits('height', winboxParams.bottom)
    p.value.left = convertUnits('width', winboxParams.left)
    p.value.right = convertUnits('width', winboxParams.right)

    p.value.minwidth = convertUnits('width', p.value.minwidth)
    p.value.minheight = convertUnits('height', p.value.minheight)

    p.value.maxwidth = window.innerWidth - p.value.right - p.value.left
    p.value.maxheight = window.innerHeight - p.value.top - p.value.bottom

    if (!winbox) {
      return
    }

    winbox.maxwidth = p.value.maxwidth
    winbox.maxheight = p.value.maxheight
    winbox.minwidth = p.value.minwidth
    winbox.minheight = p.value.minheight

    if (p.value.tether && p.value.tether.length > 0) {
      if (p.value.tether.includes('left')) {
        s.value.x = p.value.left
        if (p.value.tether.includes('top')) {
          s.value.y = p.value.top
          if (p.value.tether.includes('bottom')) {
            s.value.height = p.value.maxheight
            winbox.resize(s.value.width, s.value.height)
          }
        }
      } else if (p.value.tether.includes('right')) {
        s.value.x = window.innerWidth - p.value.right - s.value.width
        if (p.value.tether.includes('top')) {
          s.value.y = p.value.top
          if (p.value.tether.includes('bottom')) {
            s.value.height = p.value.maxheight
            winbox.resize(s.value.width, s.value.height)
          }
        }
      }

      winbox.move(s.value.x, s.value.y)
    }
  }

  const mousedownEventListener = (event: MouseEvent) => {
    if (event.type === 'mousedown') {
      window.addEventListener('mouseup', resizeEventListener)
      return
    }

    window.removeEventListener('mouseup', resizeEventListener)
  }

  winboxParams.onminimize = function (flag = true) {
    s.value.min = flag
    return !!onminimize && onminimize.call(this, flag)
  }

  winboxParams.onmaximize = function (flag = true) {
    s.value.max = flag
    return !!onmaximize && onmaximize.call(this, flag)
  }

  winboxParams.onrestore = function () {
    s.value.max = false
    s.value.min = false
    return !!onrestore && onrestore.call(this)
  }

  winboxParams.onclose = function (forceFlag = false): boolean {
    window.removeEventListener('resize', resizeEventListener)
    document.removeEventListener('fullscreenchange', fullscreenEventListener)
    winboxDragEl.removeEventListener('mousedown', mousedownEventListener)

    winboxWindows.value.delete(winboxParams.id)

    return !!onclose && onclose.call(this, forceFlag)
  }

  winboxParams.onresize = function (width, height) {
    nextTick(() => {
      if (s.value.min || s.value.max) {
        return
      }

      s.value.height = height
      s.value.width = width
    })

    return !!onresize && onresize.call(this, width, height)
  }

  winboxParams.onmove = function (x, y) {
    nextTick(() => {
      if (s.value.min || s.value.max) {
        return
      }

      s.value.x = x
      s.value.y = y
    })
    return !!onmove && onmove.call(this, x, y)
  }

  winboxParams.onfocus = function () {
    s.value.min = false
    return !!onfocus && onfocus.call(this)
  }

  winboxParams.onblur = function () {
    return !!onblur && onblur.call(this)
  }

  winbox = new window.WinBox({
    ...winboxParams,
    ...p.value,
    mount,
    root,
  })

  window.addEventListener('resize', resizeEventListener)
  document.addEventListener('fullscreenchange', fullscreenEventListener)

  winboxDragEl = document
    .getElementById(winboxParams.id)!
    .querySelector('.wb-drag')!
  winboxDragEl.addEventListener('mousedown', mousedownEventListener)

  resizeEventListener()

  watch(winboxCursor, (cursor) => {
    if (!winbox || cursor !== winboxParams.id) {
      return
    }

    if (s.value.min) {
      winbox.minimize(false)
    }

    winbox.focus()
  })
}
