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

      tether: [],
      class: ['simple'],

      width: 400,
      height: 600,

      x: window.innerWidth - 400,
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

// function handleClose() {
//   const w = winboxWindow.value
//   if (w?.winbox)
//     w.winbox.close()
// }
</script>

<template>
  <ACard
    class="cursor-pointer select-none spacing-70 [&_.a-title]:leading-tight"
    :variant="winboxWindow ? 'fill' : 'light'"
    @click="handleOpen"
  >
    <div class="w-full flex flex-row a-card-body">
      <div class="flex flex-grow flex-row items-center flex-gap-4">
        <AAvatar color="primary" class="text-xl spacing-100">
          {{ [item.info.first_name, item.info.last_name].map((str) => str[0]).join("") }}
        </AAvatar>
        <ATypography
          :title="`${item.info.first_name} ${item.info.last_name}`"
          :subtitle="item.email"
        />
      </div>
      <div v-if="winboxWindow?.winbox" class="flex flex-shrink flex-wrap justify-center gap-x-4 gap-y-2 spacing-100">
        <ABtn
          color="info"
          variant="light"
          icon="i-carbon:bring-to-front"
          icon-only
          class="text"
          @click="item.mandate !== undefined && item.mandate++"
        />
      </div>
    </div>
  </ACard>
</template>
