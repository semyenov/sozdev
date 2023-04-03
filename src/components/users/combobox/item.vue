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
</script>

<template>
  <div
    v-if="item"
    class="box-size__md flex flex-row cursor-pointer items-center text-left"
  >
    <i class="i-carbon:building inline-block" />
    {{ item.info.first_name }}
    {{ item.info.last_name }}
    <br>
    {{ item.email }}
  </div>
</template>
