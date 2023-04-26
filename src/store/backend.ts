import { hasOwnProperty, toArray } from '@antfu/utils'
import { Document } from 'flexsearch'
import copy from 'fast-copy'

import { ApiClient } from '~/api/client'
import type { IObject } from '~/types'
import { IMetaScope } from '~/types'

import type { FetchOptions, SearchParameters } from 'ofetch'

export const backendStoreIdentificator = '_id' as const
export const backendStoreKey = 'backend' as const

const logger = useLogger(`store/${backendStoreKey}`)

export const backendScopeTypes: IMetaScope[] = [
  IMetaScope.OBJECTS,
  IMetaScope.USERS,
  IMetaScope.MOVES,
]
export const backendScopeTypesMap: Partial<Record<IMetaScope, string[]>> = {
  data: ['data'],
  objects: ['objects'],
  users: ['users'],
  moves: ['moves'],
  reports: ['tasks', 'reports'],
}

export const useBackendStore = defineStore(backendStoreKey, () => {
  const authorizationStore = useAuthorizationStore()

  const client = new ApiClient({
    baseURL: getRuntimeConfigKey('apiUri'),
    onRequestError: (ctx) => {
      logger.error(JSON.stringify(ctx, null, 2))
    },
  })

  const objectsIndex = new Document<IObject>({
    // worker: true,
    preset: 'performance',
    document: {
      id: '_id',
      field: [
        'info:name',
        'info:code',
        'resources',
        'demands',
        ...[
          'fd3c3c97-b897-44fd-879c-2921400ed45f',
          'bcdc181a-21d9-4144-a6a4-35ae0280c5ec',
          'c7ac6f88-73b2-46ac-8d7a-a1ed63dfbefa',
          'c1e3da75-fe31-4e95-9957-8ccdfe0e8496',
          'b65d673a-c71b-4ea0-9b7f-80a78f344a8b',
        ].map(id => `fields:${id}`),
      ],
    },
  })

  const store = ref<Map<IMetaScope, Map<string, any>>>(
    new Map(backendScopeTypes.map(scope => [scope, new Map()])),
  )

  const itemsGetterByIds =
    <T>(scope: IMetaScope) =>
    async (ids: string[]) => {
      const storeScopeMap = store.value.get(scope)!

      const missingIds = ids.filter((id) => !storeScopeMap.has(id))
      if (missingIds.length > 0) {
        for (const id of missingIds) {
          await get<T>([scope, 'items', id])
        }
      }

      return computed(() => {
        const storeScopeMap = store.value.get(scope)!
        return ids.map((id) => storeScopeMap.get(id)) as T[]
      })
    }

  const itemsGetter = async <T>(scope: IMetaScope) => {
    const storeScopeMap = store.value.get(scope)!
    if (storeScopeMap.size === 0)
      await get<T[]>([scope, 'items'])

    return computed(() => {
      const storeScopeMap = store.value.get(scope)!
      return Array.from(storeScopeMap.values()) as T[]
    })
  }

  const itemGetter
    = <T>(scope: IMetaScope) =>
      async (id: string) => {
        const storeScopeMap = store.value.get(scope)!

        if (!storeScopeMap.has(id))
          await get<T>([scope, 'items', id])

        return computed(() => {
          return storeScopeMap.get(id) as T | undefined
        })
      }

  // const searchGetter = <T>(scope: IMetaScope) => async (query: string) => {
  //   const storeScopeMap = store.value.get(scope)!
  //   if (scope !== IMetaScope.OBJECTS) {
  //     logger.error('Search is only available for objects')
  //     return
  //   }
  //   const results = objectsIndex.search(query)
  //   const items = results.flatMap(r => r.result.map(id => storeScopeMap.get(id as string) as T))

  //   return computed(() => items)
  // }

  const searchGetter = (scope: IMetaScope) => (query: string) => {
    // const storeScopeMap = store.value.get(scope)!

    return computed(() => {
      if (scope !== IMetaScope.OBJECTS) {
        logger.error('Search is only available for objects')
        return []
      }

      const start = Date.now()
      const results = objectsIndex.search(query, {
        index: [
          'fd3c3c97-b897-44fd-879c-2921400ed45f',
          'bcdc181a-21d9-4144-a6a4-35ae0280c5ec',
          'c7ac6f88-73b2-46ac-8d7a-a1ed63dfbefa',
          'c1e3da75-fe31-4e95-9957-8ccdfe0e8496',
          'b65d673a-c71b-4ea0-9b7f-80a78f344a8b',
        ].map(id => `fields:${id}`),
      })
      const end = Date.now()
      logger.info(`Search for "${query}" took ${end - start}ms`)

      // console.log(results)

      const ids = results.flatMap(r => r.result)
      return ids as string[]
    })
  }

  async function get<T, Q extends SearchParameters = {}>(
    [scope, command, ...params]: [IMetaScope, string, ...string[]],
    query?: Q,
    opts?: FetchOptions<'json'>,
  ): Promise<T | undefined> {
    const uri = formatURI(scope, command, ...params)
    const headers = formatHeaders(authorizationStore.authorization)

    const res = await client.request<T>('get', uri, {
      query,
      headers,
      ...opts,
    })

    if (res.data) {
      setStoreItems(scope, toArray<T>(res.data))
      return res.data
    }
  }

  async function post<T, B extends Record<string, any> = {}>(
    [scope, command, ...params]: [IMetaScope, string, ...string[]],
    body?: B,
    opts?: FetchOptions<'json'>,
  ): Promise<T | undefined> {
    const uri = formatURI(scope, command, ...params)
    const headers = formatHeaders(authorizationStore.authorization)

    const res = await client.request<T>('post', uri, {
      body,
      headers,
      ...opts,
    })

    if (res.data) {
      // setStoreItems(scope, [res.data])
      return res.data
    }
  }

  async function put<T, B extends Record<string, any> = {}>(
    [scope, command, ...params]: [IMetaScope, string, ...string[]],
    body?: B,
    opts?: FetchOptions<'json'>,
  ): Promise<T | undefined> {
    const uri = formatURI(scope, command, ...params)
    const headers = formatHeaders(authorizationStore.authorization)

    const res = await client.request<T>('put', uri, {
      body,
      headers,
      ...opts,
    })

    if (res.data) {
      // setStoreItems(scope, [res.data])
      return res.data
    }
  }

  async function patch<T, B extends Record<string, any> = {}>(
    [scope, command, ...params]: [IMetaScope, string, ...string[]],
    body?: B,
    opts?: FetchOptions<'json'>,
  ): Promise<T | undefined> {
    const uri = formatURI(scope, command, ...params)
    const headers = formatHeaders(authorizationStore.authorization)

    const res = await client.request<T>('patch', uri, {
      body,
      headers,
      ...opts,
    })

    if (res.data) {
      // setStoreItems(scope, [res.data])
      return res.data
    }
  }

  function setStoreItems<T>(scope: IMetaScope, items: T[]) {
    const storeScopeMap = store.value.get(scope)!
    for (const i in items) {
      const item = items[i] as T & { [backendStoreIdentificator]: string }
      if (hasOwnProperty(item, backendStoreIdentificator)) {
        if (scope === IMetaScope.OBJECTS) {
          // console.log(item)

          objectsIndex.add(item as unknown as IObject)
        }

        storeScopeMap.set(item[backendStoreIdentificator], copy(item))
      }
    }

    return true
  }

  return {
    store,

    setStoreItems,

    itemsGetter,
    itemsGetterByIds,

    itemGetter,
    searchGetter,

    get,
    post,
    put,
    patch,
  }
})

function formatHeaders(authorization: string | null): HeadersInit {
  const headers: HeadersInit = []

  if (authorization)
    headers.push(['Authorization', `Bearer ${authorization}`])

  return headers
}

function formatURI(scope: IMetaScope, ...args: string[]) {
  return [...(backendScopeTypesMap[scope] || scope), ...args]
    .filter(item => !!item && item !== '')
    .join('/')
}
