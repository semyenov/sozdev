import { Document } from 'flexsearch'

import { IMetaScope } from '~/types'
import type { IUser } from '~/types'

declare global {
  interface Window {
    UsersIndex: Document<IUser>
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const backendStore = useBackendStore()

  window.UsersIndex = new Document<IUser>({
    worker: true,
    preset: 'performance',
    document: {
      id: '_id',
      field: ['email', 'info:first_name', 'info:last_name'],
    },
  })

  nuxtApp.hooks.hookOnce('app:mounted', async () => {
    for (const item of backendStore.store.get(IMetaScope.USERS)!.entries())
      await window.UsersIndex.addAsync(item[0], item[1])

  //   // console.log('Flexsearch', window.UsersIndex.export(console.log))
  })
})
