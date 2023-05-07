<script setup lang="ts">
import { winboxRegister } from '../utils/winbox'

import type { PropType } from 'vue'
import type { WinBoxParams } from '../types'

const props = defineProps({
  params: {
    type: Object as PropType<WinBoxParams>,
    required: true,
  },
})

const disabled = ref(true)
const params = toRef(props, 'params')
const [showFlag, showToggle] = useToggle(false)

const { winboxWindow } = useWinbox(params.value.id)

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
  mountEl.innerHTML = '<div class="wb-content"></div>'
  mountEl.classList.add('wb-wrapper')

  const templateEl = document.createElement('div')
  templateEl.innerHTML = `
    <div class="wb-header">
      <div class="wb-drag"></div>
      <div class="wb-control text-xl">
        <i class="wb-min i-ic:baseline-minimize"></i>
        <!-- <i class="wb-max i-carbon:maximize"></i>
        <i class="wb-full i-ic:baseline-fullscreen"></i> -->
        <i class="wb-close i-ic:round-close"></i>
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
    top: 45,
    bottom: 0,
    left: 45,
    right: 0,
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

  if (p.url)
    winboxWindow.value.winbox.setUrl(p.url)
  if (p.title)
    winboxWindow.value.winbox.setTitle(p.title)
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
  <Teleport v-if="showFlag" :disabled="disabled" :to="`#${params.id} .wb-content`">
    <slot name="default" />
  </Teleport>
</template>
