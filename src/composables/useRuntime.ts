import type {
  App,
  ConcreteComponent,
  ExtractPropTypes,
  VNodeNormalizedChildren,
} from 'vue'
import { h } from 'vue'
import { ISettingsWindox } from './preserve'

const logger = useLogger('composable/runtime')

// interface IRuntimeObject {
//   preserve?: {}
//   component: VNode
// }

const runtimeContainers = ref<Map<string, Map<string, VNode>>>(new Map())

function removeComponent(
  keyContainer: string,
  keyComponent: string,
  needDelete?: boolean
) {
  const runtimeContainer = runtimeContainers.value.get(keyContainer)
  if (!runtimeContainer) {
    return
  }
  runtimeContainer.delete(keyComponent)
  runtimeContainers.value.set(keyContainer, runtimeContainer)
  logger.info('component deleted')
  if (!needDelete) {
    return
  }
  const preserve = usePreserve()
  preserve.removeItem(keyComponent)
}
interface IRuntimePropsAddComponent {
  keyContainer: string
  keyComponent: string
  VNode: VNode
  preserveInfo?: ISettingsWindox
}

function addComponent({
  keyContainer,
  keyComponent,
  VNode,
  preserveInfo,
}: IRuntimePropsAddComponent) {
  let runtimeContainer = runtimeContainers.value.get(keyContainer)
  // const runtimeObject: IRuntimeObject = {
  //   component: VNode,
  // }

  if (!runtimeContainer) {
    runtimeContainer = new Map()
  }

  if (preserveInfo) {
    const preserve = usePreserve()
    preserve.setItem(keyComponent, { ...preserveInfo })
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

// function renderComponent<T extends ComponentPublicInstance<Component>>() {
//   const wrapper = defineComponent({
//     props: {
//       component: { type: Object },
//     },
//     render() {
//       h(this.$props.component || {}, {}, this.$slots)
//     },
//   })

//   return wrapper as typeof wrapper & T
// }
type TRenderResolvedComponent<T> = (
  keyContainer: string,
  keyComponent: string,
  props: ExtractPropTypes<T>,
  slot?: VNodeNormalizedChildren
) => void

async function renderComponent(
  nameComponent: string,
  resolveCallback: (name: string) => ConcreteComponent | string
) {
  const resolvedComponent = resolveComponent(nameComponent)
  // const resolvedComponent = await resolveCallback(nameComponent)
  console.log(resolvedComponent)

  if (typeof resolvedComponent === 'string') {
    return
  }

  return function renderResolvedComponent(
    keyContainer,
    keyComponent,
    props,
    slot
  ) {
    const component = h(resolvedComponent, props, slot ? slot : [])
    addComponent({
      keyContainer: keyContainer,
      keyComponent: keyComponent,
      VNode: component,
    })
  } as TRenderResolvedComponent<typeof resolvedComponent>
}

export const useRuntime = () => ({
  getRuntimeContainers: () => runtimeContainers,
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
