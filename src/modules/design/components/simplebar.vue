<script setup lang="ts">
import Simplebar from 'simplebar-core'

const props = defineProps({
  scrollbarMaxSize: {
    type: Number,
  },
  scrollbarMinSize: {
    type: Number,
  },
})

const emits = defineEmits<{
  (event: 'scroll', e: UIEvent): void
}>()

const sb = ref<Simplebar>()

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)

defineExpose({
  sb,

  rootRef,
  scrollRef,
})

onMounted(() => {
  sb.value = new Simplebar(rootRef.value!, {
    ...Simplebar.defaultOptions,
    ...props,
  })
})
</script>

<template>
  <div ref="rootRef" data-simplebar="init">
    <div class="simplebar-wrapper">
      <div class="simplebar-height-auto-observer-wrapper">
        <div class="simplebar-height-auto-observer" />
      </div>
      <div class="simplebar-mask">
        <div class="simplebar-offset">
          <div ref="scrollRef" class="simplebar-content-wrapper" @scroll="e => emits('scroll', e)">
            <div class="simplebar-content">
              <slot />
            </div>
          </div>
        </div>
      </div>
      <div class="simplebar-placeholder" />
    </div>
    <div class="simplebar-track simplebar-horizontal">
      <div class="simplebar-scrollbar" />
    </div>
    <div class="simplebar-track simplebar-vertical">
      <div class="simplebar-scrollbar" />
    </div>
  </div>
</template>
