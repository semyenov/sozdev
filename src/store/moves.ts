import { acceptHMRUpdate, defineStore } from 'pinia'

import type { IMove, IMoveUpdateInput } from '~/types'
import { IMetaScope } from '~/types'

export const movesStoreKey = IMetaScope.MOVES as const

export const useMovesStore = defineStore(movesStoreKey, () => {
  const backendStore = useBackendStore()

  const itemsGetterByIds = backendStore.itemsGetterByIds<IMove>(
    IMetaScope.MOVES
  )
  const itemGetter = backendStore.itemGetter<IMove>(IMetaScope.MOVES)
  const itemsGetter = backendStore
    .itemsGetter<IMove>(IMetaScope.MOVES)
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

  const getItems = () => backendStore.get<IMove>([IMetaScope.MOVES, 'items'])
  const getOthers = () => backendStore.get<IMove>([IMetaScope.MOVES, 'others'])
  const getItem = (id: string) =>
    backendStore.get<IMove>([IMetaScope.MOVES, 'items', id])
  const putItem = (id: string, input: IMoveUpdateInput) =>
    backendStore.put<IMove, IMoveUpdateInput>(
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
