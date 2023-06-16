<script setup lang="ts">
import MapLibreGlDirections, { LoadingIndicatorControl, layersFactory } from '@maplibre/maplibre-gl-directions'

import type { ControlPosition } from 'maplibre-gl'
import type { ShallowRef } from 'vue'

const props = withDefaults(defineProps<{
  positionLoadingControl?: ControlPosition
}>(), {
  positionLoadingControl: 'bottom-right',
})

const map = inject('map-key') as ShallowRef<maplibregl.Map>

const directionsRef = shallowRef<MapLibreGlDirections | null>(null)
const control = ref<LoadingIndicatorControl | null>(null)

const totalDistance = ref(0)
const distanceUnit = ref('m')

onMounted(() => initializeDirections())

function initializeDirections() {
  const layers = layersFactory()
  // add a direction arrow layer
  layers.push({
    id: 'maplibre-gl-directions-routeline-direction-arrow',
    type: 'symbol',
    source: 'maplibre-gl-directions',
    layout: {
      'symbol-placement': 'line-center',
      'icon-image': 'custom:default/MaterialSymbolsLineEndArrowRounded',
      'icon-size': ['interpolate', ['exponential', 1.5], ['zoom'], 12, 0.85, 18, 1.4],
    },
    paint: {
      'icon-opacity': 0.9,
    },
    filter: ['==', ['get', 'route'], 'SELECTED'],
  },
  {
    id: 'maplibre-gl-directions-waypoint-label',
    type: 'symbol',
    source: 'maplibre-gl-directions',
    layout: {
      'text-field': [
        'case',
        ['==', ['get', 'category'], 'ORIGIN'],
        'A',
        ['==', ['get', 'category'], 'DESTINATION'],
        'B',
        '',
      ],
      'text-font': ['Noto Sans Bold'],
    },
    paint: {
      'text-color': '#ffffff',
      'text-opacity': 0.7,
    },
    filter: [
      'all',
      ['==', ['geometry-type'], 'Point'],
      ['==', ['get', 'type'], 'WAYPOINT'],
      ['in', ['get', 'category'], ['literal', ['ORIGIN', 'DESTINATION']]],
    ],
  })

  const directions = new MapLibreGlDirections(map.value, {
    api: 'http://localhost:5000/route/v1',
    profile: 'driving',
    requestOptions: {
      alternatives: 'true',
    },
    layers,
  })

  directions.interactive = true
  directionsRef.value = directions

  if (control.value && map.value.hasControl(control.value))
    map.value.removeControl(control.value)
  map.value.addControl((control.value = new LoadingIndicatorControl(directions, { class: 'm-2' })), props.positionLoadingControl)

  directions.on('fetchroutesend', (ev) => {
    let distance = Math.floor(ev.data?.routes[0].distance as number || 0)
    let unit = 'm'
    if (distance > 1000) {
      distance = Math.floor(distance / 1000 * 100) / 100
      unit = 'km'
    }
    distanceUnit.value = unit
    totalDistance.value = distance
  })

  directions.on('removewaypoint', () => {
    if (directions.waypoints.length < 2)
      totalDistance.value = 0
  })
}

function clear() {
  directionsRef.value?.clear()
  totalDistance.value = 0
}
</script>

<template>
  <div class="panel absolute right-2 top-16">
    <ACard variant="fill" class="relative flex flex-col bg-blue-100 px-3 py-3">
      <AChip class="mb-2 text-dark">
        distance: {{ totalDistance }} {{ distanceUnit }}
      </AChip>
      <ABtn @click="clear">
        Clear
      </ABtn>
    </ACard>
  </div>
  <slot />
</template>
