import { Pinia } from 'pinia'
import type { App, ComponentPropsOptions } from 'vue'
import { createApp, h, onMounted } from 'vue'

const logger = useLogger('composable/runtime')

const runtimeContainers = ref<Map<string, Map<string, VNode>>>(new Map())
const runtimeApps = ref<Map<string, App>>(new Map())

function removeComponent(keyContainer: string, keyComponent: string) {
  const runtimeContainer = runtimeContainers.value.get(keyContainer)
  if (!runtimeContainer) {
    return
  }
  const isDelete = runtimeContainer.delete(keyComponent)
  if (isDelete) {
    runtimeContainers.value.set(keyContainer, runtimeContainer)
    logger.info('component deleted')
  }
}
interface IRuntimePropsAddComponent {
  keyContainer: string
  keyComponent: string
  VNode: VNode
}

function addComponent({
  keyContainer,
  keyComponent,
  VNode,
}: IRuntimePropsAddComponent) {
  let runtimeContainer = runtimeContainers.value.get(keyContainer)
  if (!runtimeContainer) {
    runtimeContainer = new Map()
  }
  runtimeContainer.set(keyComponent, VNode)
  runtimeContainers.value.set(keyContainer, runtimeContainer)
  logger.success('component added')
}
function checkComponent(keyContainer: string, keyComponent: string) {
  const container = runtimeContainers.value.get(keyContainer)
  if (!container) {
    return false
  }
  return container.has(keyComponent)
}

function renderComponent<T extends ComponentPublicInstance<Component>>() {
  const wrapper = defineComponent({
    props: {
      component: { type: Object },
    },
    render() {
      h(this.$props.component || {}, {}, this.$slots)
    },
  })

  return wrapper as typeof wrapper & T
}

export const useRuntime = () => ({
  getRuntimeContainers: () => runtimeContainers,
  getRuntimeApps: () => runtimeApps,
  removeComponent,
  addComponent,
  checkComponent,
  renderComponent,
})

// const createRuntimeApp = (
//   id: string,
//   mapNode: Ref<Map<string, Map<string, VNode>>>,
//   pinia: Pinia
//   // i18: I18n
// ) => {
//   const appRoot = document.createElement('div')
//   const childrenApp = mapNode.value.get(id) || new Map()

//   appRoot.setAttribute('id', `__${id}_root`)
//   document.querySelector('body')?.appendChild(appRoot)

//   const component = defineComponent({
//     data: () => {
//       return {
//         title: '123321',
//       }
//     },
//     mounted: function () {
//       if (!this) {
//         return
//       }

//       const title = this.test()
//     },
//     setup(props, ctx) {
//       const number = 1
//       return number
//     },
//     methods: {
//       test() {
//         return this.title
//       },
//     },
//     render: function () {
//       return h(
//         'div',
//         {
//           id: `${id}_app`,
//           key: `${id}_app`,
//           style: { zIndex: 0 },
//           class: ['fixed top-0 left-0 right-0'],
//         },
//         [...childrenApp.values()]
//       )
//     },
//   })

//   const appComponent = defineComponent({
//     render: () => component,
//   })

//   const app = createApp(h(appComponent))
//   app.use(pinia)
//   app.mount(appRoot)
//   return app
// }
