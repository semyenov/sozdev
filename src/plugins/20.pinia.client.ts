import { create, insert, insertMultiple, search } from '@orama/orama'

import { ApiClient } from '~/api/client'
import type { IMetaScope } from '~/types'

import type { Pinia, PiniaPlugin } from 'pinia'
import type { Components, Document, Orama, Results, Schema, SearchParams } from '@orama/orama'

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

    db: Orama

    search?: (params: SearchParams) => Promise<Results>
    insertMultiple?: (items: Document[]) => Promise<string[]>
    insert?: (item: Document) => Promise<string>
  }

  export interface PiniaCustomStateProperties<S> {
    ts: number
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
      store.$state.ts = 0
      create(orama)
        .then((db) => {
          store.db = markRaw(db)

          store.search = params =>
            search(store.db, params)
          store.insertMultiple = items =>
            insertMultiple(store.db, items)
          store.insert = item =>
            insert(store.db, item)

          const uri = formatURI(store.$id as IMetaScope, 'items')
          client.request('get', uri).then((res) => {
            if (res.data) {
              insertMultiple(store.db, res.data as Document[])
                .then(() => {
                  store.$patch((state) => {
                    logger.log('hello')
                    state.ts = Date.now()
                    return state
                  })
                })
            }
          })
        })
    }
  }
}

export default defineNuxtPlugin((ctx) => {
  logger.info('context', ctx)

  const pinia = ctx.$pinia as Pinia
  const client = new ApiClient({
    baseURL: getRuntimeConfigKey('apiUri'),
    onRequestError: (ctx) => {
      logger.error(JSON.stringify(ctx, null, 2))
    },
  })

  ctx.hooks.hookOnce('app:beforeMount', async () => {
    pinia.use(createPlugin(client))
  })
})

function formatURI(scope: IMetaScope, ...args: string[]) {
  return [...(backendScopeTypesMap[scope] || scope), ...args]
    .filter(item => !!item && item !== '')
    .join('/')
}
