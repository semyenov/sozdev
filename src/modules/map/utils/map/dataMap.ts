import { clamp } from '@antfu/utils'
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox/typed'

import { MAP_LAYERS, MAP_SOURCES } from '../index'

import type { IMove } from '~/types'

import { animateClusterFeature, convertDistancePixelToMeters, geChildrenOfCluster, getObjectTooltip } from './utils'

import type { TMapboxOverlay } from '../../types'
import type { Feature, FeatureCollection, LineString, Point } from 'geojson'
import type { LngLatLike } from 'maplibre-gl'

export async function initializeDataMap(map: maplibregl.Map, popup: maplibregl.Popup) {
  const missingDefaultIds = shallowRef<string[]>([])

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

  const deckOverlay = new DeckOverlay({ effects: [] }) as TMapboxOverlay

  map.addControl(deckOverlay)

  map.on('mouseenter', MAP_LAYERS.OBJECTS, (e) => {
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

  map.on('mouseleave', MAP_LAYERS.OBJECTS, (_e) => {
    map.getCanvas().style.cursor = 'default'
    popup.remove()
  })

  map.on('mouseenter', MAP_LAYERS.OBJECTS_UNCLUSTER, (e) => {
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

  map.on('mouseleave', MAP_LAYERS.OBJECTS_UNCLUSTER, (_e) => {
    map.getCanvas().style.cursor = 'default'
    popup.remove()
  })

  map.on('click', MAP_LAYERS.OBJECTS_UNCLUSTER, (e) => {
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

  map.on('click', MAP_LAYERS.OBJECTS, (e) => {
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

  map.on('click', MAP_LAYERS.CLUSTERS, (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [MAP_LAYERS.CLUSTERS],
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
  })

  map.on('styleimagemissing', (e) => {
    const id = e.id
    const regexpIcon = /^custom:([^/]+)/

    if (!regexpIcon.test(id) && !missingDefaultIds.value.includes(id)) {
      missingDefaultIds.value.push(id)
      logger.info('missing default icon:', id)
      return
    }

    const image = map.getImage('custom:default/icon')
    if (image.data) {
      map.addImage(id, image.data)
      logger.success('edited icon:', id)
    }
  })

  map.on('mouseenter', MAP_LAYERS.CLUSTERS, () => {
    map.getCanvas().style.cursor = 'pointer'
  })

  map.on('mouseleave', MAP_LAYERS.CLUSTERS, () => {
    map.getCanvas().style.cursor = 'default'
  })

  map.on('mousemove', MAP_LAYERS.POLYGONS, (e) => {
    map.getCanvas().style.cursor = 'pointer'

    if (!e.features || !e.features[0].id)
      return

    // Do nothing if the feature has not changed
    if (hoveredStateId.value === e.features[0].id)
      return

    // Change hover state prev feature
    map.setFeatureState(
      { source: MAP_SOURCES.POLYGONS, id: hoveredStateId.value },
      { hover: false },
    )

    // Change hover state on current feature
    map.setFeatureState(
      { source: MAP_SOURCES.POLYGONS, id: e.features[0].id },
      { hover: true },
    )

    hoveredStateId.value = e.features[0].id
  })

  map.on('mouseleave', MAP_LAYERS.POLYGONS, (_e) => {
    if (hoveredStateId.value) {
      map.setFeatureState(
        { source: MAP_SOURCES.POLYGONS, id: hoveredStateId.value },
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
        MAP_SOURCES.OBJECTS,
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
