<script setup lang="ts">
import { winboxRegister } from '../utils/winbox'

import type { WinBoxParams } from '../types'

const props = defineProps<{ params: WinBoxParams }>()
const params = toRef(props, 'params')

const disabled = ref(true)
const [showFlag, showToggle] = useToggle(false)

const { winboxWindow } = useWinbox(params.value.id!)

defineExpose({
  open: openWindow,
  close: closeWindow,
  window: winboxWindow,
})

onMounted(openWindow)
onScopeDispose(closeWindow)

watch(showFlag, flag => (flag ? openWindow() : closeWindow()))
watch(params, updateWindowParams)

function openWindow() {
  disabled.value = false

  if (winboxWindow.value && winboxWindow.value.winbox)
    return

  const rootEl
    = document.getElementById(props.params.teleportId) || document.body
  const mountEl = document.createElement('div')
  mountEl.classList.add('wb-wrapper')

  const templateEl = document.createElement('div')
  templateEl.innerHTML = `
    <div class="wb-header">
      <div class="wb-drag"></div>
      <div class="wb-control text-xl">
        <i class="wb-min i-ph:minus mt-2.5"></i>
        <i class="wb-max i-ph:plus"></i>
        <i class="wb-full i-ph:browser"></i>
        <i class="wb-close i-ph:x"></i>
      </div>
    </div>

    <div class="wb-body"></div>

    <div class="wb-n"></div>
    <div class="wb-s"></div>
    <div class="wb-w"></div>
    <div class="wb-e"></div>
    <div class="wb-nw"></div>
    <div class="wb-ne"></div>
    <div class="wb-se"></div>
    <div class="wb-sw"></div>
  `

  winboxRegister(rootEl, mountEl, {
    top: 44,
    left: 44,
    bottom: -1,
    right: -1,
    border: 0,
    width: 400,
    header: 45,
    minwidth: 300,
    minheight: 100,
    class: ['simple'],
    min: false,
    max: false,
    full: false,
    hidden: false,
    template: templateEl,
    background: 'rgba(255,255,255,0.80)',
    onclose(fl) {
      showToggle(false)
      return fl || false
    },

    ...params.value,

    title: undefined,
  })

  nextTick(() => {
    showToggle(true)
  })
}

function updateWindowParams(p: WinBoxParams) {
  if (!winboxWindow.value || !winboxWindow.value.winbox)
    return

  // if (p.title)
  //   winboxWindow.value.winbox.setTitle(p.title)
  if (p.url)
    winboxWindow.value.winbox.setUrl(p.url)
  if (p.background)
    winboxWindow.value.winbox.setBackground(p.background)
}

function closeWindow() {
  if (!winboxWindow.value || !winboxWindow.value.winbox)
    return

  winboxWindow.value.winbox.close()
}
</script>

<template>
  <Teleport v-if="showFlag" :disabled="disabled" :to="`#${params.id} .wb-drag`">
    <div class="wb-title">
      <slot v-if="$slots.title" name="title" />
      <span v-else>{{ params.title }}</span>
    </div>
  </Teleport>
  <Teleport v-if="showFlag" :disabled="disabled" :to="`#${params.id} .wb-wrapper`">
    <slot name="default" />
  </Teleport>
</template>
