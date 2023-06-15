<script setup lang="ts">
import MapLibreGlDirections from '@maplibre/maplibre-gl-directions'
import maplibregl from 'maplibre-gl'

import type { MapOptions } from 'maplibre-gl'

const props = withDefaults(defineProps<{
  mapOptions?: Partial<MapOptions>
  workerCount?: number
}>(), {
  workerCount: 10,
})

const mapRef = shallowRef<HTMLElement | null>(null)

const maplibreMap = shallowRef<maplibregl.Map>()
const initialized = ref<boolean>(false)

const missingDefaultIds = ref<string[]>([])
const hoveredStateId = ref<string | number>('')

provide('map-key', maplibreMap)

onMounted(() => initializeMap())
onScopeDispose(() => maplibreMap.value?.remove())

function initializeMap() {
  if (process.server)
    return

  const mapOptions: MapOptions = {
    container: mapRef.value || 'map',
    style: '/map/styles/streets/style.json',
    maxZoom: 18,
    minZoom: 0,
    center: [37.61199474334717, 54.198741669025175],
    zoom: 14,
    attributionControl: false,
    trackResize: true,
    localIdeographFontFamily: '\'Noto Sans Regular\', \'Roboto Regular\'',
    ...props.mapOptions,
  }

  maplibregl.workerCount = props.workerCount
  const map = new maplibregl.Map(mapOptions)

  map.on('load', async () => {
    maplibreMap.value = map

    const directions = new MapLibreGlDirections(map, {
      api: 'http://localhost:5000/route/v1',
      profile: 'driving',
      requestOptions: {
        alternatives: 'true',
      },
    })

    directions.interactive = true
    initialized.value = true
  })

  map.on('styleimagemissing', (e) => {
    const id = e.id
    const regexpIcon = /^custom:([^/]+)/

    if (!regexpIcon.test(id)) {
      if (missingDefaultIds.value.includes(id))
        return
      missingDefaultIds.value.push(id)
      logger.info('missing default icon:', id)
      return
    }

    const image = map.getImage('custom:default/icon')
    if (image.data) {
      map.addImage(id, image.data)
      logger.success('edited icon:', id)
    }
  })

  map.on('mousemove', 'polygons', (e) => {
    map.getCanvas().style.cursor = 'pointer'

    if (!e.features || !e.features[0].id)
      return

    if (hoveredStateId.value !== e.features[0].id) {
      map.setFeatureState(
        { source: 'polygons-source-layer', id: hoveredStateId.value },
        { hover: false },
      )

      map.setFeatureState(
        { source: 'polygons-source-layer', id: e.features[0].id },
        { hover: true },
      )

      hoveredStateId.value = e.features[0].id
    }
  })

  map.on('mouseleave', 'polygons', (_e) => {
    if (hoveredStateId.value) {
      map.setFeatureState(
        { source: 'polygons-source-layer', id: hoveredStateId.value },
        { hover: false },
      )

      hoveredStateId.value = ''

      map.getCanvas().style.cursor = 'default'
    }
  })
}
</script>

<template>
  <div
    class="fixed left-0 top-0 h-full w-full flex flex-grow"
  >
    <div ref="mapRef" class="z-0 h-full w-full" />
    <slot v-if="initialized" />
  </div>
</template>
