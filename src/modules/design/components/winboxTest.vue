<script setup lang="ts">
import type { PropType } from 'vue'
import { nanoid } from 'nanoid'

import type { WinBoxParams } from '~/store/winbox'

const props = defineProps({
  teleportId: {
    type: String,
    default: 'teleport',
  },
  dataId: {
    type: String,
    default: () => `id-${nanoid(8)}`,
  },
  show: {
    type: Boolean,
    default: true,
  },
  params: {
    type: Object as PropType<WinBoxParams>,
    default: () => ({}),
  },
  rootEl: {
    type: Object as PropType<HTMLElement>,
  },

})

const emit = defineEmits<{
  // (event: 'update:show', value: boolean): void
  (event: 'closeWindow', value?: string): void
}>()

const winboxStore = useWinboxStore()

const id = ref<string>(props.dataId)
const winbox = ref<WinBox | null>(null)

const [showFlag, showFlagToggle] = useToggle(false)
const [show, showToggle] = useToggle(true)

// const show = toRef(props, 'show')


defineExpose({
  id,

  open,
  winbox,
})

watch(show, (s) => (s ? open() : close()))
watch(showFlag, (sf) => showToggle(sf))

onMounted(() => show.value && open())
onScopeDispose(close)

function open() {
  const el = getWinboxEl()
  if (el && el.winbox) {
    el.winbox.minimize(false).focus()

    return
  }

  // const rootEl = document.getElementById(props.teleportId) || document.body
  const rootEl = props.rootEl || document.body
  const mountEl = document.createElement('div')
  const contentEl = document.createElement('div')

  contentEl.classList.add('wb-content')
  mountEl.appendChild(contentEl)

  const winboxParams = getWinboxParams(id.value, rootEl, mountEl)

  winboxStore.register(id.value, winboxParams)

  nextTick(() => {
    showFlagToggle(true)
  })

}

function close() {

  const el = getWinboxEl()
  if (!el || !el.winbox) {
  nextTick(() => {
    emit('closeWindow')
  })
    return
  }
  el.winbox.close()
}

function getWinboxEl() {
  const el = document.getElementById(id.value) as
    | (HTMLElement & {
        winbox?: WinBox
      })
    | null

  return el
}

function getWinboxParams(
  id: string,
  root: HTMLElement,
  mount: HTMLElement
): WinBoxParams {
  return {
    header: 45,
    border: 100,
    class: ['simple'],
    mount,
    root,
    id,

    onclose(forceFlag = false) {
      nextTick(() => showFlagToggle(false))
      return forceFlag
    },

    ...props.params,
  }
}
</script>

<template>
  <Teleport v-if="showFlag" :to="`#${id} .wb-content`">
    <pre
      class="w-full border-b box-color__default--2 p-6 border-b-dashed text-xs"
      >{{ winboxStore.windows.get(id) }}</pre
    >
    <slot name="default" />
  </Teleport>
</template>
