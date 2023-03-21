import { IObject, IUser } from '../types'

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.hooks.hookOnce('app:mounted', async () => {
    const runtime = useRuntime()
    const winboxStore = useWinboxStore()
    const nuxtApp = useNuxtApp()

    const backendStore = useBackendStore()

    const preserve = usePreserve()

    const items = preserve.itemsGetter()

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

        const keyContainer = 'winbox'

        const keyComponent = `winbox-${item.value._id}-id`

        const VNode = h(
          component,
          {
            show: true,
            teleportId: 'teleport-layer--20',
            dataId: keyComponent,
            params: {
              ...winboxStore.winboxParams,
              ...(objectPreserve.componentInfo.params || {}),
              title: `${item.value.info.name}`,
            },
            onCloseWindow: () =>
              runtime.removeComponent(keyContainer, keyComponent, true),
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
      })
    })
  })
})
