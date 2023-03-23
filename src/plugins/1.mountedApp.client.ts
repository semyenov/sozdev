export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.hooks.hookOnce('app:mounted', () => {
    // const runtime = useRuntime()
    // const runtimeMapNode = runtime.getRuntimeContainers()
    // const runtimeApps = runtime.getRuntimeApps()
    // console.log(runtimeMapNode)
    // console.log(isRef(runtimeMapNode))
    // watch(
    //   runtimeMapNode,
    //   (mapNode) => {
    //     console.log(mapNode)
    //     const target = runtime.getRuntimeTarget()
    //     if (!target.value) {
    //       return
    //     }
    //     console.log('watch plugin')
    //     if (!runtimeApps.value.has(target.value)) {
    //       const pinia = nuxtApp.payload.pinia as Pinia
    //       // const i18n = nuxtApp.
    //       console.log(nuxtApp)
    //       const appTarget = runtime.createRuntimeApp(
    //         target.value,
    //         runtimeMapNode,
    //         pinia
    //         // i18n
    //       )
    //       runtimeApps.value.set(target.value, appTarget)
    //     }
    //   },
    //   { deep: true }
    // )
  })
})
