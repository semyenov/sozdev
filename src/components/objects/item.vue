<script setup lang="ts">
import type { IObject } from '~/types'

const props = withDefaults(defineProps<{
  index: number
  item: IObject
}>(), {
  index: 0,
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
      class: [],

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
    class="cursor-pointer select-none text-sm shadow spacing-80"
    :variant="winboxWindow ? 'fill' : 'light'"
    :title="[`${item.info.name}`, 'mb-1 leading-tight']"
    :subtitle="item.info!.code"
    @click="handleOpen"
  >
    <template v-if="winboxWindow" #header-right>
      <!-- Action buttons -->
      <div
        v-if="winboxWindow?.winbox"
        class="ml-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 spacing-100"
      >
        <ABtn
          color="info"
          variant="light"
          icon="i-ph:cards"
          icon-only
          class="text-base"
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
