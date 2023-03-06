import { range } from '@antfu/utils'
import { faker } from '@faker-js/faker'

import type { IObject } from '~/types'

export const items: IObject[] = range(0, 100000).map((_i) => {
  const id = faker.datatype.uuid()

  return {
    _id: faker.datatype.uuid(),
    info: {
      name: `${faker.address.street()}, ${faker.address.buildingNumber()}`,
    },
    feature: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [faker.address.latitude(), faker.address.longitude()],
      },
      properties: {
        id,
        name: 'Dinagat Islands',
      },
    },
    type: 'test',
    level: faker.datatype.number({ min: 0, max: 1000, precision: 100 }),
    fields: {},
    parent: null,
    demands: {},
    resources: {},
  }
})
