<script setup lang="ts">
import type {
  ParsedContent,
} from '@nuxt/content/dist/runtime/types'
import type { PropType } from 'vue'

const props = defineProps({
  item: {
    type: Object as PropType<ParsedContent>,
    required: true,
  },
})
const item = toRef(props, 'item')
const { winboxWindow, createWindow } = useWinbox(item.value._id)

const winboxId = `winbox-help-${item.value._path?.replaceAll('/', '-')}`

function handleOpen() {
  const w = winboxWindow.value

  if (!w?.winbox) {
    createWindow({
      id: winboxId,
      title: item.value.title,

      teleportId: 'teleport-layer--20',

      dataComponent: 'ContentDoc',
      dataProps: {
        path: item.value._path,
      },

      tether: [],
      class: ['simple'],

      width: 400,
      height: '50%',

      x: (window.innerWidth - 400) / 2,
      y: (window.innerHeight - 600) / 2,

      top: 45,
      bottom: 0,
      left: 45,
    })

    return
  }

  if (w.state?.min)
    w.winbox.minimize(false)

  w.winbox.focus()
}
</script>

<template>
  <ATypography v-if="item" :title="item.title" @click="handleOpen" />
</template>
