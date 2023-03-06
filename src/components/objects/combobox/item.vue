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
</script>

<template>
  <div
    v-if="item"
    class="flex-row items-center box-size__md flex cursor-pointer text-left"
  >
    <i class="i-carbon:building inline-block" />
    {{ item.info.name }}
  </div>
</template>
