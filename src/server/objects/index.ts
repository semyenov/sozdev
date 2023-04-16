import { range } from '@antfu/utils'
import { faker } from '@faker-js/faker'

import type { IObject } from '~/types'

const fieldsIds = [
  'fd3c3c97-b897-44fd-879c-2921400ed45f',
  'bcdc181a-21d9-4144-a6a4-35ae0280c5ec',
  'c7ac6f88-73b2-46ac-8d7a-a1ed63dfbefa',
  'c1e3da75-fe31-4e95-9957-8ccdfe0e8496',
  'b65d673a-c71b-4ea0-9b7f-80a78f344a8b',
]

export const items: IObject[] = range(0, 10000).map((_i) => {
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
    fields: fieldsIds.reduce((prev, id) => ({ [id]: faker.internet.domainName(), ...prev }), {}),
    parent: null,
    demands: {
      [faker.datatype.uuid()]: faker.datatype.number({ min: 0, max: 1000, precision: 100 }),
      [faker.datatype.uuid()]: faker.datatype.number({ min: 0, max: 1000, precision: 100 }),
      [faker.datatype.uuid()]: faker.datatype.number({ min: 0, max: 1000, precision: 100 }),
      [faker.datatype.uuid()]: faker.datatype.number({ min: 0, max: 1000, precision: 100 }),
      [faker.datatype.uuid()]: faker.datatype.number({ min: 0, max: 1000, precision: 100 }),
    },
    resources: {
      [faker.datatype.uuid()]: faker.datatype.number({ min: 0, max: 1000, precision: 100 }),
      [faker.datatype.uuid()]: faker.datatype.number({ min: 0, max: 1000, precision: 100 }),
      [faker.datatype.uuid()]: faker.datatype.number({ min: 0, max: 1000, precision: 100 }),
      [faker.datatype.uuid()]: faker.datatype.number({ min: 0, max: 1000, precision: 100 }),
    },
  }
})
