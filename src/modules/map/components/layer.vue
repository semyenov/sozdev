<script setup lang="ts">
import { layerEvents } from '../constants'
import { getLayerTemplate } from '../utils'

import type { TLayerEvent, TLayerOptions, TLayerPayload, TLayerTemplate } from '../types'
import type { Map } from 'maplibre-gl'
import type { ShallowRef } from 'nuxt/dist/app/compat/capi'

const props = withDefaults(defineProps<{
  layerTemplate?: TLayerTemplate
  layersOptions: TLayerOptions
}>(), {
})

const emits = defineEmits<{
  (event: TLayerEvent, payload: TLayerPayload<TLayerEvent>): void
}>()

const map = inject('map-key') as ShallowRef<Map>
const layersOptions = Object.assign(getLayerTemplate(props.layerTemplate), props.layersOptions)

onMounted(() => initializeLayer())
function initializeLayer() {
  map.value.addLayer({ ...layersOptions })
  layerEvents.forEach(event =>
    map.value.on(event, props.layersOptions.id, e => emits(event, e)),
  )
}
</script>

<template>
  <slot />
</template>
