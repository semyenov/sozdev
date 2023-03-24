<script setup lang="ts">
import type { PropType } from 'vue'
import type { WinBoxComponent, WinBoxParams } from '~/types/winbox'

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

const emit = defineEmits<{
  (event: 'update:show', value: boolean): void
  (event: 'close', value?: string): void
}>()

const winbox = ref<WinBox | null>(null)

const [show, showToggle] = useToggle(false)

defineExpose({
  open,
  winbox,
})

watch(show, (s) => (s ? open() : close()))

onMounted(() => open())
onScopeDispose(close)

function open() {
  const el = getWinboxEl()
  if (el && el.winbox) {
    el.winbox.minimize(false).focus()

    return
  }

  const rootEl =
    document.getElementById(props.params.teleportId) || document.body
  const mountEl = document.createElement('div')
  const contentEl = document.createElement('div')

  contentEl.classList.add('wb-content')
  mountEl.appendChild(contentEl)

  const winboxParams = getWinboxParams()
  register(rootEl, mountEl, winboxParams, props.component)

  nextTick(() => {
    showToggle(true)
  })
}

function close() {
  const el = getWinboxEl()
  if (!el || !el.winbox) {
    nextTick(() => {
      emit('close')
    })
    return
  }
  el.winbox.close()
}

function getWinboxEl() {
  const el = document.getElementById(props.params.id) as
    | (HTMLElement & {
        winbox?: WinBox
      })
    | null

  return el
}

function getWinboxParams(): WinBoxParams {
  return {
    top: 0,
    bottom: 0,
    left: 44,
    right: 0,
    border: 0,
    width: 550,
    header: 45,
    height: '100%',
    minwidth: 500,
    class: ['simple', 'wb-right', 'no-move', 'border-r-none'],
    tether: ['right', 'top', 'bottom'],

    onclose(forceFlag = false) {
      nextTick(() => showToggle(false))
      return forceFlag
    },

    ...props.params,
  }
}
</script>

<template>
  <Teleport v-if="show" :to="`#${props.params.id} .wb-content`">
    <slot name="default" />
  </Teleport>
</template>
