<script setup lang="ts">
import maplibregl from 'maplibre-gl'
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox/typed'
import { ArcLayer } from '@deck.gl/layers/typed'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { clamp } from '@antfu/utils'

import type { IMove } from '~/types'

import type { LngLatLike } from 'maplibre-gl'
import type { TMapboxDraw, TMapboxOverlay } from '../types'
import type { Feature, FeatureCollection, Point } from 'geojson'

const objectsStore = useObjectsStore()
const movesStore = useMovesStore()
const objectTypesStore = useObjectTypesStore()

const objectsIds = await objectsStore.itemsGetter
const objectTypesIds = await objectTypesStore.itemsGetter
const objectTypes = await objectTypesStore.itemsGetterByIds(objectTypesIds.value)
const objects = await objectsStore.itemsGetterByIds(objectsIds.value)
const movesId = await movesStore.itemsGetter
const moves = await movesStore.itemsGetterByIds(movesId.value)

const moveFilter = ref<string>('')
const hoveredStateId = ref<string | number>('')

const objectsFeatures = computed<
  FeatureCollection<Point, { id: string; label: string }>
>(() => {
  const features = objects.value.map(object =>
    Object.assign(object.feature, {
      properties: { id: object._id, label: object.info.name, type: object.type, icon: objectTypes.value.find(item => item._id === object.type)?.icon },
    }),
  )
  logger.log(features)

  return {
    type: 'FeatureCollection',
    features,
  }
})

const movesFiltered = computed<IMove[]>(() => {
  if (!moveFilter.value)
    return moves.value

  return moves.value.filter(move => move._id === moveFilter.value)
})

let maplibreglMap: maplibregl.Map
let maplibreglPopup: maplibregl.Popup
let maplibreglMarker: maplibregl.Marker
let deckOverlay: TMapboxOverlay

onMounted(createMaplibreglMap)

// // Objects reposition test
// const backendStore = useBackendStore()
// function handleClick() {
//   const objectsStoreMap = backendStore.store.get(IMetaScope.OBJECTS)
//   if (!objectsStoreMap)
//     return

//   backendStore.setStoreItems(
//     IMetaScope.OBJECTS,
//     objectsIds.value.filter(() => Math.random() > 0.5).map((id) => {
//       const object = objectsStoreMap.get(id) as IObject

//       object.feature.geometry.coordinates = [
//         object.feature.geometry.coordinates[0] + (Math.random() - 0.5),
//         object.feature.geometry.coordinates[1] + (Math.random() - 0.5),
//       ]

//       return object
//     }),
//   )
// }
// setInterval(handleClick, 5000)

