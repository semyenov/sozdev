import { ClientOnly, WinboxWindow } from '#components'

const logger = useLogger(`winboxRoot`)

const WinboxRoot = defineComponent({
  setup() {
    const { vueApp: app } = useNuxtApp()
    const windows = computed(() => {
      return [...winboxWindows.value.values()]
    })
    return { app, windows }
  },
  render() {
    return h(ClientOnly, () =>
      this.windows
        .filter((window) => window.component && window.component.name)
        .map((info) => {
          const component = this.app.component(info.component!.name)
          if (!component) {
            logger.error(`Component ${info.component!.name} not found`)

            return null
          }

          return h(
            WinboxWindow,
            {
              key: info.params.id,
              params: info.params,
              component: info.component,
            },
            () => h(component, info.component?.props)
          )
        })
    )
  },
})

export default WinboxRoot
