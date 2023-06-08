import type { MapboxOverlay } from '@deck.gl/mapbox/typed'
import type MapboxDraw from '@mapbox/mapbox-gl-draw'

import type { IControl } from 'maplibre-gl'
import { ShallowRef } from 'nuxt/dist/app/compat/capi'

export type TMapboxOverlay = MapboxOverlay & IControl

export type TMapboxDraw = MapboxDraw & IControl


export type TMapLibreRef = ShallowRef<maplibregl.Map | null>
