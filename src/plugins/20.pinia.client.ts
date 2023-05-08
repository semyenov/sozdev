import { create, insertMultiple, search } from '@orama/orama'

import { ApiClient } from '~/api/client'
import type { IMetaScope } from '~/types'

import type { Pinia, PiniaPlugin } from 'pinia'
import type { Components, Document, Orama, Schema } from '@orama/orama'

declare module 'pinia' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  export interface DefineStoreOptionsBase<S, Store> {
    orama?: {
      schema: Schema
      language?: string
      components?: Components
    }
  }

  export interface PiniaCustomProperties<Id, S, G, A> {
    $options: {
      id: Id
      state?: () => S
      getters?: G
      actions?: A
    }
    store: Orama
    searchGetter?: (term: string) => Promise<string[]>
  }
}

const logger = useLogger('plugins/pinia')

export const backendScopeTypesMap: Partial<Record<IMetaScope, string[]>> = {
  data: ['data'],
  objects: ['objects'],
  users: ['users'],
  moves: ['moves'],
  reports: ['tasks', 'reports'],
}

function createPlugin(client: ApiClient): PiniaPlugin {
  return function ({ store, options: { orama } }) {
    if (orama) {
      create(orama)
        .then((o) => {
          store.store = markRaw(o)
          store.searchGetter = term =>
            search(store.store, {
              term,
              properties: '*',
              limit: 100000,
            })
              .then((results) => {
                return results.hits.map(item => item.id)
              })

          const uri = formatURI(store.$id as IMetaScope, 'items')
          client.request('get', uri).then((res) => {
            if (res.data)
              insertMultiple(store.store, res.data as Document[])
          })
        })
    }
  }
}

export default defineNuxtPlugin((ctx) => {
  logger.info('context', ctx)

  const client = new ApiClient({
    baseURL: getRuntimeConfigKey('apiUri'),
    onRequestError: (ctx) => {
      logger.error(JSON.stringify(ctx, null, 2))
    },
  })

  const pinia = ctx.$pinia as Pinia
  pinia.use(createPlugin(client))
})

function formatURI(scope: IMetaScope, ...args: string[]) {
  return [...(backendScopeTypesMap[scope] || scope), ...args]
    .filter(item => !!item && item !== '')
    .join('/')
}
