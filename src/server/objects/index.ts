import { range } from '@antfu/utils'
import { faker } from '@faker-js/faker'

import type { Feature, Point } from 'geojson'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import randomPoints from 'random-points-on-polygon'
import jsonData from '../../modules/map/geojson/voronezh.json'

import type { IObject } from '~/types'

const points = randomPoints(1000, jsonData.features[0]) as Feature[]

export const items: IObject[] = range(0, 1000).map((_i) => {
  const id = faker.datatype.uuid()

  return {
    _id: faker.datatype.uuid(),
    info: {
      name: `${faker.address.street()}, ${faker.address.buildingNumber()}`,
    },
    feature: {
      ...points[_i],
      // type: 'Feature',
      // geometry: {
      //   type: 'Point',
      //   coordinates: [faker.address.latitude(), faker.address.longitude()],
      // },
      properties: {
        id,
        name: 'Dinagat Islands',
      },
    } as Feature<Point>,
    type: 'test',
    level: faker.datatype.number({ min: 0, max: 1000, precision: 100 }),
    fields: {},
    parent: null,
    demands: {},
    resources: {},
  }
})
