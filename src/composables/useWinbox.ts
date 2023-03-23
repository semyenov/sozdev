import { throttle } from '@antfu/utils'
import { useStorage } from '@vueuse/core'

import type { Component } from 'vue'
import type WinBox from 'winbox'

import type {
  ISettingsWindoxStorage,
  IWinboxComposeProps,
  IWindowInfo,
  TWinboxParamsKeys,
  WinBoxParams,
} from '~/types/winbox'

const logger = useLogger(`store/${backendStoreKey}`)

const preservedWinbox = useStorage(
  'key-preserved-winbox',
  {} as ISettingsWindoxStorage
)

const windows = ref<Map<string, IWindowInfo>>(new Map())

export const runtimeContainers = ref<Map<string, VNode>>(new Map())

const mouse = useMouse()
const cursor = ref<string>()

const winboxParams: Pick<WinBoxParams, TWinboxParamsKeys> = {
  top: 0,
  bottom: 0,
  left: 44,
  right: 0,
  border: 0,
  width: 550,
  height: '100%',
  minwidth: 500,
  class: ['simple', 'wb-right', 'no-move', 'border-r-none'],
  tether: ['right', 'top', 'bottom'],
}

function removeComponent(keyComponent: string) {
  runtimeContainers.value.delete(keyComponent)
  removePreserveItem(keyComponent)
  logger.info(`component deleted`)
}

function setPreserveItem(id: string, data: IWinboxComposeProps) {
  preservedWinbox.value[id] = data
}

function getPreserveItem(id: string) {
  return preservedWinbox.value[id]
}

function removePreserveItem(id: string) {
  preservedWinbox.value = Object.keys(preservedWinbox.value).reduce(
    (prev, cur) => {
      if (id === cur) {
        return prev
      }
      prev[cur] = preservedWinbox.value[cur]
      return prev
    },
    {} as ISettingsWindoxStorage
  )
}

export function preservedItemsGetter() {
  const objects = preservedWinbox.value
  return Object.keys(objects).reduce((array, key) => {
    const item = objects[key]
    array.push(item)
    return array
  }, [] as IWinboxComposeProps[])
}

function getComponent(name: string): Component | undefined {
  const { vueApp } = useNuxtApp()
  const component = vueApp.component(name)
  if (!component) {
    logger.error(`Component ${name} not found`)
  }
  return component
}

function renderVNode(
  props: IWinboxComposeProps,
  keyComponent: string
): VNode | undefined {
  const component = getComponent(props.components.name)
  const child = getComponent(props.components.slot.name)
  if (!component || !child) {
    return
  }
  const VNode = h(
    component,
    {
      show: true,
      teleportId: 'teleport-layer--20',
      dataId: keyComponent,
      params: {
        ...winboxParams,
        ...(props.params || {}),
      },
      onActionClose: () => removeComponent(keyComponent),
    },
    () => child && h(child, { id: props.itemId })
  )
  return VNode
}

function addComponent(keyComponent: string, props: IWinboxComposeProps) {
  const component = renderVNode(props, keyComponent)
  if (!component) {
    return
  }
  runtimeContainers.value.set(keyComponent, component)
  setPreserveItem(keyComponent, props)
}

export const useWinbox = (props: IWinboxComposeProps) => {
  const isOpen = computed(() => {
    return runtimeContainers.value.has(props.components.id)
  })
  const windowParams = computed(() => {
    return windows.value.get(props.components.id)
  })

  function toggleWinbox() {
    if (isOpen.value) {
      removeComponent(props.components.id)
    } else {
      addComponent(props.components.id, props)
    }
  }

  return {
    register,

    windows,
    mouse,

    winboxParams,

    isOpen,
    toggleWinbox,
    windowParams,
  }
}

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

export function register(id: string, params: WinBoxParams) {
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

  params.onminimize = function () {
    logger.log('onminimize')

    if (!w) {
      return
    }

    w.minimized = true

    const preserveItem = getPreserveItem(id)

    const params = {
      minimized: true,
      maximized: false,
    }

    preserveItem.params = {
      ...preserveItem.params,
      ...params,
    }

    setPreserveItem(id, preserveItem)
    return !!onminimize && onminimize.call(this)
  }

  params.onmaximize = function (state = true) {
    logger.log('onmaximize')

    if (!w) {
      return
    }

    w.maximized = state

    const preserveItem = getPreserveItem(id)
    const params = {
      minimized: false,
      maximized: state,
    }

    preserveItem.params = {
      ...preserveItem.params,
      ...params,
    }

    setPreserveItem(id, preserveItem)
    return !!onmaximize && onmaximize.call(this, state)
  }

  params.onrestore = function () {
    logger.log('onrestore')

    if (!w) {
      return
    }

    w.maximized = false
    w.minimized = false

    const preserveItem = getPreserveItem(id)
    const params = {
      minimized: false,
      maximized: false,
    }

    preserveItem.params = {
      ...preserveItem.params,
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
