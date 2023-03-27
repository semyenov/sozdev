import { winboxWindows } from '../utils/winbox'
import WinboxWindow from './window.vue'

import { ClientOnly } from '#components'

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
    return h(ClientOnly, () =>
      this.windows
        .filter(([id, info]) => info.component)
        .map(([id, info]) => {
          const component = this.app.component(info.component!.name)
          if (!component) {
            logger.error(`Component ${info.component!.name} not found`)

            return null
          }

          return h(
            WinboxWindow,
            {
              key: `${id}`,
              params: { ...info.params, ...info.state },
              component: info.component,
            },
            () => h(component, info.component?.props)
          )
        })
    )
  },
})

export default WinboxRoot
