import 'winbox'

import type { WinBoxConstructor } from 'winbox'

declare global {
  interface Window {
    WinBox: WinBoxConstructor
  }
}

export default defineNuxtPlugin(async (_nuxtApp) => {
  // nuxtApp.hooks.hookOnce('app:mounted', () => {
  //   // window.WinBox = WinBox
  // })
})
