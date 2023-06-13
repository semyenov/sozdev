<script setup lang="ts">
import maplibregl from 'maplibre-gl'

import type { MapOptions } from 'maplibre-gl'

const props = withDefaults(defineProps<{
  mapOptions: Partial<MapOptions> & {
    container: string
  }
  workerCount?: number
}>(), {
  // mapOptions: () => ({
  //   container: 'mapContainer',
  //   style: '/map/styles/streets/style.json',
  //   maxZoom: 18,
  //   minZoom: 0,
  //   center: [37.61199474334717, 54.198741669025175],
  //   zoom: 14,
  //   attributionControl: false,
  //   trackResize: true,
  //   localIdeographFontFamily: '\'Noto Sans Regular\', \'Roboto Regular\'',
  // }),
  workerCount: 10,
})

// const emits = defineEmits<{
//   (e: keyof maplibregl.MapEventType, mapEvent: maplibregl.MapEvent): void
// }>()

const maplibreMap = shallowRef<maplibregl.Map>()
const initialized = shallowRef<boolean>(false)

const missingDefaultIds = shallowRef<string[]>([])

const hoveredStateId = ref<string | number>('')

provide('map-key', maplibreMap)

const mapOptions = Object.assign({
  container: 'mapContainer',
  style: '/map/styles/streets/style.json',
  maxZoom: 18,
  minZoom: 0,
  center: [37.61199474334717, 54.198741669025175],
  zoom: 14,
  attributionControl: false,
  trackResize: true,
  localIdeographFontFamily: '\'Noto Sans Regular\', \'Roboto Regular\'',
} as MapOptions, props.mapOptions)

onMounted(() => initializeMap())
onScopeDispose(() => maplibreMap.value?.remove())
function initializeMap() {
  if (process.server)
    return

  maplibregl.workerCount = props.workerCount

  const map = new maplibregl.Map(mapOptions)

  map.on('load', async () => {
    // mapEvents.forEach(event => map.on(event, e => emits(event, e)))
    maplibreMap.value = map
    initialized.value = true

    map.on('styleimagemissing', (e) => {
      const id = e.id
      const regexpIcon = /^custom:([^/]+)/

      if (!regexpIcon.test(id) && !missingDefaultIds.value.includes(id)) {
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

      // Do nothing if the feature has not changed
      if (hoveredStateId.value === e.features[0].id)
        return

      // Change hover state prev feature
      map.setFeatureState(
        { source: 'polygons-source-layer', id: hoveredStateId.value },
        { hover: false },
      )

      // Change hover state on current feature
      map.setFeatureState(
        { source: 'polygons-source-layer', id: e.features[0].id },
        { hover: true },
      )

      hoveredStateId.value = e.features[0].id
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
  })
}
</script>

<template>
  <div
    class="layout-default__map fixed left-0 top-0 h-full w-full flex flex-grow"
  >
    <div :id="props.mapOptions.container" class="layout-default__map z-0 h-full w-full" />
    <slot v-if="initialized" />
  </div>
</template>
