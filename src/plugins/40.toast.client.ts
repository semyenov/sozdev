import type { Toast } from '~/utils/toast/toast.d'

declare global {
  interface Window {
    Toast: Toast
  }
}

const logger = useLogger('plugins/toast')
export default defineNuxtPlugin(async (_nuxtApp) => {
  // nuxtApp.hooks.hookOnce('app:beforeMount', () => {
  //   const toastElement = document.createElement('div')
  //   toastElement.setAttribute('id', '__toasts')
  //   const appRoot = document.querySelector('body')
  //   appRoot?.insertAdjacentElement('beforeend', toastElement)

  //   window.Toast = toaster.getToastRender()
  //   logger.success('added toaster')
  // })
})
