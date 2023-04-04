<script setup lang="ts">
import type { IObject } from '~/types'

import type { PropType } from 'vue'

const props = defineProps({
  index: {
    type: Number,
    default: 0,
  },
  item: {
    type: Object as PropType<IObject>,
    required: true,
  },
})

const item = toRef(props, 'item')

const winboxTitle = `${item.value.info.name}`
const winboxId = `winbox-detail-${item.value._id}`

const { winboxWindow, createWindow } = useWinbox(winboxId)

function handleClick() {
  const w = winboxWindow.value

  if (!w?.winbox) {
    createWindow({
      id: winboxId,
      title: winboxTitle,

      teleportId: 'teleport-layer--20',

      dataComponent: 'WinboxObjectsDetailItem',
      dataProps: {
        id: item.value._id,
      },

      tether: ['top', 'right', 'bottom'],
      class: ['simple', 'wb-right'],
    })

    return
  }

  if (w.state?.min)
    w.winbox.minimize(false)

  w.winbox.focus()
}
</script>

<template>
  <div class="component-object-item">
    <UiCard
      class="cursor-pointer select-none"
      rounded="none"
      :color="winboxWindow ? 'fourth' : 'primary'"
      @click="handleClick"
    >
      <template v-if="item" #header>
        <div class="flex flex-row w-full justify-between px-4 py-2">
          {{ `# ${item.info.name}` }}
        </div>
      </template>
      <template v-if="item">
        <div class="p-4">
          {{ item }}
        </div>
      </template>
      <template v-if="winboxWindow" #footer>
        <div v-if="winboxWindow?.state" class="px-4 py-1.5">
          {{ winboxWindow?.state }}
        </div>
      </template>
    </UiCard>
  </div>
</template>
