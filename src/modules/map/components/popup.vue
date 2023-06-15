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
const disabledFlag = ref(true)
const showFlag = ref(false)
const initialized = ref(false)
const map: ShallowRef<maplibregl.Map> | undefined = inject('map-key')

defineExpose<{
  popup: ShallowRef<Popup | null>
  toggleVisibility: (shouldVisible: boolean) => void }>
    ({
      popup,
      toggleVisibility,
    })

// const slots = defineSlots()
onMounted(() => initializePopup())
onScopeDispose(() => popup.value?.remove())

function initializePopup() {
  if (!map)
    return

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
  disabledFlag.value = false
}
function toggleVisibility(flag: boolean) {
  if (!popup.value)
    return

  showFlag.value = flag

  if (flag) {
    popup.value.removeClassName('invisible')
    popup.value.addClassName('visible')

    return
  }

  popup.value.removeClassName('visible')
  popup.value.addClassName('invisible')
}
</script>

<template>
  <Teleport v-if="initialized" :disabled="disabledFlag" to=".custom-popup #teleport-popup">
    <slot :name="props.slotName || 'default'" />
  </Teleport>
</template>
