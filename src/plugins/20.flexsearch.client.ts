import { Document } from 'flexsearch'

import type { IUser } from '~/types'
import { IMetaScope } from '~/types'

declare global {
  interface Window {
    UsersIndex: Document<IUser>
  }
}

export default defineNuxtPlugin(async (_nuxtApp) => {
  const backendStore = useBackendStore()

  _nuxtApp.hooks.hookOnce('app:mounted', () => {
    window.UsersIndex = new Document<IUser>({
      document: {
        id: '_id',
        field: ['email', 'info:first_name', 'info:last_name'],
      },
    })

    for (const item of backendStore.store.get(IMetaScope.USERS)!.entries()) {
      window.UsersIndex.add(item[0], item[1])
    }

    // console.log('Flexsearch', window.UsersIndex.export(console.log))
  })
})
