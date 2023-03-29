import { Suspense } from '@vue/runtime-core'

import { winboxWindows } from '../utils/winbox'
import WinboxWindow from './window.vue'

import { ClientOnly } from '#components'

const logger = useLogger(`modules/winbox/components/root`)

const WinboxRoot = defineComponent({
  render() {
    const { vueApp: app } = useNuxtApp()

    return h(ClientOnly, { key: 'winbox-root--client-only' }, () =>
      Array.from(winboxWindows.value.entries())
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
              key: `${id}--winbox`,
              params: {
                ...window.params,
                ...window.state,
              },
            },
            h(Suspense, { key: `${id}--suspence` }, () =>
              h(component, {
                key: `${id}--component`,
                ...window.params?.dataProps,
              })
            )
          )
        })
    )
  },
})

export default WinboxRoot
