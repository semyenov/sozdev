<script setup lang="ts">
import type { IUser } from '~/types'

import type { PropType } from 'vue'

const props = defineProps({
  index: {
    type: Number,
    default: 0,
  },
  item: {
    type: Object as PropType<IUser>,
    required: true,
  },
})

const item = toRef(props, 'item')

const winboxTitle = `${item.value.info.first_name} ${item.value.info.last_name}`
const winboxId = `winbox-detail-${item.value._id}`

const { winboxWindow, createWindow } = useWinbox(winboxId)

function handleClick() {
  const w = winboxWindow.value

  if (!w?.winbox) {
    createWindow({
      id: winboxId,
      title: winboxTitle,

      teleportId: 'teleport-layer--20',

      dataComponent: 'WinboxUsersDetailItem',
      dataProps: {
        id: item.value._id,
      },

      tether: [],
      class: ['simple'],

      width: 400,
      height: 400,

      x: (window.innerWidth - 400) / 2,
      y: (window.innerHeight - 400) / 2,
    })

    return
  }

  if (w.state?.min)
    w.winbox.minimize(false)

  w.winbox.focus()
}
</script>

<template>
  <div class="component-user-item">
    <UiCard
      class="cursor-pointer select-none"
      rounded="none"
      :color="winboxWindow ? 'secondary' : 'third'"
      @click="handleClick()"
    >
      <template v-if="item" #header>
        <div class="w-full flex flex-row justify-between px-4 py-2">
          {{ `# ${item.info.first_name} ${item.info.last_name}` }}
          <div
            class="inline-flex border text-sm box-rounded__sm px-2 font-mono font-light box-color__default--6"
          >
            {{ item.email }}
          </div>
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
