import type { MapboxOverlay } from '@deck.gl/mapbox/typed'
import type MapboxDraw from '@mapbox/mapbox-gl-draw'

import type { IControl, Map, MapLayerEventType, SourceSpecification, LayerSpecification, CustomLayerInterface, MapTouchEvent, MapMouseEvent  } from 'maplibre-gl'
import { ShallowRef } from 'nuxt/dist/app/compat/capi'
import { never } from 'zod'


export type TMapboxOverlay = MapboxOverlay & IControl

export type TMapboxDraw = MapboxDraw & IControl


export type TMapLibreRef = ShallowRef<maplibregl.Map | null>



// export type TLayerEvent<T extends keyof MapLayerEventType  = unknown> = MapMouseEvent & {
//   features?: MapGeoJSONFeature[] | undefined;
// } | MapTouchEvent & {
//   features?: MapGeoJSONFeature[] | undefined;
// } & Object | MapLayerEventType[T] & {
//   features?: MapGeoJSONFeature[] | undefined;
// } & Object

export type TLayerEvent = 'click' | 'dblclick' | 'mousedown' | 'mouseup' | 'mousemove' | 'mouseenter' | 'mouseleave' | 'mouseover' | 'mouseout' | 'contextmenu' | 'touchstart' | 'touchend' | 'touchcancel'


export type TLayerTemplate = 'object' | 'cluster' | undefined
export type TSourceTemplate = 'object' | 'cluster' | undefined


export type TLayerOptions = (LayerSpecification & {
  source?: string | SourceSpecification
}) | CustomLayerInterface
