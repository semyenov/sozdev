import { createApp, App, watch } from 'vue'

const createRuntimeApp = (id: string, mapNode: Ref<Map<string, VNode[]>>) => {
  const appRoot = document.createElement('div')
  const listNode = mapNode.value.get(id) || []
  appRoot.setAttribute('id', `__${id}_root`)
  document.querySelector('body')?.appendChild(appRoot)
  const component = defineComponent({
    render: () =>
      h(
        'div',
        {
          id: `${id}_app`,
          style: { zIndex: 0 },
          class: ['fixed top-0 left-0 right-0  '],
        },
        [...listNode]
      ),
  })

  const app = createApp(h(component, {}, () => h('span', 'www')))
  app.mount(appRoot)
  return app
}

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.hooks.hookOnce('app:mounted', () => {
    const runtime = useRuntime()
    const runtimeMapNode = runtime.getRuntimeNode()
    const runtimeApps = runtime.getRuntimeApps()

    console.log(runtimeMapNode)
    console.log(isRef(runtimeMapNode))

    watch(
      runtimeMapNode,
      (mapNode) => {
        const target = runtime.getRuntimeTarget()
        if (!target.value) {
          return
        }
        console.log('watch plugin')
        let appTarget = runtimeApps.value.get(target.value)
        if (!appTarget) {
          appTarget = createRuntimeApp(target.value, runtimeMapNode)
          runtimeApps.value.set(target.value, appTarget)
        }
      },
      { deep: true }
    )
  })
})
