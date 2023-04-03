<script setup lang="ts">
import maplibregl from 'maplibre-gl'
import type { FeatureCollection, Point } from 'geojson'
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox/typed'
import { ArcLayer } from '@deck.gl/layers/typed'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

import type { TMapboxDraw, TMapboxOverlay } from '../types'
import jsonData from '../geojson/voronezh.json'
import type { IObject } from '~/types'
import { IMetaScope } from '~/types'

let maplibreglMap: maplibregl.Map

const objectsStore = useObjectsStore()
const backendStore = useBackendStore()

const objectsIds = await objectsStore.itemsGetter
const objects = await objectsStore.itemsGetterByIds(objectsIds.value)

const objectsStoreMap = backendStore.store.get(IMetaScope.OBJECTS)!

const objectsFeatures = computed<FeatureCollection<Point>>(
  () => {
    const features = objects.value.map((object) => object.feature)

    return {
      type: 'FeatureCollection',
      features,
    }
  }
  // {
  //   onTrack: console.log,
  //   // onTrigger: console.log,
  // }
)

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

function createMaplibreglMap() {
  maplibreglMap = new maplibregl.Map({
    container: 'mapContainer',
    style:
      'https://api.maptiler.com/maps/streets-v2/style.json?key=jSJRPdUXEsNgteCkgfs4',
    center: [0, 0], // starting position [lng, lat]
    maxZoom: 18,
    minZoom: 0,
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

    const arcLayer = new ArcLayer({
      id: 'deckgl-arc',

      data: [
        {
          source: [39.29009860000001, 51.33351280000001],
          target: [42.947337399999995, 51.26721980000001],
        },
      ],

      pickable: true,
      getWidth: 3,
      getTilt: (_d) => (Math.random() < 0.5 ? -1 : 1) * Math.random() * 30,
      getSourcePosition: (d) => d.source,
      getTargetPosition: (d) => d.target,
      getSourceColor: [255, 0, 128],
      getTargetColor: [0, 200, 255],
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
  <UiButton @click="handleClick">Move -> 10</UiButton>
  <div id="mapContainer" class="flex flex-col layout-default__map z-0"></div>
</template>
