import { UiWinboxTest } from '#components'

const logger = useLogger(`winboxRoot`)

const WinboxRoot = defineComponent({
  setup() {
    const { vueApp: app } = useNuxtApp()
    const windows = computed(() => {
      return [...winboxWindows.value.entries()]
    })
    return { app, windows }
  },
  render() {
    return this.windows.map(([id, info]) => {
      const component = this.app.component(info.component?.name || '')
      if (!component) {
        logger.error(`Component ${info.component?.name} not found`)

        return null
      }

      return h(
        UiWinboxTest,
        { key: id, params: info.params, component: info.component },
        () => h(component, info.component?.props)
      )
    })
  },
})

export default WinboxRoot
