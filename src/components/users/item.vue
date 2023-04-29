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

      x: (window.innerWidth - 400) / 2,
      y: (window.innerHeight - 600) / 2,
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
    class="cursor-pointer select-none shadow-none spacing-80 [&_.a-title]:leading-tight"
    :variant="winboxWindow ? 'fill' : 'light'"
    color="primary"
    :subtitle="item.email"
    @click="handleOpen"
  >
    <template #title>
      <div
        class="flex flex-grow"
      >
        {{ `# ${item.info.first_name} ${item.info.last_name}` }}
      </div>
    </template>
    <template v-if="winboxWindow" #header-right>
      <!-- Action buttons -->
      <div v-if="winboxWindow?.winbox" class="flex flex-wrap gap-x-4 gap-y-2">
        <ABtn
          color="info"
          variant="fill"
          icon="i-carbon:add"
          @click="item.mandate !== undefined && item.mandate++"
        >
          Mandate
        </ABtn>
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
