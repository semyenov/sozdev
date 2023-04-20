<script setup lang="ts">
import type {
  UIColorVariants,
  UIRoundedVariants,
  UISizeVariants,
} from '~/types/ui'

import type { PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  color: {
    type: String as PropType<UIColorVariants>,
    default: 'default',
  },
  size: {
    type: String as PropType<UISizeVariants>,
    default: 'md',
  },
  rounded: {
    type: String as PropType<UIRoundedVariants>,
    default: 'md',
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', val: string): void
}>()
const attrs = useAttrs()
const rootRef = ref<HTMLInputElement | null>(null)

defineExpose({
  rootRef,
})

const input = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <input
    v-bind="attrs"
    ref="rootRef"
    v-model="input"
    class="c-input flex flex-row items-center justify-center border outline-none transition-200"
    :class="[
      props.color
        && `box-color__${props.color}--2 focus:box-color__${props.color}--3`,
      props.size && `box-size__${props.size}`,
      props.rounded && `box-rounded__${props.rounded}`,
    ]"
  >
</template>
