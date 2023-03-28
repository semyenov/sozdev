import { winboxWindows } from '../utils/winbox'

import { ClientOnly, WinboxWindow } from '#components'

const logger = useLogger(`modules/winbox/components/root`)

const WinboxRoot = defineComponent({
  setup() {
    const { vueApp } = useNuxtApp()
    const windows = computed(() => {
      return [...winboxWindows.value.entries()]
    })

    return {
      app: vueApp,
      windows,
    }
  },

  render() {
    const { app, windows } = this

    return h(ClientOnly, () =>
      windows
        .filter(([_, window]) => {
          return (
            window.params.dataComponent && window.params.dataComponent !== ''
          )
        })
        .map(([id, window]) => {
          const component = app.component(window.params.dataComponent!)
          if (!component) {
            logger.error(`Component ${window.params.dataComponent!} not found`)

            return null
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
    )
  },
})

export default WinboxRoot
