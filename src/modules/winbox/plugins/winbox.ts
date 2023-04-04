import WinBox from 'winbox'

import type { WinBoxConstructor } from 'winbox'

declare global {
  interface Window {
    WinBox: WinBoxConstructor
  }
}

export default defineNuxtPlugin(() => {
  window.WinBox = WinBox
})
