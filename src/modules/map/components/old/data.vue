<script setup lang="ts">
import { ArcLayer } from '@deck.gl/layers/typed'
import { along, lineString, transformTranslate } from '@turf/turf'
import { clamp } from '@antfu/utils'
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox/typed'
import maplibregl from 'maplibre-gl'

import type { IMove } from '~/types'

import type { TMapboxOverlay } from '../../types'
import type { ShallowRef } from 'vue'
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry, LineString, Point } from 'geojson'
import type { Units } from '@turf/turf'
import type { LngLatLike } from 'maplibre-gl'

const maplibreMap = inject('mapLibreUniqueKey') as ShallowRef<maplibregl.Map>

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
onMounted(() => onMapReady(maplibreMap.value, new maplibregl.Popup()))

// watch(() => maplibreMap?.value, (map) => {
//   if (!map)
//     return
//   onMapReady(map, new maplibregl.Popup())
// })

const distancePixelsAnimation = ref<number>(100)
const stepsAnimation = ref<number>(40)
const unclusteredId = ref<number>(0)
function onMapReady(map: maplibregl.Map, popup: maplibregl.Popup) {
  const deckOverlay = new DeckOverlay({ effects: [] }) as TMapboxOverlay
  map.addControl(deckOverlay)

  map.on('mouseenter', 'objects', (e) => {
    map.getCanvas().style.cursor = 'pointer'

    const feature = e.features![0] as unknown as Feature<
        Point,
        { id: string; label: string }
      > & { state: { hidden: boolean } }

    if (feature.state.hidden)
      return

    popup
      .setLngLat(e.lngLat)
      .setHTML(getObjectTooltip(feature.properties.label))
      .trackPointer()
      .addTo(map)
  })

  map.on('mouseleave', 'objects', (_e) => {
    map.getCanvas().style.cursor = 'default'
    popup.remove()
  })

  map.on('mouseenter', 'objects-uncluster', (e) => {
    map.getCanvas().style.cursor = 'pointer'

    const feature = e.features![0] as unknown as Feature<
        Point,
        { id: string; label: string }
      >
    popup
      .setLngLat(e.lngLat)
      .setHTML(getObjectTooltip(feature.properties.label))
      .trackPointer()
      .addTo(map)
  })

  map.on('mouseleave', 'objects-uncluster', (_e) => {
    map.getCanvas().style.cursor = 'default'
    popup.remove()
  })

  map.on('click', 'objects-uncluster', (e) => {
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

  map.on('click', 'objects', (e) => {
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

  map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters'],
    })
    const cluster = features[0] as Feature<Point>
    const clusterId = features[0].properties.cluster_id
    const source = map.getSource(
      'objects-source-layer',
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
            'objects-source-uncluster',
          ) as maplibregl.GeoJSONSource

          const sourceUnclusterLines = map.getSource(
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

          const distance = convertDistancePixelToMeters(map, cluster.geometry.coordinates[1], distancePixelsAnimation.value)

          if (unclusteredId.value) {
            const prevFeatures = map.querySourceFeatures('objects-source-uncluster') as Feature<Point>[]

            prevFeatures.forEach((f) => {
              if (!map)
                return
              map.setFeatureState({
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
            map.setFeatureState({
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

  map.on('styleimagemissing', (e) => {
    const id = e.id
    const regexpIcon = /^custom:([^/]+)/

    if (!regexpIcon.test(id)) {
      logger.info('missing default icon:', id)
      return
    }

    const image = map.getImage('custom:default/icon')
    if (image.data) {
      map.addImage(id, image.data)
      logger.success('edited icon:', id)
    }
  })

  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer'
  })

  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = 'default'
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

  watch(
    objectsFeatures,
    (of) => {
      console.log('watch data')

      const source = map.getSource(
        'objects-source-layer',
      ) as maplibregl.GeoJSONSource

      if (!source)
        return

      source.setData(of)
    },
    { immediate: true },
  )

  // watch(
  //   movesFiltered,
  //   (mf) => {
  //     const arcLayer = getArcLayer({ data: mf, map, popup })
  //     deckOverlay.setProps({
  //       layers: [arcLayer],
  //     })
  //   },
  //   { immediate: true },
  // )
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
  popup = null,
}: {
  data: IMove[]
  map: maplibregl.Map | null
  popup: maplibregl.Popup | null
}) {
  if (!map || !popup)
    return
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
      if (pickingInfo.object && pickingInfo.coordinate) {
        map.getCanvas().style.cursor = 'pointer'

        popup
          .setLngLat([pickingInfo.coordinate[0], pickingInfo.coordinate[1]])
          .setHTML(
            getMoveTooltip(
              pickingInfo.object.resource,
              pickingInfo.object.value,
              pickingInfo.object.sender,
              pickingInfo.object.receiver,
            ),
          )
          .addTo(map)
      }
      else {
        map.getCanvas().style.cursor = 'default'
        popup.remove()
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
  <div />
</template>
