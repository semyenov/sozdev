<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

const props = defineProps<{
  item: ParsedContent
}>()
const item = toRef(props, 'item')

const winboxTitle = `${item.value.title}`
const winboxId = `winbox-help-${item.value._path?.replaceAll('/', '-')}`
const { winboxWindow, createWindow } = useWinbox(winboxId)

function handleOpen() {
  const w = winboxWindow.value

  if (!w?.winbox) {
    createWindow({
      id: winboxId,
      title: winboxTitle,

      teleportId: 'teleport-layer--20',

      dataComponent: 'ContentDoc',
      dataProps: {
        path: item.value._path,
        class: 'w-full h-full',
      },

      tether: [],
      class: ['simple'],

      width: 400,
      height: '50%',

      x: (window.innerWidth - 400) / 2,
      y: (window.innerHeight - 600) / 2,

      top: 44,
      bottom: -1,
      left: 44,
      right: -1,
    })

    return
  }

  if (w.state?.min)
    w.winbox.minimize(false)

  w.winbox.focus()
}
</script>

<template>
  <ACard
    v-if="item" :title="item.title" :subtitle="item.description" class="cursor-pointer select-none spacing-80 [&_.a-title]:leading-tight"
    :variant="winboxWindow ? 'fill' : 'light'" @click="handleOpen"
  />
</template>
