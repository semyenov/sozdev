<script setup lang="ts">
import maplibregl from 'maplibre-gl'
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox/typed'
import { ArcLayer } from '@deck.gl/layers/typed'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

import jsonData from '../geojson/voronezh.json'

import type { IMove, IObject } from '~/types'
import { IMetaScope } from '~/types'

import type { TMapboxDraw, TMapboxOverlay } from '../types'
import type { FeatureCollection, Point } from 'geojson'

let maplibreglMap: maplibregl.Map
let maplibreglPopup: maplibregl.Popup
let deckOverlay: TMapboxOverlay

const objectsStore = useObjectsStore()
const backendStore = useBackendStore()
const movesStore = useMovesStore()

const objectsIds = await objectsStore.itemsGetter
const objects = await objectsStore.itemsGetterByIds(objectsIds.value)
const movesId = await movesStore.itemsGetter
const moves = await movesStore.itemsGetterByIds(movesId.value)

const moveFilter = ref<string>('')
const hoveredStateId = ref<string | number >('')

const objectsStoreMap = backendStore.store.get(IMetaScope.OBJECTS)!

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
    }),
  )
}

// setInterval(handleClick, 5000)

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

function createMaplibreglMap() {
  maplibreglMap = new maplibregl.Map({
    container: 'mapContainer',
    style:
      'https://api.maptiler.com/maps/streets-v2/style.json?key=jSJRPdUXEsNgteCkgfs4',
    center: [42.9473373, 51.2672198], // starting position [lng, lat]
    maxZoom: 18,
    minZoom: 0,
    zoom: 6,
    attributionControl: false,
    trackResize: true,
    pixelRatio: 1.5,
  })

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
        'fill-color': '#627BC1',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0.5,
        ],
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
      // offset: 0,
      closeButton: false,
      closeOnClick: false,
    })

    // maplibreglMap.addLayer({
    //   id: 'cluster-count',
    //   type: 'symbol',
    //   source: 'test-source-layer-2',
    //   filter: ['has', 'point_count'],

    //   layout: {
    //     'text-field': '{point_count_abbreviated}',
    //     'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    //     'text-size': 12,
    //   },
    // })

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

    deckOverlay = new DeckOverlay({
    }) as TMapboxOverlay

    maplibreglMap.addControl(deckOverlay)

    maplibreglMap.on('click', 'clusters', (e) => {
      const features = maplibreglMap.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      })

      const clusterId = features[0].properties.cluster_id
      const source = maplibreglMap.getSource(
        'test-source-layer-2',
      ) as maplibregl.GeoJSONSource

      if (!source)
        return

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || !zoom)
          return

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

    maplibreglMap.on('mousemove', 'test-layer', (e) => {
      if (!e.features || !e.features[0].id)
        return

      // Do nothing if the feature has not changed
      if (hoveredStateId.value === e.features[0].id)
        return

      // Change hover state prev feature
      maplibreglMap.setFeatureState(
        { source: 'test-source-layer', id: hoveredStateId.value },
        { hover: false },
      )

      // Change hover state on current feature
      maplibreglMap.setFeatureState(
        { source: 'test-source-layer', id: e.features[0].id },
        { hover: true },
      )

      hoveredStateId.value = e.features[0].id
    })

    maplibreglMap.on('mouseleave', 'test-layer', (_e) => {
      if (hoveredStateId.value) {
        maplibreglMap.setFeatureState(
          { source: 'test-source-layer', id: hoveredStateId.value },
          { hover: false },
        )
        hoveredStateId.value = ''
      }
    })

    watch(
      objectsFeatures,
      (of) => {
        const source = maplibreglMap.getSource(
          'test-source-layer-2',
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
        const arcLayer = getArcLayer(mf)
        deckOverlay.setProps({
          layers: [arcLayer],
        })
      },
      { immediate: true },
    )
  })
}

function getArcLayer(data: IMove[]) {
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
    updateTriggers: {
      data: movesFiltered.value,
    },
    onHover(pickingInfo, _event) {
      if (pickingInfo.object && pickingInfo.coordinate) {
        // console.log('pickingInfo', pickingInfo)
        maplibreglMap.getCanvas().style.cursor = 'pointer'
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
        maplibreglMap.getCanvas().style.cursor = 'default'
        maplibreglPopup.remove()
      }
    },
  })
}
</script>

<template>
  <div id="mapContainer" class="layout-default__map z-0 h-full w-full" />
</template>

<style lang="postcss">
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
