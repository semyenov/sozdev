import { Document } from 'flexsearch'

import { IMetaScope } from '~/types'
import type { IUser } from '~/types'

declare global {
  interface Window {
    UsersIndex: Document<IUser>
  }
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const backendStore = useBackendStore()

  nuxtApp.hooks.hookOnce('app:mounted', () => {
    window.UsersIndex = new Document<IUser>({
      document: {
        id: '_id',
        field: ['email', 'info:first_name', 'info:last_name'],
      },
    })

    for (const item of backendStore.store.get(IMetaScope.USERS)!.entries())
      window.UsersIndex.add(item[0], item[1])

    // console.log('Flexsearch', window.UsersIndex.export(console.log))
  })
})
