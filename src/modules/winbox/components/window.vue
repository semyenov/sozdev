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

function openWindow() {
  if (winboxWindow.value && winboxWindow.value.winbox)
    return

  const rootEl
    = document.getElementById(props.params.teleportId) || document.body
  const mountEl = document.createElement('div')
  const contentEl = document.createElement('div')

  mountEl.classList.add('wb-wrapper')
  contentEl.classList.add('wb-content')
  mountEl.appendChild(contentEl)

  winboxRegister(rootEl, mountEl, {
    top: 0,
    bottom: 0,
    left: 44,
    right: 0,
    border: 0,
    width: 550,
    header: 45,
    minwidth: 400,
    class: ['simple'],
    min: false,
    max: false,
    full: false,
    hidden: false,

    ...params.value,
  })

  nextTick(() => {
    showToggle(true)
  })
}

function closeWindow() {
  if (!winboxWindow.value || !winboxWindow.value.winbox)
    return

  winboxWindow.value.winbox.close()
}
</script>

<template>
  <Teleport v-if="showFlag" :to="`#${params.id} .wb-content`">
    <pre class="px-6 border-b box-color__default--2 py-4 text-xs">{{
      winboxWindow?.state
    }}</pre>
    <slot name="default" />
  </Teleport>
</template>
