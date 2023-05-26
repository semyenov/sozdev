import { range } from '@antfu/utils'
import { faker } from '@faker-js/faker'
import { bbox, randomPosition } from '@turf/turf'

import jsonData from '~/public/geojson/tula.json'
import type { IObject } from '~/types'

const fieldsIds = [
  'fd3c3c97-b897-44fd-879c-2921400ed45f',
  'bcdc181a-21d9-4144-a6a4-35ae0280c5ec',
  'c7ac6f88-73b2-46ac-8d7a-a1ed63dfbefa',
  'c1e3da75-fe31-4e95-9957-8ccdfe0e8496',
  'b65d673a-c71b-4ea0-9b7f-80a78f344a8b',
]

const lineBBox = bbox(jsonData.features.find((item) => {
  return item.id === 4775559
}))

export const items = range(0, 10000).map((_i) => {
  const item: IObject = {
    _id: faker.string.uuid(),
    info: {
      name: `${faker.location.street()}, ${faker.location.buildingNumber()}`,
      code: `${faker.string.alpha(3)}-${faker.string.numeric()}`,
    },
    feature: {
      id: faker.string.uuid(),
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: randomPosition(lineBBox),
      },
      state: {},
      properties: {
        label: faker.string.alpha(3),
        id: faker.string.uuid(),
        // color: Array.from({ length: 3 }, () =>
        //   faker.number.float({ min: 0, max: 255 }),
        // ) as [number, number, number],

        icon: 'map-icons/medical/plus_empty/7.svg',
      },
    },
    type: 'test',
    level: faker.number.float({ min: 0, max: 1000, precision: 100 }),
    fields: fieldsIds.reduce((prev, id) => ({ [id]: faker.internet.domainName(), ...prev }), {}),
    parent: null,
    demands: {
      [faker.string.uuid()]: faker.number.float({ min: 0, max: 1000, precision: 100 }),
      [faker.string.uuid()]: faker.number.float({ min: 0, max: 1000, precision: 100 }),
      [faker.string.uuid()]: faker.number.float({ min: 0, max: 1000, precision: 100 }),
      [faker.string.uuid()]: faker.number.float({ min: 0, max: 1000, precision: 100 }),
      [faker.string.uuid()]: faker.number.float({ min: 0, max: 1000, precision: 100 }),
    },
    resources: {
      [faker.string.uuid()]: faker.number.float({ min: 0, max: 1000, precision: 100 }),
      [faker.string.uuid()]: faker.number.float({ min: 0, max: 1000, precision: 100 }),
      [faker.string.uuid()]: faker.number.float({ min: 0, max: 1000, precision: 100 }),
      [faker.string.uuid()]: faker.number.float({ min: 0, max: 1000, precision: 100 }),
    },
  }

  return item
})
