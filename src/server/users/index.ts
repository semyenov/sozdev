import { faker } from '@faker-js/faker'
import { range } from '@antfu/utils'

import type { IUser } from '~/types'
import { IMetaScope } from '~/types'

export const items: IUser[] = range(0, 10000).map((_i) => ({
  _id: faker.datatype.uuid(),
  info: {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    phone: faker.phone.number(),
  },
  type: 'test',
  mandate: faker.datatype.number({ min: 0, max: 9 }),
  role: faker.datatype.number({ min: 0, max: 50, precision: 10 }),
  email: faker.internet.email(),
  scopes: [
    IMetaScope.OBJECTS,
    IMetaScope.OBJECT_TYPES,
    IMetaScope.OBJECT_FIELDS,
    IMetaScope.OBJECT_RESOURCES,
  ],
}))
