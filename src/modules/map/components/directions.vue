<script setup lang="ts">
import MapLibreGlDirections from '@maplibre/maplibre-gl-directions'

import type { ShallowRef } from 'vue'

const map = inject('map-key') as ShallowRef<maplibregl.Map>

const directionsRef = shallowRef<MapLibreGlDirections | null>(null)

onMounted(() => initializeDirections())

function initializeDirections() {
  const directions = new MapLibreGlDirections(map.value, {
    api: 'http://localhost:5000/route/v1',
    profile: 'driving',
    requestOptions: {
      alternatives: 'true',
    },
    sourceName: 'source-directions',
  })
  directions.interactive = true
  directionsRef.value = directions
}

function clear() {
  directionsRef.value?.clear()
}
</script>

<template>
  <div class="panel absolute right-0 top-20">
    <ABtn @click="clear">
      Clear
    </ABtn>
  </div>
  <slot />
</template>
