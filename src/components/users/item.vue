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
      teleportId: 'teleport-layer--20',
      title: winboxTitle,
    },
    {
      name: 'LazyUsersDetailItem',
      props: {
        id: item.value._id,
      },
    }
  )
}
</script>

<template>
  <div class="component-user-item">
    <UiCard
      class="cursor-pointer select-none"
      dashed
      color="third"
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
