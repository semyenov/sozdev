import { throttle } from '@antfu/utils'

import { IWindowInfo, WinBoxParams } from '../store/winbox'

function convertUnits(type: 'width' | 'height', value?: string | number) {
  return typeof value === 'number'
    ? value
    : typeof value === 'string'
    ? (parseFloat(value.slice(0, value.length - 1)) / 100) *
      (type === 'width' ? window.innerWidth : window.innerHeight)
    : 0
}

const logger = useLogger(`store/${backendStoreKey}`)

export const useWinbox = (
  windows: Ref<Map<string, IWindowInfo>>,
  cursor: Ref<string | undefined>
) => {
  const keys = useMagicKeys()
  const shiftLeftArrowKey = keys['Shift+<']
  const shiftRightArrowKey = keys['Shift+>']

  watch(shiftLeftArrowKey, (flag) => {
    if (flag) {
      const ids = [...windows.value.keys()]
      const currentIndex = ids.findIndex((key) => key === cursor.value) - 1

      if (currentIndex > -2) {
        cursor.value = ids[currentIndex]

        return
      }

      if (ids.length > 0) {
        cursor.value = ids[ids.length - 1]
      }
    }
  })

  watch(shiftRightArrowKey, (flag) => {
    if (flag) {
      const ids = [...windows.value.keys()]
      const currentIndex = ids.findIndex((key) => key === cursor.value) + 1

      if (currentIndex > 0 && currentIndex < ids.length) {
        cursor.value = ids[currentIndex]

        return
      }

      if (ids.length > 0) {
        cursor.value = ids[0]
      }
    }
  })

  function register(id: string, params: WinBoxParams) {
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
    // let winboxDrag: HTMLElement | undefined
    let winboxElem: HTMLElement & {
      winbox?: WinBox
    }

    const onclose = params.onclose
    const onresize = params.onresize
    const onmove = params.onmove
    const onfocus = params.onfocus
    const onblur = params.onblur
    const onminimize = params.onminimize
    const onmaximize = params.onmaximize
    const onrestore = params.onrestore

    const fullscreenEventListener = (event: Event) => {
      const target = event.target as HTMLElement
      if (target.isEqualNode(winbox.body)) {
        w.fullscreen = !w.fullscreen
      }
    }

    const resizeEventListener = throttle(50, () => {
      if (!w || w.minimized || w.fullscreen) {
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

      if (w.maximized) {
        nextTick(() => {
          if (!winboxElem || !winboxElem.winbox) {
            return
          }

          winboxElem.winbox.resize(
            Math.max(maxWidth, minWidth),
            Math.max(maxHeight, minHeight),
            true
          )
          winboxElem.winbox.maximize(true)
        })

        return
      }

      if (!params.tether) {
        return
      }

      if (params.tether.includes('left')) {
        w.x = convertUnits('width', params.left)

        if (params.tether.includes('top')) {
          w.y = convertUnits('height', params.top)

          if (params.tether.includes('bottom')) {
            w.height = window.innerHeight
            winbox.resize(undefined, w.height)
          }
        }

        winbox.move(w.x, w.y)

        return
      }

      if (params.tether.includes('right')) {
        w.x = window.innerWidth - w.width - convertUnits('width', params.right)

        if (params.tether.includes('top')) {
          w.y = typeof params.top === 'number' ? params.top : 0

          if (params.tether.includes('bottom')) {
            w.height = window.innerHeight
            winbox.resize(undefined, w.height)
          }
        }

        winbox.move(w.x, w.y)
      }
    })

    const preserve = usePreserve()

    params.onminimize = function () {
      logger.log('onminimize')

      if (!w) {
        return
      }

      w.minimized = true

      const preserveItem = preserve.getItem(id)

      const params = {
        minimized: true,
        maximized: false,
      }

      preserveItem.componentInfo.params = {
        ...preserveItem.componentInfo.params,
        ...params,
      }

      preserve.setItem(id, preserveItem)
      return !!onminimize && onminimize.call(this)
    }

    params.onmaximize = function (state = true) {
      logger.log('onmaximize')

      if (!w) {
        return
      }

      w.maximized = state

      const preserveItem = preserve.getItem(id)
      const params = {
        minimized: false,
        maximized: state,
      }

      preserveItem.componentInfo.params = {
        ...preserveItem.componentInfo.params,
        ...params,
      }

      preserve.setItem(id, preserveItem)
      return !!onmaximize && onmaximize.call(this, state)
    }

    params.onrestore = function () {
      logger.log('onrestore')

      if (!w) {
        return
      }

      w.maximized = false
      w.minimized = false

      const preserveItem = preserve.getItem(id)
      const params = {
        minimized: false,
        maximized: false,
      }

      preserveItem.componentInfo.params = {
        ...preserveItem.componentInfo.params,
        ...params,
      }

      resizeEventListener()

      return !!onrestore && onrestore.call(this)
    }

    params.onclose = function (forceFlag = false) {
      logger.log('onclose')

      windows.value.delete(id)
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

      w.height = Math.max(height, minHeight)
      w.width = Math.max(width, minWidth)

      return !!onresize && onresize.call(this, w.width, w.height)
    }

    params.onmove = function (x, y) {
      logger.log('onmove')

      if (!w) {
        return
      }

      w.x = x
      w.y = y

      return !!onmove && onmove.call(this, w.x, w.y)
    }

    params.onfocus = function () {
      logger.log('onfocus')

      if (!w) {
        return
      }

      w.minimized = false
      w.active = true

      return !!onfocus && onfocus.call(this)
    }

    params.onblur = function () {
      logger.log('onblur')

      if (!w) {
        return
      }

      w.active = false

      return !!onblur && onblur.call(this)
    }

    winbox = new window.WinBox(params)

    if (params.maximized && !params.minimized) {
      winbox.maximize(params.maximized)
    }
    if (params.minimized) {
      winbox.minimize(params.minimized)
    }

    if (!windows.value.has(id)) {
      windows.value.set(id, {
        x: winbox.body.parentElement?.offsetLeft || 0,
        y: winbox.body.parentElement?.offsetTop || 0,
        width: winbox.body.parentElement?.clientWidth || 0,
        height: winbox.body.parentElement?.clientHeight || 0,
        minimized: params.minimized || false,
        fullscreen: false,
        maximized: winbox.max,
        active: true,
        needSave: params.needSave || false,
      })
    }

    w = windows.value.get(id)!

    window.addEventListener('resize', resizeEventListener)
    document.addEventListener('fullscreenchange', fullscreenEventListener)

    winboxElem = document.getElementById(id) as HTMLElement & {
      winbox?: WinBox
    }

    const { isDragging, position } = useDraggable(winboxElem, {
      preventDefault: false,
    })

    watch([isDragging, position], ([flag, { x, y }]) => {
      if (!w || !winboxElem || !winboxElem.winbox || flag) {
        return
      }

      w.x = x
      w.y = y

      if (!params.tether) {
        winboxElem.winbox.move(w.x, w.y)

        return
      }

      if (params.tether.includes('right')) {
        w.x = window.innerWidth - w.width
      }

      if (params.tether.includes('left')) {
        w.x = convertUnits('width', params.left)
      }

      if (params.tether.includes('top')) {
        w.y = convertUnits('height', params.top)
      }

      winboxElem.winbox.move(w.x, w.y)
    })

    watch(cursor, (cursor) => {
      if (!winboxElem || !winboxElem.winbox || cursor !== id) {
        return
      }

      winboxElem.winbox.focus()
    })

    resizeEventListener()

    return winbox
  }

  return { register }
}
