import { faker } from '@faker-js/faker'
import { range } from '@antfu/utils'

import { IMetaScope } from '~/types'
import type { IUser } from '~/types'

export const items: IUser[] = range(0, 10000).map(_i => ({
  _id: faker.string.uuid(),
  info: {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    phone: faker.phone.number(),
  },
  type: 'test',
  mandate: faker.number.float({ min: 0, max: 9 }),
  role: faker.number.float({ min: 0, max: 50, precision: 10 }),
  email: faker.internet.email(),
  scopes: [
    IMetaScope.OBJECTS,
    IMetaScope.OBJECT_TYPES,
    IMetaScope.OBJECT_FIELDS,
    IMetaScope.OBJECT_RESOURCES,
  ],
}))
