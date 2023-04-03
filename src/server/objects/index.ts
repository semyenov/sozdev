import { range } from '@antfu/utils'
import { faker } from '@faker-js/faker'

import { bbox, randomPosition } from '@turf/turf'

import jsonData from '../../modules/map/geojson/voronezh.json'

import type { IObject } from '~/types'

const lineBBox = bbox(jsonData.features[0])

export const items = range(0, 1000).map((_i) => {
  const item: IObject = {
    _id: faker.datatype.uuid(),
    info: {
      name: `${faker.address.street()}, ${faker.address.buildingNumber()}`,
    },
    feature: {
      id: faker.datatype.uuid(),
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: randomPosition(lineBBox),
      },
      properties: {
        color: Array.from({ length: 3 }, () =>
          faker.datatype.number({ min: 0, max: 255 })
        ) as [number, number, number],
      },
    },
    type: 'test',
    level: faker.datatype.number({ min: 0, max: 1000, precision: 100 }),
    fields: {},
    parent: null,
    demands: {},
    resources: {},
  }

  return item
})