async function createMaplibreglMap() {
  maplibregl.workerCount = 10

  maplibreglMap = new maplibregl.Map({
    container: 'mapContainer',
    style: '/map/styles/streets/style.json',
    center: [37.618399, 54.20877], // starting position [lng, lat]
    maxZoom: 18,
    minZoom: 0,
    zoom: 10,
    attributionControl: false,
    trackResize: true,
    localIdeographFontFamily: '\'Noto Sans Regular\', \'Roboto Regular\'',
  })
  // maplibreglMap.setStyle()

  maplibreglMap.addControl(
    new maplibregl.NavigationControl({
      showCompass: true,
      visualizePitch: true,
    }),
    'bottom-right',
  )

  maplibreglMap.addControl(
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

  maplibreglMap.addControl(drawControl, 'bottom-right')

  maplibreglMarker = new maplibregl.Marker({ scale: 0.5 })

  maplibreglPopup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: 'custom-popup',
  })

  maplibreglMap.on('load', async () => {
    maplibreglMap.addSource('objects-source-layer', {
      type: 'geojson',
      data: null,

      generateId: true,
      cluster: true,
      clusterMaxZoom: 18, // Max zoom to cluster points on
      clusterRadius: 40, // Max zoom to cluster points on
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
      // clusterProperties: objectTypesIds.value.reduce((sum, cur) => Object.assign(sum, { [cur]: ['+', ['case', ['==', ['get', 'type'], cur], 1, 0]] }), {}),
    })

    maplibreglMap.addLayer({
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

    maplibreglMap.addLayer({
      id: 'cluster-counts',
      type: 'symbol',
      source: 'objects-source-layer',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['Noto Sans Regular'],
        'text-size': 12,
        'text-rotate': 0,
      },
    })

    maplibreglMap.addLayer({
      id: 'objects',
      type: 'symbol',
      source: 'objects-source-layer',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'symbol-placement': 'point',
        'symbol-avoid-edges': true,
        'icon-image': ['get', 'icon'],
        'icon-anchor': 'bottom',
        'icon-size': 0.5,
        'icon-allow-overlap': true,
        'icon-pitch-alignment': 'viewport',
        'icon-rotation-alignment': 'viewport',
        'icon-ignore-placement': true,
        'icon-overlap': 'never',
      },
    })

    maplibreglMap.addLayer({
      id: 'objects-labels',
      type: 'symbol',
      source: 'objects-source-layer',
      paint: {
        'text-opacity': 0.7,
        'text-color': '#404040',
      },
      filter: ['!', ['has', 'point_count']],
      layout: {
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

    deckOverlay = new DeckOverlay({ effects: [] }) as TMapboxOverlay
    maplibreglMap.addControl(deckOverlay)

    maplibreglMap.on('mouseenter', 'objects', (e) => {
      maplibreglMap.getCanvas().style.cursor = 'pointer'

      const feature = e.features![0] as Feature<
        Point,
        { id: string; label: string }
      >
      maplibreglPopup
        .setLngLat(e.lngLat)
        .setHTML(getObjectTooltip(feature.properties.label))
        .trackPointer()
        .addTo(maplibreglMap)
    })

    maplibreglMap.on('mouseleave', 'objects', (_e) => {
      maplibreglMap.getCanvas().style.cursor = 'default'
      maplibreglPopup.remove()
    })

    maplibreglMap.on('click', 'objects', (e) => {
      const feature = e.features![0] as Feature<
        Point,
        { id: string; label: string }
      >
      const winboxId = `winbox-detail-${feature.properties.id}`
      const winboxTitle = feature.properties.label

      const { createWindow } = useWinbox(winboxId)

      createWindow({
        title: winboxTitle,
        teleportId: 'teleport-layer--20',

        dataComponent: 'WinboxObjectsDetailItem',
        dataProps: {
          id: feature.properties.id,
        },

        tether: ['top', 'right', 'bottom'],
        class: [],

        top: 44,
        bottom: -1,
        left: 44,
        right: -1,
      })
    })

    maplibreglMap.on('click', 'clusters', (e) => {
      const features = maplibreglMap.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      })
      logger.info('cluster:click', features, e.features)

      const clusterId = features[0].properties.cluster_id
      const source = maplibreglMap.getSource(
        'objects-source-layer',
      ) as maplibregl.GeoJSONSource

      if (!source)
        return

      // logger.info(source)

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || !zoom)
          return

        if (features[0].geometry.type === 'Point') {
          maplibreglMap.easeTo({
            center: features[0].geometry.coordinates as LngLatLike,
            zoom: clamp(
              zoom + 2,
              maplibreglMap.getMinZoom(),
              maplibreglMap.getMaxZoom(),
            ),
          })
        }
      })
    })

    maplibreglMap.on('mouseenter', 'clusters', () => {
      maplibreglMap.getCanvas().style.cursor = 'pointer'
    })

    maplibreglMap.on('mouseleave', 'clusters', () => {
      maplibreglMap.getCanvas().style.cursor = 'default'
    })

    maplibreglMap.on('mousemove', 'polygons', (e) => {
      maplibreglMap.getCanvas().style.cursor = 'pointer'

      if (!e.features || !e.features[0].id)
        return

      // Do nothing if the feature has not changed
      if (hoveredStateId.value === e.features[0].id)
        return

      // Change hover state prev feature
      maplibreglMap.setFeatureState(
        { source: 'polygons-source-layer', id: hoveredStateId.value },
        { hover: false },
      )

      // Change hover state on current feature
      maplibreglMap.setFeatureState(
        { source: 'polygons-source-layer', id: e.features[0].id },
        { hover: true },
      )

      hoveredStateId.value = e.features[0].id
    })

    maplibreglMap.on('mouseleave', 'polygons', (_e) => {
      if (hoveredStateId.value) {
        maplibreglMap.setFeatureState(
          { source: 'polygons-source-layer', id: hoveredStateId.value },
          { hover: false },
        )
        hoveredStateId.value = ''

        maplibreglMap.getCanvas().style.cursor = 'default'
      }
    })

    watch(
      objectsFeatures,
      (of) => {
        const source = maplibreglMap.getSource(
          'objects-source-layer',
        ) as maplibregl.GeoJSONSource

        if (!source)
          return

        source.setData(of)
      },
      { immediate: true },
    )

    watch(
      movesFiltered,
      (mf) => {
        const arcLayer = getArcLayer({ data: mf, map: maplibreglMap })
        deckOverlay.setProps({
          layers: [arcLayer],
        })
      },
      { immediate: true },
    )
  })
}

