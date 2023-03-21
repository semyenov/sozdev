import { ISettingsWindox } from '~/types/winbox'

const logger = useLogger('composable/runtime')

const runtimeContainers = ref<Map<string, Map<string, VNode>>>(new Map())

function removeComponent(
  keyContainer: string,
  keyComponent: string,
  needDelete?: boolean,
  deletePresereve?: Function
) {
  const runtimeContainer = runtimeContainers.value.get(keyContainer)
  if (!runtimeContainer) {
    return
  }
  runtimeContainer.delete(keyComponent)
  runtimeContainers.value.set(keyContainer, runtimeContainer)
  if (deletePresereve) {
    deletePresereve.call(globalThis, keyComponent)
  }
  logger.info(`component deleted`)
}
interface IRuntimePropsAddComponent {
  keyContainer: string
  keyComponent: string
  VNode: VNode
  preserveInfo?: ISettingsWindox
  setterPreserve?: Function
}

function addComponent({
  keyContainer,
  keyComponent,
  VNode,
  preserveInfo,
  setterPreserve,
}: IRuntimePropsAddComponent) {
  let runtimeContainer = runtimeContainers.value.get(keyContainer)

  if (!runtimeContainer) {
    runtimeContainer = new Map()
  }

  if (preserveInfo && setterPreserve) {
    // const winboxCompose = useWinbox()
    // winboxCompose.setPreserveItem.call(globalThis, keyComponent, { ...preserveInfo })
    setterPreserve.call(globalThis, keyComponent, { ...preserveInfo })
    // winboxCompose.setPreserveItem(keyComponent, { ...preserveInfo })
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

export const useRuntime = () => ({
  getRuntimeContainers: () => runtimeContainers,
  removeComponent,
  addComponent,
  checkComponent,
})
