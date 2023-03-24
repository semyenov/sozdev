<script setup lang="ts">
import type { PropType } from 'vue'

import type { IObject } from '~/types'

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

function handleClick() {
  winboxWindows.value.set(winboxId, {
    params: {
      id: winboxId,
      teleportId: 'teleport-layer--20',
      title: winboxTitle,
      runtime: true,
    },
    component: {
      name: 'ObjectsDetailItem',
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

// const { isOpen, toggleWinbox, windowParams } = useWinbox(winboxProps)
</script>

<template>
  <div class="component-object-item">
    <UiCard dashed class="cursor-pointer select-none" @click="handleClick">
      <template v-if="item" #header>
        <div class="flex flex-row w-full justify-between px-4 py-2">
          {{ `# ${item.info.name}` }}
        </div>
      </template>
      <template #footer>
        <!-- <div class="px-4 py-1.5">
          {{ item._id }}<br />
          isOpen: {{ isOpen }} <br />
          {{ windowParams?.active || false }}
        </div> -->
      </template>
    </UiCard>
  </div>
</template>
