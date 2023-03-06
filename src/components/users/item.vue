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

const [showFlag, showToggle] = useToggle(false)
const item = toRef(props, 'item')

function handleChange(event: Event) {
  event.preventDefault()

  item.value.mandate =
    item.value.mandate !== undefined ? item.value.mandate + 1 : 0
}
</script>

<template>
  <div class="component-user-item">
    <UiCard
      :color="showFlag ? 'third' : 'default'"
      class="cursor-pointer select-none"
      dashed
      @click="showToggle()"
    >
      <template v-if="item" #header>
        <div class="w-full flex flex-row justify-between px-4 py-2">
          {{ `# ${item.info.first_name} ${item.info.last_name}` }}
          <div
            class="inline-flex border text-sm box-rounded__sm px-2 font-mono font-light box-color__default--6"
            @click="handleChange"
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

    <UiWinbox
      v-model:show="showFlag"
      teleport-id="teleport-layer--20"
      :params="{
        title: `${item.info.first_name} ${item.info.last_name}`,
        top: 0,
        bottom: 0,
        left: 44,
        right: 0,
        border: 0,
        width: 550,
        height: '100%',
        minwidth: 500,
        class: ['simple', 'wb-right', 'border-r-none'],
        tether: ['right', 'top', 'bottom'],
      }"
    >
      <pre class="p-6 text-sm">{{ item }}</pre>
    </UiWinbox>
  </div>
</template>
