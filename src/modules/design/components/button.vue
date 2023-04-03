<script setup lang="ts">
import type { PropType } from 'vue'
import type {
  UIColorVariants,
  UIRoundedVariants,
  UISizeVariants,
} from '~/types/ui'

const props = defineProps({
  color: {
    type: String as PropType<UIColorVariants>,
    default: 'gray',
  },
  size: {
    type: String as PropType<UISizeVariants>,
    default: 'md',
  },
  rounded: {
    type: String as PropType<UIRoundedVariants>,
    default: 'md',
  },
  outline: {
    type: Boolean,
    default: false,
  },
  border: {
    type: Boolean,
    default: true,
  },
})
// const {t} = useI18n()
</script>

<template>
  <button
    class="flex flex-row items-center justify-center flex-shrink-0 transition-200"
    :class="[
      props.size && `box-size__${props.size}`,
      props.rounded && `box-rounded__${props.rounded}`,
      props.outline
        ? `box-color__${props.color}--2 hover:box-color__${props.color}--4`
        : `box-color__${props.color}--5 hover:box-color__${props.color}--6`,
      props.border && `border`,
    ]"
  >
    <slot name="default" />
  </button>
</template>
