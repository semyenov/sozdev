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
</script>

<template>
  <div
    v-if="item"
    class="flex-row items-center flex cursor-pointer text-left box-size__md"
  >
    <i class="i-carbon:building inline-block" />
    {{ item.info.name }}
  </div>
</template>
