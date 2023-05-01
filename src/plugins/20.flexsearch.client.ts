import { Document } from 'flexsearch'

import { IMetaScope } from '~/types'
import type { IUser } from '~/types'

import type { Orama } from '@orama/orama'

declare global {
  interface Window {
    UsersIndex: Document<IUser>
    Orama: Orama
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hookOnce('app:mounted', async () => {
    const backendStore = useBackendStore()

    window.UsersIndex = new Document<IUser>({
      worker: true,
      preset: 'performance',
      document: {
        id: '_id',
        field: ['email', 'info:first_name', 'info:last_name'],
      },
    })
    for (const item of backendStore.store.get(IMetaScope.USERS)!.entries())
      await window.UsersIndex.addAsync(item[0], item[1])

    // window.UsersIndex.search({})
  //   // console.log('Flexsearch', window.UsersIndex.export(console.log))
  })
})