function getArcLayer({
  data = [],
  map = null,
}: {
  data: IMove[]
  map: maplibregl.Map | null
}) {
  return new ArcLayer<IMove>({
    id: 'deckgl-arc',
    data,

    getWidth: 3,
    pickable: true,
    greatCircle: true,
    autoHighlight: true,

    getTilt: _d => (Math.random() < 0.5 ? -1 : 1) * Math.random() * 30,
    getSourcePosition: (d) => {
      const coordinates = d.feature.sender.geometry.coordinates
      return [coordinates[0], coordinates[1]]
    },
    getTargetPosition: (d) => {
      const coordinates = d.feature.receiver.geometry.coordinates
      return [coordinates[0], coordinates[1]]
    },

    getSourceColor: (d) => {
      return d.feature.sender.properties.color
    },
    getTargetColor: (d) => {
      return d.feature.receiver.properties.color
    },
    onClick(pickingInfo, _event) {
      if (!pickingInfo.object)
        return
      if (moveFilter.value === pickingInfo.object._id)
        moveFilter.value = ''
      else moveFilter.value = pickingInfo.object._id
    },
    onHover(pickingInfo, _event) {
      if (!map)
        return

      if (pickingInfo.object && pickingInfo.coordinate) {
        map.getCanvas().style.cursor = 'pointer'

        maplibreglPopup
          .setLngLat([pickingInfo.coordinate[0], pickingInfo.coordinate[1]])
          .setHTML(
            getMoveTooltip(
              pickingInfo.object.resource,
              pickingInfo.object.value,
              pickingInfo.object.sender,
              pickingInfo.object.receiver,
            ),
          )
          .addTo(maplibreglMap)
      }
      else {
        map.getCanvas().style.cursor = 'default'
        maplibreglPopup.remove()
      }
    },
  })
}

function getMoveTooltip(
  res: string,
  value: string,
  from: string,
  to: string,
): string {
  return `
  <div class="custom-tooltip custom-tooltip--move">
    <div class="custom-tooltip__header">
      <span>${res} - ${value}</span>
    </div>
    <div class="custom-tooltip__body">
      <div class="custom-tooltip__row">
        <span>Отправитель:</span> ${from}
      </div>
      <div class="custom-tooltip__row">
        <span>Получатель:</span> ${to}
      </div>
    </div>
  </div>`
}
function getObjectTooltip(label: string): string {
  return `
  <div class="custom-tooltip custom-tooltip--object">
    <div class="custom-tooltip__header">
      <h3>${label}</h3>
    </div>
  </div>`
}
</script>

<template>
  <div id="mapContainer" class="layout-default__map z-0 h-full w-full" />
</template>
