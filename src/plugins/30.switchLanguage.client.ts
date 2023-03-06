export default defineNuxtPlugin(async (nuxtApp) => {
  const route = useRoute()
  const router = useRouter()

  nuxtApp.$i18n.onBeforeLanguageSwitch = (
    oldLocale: string,
    newLocale: string,
    isInitialSetup: boolean
  ) => {
    console.log('onBeforeLanguageSwitch', oldLocale, newLocale, isInitialSetup)
  }

  nuxtApp.$i18n.onLanguageSwitched = (oldLocale: string, newLocale: string) => {
    let linkTo = '/'
    if (route.name) {
      linkTo = route.fullPath as string
    }
    // nuxtApp.vueApp.$nuxt.$i18n.getLocaleCookie()

    console.log('onLanguageSwitched', oldLocale, newLocale)
    // await navigateTo(linkTo, { external: true, replace: true })
    router.go(0)
  }
})
