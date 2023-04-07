import { IMetaScope } from '~/types'
import type { IObject, IObjectUpdateInput } from '~/types'

export const objectsStoreKey = IMetaScope.OBJECTS as const

export const useObjectsStore = defineStore(objectsStoreKey, () => {
  const backendStore = useBackendStore()

  const itemGetter = backendStore.itemGetter<IObject>(IMetaScope.OBJECTS)
  const itemsGetter = backendStore
    .itemsGetter<IObject>(IMetaScope.OBJECTS)
    .then(items =>
      computed(() =>
        items.value
          .filter((item) => {
            return !!item.info.name
          })
          .sort((a, b) => {
            const ah = a.info.name.trimStart()
            const bh = b.info.name.trimStart()

            if (ah === bh)
              return 0

            return ah > bh ? 1 : -1
          })
          .map(item => item._id),
      ),
    )
  const searchGetter = backendStore.searchGetter(IMetaScope.OBJECTS)

  const getItems = () =>
    backendStore.get<IObject>([IMetaScope.OBJECTS, 'items'])
  const getOthers = () =>
    backendStore.get<IObject>([IMetaScope.OBJECTS, 'others'])
  const getItem = (id: string) =>
    backendStore.get<IObject>([IMetaScope.OBJECTS, 'items', id])
  const putItem = (id: string, input: IObjectUpdateInput) =>
    backendStore.put<IObject, IObjectUpdateInput>(
      [IMetaScope.OBJECTS, 'items', id],
      input,
    )

  return {
    itemsGetter,
    itemGetter,
    searchGetter,

    getItems,
    getOthers,
    getItem,
    putItem,
  }
})
