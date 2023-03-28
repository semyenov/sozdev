<script setup lang="ts">
import type { PropType } from 'vue'
import { nextTick, onMounted, onScopeDispose, toRef, watch } from 'vue'
import { useToggle } from '@vueuse/core'
import { winboxRegister } from '../utils/winbox'

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

watch(showFlag, (flag) => (flag ? openWindow() : closeWindow()))

function openWindow() {
  if (winboxWindow.value && winboxWindow.value.winbox) {
    return
  }

  const rootEl =
    (props.params.teleportId &&
      document.getElementById(props.params.teleportId)) ||
    document.body

  const mountEl = document.createElement('div')
  const contentEl = document.createElement('div')

  mountEl.classList.add('wb-wrapper')
  contentEl.classList.add('wb-content')

  mountEl.appendChild(contentEl)

  winboxRegister(rootEl, mountEl, params.value)

  nextTick(() => {
    showToggle(true)
  })
}

function closeWindow() {
  if (!winboxWindow.value || !winboxWindow.value.winbox) {
    return
  }

  winboxWindow.value.winbox.close()
}
</script>

<template>
  <Teleport v-if="showFlag" :to="`#${params.id} .wb-wrapper .wb-content`">
    <slot name="default" />
  </Teleport>
</template>
