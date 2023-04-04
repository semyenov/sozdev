<script setup lang="ts">
import type {
  UIColorVariants,
  UIRoundedVariants,
  UISizeVariants,
} from '~/types/ui'

const props = defineProps({
  items: {
    type: Array as PropType<unknown[]>,
    required: true,
  },

  color: {
    type: String as PropType<UIColorVariants>,
    default: 'primary',
  },
  size: {
    type: String as PropType<UISizeVariants>,
    default: 'md',
  },
  rounded: {
    type: String as PropType<UIRoundedVariants>,
    default: 'md',
  },
  dashed: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div
    class="relative w-full flex flex-col border text-left divide-y dark:bg-gray-900 component-list rounded-lg"
    :class="[
      props.color && `list-color__${props.color}`,
      props.rounded && `box-rounded__${props.rounded}`,
      props.dashed && `divide-dashed dashed`,
    ]"
  >
    <div
      v-for="(item, index) of props.items"
      :key="index"
      class="box-border"
      :class="[
        props.color && `box-color__${props.color}--2`,
        props.size && `box-size__${props.size}`,
        props.rounded && `list-rounded__${props.rounded}`,
        props.dashed && `border-dashed`,
      ]"
    >
      <slot :item="item" />
    </div>
  </div>
</template>
