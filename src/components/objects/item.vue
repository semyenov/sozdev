<script setup lang="ts">
import type { PropType } from 'vue'

import type { IObject } from '~/types'
import type { IWinboxComposeProps } from '~/types/winbox'

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

const componentKey = `winbox-detail-${item.value._id}`

const winboxProps: IWinboxComposeProps = {
  components: {
    name: 'UiWinboxTest',
    id: componentKey,
    slot: { name: 'ObjectsDetailItem' },
  },
  params: {
    title: winboxTitle,
  },
  itemId: item.value._id,
}

const { isOpen, toggleWinbox, windowParams } = useWinbox(winboxProps)
</script>

<template>
  <div class="component-object-item">
    <UiCard
      dashed
      :color="isOpen ? 'fourth' : 'secondary'"
      class="cursor-pointer select-none"
      @click="toggleWinbox"
    >
      <template v-if="item" #header>
        <div class="flex flex-row w-full justify-between px-4 py-2">
          {{ `# ${item.info.name}` }}
        </div>
      </template>
      <template #footer>
        <div class="px-4 py-1.5">
          {{ item._id }}<br />
          isOpen: {{ isOpen }} <br />
          {{ windowParams?.active || false }}
        </div>
      </template>
    </UiCard>
  </div>
</template>
