// import type { VNodeArrayChildren } from '@vue/runtime-core'

import { throttle } from '@antfu/utils'

import { useStorage } from '@vueuse/core'
import type { IWindowInfo, WinBoxComponent, WinBoxParams } from '~/types/winbox'
// import { UiWinboxTest } from '#components'

const logger = useLogger(`store/${backendStoreKey}`)
const winboxCursor = ref<string>()
export const winboxWindows = useStorage<Map<string, IWindowInfo>>(
  'winbox-windows',
  new Map()
)

// export const winboxWindows = ref<Map<string, IWindowInfo>>(new Map())

// export const WinboxRoot = defineComponent({
//   setup() {
//     const { vueApp } = useNuxtApp()
//     return { vueApp, winboxWindows }
//   },
//   render() {
//     // const { vueApp, winboxWindows } = this
//     const winboxWindows = this.winboxWindows
//     const vueApp = this.vueApp

//     const childrens: VNodeArrayChildren = []

//     for (const [id, info] of winboxWindows.entries()) {
//       if (!info) {
//         return
//       }
//       logger.info('info', info)
//       const component = vueApp.component(info.component?.name || '321')
//       if (!component) {
//         logger.error(`Component ${info.component?.name} not found`)
//         return
//       }

//       childrens.push(
//         h(
//           UiWinboxTest,
//           { key: id, params: info.params, component: info.component },
//           () => h(component, info.component?.props)
//         )
//       )
//     }
//     return h('div', childrens)
//   },
// })

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

