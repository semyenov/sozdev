import { create, insertMultiple } from '@orama/orama'

import { IMetaScope } from '~/types'
import type { IObject, IUser } from '~/types'

import type { Orama } from '@orama/orama'

declare global {
  interface Window extends Record<IMetaScope, Orama> {}
}

const logger = useConsola('plugins/orama')

export default defineNuxtPlugin((nuxtApp) => {
  const backendStore = useBackendStore()

  nuxtApp.hooks.hookOnce('app:mounted', () => {
    create({
      language: 'russian',
      schema: {
        _id: 'string',
        info: {
          name: 'string',
          code: 'string',
        },
        fields: {
          'fd3c3c97-b897-44fd-879c-2921400ed45f': 'string',
          'bcdc181a-21d9-4144-a6a4-35ae0280c5ec': 'string',
          'c7ac6f88-73b2-46ac-8d7a-a1ed63dfbefa': 'string',
          'c1e3da75-fe31-4e95-9957-8ccdfe0e8496': 'string',
          'b65d673a-c71b-4ea0-9b7f-80a78f344a8b': 'string',
        },
      },
      components: {
        getDocumentIndexId(doc: IObject) {
          return doc._id
        },
        // required if schema is valid return undefined to skip validation
        validateSchema(doc, schema) {
          if (typeof doc._id !== schema._id) {
            logger.warn('validateSchema', doc)
            return '_id'
          }
          return undefined
        },

      },
    }).then((index) => {
      logger.info(`Create window[${IMetaScope.OBJECTS}] index`)
      window[IMetaScope.OBJECTS] = index

      logger.info(`Insert window[${IMetaScope.OBJECTS}] data`)
      backendStore.itemsGetter<IObject>(IMetaScope.OBJECTS).then((items) => {
        insertMultiple(index, items.value).catch((e) => {
          logger.info('error insert', e.message)
        })
      })
    })

    create({
      schema: {
        _id: 'string',
        email: 'string',
        info: {
          first_name: 'string',
          last_name: 'string',
          phone: 'string',
        },
      },
      components: {
        getDocumentIndexId(doc: IUser) {
          return doc._id
        },
        validateSchema(doc, schema) {
          if (typeof doc._id !== schema._id)
            return '_id'

          return undefined
        },
      },
    }).then((index) => {
      logger.info(`Create window[${IMetaScope.USERS}] index`)
      window[IMetaScope.USERS] = index

      logger.info(`Insert window[${IMetaScope.USERS}] data`)
      backendStore.itemsGetter<IUser>(IMetaScope.USERS).then((items) => {
        insertMultiple(index, items.value)
      })
    })
  })
})
