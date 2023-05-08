import { IMetaScope } from '~/types'
import type { IObject, IObjectUpdateInput } from '~/types'

export const objectsStoreKey = IMetaScope.OBJECTS as const

export const useObjectsStore = defineStore(objectsStoreKey, () => {
  const backendStore = useBackendStore()

  const itemsGetterByIds = backendStore.itemsGetterByIds<IObject>(
    IMetaScope.OBJECTS,
  )
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
    itemsGetterByIds,
    itemGetter,

    getItems,
    getOthers,
    getItem,
    putItem,
  }
}, {
  orama: {
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
    },
  },
})
