import type {
  IUser,
  IUserLoginInput,
  IUserTokensData,
  IUserUpdateInput,
} from '~/types'
import { IMetaScope } from '~/types'

export const usersStoreKey = IMetaScope.USERS as const

export const useUsersStore = defineStore(usersStoreKey, () => {
  const backendStore = useBackendStore()

  const testCount = ref<number>(0)

  const itemGetter = backendStore.itemGetter<IUser>(IMetaScope.USERS)
  const itemsGetter = backendStore
    .itemsGetter<IUser>(IMetaScope.USERS)
    .then(items =>
      computed(() =>
        items.value
          .filter((item) => {
            return !!item.info.first_name
          })
          .sort((a, b) => {
            const ah = a.info.first_name.trimStart()
            const bh = b.info.first_name.trimStart()

            if (ah === bh)
              return 0

            return ah > bh ? 1 : -1
          })
          .map(item => item._id),
      ),
    )

  const getItems = () => backendStore.get<IUser>([IMetaScope.USERS, 'items'])
  const getItem = (id: string) =>
    backendStore.get<IUser>([IMetaScope.USERS, 'items', id])
  const putItem = (id: string, input: IUserUpdateInput) =>
    backendStore.put<IUser, IUserUpdateInput>(
      [IMetaScope.USERS, 'items', id],
      input,
    )

  const getCurrent = () =>
    backendStore.get<IUser>([IMetaScope.USERS, 'current'])
  const postCurrent = (body: IUserLoginInput) =>
    backendStore.post<IUserTokensData, IUserLoginInput>(
      [IMetaScope.USERS, 'current'],
      body,
    )

  return {
    itemsGetter,
    itemGetter,

    getItems,
    getItem,
    putItem,

    getCurrent,
    postCurrent,

    testCount,
  }
})
