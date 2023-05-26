import { IMetaScope } from '~/types'
import type { IObjectType, IObjectTypeUpdateInput } from '~/types'

export const objectTypesStoreKey = IMetaScope.OBJECT_TYPES as const

export const useObjectTypesStore = defineStore(objectTypesStoreKey, () => {
  const backendStore = useBackendStore()

  const itemsGetterByIds = backendStore.itemsGetterByIds<IObjectType>(
    IMetaScope.OBJECT_TYPES,
  )
  const itemGetter = backendStore.itemGetter<IObjectType>(IMetaScope.OBJECT_TYPES)
  const itemsGetter = backendStore
    .itemsGetter<IObjectType>(IMetaScope.OBJECT_TYPES)
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
  const searchGetter = backendStore.searchGetter(IMetaScope.OBJECT_TYPES)

  const getItems = () =>
    backendStore.get<IObjectType>([IMetaScope.OBJECT_TYPES, 'items'])
  const getItem = (id: string) =>
    backendStore.get<IObjectType>([IMetaScope.OBJECT_TYPES, 'items', id])
  const putItem = (id: string, input: IObjectTypeUpdateInput) =>
    backendStore.put<IObjectType, IObjectTypeUpdateInput>(
      [IMetaScope.OBJECT_TYPES, 'items', id],
      input,
    )

  return {
    itemsGetter,
    itemsGetterByIds,
    itemGetter,
    searchGetter,

    getItems,
    getItem,
    putItem,
  }
})
