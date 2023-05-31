<script setup lang="ts">
import maplibregl from 'maplibre-gl'
import { clamp } from '@antfu/utils'
import { ArcLayer } from '@deck.gl/layers/typed'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { lineString } from '@turf/helpers'
import along from '@turf/along'
import transformTranslate from '@turf/transform-translate'
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox/typed'

import type { IMove } from '~/types'

import type { LngLatLike } from 'maplibre-gl'
import type { Units } from '@turf/helpers'
import type { TMapboxDraw, TMapboxOverlay } from '../types'
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry, LineString, Point } from 'geojson'

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
      properties: {
        id: object._id,
        label: object.info.name,
        type: object.type,
        icon: objectTypes.value.find(item => item._id === object.type)?.icon,
      },
    }),
  )

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

const distancePixelsAnimation = ref<number>(100)
const stepsAnimation = ref<number>(40)
const unclusteredId = ref<number>(0)

onMounted(createMaplibreglMap)

async function createMaplibreglMap() {
  maplibregl.workerCount = 10

  maplibreglMap = new maplibregl.Map({
    container: 'mapContainer',
    style: '/map/styles/streets/style.json',
    center: [37.61199474334717, 54.198741669025175],
    maxZoom: 18,
    minZoom: 0,
    zoom: 14,
    attributionControl: false,
    trackResize: true,
    localIdeographFontFamily: '\'Noto Sans Regular\', \'Roboto Regular\'',

  })

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

    maplibreglMap.addSource('objects-source-uncluster', {
      type: 'geojson',
      data: null,
      promoteId: 'id',
    })

    maplibreglMap.addSource('objects-source-uncluster-lines', {
      type: 'geojson',
      data: null,
      promoteId: 'id',
    })

    maplibreglMap.addLayer({
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

    maplibreglMap.addLayer({
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

    maplibreglMap.addLayer({
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
        'text-overlap': 'always',
      },
    })

    deckOverlay = new DeckOverlay({ effects: [] }) as TMapboxOverlay
    maplibreglMap.addControl(deckOverlay)

    maplibreglMap.on('mouseenter', 'objects', (e) => {
      maplibreglMap.getCanvas().style.cursor = 'pointer'

      const feature = e.features![0] as unknown as Feature<
        Point,
        { id: string; label: string }
      > & { state: { hidden: boolean } }

      if (feature.state.hidden)
        return

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

    maplibreglMap.on('mouseenter', 'objects-uncluster', (e) => {
      maplibreglMap.getCanvas().style.cursor = 'pointer'

      const feature = e.features![0] as unknown as Feature<
        Point,
        { id: string; label: string }
      >
      maplibreglPopup
        .setLngLat(e.lngLat)
        .setHTML(getObjectTooltip(feature.properties.label))
        .trackPointer()
        .addTo(maplibreglMap)
    })

    maplibreglMap.on('mouseleave', 'objects-uncluster', (_e) => {
      maplibreglMap.getCanvas().style.cursor = 'default'
      maplibreglPopup.remove()
    })

    maplibreglMap.on('click', 'objects-uncluster', (e) => {
      const feature = e.features![0] as unknown as Feature<
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

    maplibreglMap.on('click', 'objects', (e) => {
      const feature = e.features![0] as unknown as Feature<
        Point,
        { id: string; label: string }
      > & { state: { hidden?: boolean } }

      if (feature.state.hidden)
        return

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
      const cluster = features[0] as Feature<Point>
      const clusterId = features[0].properties.cluster_id
      const source = maplibreglMap.getSource(
        'objects-source-layer',
      ) as maplibregl.GeoJSONSource

      if (!source)
        return

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || !zoom)
          return

        if (features[0].geometry.type === 'Point') {
          const maxZoom = maplibreglMap.getMaxZoom()
          const oldZoom = maplibreglMap.getZoom()
          const nextZoom = clamp(
            zoom + 2,
            maplibreglMap.getMinZoom(),
            maxZoom,
          )
          maplibreglMap.easeTo({
            center: features[0].geometry.coordinates as LngLatLike,
            zoom: nextZoom,
          })

          if (maxZoom !== oldZoom)
            return

          source.getClusterChildren(clusterId, async (_e, arr) => {
            // if (!arr || !arr.length || arr.some(f => f.properties?.cluster))
            if (!arr || !arr.length)
              return

            const sourceUncluster = maplibreglMap.getSource(
              'objects-source-uncluster',
            ) as maplibregl.GeoJSONSource

            const sourceUnclusterLines = maplibreglMap.getSource(
              'objects-source-uncluster-lines',
            ) as maplibregl.GeoJSONSource

            if (!sourceUncluster || !sourceUnclusterLines)
              return false

            const clusterFC = {
              type: 'FeatureCollection',
              features: [],
            } as FeatureCollection<Point>

            const clusterLinesFC = {
              type: 'FeatureCollection',
              features: [],
            } as FeatureCollection<LineString>

            const distance = convertDistancePixelToMeters(maplibreglMap, cluster.geometry.coordinates[1], distancePixelsAnimation.value)

            if (unclusteredId.value) {
              const prevFeatures = maplibreglMap.querySourceFeatures('objects-source-uncluster') as Feature<Point>[]

              prevFeatures.forEach((f) => {
                maplibreglMap.setFeatureState({
                  source: 'objects-source-layer',
                  id: f.id,
                }, { hidden: false })
              })

              sourceUncluster.setData(clusterFC)
              sourceUnclusterLines.setData(clusterLinesFC)

              if (unclusteredId.value === clusterId) {
                unclusteredId.value = 0
                return
              }
            }

            clusterFC.features = await geChildrenOfCluster(source, arr) as Feature<Point>[]

            clusterFC.features = clusterFC.features.map((f, i) => {
              clusterLinesFC.features[i] = {
                ...f,
                geometry: {
                  type: 'LineString',
                  coordinates: [cluster.geometry.coordinates, cluster.geometry.coordinates],
                },
              }
              maplibreglMap.setFeatureState({
                source: 'objects-source-layer',
                id: f.id,
              }, { hidden: true })

              f.geometry.coordinates = cluster.geometry.coordinates
              return f
            })

            animateClusterFeature(clusterFC, clusterLinesFC, sourceUncluster, sourceUnclusterLines, stepsAnimation.value, 0, distance)

            unclusteredId.value = clusterId
          })
        }
      })
    })

    maplibreglMap.on('styleimagemissing', (e) => {
      const id = e.id
      const regexpIcon = /^custom:([^/]+)/
      if (!regexpIcon.test(id))
        return

      const image = maplibreglMap.getImage('custom:default/icon')
      if (image.data) {
        maplibreglMap.addImage(id, image.data)
        logger.success('edited on default:', id)
      }
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

async function geChildrenOfCluster(source: maplibregl.GeoJSONSource, arr: Feature<Geometry, GeoJsonProperties>[] | null | undefined) {
  let features = [] as Feature<Geometry, GeoJsonProperties>[]
  if (!arr)
    return features

  const clusterChildren = await Promise.all(arr.map(async (f) => {
    if (!f.properties?.cluster)
      return f
    const children = await new Promise<Feature<Geometry, GeoJsonProperties>[] | null | undefined>((resolve, _reject) => {
      source.getClusterChildren(f.properties?.cluster_id, (_err, arr) => {
        resolve(arr)
      })
    })
    if (!children)
      return []

    return await geChildrenOfCluster(source, children)
  }))

  features = [...features, ...clusterChildren.flat()]

  return features
}

function getDirectionAngle(count: number, index: number) {
  const angle = 360 / count
  return angle * index
}

function convertDistancePixelToMeters(map: maplibregl.Map, lat: number, pixels: number) {
  const tileSize = map.getSource('openmaptiles')?.tileSize || 512
  const eqMetersOnPixel = 40075.016686 * 1000 / tileSize
  const zoom = map.getZoom()
  const resolution = eqMetersOnPixel * Math.cos(lat * (Math.PI / 180)) / (2 ** zoom)

  return resolution * pixels
}

function animateClusterFeature(features: FeatureCollection<Point>, linesFC: FeatureCollection<LineString>, source: maplibregl.GeoJSONSource, sourceLines: maplibregl.GeoJSONSource, steps: number, currentDistance: number, distance: number) {
  if (currentDistance >= distance)
    return

  const options: { units: Units } = { units: 'meters' }

  currentDistance = currentDistance + distance / steps

  features.features = features.features.map((f, i) => {
    const newCoordinates = along(lineString([f.geometry.coordinates, transformTranslate(f, distance / steps, getDirectionAngle(features.features.length, i), options).geometry.coordinates]), currentDistance, options).geometry.coordinates
    f.geometry.coordinates = newCoordinates
    linesFC.features[i].geometry.coordinates[1] = newCoordinates
    return f
  })

  source.setData(features)
  sourceLines.setData(linesFC)

  requestAnimationFrame(() => animateClusterFeature(features, linesFC, source, sourceLines, steps, currentDistance, distance))
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

    // getSourceColor: (d) => {
    //   return d.feature.sender.properties.color
    // },
    // getTargetColor: (d) => {
    //   return d.feature.receiver.properties.color
    // },
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
