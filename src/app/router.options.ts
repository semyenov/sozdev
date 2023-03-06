import qs from 'qs'
import type { RouterOptions } from '@nuxt/schema'

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterOptions>{
  parseQuery: qs.parse,
  stringifyQuery: qs.stringify,

  scrollBehavior(_from, _to, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return {
      top: 0,
      left: 0,
    }
  },
}
