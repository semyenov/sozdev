export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.hooks.hookOnce('app:mounted', async () => {
    const items = preservedItemsGetter()
    for (const item of items) {
      const { toggleWinbox } = useWinbox(item)
      toggleWinbox()
    }
  })
})
