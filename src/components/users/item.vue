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
    <ACard
      class="cursor-pointer select-none"
      :color="winboxWindow ? 'primary' : 'info'"
      :variant="winboxWindow ? 'fill' : 'light'"
      @click="handleClick()"
    >
      <template v-if="item" #title>
        <div class="w-full flex flex-row justify-between">
          {{ `# ${item.info.first_name} ${item.info.last_name}` }}
        </div>
      </template>
      <template v-if="item" #header-right>
        <div
          class="box-color__default--6 inline-flex items-center font-mono text-sm font-light"
        >
          {{ item.email }}
        </div>
      </template>
      <template v-if="item">
        <div class="px-4 leading-snug" :class="[winboxWindow ? 'pb-2' : 'pb-5']">
          {{ item }}
        </div>

        <div v-if="winboxWindow?.state" class="px-4 pb-5 pt-1.5">
          {{ winboxWindow?.state }}
        </div>
      </template>
    </ACard>
  </div>
</template>

<style lang="postcss">
.a-card-typography-wrapper {
  @apply !pb-2 pt-4;
}
</style>
