import type { Options, TRenderFunction } from './toast.d'
import { validateOptions } from './validate'
import { appendStylesheet } from './styles'
import renderToast from './render'

/**
 * **Options:**
 * @property `class` - Global class to be added to each toast.
 * @property `disableClick` - Disable toast removal on click.
 * @property `duration` - Time in milliseconds before hiding the toast notification,
 * set to `false` for an indefinite duration.
 * @property `pauseOnHover` - Pause toast duration on `mouseover`, resume on `mouseout`.
 * @property `max` - Max number of toasts allowed at any one time.
 * @property `positionX` - 'left', 'right' or 'center'.
 * @property `positionY` - 'top' or 'bottom'.
 * @property `styles` - CSS key/value pairs.
 */
function checkOptions(globalOptions: Options = {}) {
  const options = globalOptions

  // Set defaults
  if (options.duration === undefined) {
    options.duration = 5000
  }
  if (options.pauseOnHover === undefined) {
    options.pauseOnHover = true
  }
  if (!options.positionY) {
    options.positionY = 'bottom'
  }
  if (!options.positionX) {
    options.positionX = 'right'
  }
  validateOptions(options)
  appendStylesheet(options)
  return options
}
const toastPlugin = {
  // install(app: App, globalOptions: Options): void {
  //   const options = checkOptions(globalOptions)
  //   renderToast(app, options);
  // },

  getToastRender(): TRenderFunction {
    const options = checkOptions()
    return renderToast(null, options)
  },
}

export default toastPlugin
