// import { winboxWindows } from '../utils/winbox'
import { WinboxWindow } from '#components'
import { winboxWindows } from '../utils/winbox'

const WinboxRoot = defineComponent({
  render() {
    const { vueApp: app } = useNuxtApp()

    const windows = computed(() => {
      return [...winboxWindows.value.entries()]
    })

    return windows.value
      .filter(([, window]) => {
        return window.params.dataComponent && window.params.dataComponent !== ''
      })
      .map(([id, window]) => {
        const component = app.component(window.params.dataComponent!)
        if (!component) {
          throw new Error(`Component ${window.params.dataComponent!} not found`)
        }

        return h(
          WinboxWindow,
          {
            key: `${id}`,
            params: {
              ...window.params,
              ...window.state,
            },
          },
          () => h(component, window.params?.dataProps)
        )
      })
  },
})

export default WinboxRoot
