<script setup lang="ts">
import type { PropType } from 'vue'

import type { IUser } from '~/types'

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

function handleClick() {
  winboxWindows.value.set(winboxId, {
    params: {
      id: winboxId,
      teleportId: 'teleport-layer--20',
      title: winboxTitle,
      runtime: true,
    },
    component: {
      name: 'UsersDetailItem',
      props: {
        id: item.value._id,
      },
    },
    state: {
      x: 44,
      y: 0,
      width: 550,
      height: 787,
      minimized: false,
      fullscreen: false,
      maximized: false,
      active: false,
    },
  })
}
</script>

<template>
  <div class="component-user-item">
    <UiCard
      class="cursor-pointer select-none"
      dashed
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
      <template #footer>
        <div class="px-4 py-1.5">
          {{ item._id }}
        </div>
      </template>
    </UiCard>
  </div>
</template>
