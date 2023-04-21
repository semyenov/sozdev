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
  <AListItem
    v-if="item"
    :value="item._id"
  >
    <template #default>
      <i class="i-carbon:building inline-block" />
      <div
        class="box-size__md w-full flex flex-row cursor-pointer items-center text-left"
      >
        {{ item.info.first_name }}
        {{ item.info.last_name }}
        <br>
        {{ item.email }}
      </div>
    </template>
  </AListItem>
</template>
