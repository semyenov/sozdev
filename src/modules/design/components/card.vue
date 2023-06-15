<script setup lang="ts">
import type { UIColorVariants, UIRoundedVariants } from '~/types/ui'

const props = withDefaults(defineProps<{
  color: UIColorVariants
  rounded: UIRoundedVariants
  dashed: boolean
}>(), {
  color: 'primary',
  rounded: 'md',
  dashed: false,
})
const slots = useSlots()
</script>

<template>
  <div
    class="component-card relative w-full flex flex-col border bg-white text-left shadow-xl shadow-opacity-30 divide-y dark:bg-gray-900 dark:shadow-opacity-30"
    :class="[
      props.color && `list-color__${props.color}`,
      props.rounded && `box-rounded__${props.rounded}`,
      props.dashed && `divide-dashed dashed`,
    ]"
  >
    <div
      v-if="slots.header"
      class="flex flex-grow flex-row items-center justify-between gap-1 text-base font-bold leading-snug"
      :class="[
        props.color && `box-color__${props.color}--3`,
        props.rounded && `list-rounded__${props.rounded}`,
        props.dashed && `border-dashed`,
      ]"
    >
      <slot name="header" />
    </div>
    <div
      v-if="slots.panel"
      class="flex flex-row border-b border-blue-300 bg-light-400 dark:bg-gray-800 dark:text-gray-300"
    >
      <slot name="panel" />
    </div>
    <div
      v-if="slots.default"
      class="flex flex-col items-stretch overflow-auto break-normal text-sm"
      :class="[
        props.color && `box-color__${props.color}--1`,
        props.rounded && `list-rounded__${props.rounded}`,
        props.dashed && `border-dashed`,
      ]"
    >
      <slot name="default" />
    </div>
    <div
      v-if="slots.footer"
      class="w-full flex flex-grow flex-row gap-1 text-sm"
      :class="[
        props.color && `box-color__${props.color}--2`,
        props.rounded && `list-rounded__${props.rounded}`,
        props.dashed && `border-dashed`,
      ]"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
