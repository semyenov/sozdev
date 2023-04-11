import { range } from '@antfu/utils'
import { faker } from '@faker-js/faker'

import { items as objects } from '../objects'

import type { IMove, IMoveType } from '~/types/'

export const items = range(0, 10).map((_i) => {
  const receiver
    = objects[faker.datatype.number({ min: 0, max: objects.length - 1 })]
  const sender
    = objects[faker.datatype.number({ min: 0, max: objects.length - 1 })]
  const item: IMove = {
    _id: faker.datatype.uuid(),
    info: {
      name: `${faker.address.street()}, ${faker.address.buildingNumber()}`,
    },
    receiver: receiver._id,
    sender: sender._id,
    resource: 'oil',
    value: faker.datatype.number({ min: 100, max: 1000 }),
    type: faker.datatype.number({
      min: 10,
      max: 40,
      precision: 10,
    }) as IMoveType,
    document: 'document',
    group: 'group',
    public: faker.datatype.boolean(),
    feature: {
      sender: sender.feature,
      receiver: receiver.feature,
    },
  }

  return item
})
