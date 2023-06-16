<script setup lang="ts">
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import maplibregl from 'maplibre-gl'
import MaplibreInspect from 'maplibre-gl-inspect'

import type { TMapboxDraw } from '../types'
import type { Map } from 'maplibre-gl'
import type { ShallowRef } from 'nuxt/dist/app/compat/capi'

// const props = withDefaults(defineProps<{
// }>(), {
// })

const map = inject('map-key') as ShallowRef<Map>
const initialized = shallowRef<boolean>(false)

onMounted(() => initializeLayer())
function initializeLayer() {
  map.value.addControl(
    new maplibregl.NavigationControl({
      showCompass: true,
      visualizePitch: true,
    }),
    'bottom-right',
  )

  map.value.addControl(
    new maplibregl.FullscreenControl({
      container: document.getElementById('mapContainer') || undefined,
    }),
    'bottom-right',
  )

  const drawControl = new MapboxDraw({
    controls: {
      point: true,
      line_string: true,
      combine_features: true,
      polygon: false,
      uncombine_features: false,
      trash: true,
    },
  }) as TMapboxDraw

  map.value.addControl(drawControl, 'bottom-right')

  map.value.addControl(new MaplibreInspect({
    showInspectMap: true,

    popup: new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
    }),
  }))
}
</script>

<template>
  <slot v-if="initialized" />
</template>
