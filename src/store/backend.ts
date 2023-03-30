import type { FetchOptions, SearchParameters } from 'ofetch'

import { acceptHMRUpdate, defineStore } from 'pinia'
import { hasOwnProperty, toArray } from '@antfu/utils'

import { isClient } from '@vueuse/core'
import { ApiClient } from '~/api/client'
import { IMetaScope } from '~/types'

export const backendStoreIdentificator = '_id' as const
export const backendStoreKey = 'backend' as const

const logger = useLogger(`store/${backendStoreKey}`)

export const backendScopeTypes: IMetaScope[] = [
  IMetaScope.OBJECTS,
  IMetaScope.USERS,
]
export const backendScopeTypesMap: Partial<Record<IMetaScope, string[]>> = {
  data: ['data'],
  objects: ['objects'],
  users: ['users'],
}

export const useBackendStore = defineStore(backendStoreKey, () => {
  const runtimeConfig = useRuntimeConfig()
  const baseURL = !isClient
    ? 'http://127.0.0.1:3000/api'
    : runtimeConfig.public.apiUri

  const authorizationStore = useAuthorizationStore()

  const client = new ApiClient({
    baseURL,
    onRequestError: (ctx) => {
      logger.error(JSON.stringify(ctx, null, 2))
    },
  })

  const store = ref<Map<IMetaScope, Map<string, any>>>(
    new Map(backendScopeTypes.map((scope) => [scope, new Map()]))
  )

  const itemGetterByIds = async <T>(scope: IMetaScope, ids: string[]) => {
    const storeScopeMap = store.value.get(scope)!
    const missingIds = ids.filter((id) => !storeScopeMap.has(id))

    if (missingIds.length > 0) {
      await get<T[]>([scope, 'items'], { ids: missingIds })
    }

    return computed(() => {
      return ids.map((id) => storeScopeMap.get(id)) as T[]
    })
  }

  const itemsGetter = async <T>(scope: IMetaScope) => {
    const storeScopeMap = store.value.get(scope)!
    if (storeScopeMap.size === 0) {
      await get<T[]>([scope, 'items'])
    }

    return computed(() => {
      return Array.from(storeScopeMap.values()) as T[]
    })
  }

  const itemGetter =
    <T>(scope: IMetaScope) =>
    async (id: string) => {
      const storeScopeMap = store.value.get(scope)!

      if (!storeScopeMap.has(id)) {
        await get<T>([scope, 'items', id])
      }

      return computed(() => {
        return storeScopeMap.get(id) as T | undefined
      })
    }

  async function get<T, Q extends SearchParameters = {}>(
    [scope, command, ...params]: [IMetaScope, string, ...string[]],
    query?: Q,
    opts?: FetchOptions<'json'>
  ): Promise<T | undefined> {
    const uri = formatURI(scope, command, ...params)
    const headers = formatHeaders(authorizationStore.authorization)

    const res = await client.request<T>('get', uri, {
      query,
      headers,
      baseURL,
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
    opts?: FetchOptions<'json'>
  ): Promise<T | undefined> {
    const uri = formatURI(scope, command, ...params)
    const headers = formatHeaders(authorizationStore.authorization)

    const res = await client.request<T>('post', uri, {
      body,
      baseURL,
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
    opts?: FetchOptions<'json'>
  ): Promise<T | undefined> {
    const uri = formatURI(scope, command, ...params)
    const headers = formatHeaders(authorizationStore.authorization)

    const res = await client.request<T>('put', uri, {
      body,
      headers,
      baseURL,
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
    opts?: FetchOptions<'json'>
  ): Promise<T | undefined> {
    const uri = formatURI(scope, command, ...params)
    const headers = formatHeaders(authorizationStore.authorization)

    const res = await client.request<T>('patch', uri, {
      body,
      headers,
      baseURL,
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
        storeScopeMap.set(item[backendStoreIdentificator], item)
      }
    }

    return true
  }

  return {
    store,

    setStoreItems,

    itemsGetter,
    itemGetterByIds,

    itemGetter,

    get,
    post,
    put,
    patch,
  }
})

function formatHeaders(authorization: string | null): HeadersInit {
  const headers: HeadersInit = []

  if (authorization) {
    headers.push(['Authorization', `Bearer ${authorization}`])
  }

  return headers
}

function formatURI(scope: IMetaScope, ...args: string[]) {
  return [...(backendScopeTypesMap[scope] || scope), ...args]
    .filter((item) => !!item && item !== '')
    .join('/')
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBackendStore, import.meta.hot))
}
