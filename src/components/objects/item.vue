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

function handleOpen() {
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
      class: ['wb-right'],
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
    class="cursor-pointer select-none shadow spacing-70 [&_.a-title]:leading-tight"
    :variant="winboxWindow ? 'fill' : 'light'"
    :title="`# ${item.info.name}`"
    :subtitle="item.info!.code"
    @click="handleOpen"
  >
    <template v-if="winboxWindow" #header-right>
      <!-- Action buttons -->
      <div v-if="winboxWindow?.winbox" class="flex flex-wrap gap-x-4 gap-y-2">
        <ABtn
          class="inline-flex text-xl"
          color="info"
          variant="light"
          icon="i-carbon:bring-to-front"
          icon-only
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
