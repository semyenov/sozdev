<script setup lang="ts">
import maplibregl from 'maplibre-gl'
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox/typed'
import { ArcLayer } from '@deck.gl/layers/typed'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

import jsonData from '../geojson/tula.json'

import type { IMove } from '~/types'

import type { TMapboxDraw, TMapboxOverlay } from '../types'
import type { FeatureCollection, Point } from 'geojson'

let maplibreglMap: maplibregl.Map
let maplibreglPopup: maplibregl.Popup
let deckOverlay: TMapboxOverlay

const objectsStore = useObjectsStore()
const movesStore = useMovesStore()
const settingsStore = useSettingsStore()

const objectsIds = await objectsStore.itemsGetter
const objects = await objectsStore.itemsGetterByIds(objectsIds.value)
const movesId = await movesStore.itemsGetter
const moves = await movesStore.itemsGetterByIds(movesId.value)

const moveFilter = ref<string>('')
const hoveredStateId = ref<string | number >('')

const objectsFeatures = computed<
  FeatureCollection<Point, { color: [number, number, number] }>
>(() => {
  const features = objects.value.map(object => object.feature)

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

onMounted(createMaplibreglMap)

// function handleClick() {
//   backendStore.setStoreItems(
//     IMetaScope.OBJECTS,
//     objectsIds.value.map((id) => {
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
  maplibreglMap = new maplibregl.Map({
    container: 'mapContainer',
    style:
      '/map/styles/streets/style.json',
    center: [42.9473373, 51.2672198], // starting position [lng, lat]
    maxZoom: 18,
    minZoom: 0,
    zoom: 6,
    attributionControl: false,
    trackResize: true,
    pixelRatio: 1.5,
  })
  // maplibreglMap.setStyle()

  maplibreglMap.addControl(
    new maplibregl.NavigationControl({
      showCompass: true,
      visualizePitch: true,
    }),
    'bottom-right',
  )

  maplibreglMap.addControl(new maplibregl.FullscreenControl({}), 'bottom-right')

  const drawControl = new MapboxDraw({
    controls: {
      point: true,
      line_string: true,
      combine_features: false,
      polygon: false,
      uncombine_features: false,
      trash: false,
    },
  }) as TMapboxDraw

  maplibreglMap.addControl(drawControl, 'bottom-right')

  maplibreglMap.on('load', async () => {
    maplibreglMap.addSource('polygons-source-layer', {
      type: 'geojson',
      data: jsonData,
    })

    maplibreglMap.addSource('objects-source-layer', {
      type: 'geojson',
      data: null,

      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50, // Max zoom to cluster points on
    })

    maplibreglMap.addLayer({
      id: 'polygons',
      type: 'fill',
      source: 'polygons-source-layer',

      paint: {
        'fill-color': settingsStore.districtBoundaries.fillColor,
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.2,
          settingsStore.districtBoundaries.fillOpacity,
        ],
      },
    })

    maplibreglMap.addLayer({
      id: 'polygons-lines',
      type: 'line',
      source: 'polygons-source-layer',
      layout: {},
      paint: {
        'line-color': settingsStore.districtBoundaries.color,
        'line-width': settingsStore.districtBoundaries.weight,
      },
    })

    maplibreglMap.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'objects-source-layer',
      filter: ['has', 'point_count'],
      paint: {
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
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Noto Sans Regular', 'Roboto Regular'],
        'text-size': 25,
      },
    })

    maplibreglPopup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'custom-popup',
    })

    // maplibreglMap.addLayer({
    //   id: 'unclustered-point',
    //   type: 'circle',
    //   source: 'objects-source-layer',
    //   filter: ['!', ['has', 'point_count']],
    //   paint: {
    //     'circle-color': '#11b4da',
    //     'circle-radius': 4,
    //     'circle-stroke-width': 1,
    //     'circle-stroke-color': '#fff',
    //   },
    // })

    maplibreglMap.addLayer({
      id: 'objects',
      type: 'symbol',
      source: 'objects-source-layer',

      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': 'map-icons/tero/1_tero.svg',
        'icon-size': 0.5,
        // 'icon-allow-overlap': true,
      },
      // filter: ['!', ['has', 'point_count']],
    })

    deckOverlay = new DeckOverlay({
    }) as TMapboxOverlay

    maplibreglMap.addControl(deckOverlay)

    // maplibreglMap.on('click', 'clusters', (e) => {
    //   const features = maplibreglMap.queryRenderedFeatures(e.point, {
    //     layers: ['clusters'],
    //   })

    //   const clusterId = features[0].properties.cluster_id
    //   const source = maplibreglMap.getSource(
    //     'objects-source-layer',
    //   ) as maplibregl.GeoJSONSource

    //   if (!source)
    //     return

    //   source.getClusterExpansionZoom(clusterId, (err, zoom) => {
    //     if (err || !zoom)
    //       return

    //     if (features[0].geometry.type === 'Point') {
    //       maplibreglMap.easeTo({
    //         center: features[0].geometry.coordinates as [number, number],
    //         zoom,
    //       })
    //     }
    //   })
    // })

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
        console.log(source)

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

function getArcLayer({ data = [], map = null }: { data: IMove[]; map: maplibregl.Map | null }) {
  return new ArcLayer<IMove>({
    id: 'deckgl-arc',
    data,

    pickable: true,
    getWidth: 3,
    greatCircle: true,
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
    autoHighlight: true,
    onClick(pickingInfo, _event) {
      if (!pickingInfo.object)
        return
      if (moveFilter.value === pickingInfo.object._id)
        moveFilter.value = ''
      else
        moveFilter.value = pickingInfo.object._id
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
</script>

<template>
  <div id="mapContainer" class="layout-default__map z-0 h-full w-full" />
</template>

<style lang="postcss">
.layout-default__map {
  .custom-popup {
    @apply z-10
  }
}

/* .layout-default__map {
  .maplibregl-canvas-container {
    @apply flex-row;
  }
}

.maplibregl-popup {
  @apply flex-row;

  div {
    @apply flex-row;
  }
} */
</style>
