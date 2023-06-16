<script setup lang="ts">
import maplibregl from 'maplibre-gl'

import type { Popup } from 'maplibre-gl'
import type { ShallowRef } from 'vue'

const props = withDefaults(defineProps<{
  slotName?: string
}>(), {
  slotName: 'default',
})

const popup = shallowRef<Popup | null>(null)
const showFlag = shallowRef<boolean>(false)
const disabled = ref(true)
const initialized = shallowRef<boolean>(false)
const map = inject('map-key') as ShallowRef<maplibregl.Map>

defineExpose<{
  popup: ShallowRef<Popup | null>
  setViewPopup: (shouldVisible: boolean) => void }>
    ({
      popup,
      setViewPopup,
    })

onMounted(() => initializePopup())

function initializePopup() {
  popup.value = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: 'custom-popup invisible',
  })
  popup.value
    .setLngLat([-96, 37.8])
    .setHTML('<div id="teleport-popup"></div>')
    .addTo(map.value)
    .trackPointer()

  initialized.value = true
  disabled.value = false
}
function setViewPopup(shouldVisible: boolean) {
  if (!popup.value)
    return
  showFlag.value = shouldVisible
  if (shouldVisible) {
    popup.value.removeClassName('invisible')
    popup.value.addClassName('visible')
    return
  }
  popup.value.removeClassName('visible')
  popup.value.addClassName('invisible')
}
</script>

<template>
  <Teleport v-if="initialized" :disabled="disabled" to=".custom-popup #teleport-popup">
    <slot :name="props.slotName || 'default'" />
    <!-- <slot name="objects" /> -->
    <!-- <slot /> -->
    <!-- test-teleport -->
  </Teleport>
</template>

<style lang="postcss">
/* .custom-popup {
  @apply
} */
</style>
