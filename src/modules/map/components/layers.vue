<script setup lang="ts">
import maplibregl from 'maplibre-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

import type { TMapboxDraw, TMapboxOverlay } from '../types'
import type { ShallowRef } from 'nuxt/dist/app/compat/capi'

const maplibreglMap = shallowRef<maplibregl.Map | null>()
let maplibreglPopup: maplibregl.Popup
let maplibreglMarker: maplibregl.Marker
let deckOverlay: TMapboxOverlay

const testMap = inject<ShallowRef<maplibregl.Map>>('mapLibreUniqueKey') as ShallowRef<maplibregl.Map>

onMounted(() => onReadyMap(testMap.value))
async function onReadyMap(map: maplibregl.Map) {
  map.addControl(
    new maplibregl.NavigationControl({
      showCompass: true,
      visualizePitch: true,
    }),
    'bottom-right',
  )

  map.addControl(
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

  map.addControl(drawControl, 'bottom-right')

  maplibreglMarker = new maplibregl.Marker({ scale: 0.5 })

  maplibreglPopup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: 'custom-popup',
  })

  map.addSource('objects-source-layer', {
    type: 'geojson',
    data: null,

    promoteId: 'id',
    cluster: true,
    clusterMaxZoom: 18,
    clusterRadius: 30,
    clusterMinPoints: 2,

    clusterProperties: {
      icons: [
        ['let', 'find', ['index-of', ['get', 'icon'], ['accumulated']],
          ['case',
            ['==', ['index-of', ':', ['accumulated']], -1],
            ['case',
              ['==', ['accumulated'], ['get', 'icon']],
              ['concat', ['accumulated'], ['concat', ['literal', ':'], ['get', 'icon']]],
              ['accumulated'],
            ],
            ['==', ['var', 'find'], -1],
            ['concat', ['accumulated'], ['concat', ['literal', ':'], ['get', 'icon']]],
            ['get', 'icon'],
          ],
        ],
        ['get', 'icon'],
      ],
    },
  })

  map.addSource('objects-source-uncluster', {
    type: 'geojson',
    data: null,
    promoteId: 'id',
  })

  map.addSource('objects-source-uncluster-lines', {
    type: 'geojson',
    data: null,
    promoteId: 'id',
  })
  console.log('init layers')

  map.addLayer({
    id: 'objects',
    type: 'symbol',
    source: 'objects-source-layer',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'icon-opacity': ['case', ['boolean', ['feature-state', 'hidden'], false], 0, 1],
      'text-opacity': ['case', ['boolean', ['feature-state', 'hidden'], false], 0, 0.7],
      'text-color': '#404040',
    },
    layout: {
      'symbol-placement': 'point',
      'symbol-avoid-edges': true,
      'icon-image': 'custom:{icon}',
      'icon-anchor': 'bottom',
      'icon-size': 0.5,
      'icon-allow-overlap': true,
      'icon-pitch-alignment': 'viewport',
      'icon-rotation-alignment': 'viewport',
      'icon-ignore-placement': true,
      'icon-overlap': 'always',
      'text-field': ['get', 'label'],
      'text-padding': 4,
      'text-optional': true,
      'text-font': ['Noto Sans Bold'],
      'text-transform': 'uppercase',
      'text-pitch-alignment': 'viewport',
      'text-ignore-placement': false,
      'text-size': 10,
      'text-offset': [0, 1],
      'text-anchor': 'top',
      'text-overlap': 'never',
    },
  })

  map.addLayer({
    id: 'lines-uncluster',
    source: 'objects-source-uncluster-lines',
    type: 'line',

    layout: {
      'line-cap': 'round',
      'line-join': 'round',

    },
    paint: {
      'line-color': '#51bbd6',
      'line-width': 2,
      'line-opacity': 0.5,
    },
  })

  map.addLayer({
    id: 'objects-uncluster',
    source: 'objects-source-uncluster',
    type: 'symbol',
    paint: {
      'text-opacity': 0.7,
      'text-color': '#404040',
    },
    layout: {
      'symbol-placement': 'point',
      'symbol-avoid-edges': true,
      'icon-image': 'custom:tero/18_tero',
      'icon-anchor': 'bottom',
      'icon-size': 0.5,
      'icon-pitch-alignment': 'viewport',
      'icon-rotation-alignment': 'viewport',
      'icon-ignore-placement': true,
      'icon-overlap': 'always',
      'icon-allow-overlap': true,
      'text-field': ['get', 'label'],
      'text-padding': 4,
      'text-optional': true,
      'text-font': ['Noto Sans Bold'],
      'text-transform': 'uppercase',
      'text-pitch-alignment': 'viewport',
      'text-ignore-placement': false,
      'text-size': 10,
      'text-offset': [0, 1],
      'text-anchor': 'top',
      'text-overlap': 'never',

    },
  })

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'objects-source-layer',
    filter: ['has', 'point_count'],
    paint: {
      'circle-blur': 0.1,
      'circle-opacity': 0.7,
      'circle-pitch-scale': 'viewport',
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        100,
        '#f1f075',
        750,
        '#f28cb1',
      ],
      'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
    },
  })

  map.addLayer({
    id: 'cluster-counts',
    type: 'symbol',
    source: 'objects-source-layer',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': ['Noto Sans Regular'],
      'text-size': 12,
      'text-rotate': 0,
      'text-overlap': 'always',
    },
  })
}
</script>

<template>
  <div />
</template>
