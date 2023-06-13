<script setup lang="ts">
import { layerEvents } from '../constants'
import { getLayerTemplate } from '../utils'

import type { TLayerOptions, TLayerTemplate } from '../types'
import type { Map, MapLayerMouseEvent, MapLayerTouchEvent } from 'maplibre-gl'
import type { ShallowRef } from 'nuxt/dist/app/compat/capi'

const props = withDefaults(defineProps<{
  layerTemplate?: TLayerTemplate
  layersOptions: TLayerOptions
}>(), {
})

// MapLayerTouchEvent
const emits = defineEmits<{
  (event: 'click', payload: MapLayerMouseEvent): void
  (event: 'dblclick', payload: MapLayerMouseEvent): void
  (event: 'mousedown', payload: MapLayerMouseEvent): void
  (event: 'mouseup', payload: MapLayerMouseEvent): void
  (event: 'mousemove', payload: MapLayerMouseEvent): void
  (event: 'mouseenter', payload: MapLayerMouseEvent): void
  (event: 'mouseleave', payload: MapLayerMouseEvent): void
  (event: 'mouseover', payload: MapLayerMouseEvent): void
  (event: 'mouseout', payload: MapLayerMouseEvent): void
  (event: 'contextmenu', payload: MapLayerMouseEvent): void
  (event: 'touchstart', payload: MapLayerTouchEvent): void
  (event: 'touchend', payload: MapLayerTouchEvent): void
  (event: 'touchcancel', payload: MapLayerTouchEvent): void
}>()

const map = inject('map-key') as ShallowRef<Map>
const layersOptions = Object.assign(getLayerTemplate(props.layerTemplate), props.layersOptions)

onMounted(() => initializeLayer())
function initializeLayer() {
  map.value.addLayer({ ...layersOptions })
  layerEvents.forEach(event =>
    map.value.on(event, props.layersOptions.id, e => emits(event as keyof typeof emits, e)),
  )
}
</script>

<template>
  <slot />
</template>
