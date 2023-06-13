<script setup lang="ts">
import { clamp } from '@vueuse/core'

import { MapLibrePopup } from '#components'

import type { IMove } from '~/types'
import type { TLayerEvent } from '~/modules/map/types'

import type { Feature, FeatureCollection, LineString, Point } from 'geojson'
import type { LngLatLike } from 'maplibre-gl'

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

const distancePixelsAnimation = ref<number>(100)
const stepsAnimation = ref<number>(40)
const unclusteredId = ref<number>(0)

const popupRef = shallowRef<InstanceType<typeof MapLibrePopup> | null>(null)

function mouseClickObjects(e: TLayerEvent<'click'>) {
  const map = e.target as maplibregl.Map
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
}

function mouseEnterObjects(e: TLayerEvent<'mouseenter'>) {
  if (!popupRef.value || !popupRef.value.popup)
    return

  const map = e.target
  map.getCanvas().style.cursor = 'pointer'

  const feature = e.features![0] as unknown as Feature<
        Point,
        { id: string; label: string }
      > & { state: { hidden: boolean } }

  if (feature.state.hidden)
    return

  popupRef.value.popup
    .setLngLat(e.lngLat)
    .setHTML(getObjectTooltip(feature.properties.label))
    .trackPointer()
    .addTo(map)
}

function mouseLeaveObjects(_e: TLayerEvent<'mouseleave'>) {
  if (!popupRef.value || !popupRef.value.popup)
    return
  popupRef.value.popup.remove()
}

function mouseEnterObjcetsUnclustered(e: TLayerEvent<'mouseenter'>) {
  if (!popupRef.value || !popupRef.value.popup)
    return
  const map = e.target
  map.getCanvas().style.cursor = 'pointer'
  const feature = e.features![0] as unknown as Feature<
        Point,
        { id: string; label: string }
      >

  popupRef.value.popup
    .setLngLat(e.lngLat)
    .setHTML(getObjectTooltip(feature.properties.label))
    .trackPointer()
    .addTo(map)
}

function mouseClickCluster(e: TLayerEvent<'click'>) {
  const map = e.target as maplibregl.Map
  const features = map.queryRenderedFeatures(e.point, {
    layers: ['cluster'],
  })
  const cluster = features[0] as Feature<Point>
  const clusterId = features[0].properties.cluster_id
  const source = map.getSource(
    MAP_SOURCES.OBJECTS,
  ) as maplibregl.GeoJSONSource

  if (!source)
    return

  source.getClusterExpansionZoom(clusterId, (err, zoom) => {
    if (err || !zoom)
      return
    if (features[0].geometry.type === 'Point') {
      if (!map)
        return
      const maxZoom = map.getMaxZoom()
      const oldZoom = map.getZoom()
      const nextZoom = clamp(
        zoom + 2,
        map.getMinZoom(),
        maxZoom,
      )
      map.easeTo({
        center: features[0].geometry.coordinates as LngLatLike,
        zoom: nextZoom,
      })

      if (maxZoom !== oldZoom)
        return

      source.getClusterChildren(clusterId, async (_e, arr) => {
        // if (!arr || !arr.length || arr.some(f => f.properties?.cluster))
        if (!arr || !arr.length || !map)
          return

        const sourceUncluster = map.getSource(
          MAP_SOURCES.OBJECTS_UNCLUSTER,
        ) as maplibregl.GeoJSONSource

        const sourceUnclusterLines = map.getSource(
          MAP_SOURCES.LINES_UNCLUSTER,
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

        const distance = convertDistancePixelToMeters(map, cluster.geometry.coordinates[1], distancePixelsAnimation.value)

        if (unclusteredId.value) {
          const prevFeatures = map.querySourceFeatures(MAP_SOURCES.OBJECTS_UNCLUSTER) as Feature<Point>[]

          prevFeatures.forEach((f) => {
            if (!map)
              return
            map.setFeatureState({
              source: MAP_SOURCES.OBJECTS,
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
        console.log('test')

        clusterFC.features = await geChildrenOfCluster(source, arr) as Feature<Point>[]

        clusterFC.features = clusterFC.features.map((f, i) => {
          clusterLinesFC.features[i] = {
            ...f,
            geometry: {
              type: 'LineString',
              coordinates: [cluster.geometry.coordinates, cluster.geometry.coordinates],
            },
          }
          map.setFeatureState({
            source: MAP_SOURCES.OBJECTS,
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
  <ClientOnly>
    <MapLibreMap :map-options="{ container: 'mapContainer' }">
      <MapLibrePopup ref="popupRef" />
      <MapLibreSource
        :source-id="MAP_SOURCES.OBJECTS"
        source-template="cluster"
        :source-options="{
          type: 'geojson',
          data: objectsFeatures,
        }"
      >
        <MapLibreSource
          :source-id="MAP_SOURCES.OBJECTS_UNCLUSTER"
          source-template="object"
          :source-options="{
            type: 'geojson',
            data: null,
          }"
        >
          <MapLibreSource
            :source-id="MAP_SOURCES.LINES_UNCLUSTER"
            source-template="object"
            :source-options="{
              type: 'geojson',
              data: null,
            }"
          >
            <MapLibreLayer
              layer-template="object"
              :layers-options="{
                id: MAP_LAYERS.OBJECTS,
                type: 'symbol',
                source: MAP_SOURCES.OBJECTS,
                filter: ['!', ['has', 'point_count']],
              }"
              @click.prevent="mouseClickObjects"
              @mouseenter="mouseEnterObjects"
              @mouseleave="mouseLeaveObjects"
            />

            <MapLibreLayer
              layer-template="object"
              :layers-options="{
                id: MAP_LAYERS.OBJECTS_UNCLUSTER,
                type: 'symbol',
                source: MAP_SOURCES.OBJECTS_UNCLUSTER,
                filter: ['!', ['has', 'point_count']],
              }"
              @click.prevent="mouseClickObjects"
              @mouseenter="mouseEnterObjects"
              @mouseleave="mouseLeaveObjects"
            />

            <MapLibreLayer
              layer-template="object"
              :layers-options="{
                id: MAP_LAYERS.LINES_UNCLUSTER,
                type: 'line',
                source: MAP_SOURCES.LINES_UNCLUSTER,

                layout: {
                  'line-cap': 'round',
                  'line-join': 'round',

                },
                paint: {
                  'line-color': '#51bbd6',
                  'line-width': 2,
                  'line-opacity': 0.5,
                },
              }"
              @click.prevent="mouseClickObjects"
              @mouseenter="mouseEnterObjects"
              @mouseleave="mouseLeaveObjects"
            />

            <MapLibreLayer
              layer-template="cluster"
              :layers-options="{
                id: 'cluster',
                type: 'circle',
                source: MAP_SOURCES.OBJECTS,
                filter: ['has', 'point_count'],
              }"
              @click="mouseClickCluster"
            />

            <MapLibreLayer
              :layers-options="{
                id: 'cluster-count',
                type: 'symbol',
                source: MAP_SOURCES.OBJECTS,
                filter: ['has', 'point_count'],
                layout: {
                  'text-field': ['get', 'point_count_abbreviated'],
                  'text-font': ['Noto Sans Regular'],
                  'text-size': 12,
                  'text-rotate': 0,
                  'text-overlap': 'always',
                },
              }"
            />
          </MapLibreSource>
        </MapLibreSource>
      </MapLibreSource>
    </MapLibreMap>
  </ClientOnly>
</template>
