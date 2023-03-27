<script setup lang="ts">
import type { PropType } from 'vue'

import type { WinBoxComponent, WinBoxParams } from '../types'
import { winboxRegister } from '../utils/winbox'
import { useWinbox } from '../composables/useWinbox'

const props = defineProps({
  params: {
    type: Object as PropType<WinBoxParams>,
    default: () => ({}),
  },
  component: {
    type: Object as PropType<WinBoxComponent>,
    required: false,
  },
})

const component = toRef(props, 'component')
const params = toRef(props, 'params')

const { window } = useWinbox(params.value.id)

const [show, showToggle] = useToggle(false)

defineExpose({
  open,
  window,
})

watch(show, (s) => (s ? open() : window.value?.winbox?.close()))

onMounted(() => open())
onScopeDispose(() => window.value?.winbox?.close())

function open() {
  if (window.value?.winbox) {
    return
  }

  const rootEl =
    document.getElementById(props.params.teleportId) || document.body

  const mountEl = document.createElement('div')
  mountEl.classList.add('wb-wrapper')

  const contentEl = document.createElement('div')
  contentEl.classList.add('wb-content')

  mountEl.appendChild(contentEl)

  winboxRegister(rootEl, mountEl, params.value, component.value)

  nextTick(() => {
    showToggle(true)
  })
}
</script>

<template>
  <Teleport v-if="show" :to="`#${params.id} .wb-content`">
    <slot name="default" />
  </Teleport>
</template>
