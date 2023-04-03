import { acceptHMRUpdate, defineStore } from 'pinia'

import type { IObject, IObjectUpdateInput } from '~/types'
import { IMetaScope } from '~/types'

export const movesStoreKey = IMetaScope.MOVES as const

export const useMovesStore = defineStore(movesStoreKey, () => {
  const backendStore = useBackendStore()

  const itemsGetterByIds = backendStore.itemsGetterByIds<IObject>(
    IMetaScope.MOVES
  )
  const itemGetter = backendStore.itemGetter<IObject>(IMetaScope.MOVES)
  const itemsGetter = backendStore
    .itemsGetter<IObject>(IMetaScope.MOVES)
    .then((items) =>
      computed(() =>
        items.value
          .filter((item) => {
            return !!item.info.name
          })
          .sort((a, b) => {
            const ah = a.info.name.trimStart()
            const bh = b.info.name.trimStart()

            if (ah === bh) {
              return 0
            }

            return ah > bh ? 1 : -1
          })
          .map((item) => item._id)
      )
    )

  const getItems = () => backendStore.get<IObject>([IMetaScope.MOVES, 'items'])
  const getOthers = () =>
    backendStore.get<IObject>([IMetaScope.MOVES, 'others'])
  const getItem = (id: string) =>
    backendStore.get<IObject>([IMetaScope.MOVES, 'items', id])
  const putItem = (id: string, input: IObjectUpdateInput) =>
    backendStore.put<IObject, IObjectUpdateInput>(
      [IMetaScope.MOVES, 'items', id],
      input
    )

  return {
    itemsGetter,
    itemsGetterByIds,
    itemGetter,

    getItems,
    getOthers,
    getItem,
    putItem,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useObjectsStore, import.meta.hot))
}
