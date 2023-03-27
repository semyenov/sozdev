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

const { window, open } = useWinbox(winboxId)

function handleClick() {
  if (window.value && window.value.winbox) {
    if (window.value.state?.minimized) {
      window.value.winbox.minimize(false).focus()
      return
    }

    window.value.winbox.close()
    return
  }

  open(
    {
      id: winboxId,
      title: winboxTitle,
      teleportId: 'teleport-layer--20',
    },
    {
      name: 'LazyObjectsDetailItem',
      props: {
        id: item.value._id,
      },
    }
  )
}
</script>

<template>
  <div class="component-object-item">
    <UiCard dashed class="cursor-pointer select-none" @click="handleClick">
      <template v-if="item" #header>
        <div class="flex flex-row w-full justify-between px-4 py-2">
          {{ `# ${item.info.name}` }}
        </div>
      </template>
      <template v-if="item">
        <div class="p-4">
          {{ item }}
        </div>
      </template>
      <template v-if="window" #footer>
        <div v-if="window?.state" class="px-4 py-1.5">
          {{ window?.state }}
        </div>
      </template>
    </UiCard>
  </div>
</template>
