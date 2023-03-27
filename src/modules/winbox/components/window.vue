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
const component = toRef(props, 'component')

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

  winboxRegister(
    rootEl,
    mountEl,
    {
      ...props.params,
      onclose(forceFlag = false) {
        nextTick(() => showToggle(false))
        return forceFlag
      },
    },
    component.value
  )

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
</script>

<template>
  <Teleport v-if="show" :to="`#${props.params.id} .wb-content`">
    <slot name="default" />
  </Teleport>
</template>
