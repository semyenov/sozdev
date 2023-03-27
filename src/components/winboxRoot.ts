import { UiWinboxTest } from '#components'

const logger = useLogger(`winboxRoot`)
const WinboxRoot = defineComponent({
  setup() {
    const { vueApp } = useNuxtApp()
    const windows = computed(() => {
      return [...winboxWindows.value.entries()]
    })
    return { vueApp, windows }
  },
  render() {
    return this.windows.map(([id, info]) => {
      const component = this.vueApp.component(info.component?.name || '321')

      logger.info('id', id)

      if (!component) {
        logger.error(`Component ${info.component?.name} not found`)
        return ''
      }
      logger.info('id', id)
      return h(
        UiWinboxTest,
        { key: id, params: info.params, component: info.component },
        () => h(component, info.component?.props)
      )
    })
  },
})
export default WinboxRoot
