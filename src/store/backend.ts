import { hasOwnProperty, toArray } from '@antfu/utils'
import copy from 'fast-copy'
import { insert, search } from '@orama/orama'
import { isClient } from '@vueuse/core'

import { ApiClient } from '~/api/client'
import { IMetaScope } from '~/types'

import type { FetchOptions, SearchParameters } from 'ofetch'

export const backendStoreIdentificator = '_id' as const
export const backendStoreKey = 'backend' as const

const logger = useConsola(`store/${backendStoreKey}`)

export const backendScopeTypes: IMetaScope[] = [
  IMetaScope.OBJECTS,
  IMetaScope.OBJECT_TYPES,
  IMetaScope.USERS,
  IMetaScope.MOVES,
]

export const backendScopeTypesMap: Partial<Record<IMetaScope, string[]>> = {
  data: ['data'],
  objects: ['objects'],
  object_types: ['objects', 'types'],
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

  const store = ref<Map<IMetaScope, Map<string, any>>>(
    new Map(backendScopeTypes.map(scope => [scope, new Map()])),
  )

  const itemsGetterByIds
    = <T>(scope: IMetaScope) =>
      async (ids: string[]) => {
        const storeScopeMap = store.value.get(scope)!

        const missingIds = ids.filter(id => !storeScopeMap.has(id))
        if (missingIds.length > 0) {
          for (const id of missingIds)
            await get<T>([scope, 'items', id])
        }

        return computed(() => {
          const storeScopeMap = store.value.get(scope)!
          return ids.map(id => storeScopeMap.get(id)) as T[]
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

  const searchGetter = (scope: IMetaScope) => async (query: string) => {
    if (!isClient || !window[scope])
      throw new Error('Search is not available')

    const results = await search(window[scope], {
      term: query,
      properties: '*',
      limit: 100000,
    })
    return results.hits.map(item => item.id)
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
        if (isClient && window[scope]) {
          try {
            insert(window[scope], item)
          }
          catch (e) { console.log(e) }
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
    .filter(item => `${item}`)
    .join('/')
}
