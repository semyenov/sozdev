import type { WinBoxConstructor } from 'winbox'
import WinBox from 'winbox'
declare global {
  interface Window {
    WinBox: WinBoxConstructor
  }
}

export default defineNuxtPlugin(async (_nuxtApp) => {
  _nuxtApp.hooks.hookOnce('app:mounted', () => {
    window.WinBox = WinBox
  })
})
