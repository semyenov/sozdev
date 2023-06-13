import { along, lineString, transformTranslate } from '@turf/turf'
import { ArcLayer } from '@deck.gl/layers/typed'

import type { IMove } from '~/types'

import type { Feature, FeatureCollection, GeoJsonProperties, Geometry, LineString, Point } from 'geojson'
import type { Units } from '@turf/turf'

export async function geChildrenOfCluster(source: maplibregl.GeoJSONSource, arr: Feature<Geometry, GeoJsonProperties>[] | null | undefined) {
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

export function getDirectionAngle(count: number, index: number) {
  const angle = 360 / count
  return angle * index
}

export function convertDistancePixelToMeters(map: maplibregl.Map, lat: number, pixels: number) {
  const tileSize = map.getSource('openmaptiles')?.tileSize || 512
  const eqMetersOnPixel = 40075.016686 * 1000 / tileSize
  const zoom = map.getZoom()
  const resolution = eqMetersOnPixel * Math.cos(lat * (Math.PI / 180)) / (2 ** zoom)

  return resolution * pixels
}

export function animateClusterFeature(features: FeatureCollection<Point>, linesFC: FeatureCollection<LineString>, source: maplibregl.GeoJSONSource, sourceLines: maplibregl.GeoJSONSource, steps: number, currentDistance: number, distance: number) {
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

export function getMoveTooltip(
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

export function getObjectTooltip(label: string): string {
  return `
  <div class="custom-tooltip custom-tooltip--object">
    <div class="custom-tooltip__header">
      <h3>${label}</h3>
    </div>
  </div>`
}

function getArcLayer({
  data = [],
  map = null,
  popup = null,
  moveFilter = '',
}: {
  data: IMove[]
  map: maplibregl.Map | null
  popup: maplibregl.Popup | null
  moveFilter: string
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
      if (moveFilter === pickingInfo.object._id)
        moveFilter = ''
      else moveFilter = pickingInfo.object._id
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
