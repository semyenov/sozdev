import { clamp, useStorage } from '@vueuse/core'
import type { WinBoxBbox, WinBoxParams, WinBoxState } from '../types'

export const winboxWindowsStorageKey = 'winbox-windows' as const
export const winboxWindowsParamsStorage = useStorage<Map<string, WinBoxParams>>(
  `${winboxWindowsStorageKey}--params`,
  new Map()
)
export const winboxWindowsStateStorage = useStorage<Map<string, WinBoxState>>(
  `${winboxWindowsStorageKey}--state`,
  new Map()
)

export function winboxRegister(
  root: HTMLElement,
  mount: HTMLElement,
  params: WinBoxParams
) {
  let winbox: WinBox
  winboxWindowsParamsStorage.value.set(params.id, params)

  const setState = (state: WinBoxState) =>
    winboxWindowsStateStorage.value.set(params.id, state)
  const getState = () =>
    winboxWindowsStateStorage.value.has(params.id)
      ? ({ ...winboxWindowsStateStorage.value.get(params.id) } as WinBoxState)
      : ({
          x: convertUnits('width', params.x),
          y: convertUnits('height', params.y),
          width: convertUnits('width', params.width),
          height: convertUnits('height', params.height),
          index: winboxWindowsParamsStorage.value.size,
          max: params.max || false,
          min: params.min || false,
          hidden: params.hidden || false,
          full: params.full || false,
        } as WinBoxState)

  const s = ref(getState())

  const calcBbox = (): WinBoxBbox => ({
    left: convertUnits('width', params.left),
    right: convertUnits('width', params.right),
    top: convertUnits('width', params.top),
    bottom: convertUnits('width', params.bottom),

    maxwidth:
      window.innerWidth -
      convertUnits('width', params.left) -
      convertUnits('width', params.right),
    maxheight:
      window.innerHeight -
      convertUnits('height', params.top) -
      convertUnits('height', params.bottom),

    minwidth: convertUnits('width', params.minwidth),
    minheight: convertUnits('height', params.minheight),
  })

  const fullscreenEventListener = (event: Event) => {
    const t = event.target as HTMLElement

    if (!t.isEqualNode(winbox.body)) {
      return
    }

    s.value.full = !s.value.full
  }

  const b = ref<WinBoxBbox>(calcBbox())
  const updateBbox = () => (b.value = calcBbox())

  winbox = new window.WinBox({
    ...params,
    ...s.value,

    onminimize(flag = true) {
      s.value.min = flag
      return !!params.onminimize && params.onminimize.call(this, flag)
    },

    onmaximize(flag = true) {
      s.value.max = flag
      return !!params.onmaximize && params.onmaximize.call(this, flag)
    },

    onrestore() {
      s.value = getState()
      s.value.max = false
      s.value.min = false

      return !!params.onrestore && params.onrestore.call(this)
    },

    onclose(forceFlag = false): boolean {
      window.removeEventListener('resize', updateBbox)
      document.removeEventListener('fullscreenchange', fullscreenEventListener)

      winboxWindowsParamsStorage.value.delete(params.id)
      winboxWindowsStateStorage.value.delete(params.id)

      return !!params.onclose && params.onclose.call(this, forceFlag)
    },

    onresize(width, height) {
      s.value.width = width
      s.value.height = height

      return !!params.onresize && params.onresize.call(this, width, height)
    },

    onmove(x, y) {
      s.value.x = x
      s.value.y = y

      return !!params.onmove && params.onmove.call(this, x, y)
    },

    onfocus() {
      s.value.index = 0
      return !!params.onfocus && params.onfocus.call(this)
    },

    onblur() {
      s.value.index -= 1
      return !!params.onblur && params.onblur.call(this)
    },

    mount,
    root,
  })

  window.addEventListener('resize', updateBbox)
  document.addEventListener('fullscreenchange', fullscreenEventListener)

  watch(
    [s, b],
    ([ss, bb]) => {
      winbox.maxheight = bb.maxheight
      winbox.minheight = bb.minheight

      winbox.maxwidth = bb.maxwidth
      winbox.minwidth = bb.minwidth

      const s = getState()

      s.index = ss.index
      s.hidden = ss.hidden
      s.min = ss.min
      s.full = ss.full
      s.max = ss.max

      setState(s)

      if (ss.hidden || ss.min || ss.full) {
        return
      }

      let x: number = ss.x
      let y: number = ss.y
      let width: number = ss.width
      let height: number = ss.height

      if (ss.max) {
        width = bb.maxwidth
        height = bb.maxheight

        winbox.resize(width, height)
        return
      }

      if (params.tether) {
        if (params.tether.includes('left')) {
          x = bb.left
        }
        if (params.tether.includes('top')) {
          y = bb.top
        }
        if (params.tether.includes('right')) {
          x = window.innerWidth - bb.right - width

          if (params.tether.includes('left')) {
            width = bb.maxwidth
          }
        }
        if (params.tether.includes('bottom')) {
          y = window.innerWidth - bb.bottom - height

          if (params.tether.includes('top')) {
            height = bb.maxheight
          }
        }
      }

      width = clamp(width, bb.minwidth, bb.maxwidth)
      height = clamp(height, bb.minheight, bb.maxheight)
      x = clamp(
        x,
        Math.max(0, bb.left),
        Math.max(0, window.innerWidth - bb.right - width)
      )
      y = clamp(
        y,
        Math.max(0, bb.top),
        Math.max(0, window.innerHeight - bb.bottom - height)
      )

      winbox.move(x, y)
      winbox.resize(width, height)

      s.x = x
      s.y = y
      s.height = height
      s.width = width

      setState(s)
    },
    {
      deep: true,
      immediate: true,
    }
  )
}

export function convertUnits(
  type: 'width' | 'height',
  value?: string | number
) {
  return typeof value === 'number'
    ? value
    : typeof value === 'string'
    ? (parseFloat(value.slice(0, value.length - 1)) / 100) *
      (type === 'width' ? window.innerWidth : window.innerHeight)
    : 0
}
