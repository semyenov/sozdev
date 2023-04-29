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

      tether: ['bottom'],
      class: ['simple'],

      width: 500,
      height: 600,

      x: (window.innerWidth - 500) / 2,
      y: window.innerHeight - 600,
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
    class="cursor-pointer select-none shadow spacing-70 [&_.a-title]:leading-tight"
    :variant="winboxWindow ? 'fill' : 'light'"
    :title="`# ${item.info.first_name} ${item.info.last_name}`"
    :subtitle="item.email"
    @click="handleOpen"
  >
    <template v-if="winboxWindow" #header-right>
      <div v-if="winboxWindow?.winbox" class="flex flex-wrap gap-x-4 gap-y-2">
        <ABtn
          color="info"
          variant="light"
          icon="i-carbon:bring-to-front"
          icon-only
          class="text-xl"
          @click="item.mandate !== undefined && item.mandate++"
        />
      </div>
    </template>

    <!-- <div class="a-card-body a-card-spacer">
      <ATypography
        :text="[JSON.stringify(item, null, 2), 'text-xs']"
        @click="handleOpen"
      />
      <div v-if="winboxWindow?.winbox" class="flex flex-wrap gap-x-4 gap-y-2" />
    </div> -->
  </ACard>
</template>
