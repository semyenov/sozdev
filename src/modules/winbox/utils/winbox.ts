import { clamp, useStorage } from '@vueuse/core'

import type { WinBoxBBox, WinBoxParams, WinBoxState } from '../types'

export const winboxWindowsStorageKey = 'winbox-windows' as const
export const winboxWindowsParamsStorage = useStorage<Map<string, WinBoxParams>>(
  `${winboxWindowsStorageKey}--params`,
  new Map(),
)
export const winboxWindowsStateStorage = useStorage<Map<string, WinBoxState>>(
  `${winboxWindowsStorageKey}--state`,
  new Map(),
)

export function winboxRegister(
  root: HTMLElement,
  mount: HTMLElement,
  params: WinBoxParams,
) {
  if (!winboxWindowsStateStorage.value.get(params.id)) {
    winboxWindowsStateStorage.value.set(params.id, {
      index: winboxWindowsStateStorage.value.size,
      tt: params.tether?.includes('top'),
      tr: params.tether?.includes('right'),
      tb: params.tether?.includes('bottom'),
      tl: params.tether?.includes('left'),
      x: convertUnits('width', params.x),
      y: convertUnits('height', params.y),
      max: params.max || false,
      min: params.min || false,
      hidden: params.hidden || false,
      full: params.full || false,
      width: convertUnits('width', params.width),
      height: convertUnits('height', params.height),
    })
  }

  const setState = (state: WinBoxState) =>
    winboxWindowsStateStorage.value.set(params.id, state)
  const getState = (): WinBoxState => ({
    ...winboxWindowsStateStorage.value.get(params.id)!,
  })

  const s = ref(getState())
  const b = ref<WinBoxBBox>(calcBBox(params))

  const resizeEventListener = () => {
    b.value = calcBBox(params)
  }
  const fullscreenEventListener = (event: Event) => {
    const t = event.target as HTMLElement
    if (!t.isEqualNode(root.children[0]))
      s.value.full = !s.value.full
  }

  const winbox = new window.WinBox({
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
      s.value.full = false

      return !!params.onrestore && params.onrestore.call(this)
    },

    onclose(forceFlag = false): boolean {
      winboxWindowsParamsStorage.value.delete(params.id)
      winboxWindowsStateStorage.value.delete(params.id)

      window.removeEventListener('resize', resizeEventListener)
      window.removeEventListener('fullscreenchange', fullscreenEventListener)

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
      return !!params.onfocus && params.onfocus.call(this)
    },

    onblur() {
      return !!params.onblur && params.onblur.call(this)
    },

    onfullscreen() {
      s.value.full = false
      return !!params.onfullscreen && params.onfullscreen.call(this)
    },

    oncreate() {
      window.addEventListener('resize', resizeEventListener)
      window.addEventListener('fullscreenchange', fullscreenEventListener)
      return !!params.oncreate && params.oncreate.call(this, params)
    },

    mount,
    root,
  })

  watch(
    [s, b],
    ([ss, bb]) => {
      // update winbox params
      winbox.maxheight = bb.maxheight
      winbox.minheight = bb.minheight

      winbox.maxwidth = bb.maxwidth
      winbox.minwidth = bb.minwidth

      // get current state
      const s = getState()

      // update boolean states
      s.min = ss.min
      s.max = ss.max
      s.full = ss.full
      s.hidden = ss.hidden

      // save state
      setState(s)

      if (ss.hidden || ss.min || ss.full)
        return

      if (ss.max) {
        winbox.resize(bb.maxwidth, bb.maxheight)
        return
      }

      let x: number = ss.x
      let y: number = ss.y
      let width: number = ss.width
      let height: number = ss.height

      const ws = getWindowSize()
      const ll = Array.from(winboxWindowsStateStorage.value!.values()).reduce((sum, cur) => (cur.tl && cur.index < ss.index) ? sum + cur.width : sum, 0)
      const lr = Array.from(winboxWindowsStateStorage.value!.values()).reduce((sum, cur) => (cur.tr && cur.index < ss.index) ? sum + cur.width : sum, 0)

      // calculate tether position
      if (params.tether) {
        if (ss.tl)
          x = bb.left + ll

        if (ss.tt)
          y = bb.top

        if (ss.tr) {
          x = ws.width - bb.right - lr - width

          if (ss.tl)
            width = bb.maxwidth - lr
        }
        if (ss.tb) {
          y = ws.width - bb.bottom - height

          if (ss.tt)
            height = bb.maxheight
        }
      }

      // clamp values
      width = clamp(width, bb.minwidth, bb.maxwidth)
      height = clamp(height, bb.minheight, bb.maxheight)
      x = clamp(
        x,
        Math.max(0, bb.left),
        Math.max(0, ws.width - bb.right - width),
      )
      y = clamp(
        y,
        Math.max(0, bb.top),
        Math.max(0, ws.height - bb.bottom - height),
      )

      // update winbox params
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
    },
  )
}

function calcBBox(params: WinBoxParams): WinBoxBBox {
  const ws = getWindowSize()

  return {
    left: convertUnits('width', params.left),
    right: convertUnits('width', params.right),
    top: convertUnits('width', params.top),
    bottom: convertUnits('width', params.bottom),

    maxwidth:
      ws.width
      - convertUnits('width', params.left)
      - convertUnits('width', params.right),
    maxheight:
      ws.height
      - convertUnits('height', params.top)
      - convertUnits('height', params.bottom),

    minwidth: convertUnits('width', params.minwidth),
    minheight: convertUnits('height', params.minheight),
  }
}

export function convertUnits(
  type: 'width' | 'height',
  value?: string | number,
) {
  const ws = getWindowSize()
  return (typeof value === 'number'
    ? value
    : typeof value === 'string'
      ? value.endsWith('%')
        ? Math.floor(
          (parseFloat(value.slice(0, value.length - 1)) / 100)
            * (type === 'width' ? ws.width : ws.height),
        )
        : parseInt(value.slice(0, value.length - 2))
      : 0)
}

function getWindowSize() {
  return {
    width: window.innerWidth || document.documentElement.clientWidth
  || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight
  || document.body.clientHeight,
  }
}
