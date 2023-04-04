<script setup lang="ts">
import maplibregl from 'maplibre-gl'
import type { FeatureCollection, Point } from 'geojson'
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox/typed'
import { ArcLayer } from '@deck.gl/layers/typed'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

import type { TMapboxDraw, TMapboxOverlay } from '../types'
import jsonData from '../geojson/voronezh.json'
import type { IMove, IObject } from '~/types'
import { IMetaScope } from '~/types'

let maplibreglMap: maplibregl.Map
let maplibreglPopup: maplibregl.Popup

const objectsStore = useObjectsStore()
const backendStore = useBackendStore()
const movesStore = useMovesStore()

const objectsIds = await objectsStore.itemsGetter
const objects = await objectsStore.itemsGetterByIds(objectsIds.value)
const movesId = await movesStore.itemsGetter
const moves = await movesStore.itemsGetterByIds(movesId.value)

const filter = ref<string>('')

const objectsStoreMap = backendStore.store.get(IMetaScope.OBJECTS)!

const objectsFeatures = computed<
  FeatureCollection<Point, { color: [number, number, number] }>
>(() => {
  const features = objects.value.map((object) => object.feature)

  return {
    type: 'FeatureCollection',
    features,
  }
})

const movesFiltered = computed<IMove[]>(() => {
  if (!filter.value) {
    return moves.value
  }

  return moves.value.filter((move) => move._id === filter.value)
})

// const movesFeatures = computed<IMove[]>(() => {
//   const features = moves.value.map((object) => object.feature)

//   return {
//     type: 'FeatureCollection',
//     features,
//   }
// })

onMounted(createMaplibreglMap)

function handleClick() {
  backendStore.setStoreItems(
    IMetaScope.OBJECTS,
    objectsIds.value.map((id) => {
      const object = objectsStoreMap.get(id) as IObject

      object.feature.geometry.coordinates = [
        object.feature.geometry.coordinates[0] + (Math.random() - 0.5),
        object.feature.geometry.coordinates[1] + (Math.random() - 0.5),
      ]

      return object
    })
  )
}

// setInterval(handleClick, 5000)

function getMoveTooltip(
  res: string,
  value: string,
  from: string,
  to: string
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

function createMaplibreglMap() {
  maplibreglMap = new maplibregl.Map({
    container: 'mapContainer',
    style:
      'https://api.maptiler.com/maps/streets-v2/style.json?key=jSJRPdUXEsNgteCkgfs4',
    center: [42.947337399999995, 51.26721980000001], // starting position [lng, lat]
    maxZoom: 18,
    minZoom: 0,
    zoom: 6,
    attributionControl: false,
    trackResize: true,
  })

  maplibreglMap.addControl(
    new maplibregl.NavigationControl({
      showCompass: true,
      visualizePitch: true,
    }),
    'bottom-right'
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

  maplibreglMap.on('load', () => {
    maplibreglMap.addSource('test-source-layer', {
      type: 'geojson',
      data: jsonData,
    })

    maplibreglMap.addSource('test-source-layer-2', {
      type: 'geojson',
      data: null,
      // cluster: true,
      // clusterMaxZoom: 14, // Max zoom to cluster points on
      // clusterRadius: 50,
    })

    maplibreglMap.addLayer({
      id: 'test-layer',
      type: 'fill',
      source: 'test-source-layer',

      paint: {
        'fill-color': '#088',
        'fill-opacity': 0.8,
      },
    })

    // maplibreglMap.addLayer({
    //   id: 'clusters',
    //   type: 'circle',
    //   source: 'test-source-layer-2',
    //   filter: ['has', 'point_count'],
    //   paint: {
    //     'circle-color': [
    //       'step',
    //       ['get', 'point_count'],
    //       '#51bbd6',
    //       100,
    //       '#f1f075',
    //       750,
    //       '#f28cb1',
    //     ],
    //     'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
    //   },
    // })

    // const popupOffsets: maplibregl.Offset = {
    //   top: 0,
    //   'top-left': 0,
    //   'top-right': 0,
    //   bottom: 0,
    //   'bottom-left': 0,
    //   'bottom-right': 0,
    //   left: 0,
    //   right: 0,
    // }
    maplibreglPopup = new maplibregl.Popup({
      offset: 0,
      closeButton: false,
      closeOnClick: false,
    })

    maplibreglMap.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'test-source-layer-2',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
    })

    maplibreglMap.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'test-source-layer-2',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff',
      },
    })

    const arcLayer = new ArcLayer<IMove>({
      id: 'deckgl-arc',

      data: movesFiltered.value,

      pickable: true,
      getWidth: 3,
      greatCircle: true,
      getTilt: (_d) => (Math.random() < 0.5 ? -1 : 1) * Math.random() * 30,
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
      // transitions: {
      //   getSourcePosition: {},
      //   getTargetPosition: 1000,
      // },
      onClick(pickingInfo, event) {
        if (!pickingInfo.object) {
          return
        }
        filter.value = pickingInfo.object._id
        // pickingInfo.layer?.updateState({})

        console.log({ pickingInfo, event })
      },
      updateTriggers: {
        data: movesFiltered.value,
      },
      onHover(pickingInfo, _event) {
        if (pickingInfo.object && pickingInfo.coordinate) {
          // console.log({ pickingInfo, event })
          maplibreglMap.getCanvas().style.cursor = 'pointer'
          maplibreglPopup
            .setLngLat([pickingInfo.coordinate[0], pickingInfo.coordinate[1]])
            .setHTML(
              'test'
              // getMoveTooltip(
              //   pickingInfo.object.resource,
              //   pickingInfo.object.value,
              //   pickingInfo.object.sender,
              //   pickingInfo.object.receiver
              // )
            )
            .addTo(maplibreglMap)
        } else {
          // maplibreglMap.getCanvas().style.cursor = 'default'
          // maplibreglPopup.remove()
        }
      },
    })

    const deck = new DeckOverlay({
      layers: [arcLayer],
    }) as TMapboxOverlay
    maplibreglMap.addControl(deck)

    maplibreglMap.on('click', 'clusters', (e) => {
      const features = maplibreglMap.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      })
      const clusterId = features[0].properties.cluster_id
      const source = maplibreglMap.getSource(
        'test-source-layer-2'
      ) as maplibregl.GeoJSONSource
      if (!source) {
        return
      }

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || !zoom) {
          return
        }
        if (features[0].geometry.type === 'Point') {
          maplibreglMap.easeTo({
            center: features[0].geometry.coordinates as [number, number],
            zoom,
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

    watch(
      objectsFeatures,
      (of) => {
        const source = maplibreglMap.getSource(
          'test-source-layer-2'
        ) as maplibregl.GeoJSONSource

        if (!source) {
          return
        }

        source.setData(of)
      },
      { immediate: true }
    )
  })
}
</script>

<template>
  <!-- <UiButton @click="handleClick">Move -> 10</UiButton> -->
  <div id="mapContainer" class="flex flex-col layout-default__map z-0"></div>
</template>