export function register(
  root: HTMLElement,
  mount: HTMLElement,
  params: WinBoxParams,
  component?: WinBoxComponent
) {
  if (params.tether) {
    if (params.tether.includes('right')) {
      params.x = window.innerWidth
    }

    if (params.tether.includes('left')) {
      params.x = -convertUnits('width', params.width)
    }

    if (params.tether.includes('bottom')) {
      params.y = window.innerHeight
    }

    if (params.tether.includes('top')) {
      params.y = 0
    }
  }

  let w: IWindowInfo
  let winbox: WinBox
  let winboxEl: HTMLElement & {
    winbox?: WinBox
  }

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

  const fullscreenEventListener = (event: Event) => {
    const target = event.target as HTMLElement
    if (target.isEqualNode(winbox.body)) {
      w.state.fullscreen = !w.state.fullscreen
    }
  }

  const resizeEventListener = throttle(50, () => {
    if (!w || w.state.minimized || w.state.fullscreen) {
      return
    }

    const maxWidth =
      window.innerWidth -
      convertUnits('width', params.right) -
      convertUnits('width', params.left)

    const maxHeight =
      window.innerHeight -
      convertUnits('height', params.top) -
      convertUnits('height', params.bottom)

    const minWidth = convertUnits('width', params.minwidth)
    const minHeight = convertUnits('height', params.minheight)

    if (w.state.maximized) {
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

    if (!params.tether) {
      return
    }

    if (params.tether.includes('left')) {
      w.state.x = convertUnits('width', params.left)

      if (params.tether.includes('top')) {
        w.state.y = convertUnits('height', params.top)

        if (params.tether.includes('bottom')) {
          w.state.height = window.innerHeight
          winbox.resize(undefined, w.state.height)
        }
      }

      winbox.move(w.state.x, w.state.y)

      return
    }

    if (params.tether.includes('right')) {
      w.state.x =
        window.innerWidth - w.state.width - convertUnits('width', params.right)

      if (params.tether.includes('top')) {
        w.state.y = typeof params.top === 'number' ? params.top : 0

        if (params.tether.includes('bottom')) {
          w.state.height = window.innerHeight
          winbox.resize(undefined, w.state.height)
        }
      }

      logger.info('before move')
      winbox.move(w.state.x, w.state.y)
    }
  })

  params.onminimize = function () {
    logger.log('onminimize')

    if (!w) {
      return
    }

    w.state.minimized = true
    return !!onminimize && onminimize.call(this)
  }

  params.onmaximize = function (state = true) {
    logger.log('onmaximize')

    if (!w) {
      return
    }

    w.state.maximized = state
    return !!onmaximize && onmaximize.call(this, state)
  }

  params.onrestore = function () {
    logger.log('onrestore')

    if (!w) {
      return
    }

    w.state.maximized = false
    w.state.minimized = false

    resizeEventListener()

    return !!onrestore && onrestore.call(this)
  }

  params.onclose = function (forceFlag = false) {
    logger.log('onclose')

    winboxWindows.value.delete(params.id)
    window.removeEventListener('resize', resizeEventListener)
    document.removeEventListener('fullscreenchange', fullscreenEventListener)

    return !!onclose && onclose.call(this, forceFlag)
  }

  params.onresize = function (width, height) {
    logger.log('onresize')

    if (!w) {
      return
    }

    const minWidth = convertUnits('width', params.minwidth)
    const minHeight = convertUnits('height', params.minheight)

    w.state.height = Math.max(height, minHeight)
    w.state.width = Math.max(width, minWidth)

    return !!onresize && onresize.call(this, w.state.width, w.state.height)
  }

  params.onmove = function (x, y) {
    logger.log('onmove')

    if (!w) {
      return
    }

    w.state.x = x
    w.state.y = y

    return !!onmove && onmove.call(this, w.state.x, w.state.y)
  }

  params.onfocus = function () {
    logger.log('onfocus')

    if (!w) {
      return
    }

    w.state.minimized = false
    w.state.active = true

    return !!onfocus && onfocus.call(this)
  }

  params.onblur = function () {
    logger.log('onblur')

    if (!w) {
      return
    }

    w.state.active = false

    return !!onblur && onblur.call(this)
  }

  winbox = new window.WinBox({ ...params, root, mount })

  if (params.maximized && !params.minimized) {
    winbox.maximize(params.maximized)
  }
  if (params.minimized) {
    winbox.minimize(params.minimized)
  }

  if (!winboxWindows.value.has(params.id)) {
    winboxWindows.value.set(params.id, {
      params,
      component,
      state: {
        x: winbox.body.parentElement?.offsetLeft || 0,
        y: winbox.body.parentElement?.offsetTop || 0,
        width: winbox.body.parentElement?.clientWidth || 0,
        height: winbox.body.parentElement?.clientHeight || 0,
        minimized: params.minimized || false,
        fullscreen: false,
        maximized: winbox.max,
        active: true,
      },
    })
  }

  w = winboxWindows.value.get(params.id)!

  window.addEventListener('resize', resizeEventListener)
  document.addEventListener('fullscreenchange', fullscreenEventListener)

  winboxEl = document.getElementById(params.id) as HTMLElement & {
    winbox?: WinBox
  }

  const { isDragging, position } = useDraggable(winboxEl, {
    preventDefault: false,
  })

  watch([isDragging, position], ([flag, { x, y }]) => {
    if (!w || !winboxEl || !winboxEl.winbox || flag) {
      return
    }

    w.state.x = x
    w.state.y = y

    if (!params.tether) {
      winboxEl.winbox.move(w.state.x, w.state.y)

      return
    }

    if (params.tether.includes('right')) {
      w.state.x = window.innerWidth - w.state.width
    }

    if (params.tether.includes('left')) {
      w.state.x = convertUnits('width', params.left)
    }

    if (params.tether.includes('top')) {
      w.state.y = convertUnits('height', params.top)
    }

    winboxEl.winbox.move(w.state.x, w.state.y)
  })

  watch(winboxCursor, (cursor) => {
    if (!winboxEl || !winboxEl.winbox || cursor !== params.id) {
      return
    }

    winboxEl.winbox.focus()
  })

  resizeEventListener()

  return winbox
}
