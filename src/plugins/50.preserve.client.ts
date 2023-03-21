import { IObject, IUser } from '~/types'

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.hooks.hookOnce('app:mounted', async () => {
    const runtime = useRuntime()
    const winboxCompose = useWinbox()
    const nuxtApp = useNuxtApp()

    const backendStore = useBackendStore()

    const items = winboxCompose.preserveItemsGetter()

    const preserveItems = await Promise.all(
      items.map(async (objectPreserve) => {
        const component = nuxtApp.vueApp.component(
          objectPreserve.componentInfo.name
        )

        let child: Component | undefined

        if (!component) {
          return
        }

        const itemGetter = backendStore.itemGetter<IObject | IUser>(
          objectPreserve.item.scope
        )
        const item = await itemGetter(objectPreserve.item.id)
        if (!item.value) {
          return
        }

        if (objectPreserve.componentInfo.slot) {
          child = nuxtApp.vueApp.component(
            objectPreserve.componentInfo.slot.name
          )
        }

        const keyContainer = winboxCompose.idContainer.value

        const keyComponent = objectPreserve.componentInfo.id
        const callbackPreserveDelete = winboxCompose.removePreserveItem

        const VNode = h(
          component,
          {
            show: true,
            teleportId: 'teleport-layer--20',
            dataId: keyComponent,
            params: {
              ...winboxCompose.winboxParams,
              ...(objectPreserve.componentInfo.params || {}),
            },
            onCloseWindow: () =>
              runtime.removeComponent(
                keyContainer,
                keyComponent,
                true,
                callbackPreserveDelete
              ),
          },
          () => child && h(child, {}, () => item.value && item.value.info.name)
        )

        return { VNode, keyContainer, objectPreserve, keyComponent }
      })
    )

    preserveItems.forEach((preserveItems) => {
      if (!preserveItems) {
        return
      }
      runtime.addComponent({
        keyContainer: preserveItems.keyContainer,
        keyComponent: preserveItems.keyComponent,
        VNode: preserveItems.VNode,
        preserveInfo: { ...preserveItems.objectPreserve },
        setterPreserve: winboxCompose.setPreserveItem,
      })
    })
  })
})
