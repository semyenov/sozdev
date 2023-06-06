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

const avatarText = computed(() => {
  return [item.value.info.first_name, item.value.info.last_name].map(str => str[0]).join('')
})

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
    class="cursor-pointer select-none text-sm spacing-80"
    :variant="winboxWindow ? 'fill' : 'light'"
    @click="handleOpen"
  >
    <div class="w-full flex flex-row a-card-body">
      <div class="flex flex-grow flex-row items-center gap-4">
        <div class="aspect-ratio-square flex items-center justify-center">
          <AAvatar :color="stringToColor(item._id)" class="text-xl spacing-100">
            {{ avatarText }}
          </AAvatar>
        </div>
        <ATypography
          class="flex-grow"
          :title="[`${item.info.first_name} ${item.info.last_name}`, 'mb-1 leading-tight']"
          :subtitle="[item.email, 'break-all']"
        />
      </div>
      <div v-if="winboxWindow?.winbox" class="ml-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 spacing-100">
        <ABtn
          color="info"
          variant="light"
          icon="i-carbon:data-refinery-reference"
          icon-only
          class="text"
          @click="item.mandate !== undefined && item.mandate++"
        />
      </div>
    </div>
  </ACard>
</template>
