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

function handleOpen() {
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

      tether: ['left', 'top', 'bottom'],
      class: ['simple'],

      width: 500,
      height: 600,

      bottom: 0,
    })

    return
  }

  if (w.state?.min)
    w.winbox.minimize(false)

  w.winbox.focus()
}

// function handleClose() {
//   const w = winboxWindow.value
//   if (w?.winbox)
//     w.winbox.close()
// }
</script>

<template>
  <ACard
    class="cursor-pointer select-none shadow-none spacing-75"
    :variant="winboxWindow ? 'fill' : 'light'"
    @click="handleOpen"
  >
    <div class="w-full flex flex-row a-card-body">
      <div class="flex flex-grow flex-row items-center flex-gap-4">
        <AAvatar color="primary">
          {{ [item.info.first_name, item.info.last_name].map((str) => str[0]).join("") }}
        </AAvatar>
        <ATypography
          :title="`# ${item.info.first_name} ${item.info.last_name}`"
          :subtitle="item.email"
        />
      </div>
      <div v-if="winboxWindow?.winbox" class="flex flex-shrink flex-wrap justify-center gap-x-4 gap-y-2">
        <ABtn
          color="info"
          variant="text"
          icon="i-carbon:bring-to-front"
          icon-only
          class="text-lg"
          @click="item.mandate !== undefined && item.mandate++"
        />
      </div>
    </div>
  </ACard>
</template>
