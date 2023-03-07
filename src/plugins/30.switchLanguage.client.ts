export default defineNuxtPlugin(async ({ $i18n }) => {
  $i18n.onLanguageSwitched = () => window.location.reload()
})
