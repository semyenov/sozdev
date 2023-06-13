<script setup lang="ts">
import maplibregl from 'maplibre-gl'

import type { Popup } from 'maplibre-gl'
import type { ShallowRef } from 'vue'

// const props = withDefaults(defineProps<{
// }>(), {
//   popupId: 'map-popup',
// })

const popup = shallowRef<Popup | null>(null)
const initialized = shallowRef<boolean>(false)

defineExpose<{ popup: ShallowRef<Popup | null> }>({
  popup,
})

onMounted(() => initializeLayer())
function initializeLayer() {
  popup.value = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: 'custom-popup',
  })
  initialized.value = true
}
</script>

<template>
  <slot v-if="initialized" />
</template>
