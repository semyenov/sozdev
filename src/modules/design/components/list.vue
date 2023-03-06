<script setup lang="ts">
import type { UIColorVariants, UISizeVariants } from '~/types/ui'
const props = defineProps({
  color: {
    type: String as PropType<UIColorVariants>,
    default: 'primary',
  },
  size: {
    type: String as PropType<UISizeVariants>,
    default: 'md',
  },
  items: {
    type: Array as PropType<unknown[]>,
    required: true,
  },
})
</script>

<template>
  <div
    class="relative w-full w-full flex flex-col border text-left divide-y dark:bg-gray-900 component-list rounded-lg"
    :class="[props.color && `list-color__${props.color}`]"
  >
    <div
      v-for="(item, index) of props.items"
      :key="index"
      :class="[
        props.color && `box-color__${props.color}--2`,
        props.size && `box-size__${props.size}`,
      ]"
    >
      <slot :item="item"></slot>
    </div>
  </div>
</template>
