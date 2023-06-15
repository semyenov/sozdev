<script setup lang="ts">
import maplibregl from 'maplibre-gl'

import type { TMapboxOverlay } from '../../types'

const maplibreMap = shallowRef<maplibregl.Map | null>(null)
let maplibreglPopup: maplibregl.Popup
let maplibreglMarker: maplibregl.Marker
let deckOverlay: TMapboxOverlay
const shouldLoaded = ref(false)

provide('mapLibreUniqueKey', maplibreMap)

onMounted(() => createMaplibeMap())
async function createMaplibeMap() {
  maplibregl.workerCount = 10

  const map = new maplibregl.Map({
    container: 'mapContainer',
    style: '/map/styles/streets/style.json',
    center: [37.61199474334717, 54.198741669025175],
    maxZoom: 18,
    minZoom: 0,
    zoom: 14,
    attributionControl: false,
    trackResize: true,
    localIdeographFontFamily: '\'Noto Sans Regular\', \'Roboto Regular\'',
  })
  map.on('load', () => {
    maplibreglMarker = new maplibregl.Marker({ scale: 0.5 })

    maplibreglPopup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'custom-popup',
    })

    maplibreMap.value = map
    nextTick().then(() => {
      shouldLoaded.value = true
    })
  })
}
</script>

<template>
  <div
    class="layout-default__map fixed left-0 top-0 h-full w-full flex flex-grow"
  >
    <div id="mapContainer" class="layout-default__map z-0 h-full w-full" />
    <template v-if="shouldLoaded">
      <MapLibreOldLayers />
      <MapLibreOldData />
    </template>
  </div>
</template>
