import maplibregl from 'maplibre-gl'

import { initializeDataMap, initializeLayers } from '../utils'

import type { LngLatLike } from 'maplibre-gl'

const maplibreMap = shallowRef<maplibregl.Map | null>(null)
const maplibreglMarker = shallowRef<maplibregl.Marker | null>(null)
const maplibreglPopup = shallowRef<maplibregl.Popup | null>(null)
const isLoaded = shallowRef<boolean>(false)

const testRef = ref(null)

export function useMap() {
  return {
    initializeMap,
    setView,
    maplibreMap,
    isLoaded,
  }
}

function initializeMap(mapOptions: maplibregl.MapOptions) {
  if (maplibreMap.value || process.server)
    return

  maplibregl.workerCount = 10

  const map = new maplibregl.Map(mapOptions)

  map.on('load', async () => {
    maplibreglMarker.value = new maplibregl.Marker({ scale: 0.5 })

    maplibreglPopup.value = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'custom-popup',
    })

    maplibreMap.value = map
    // await nextTick()
    isLoaded.value = true

    initializeLayers(map)
    initializeDataMap(map, maplibreglPopup.value)
  })
}

function setView(position: LngLatLike, zoom?: number) {
  if (!maplibreMap.value)
    return
  if (!zoom)
    zoom = maplibreMap.value.getZoom()

  maplibreMap.value.easeTo({ center: position, zoom })
}
