import { MapboxOverlay } from '@deck.gl/mapbox/typed'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

import type { IControl } from 'maplibre-gl'

export type TMapboxOverlay = MapboxOverlay & IControl

export type TMapboxDraw = MapboxDraw & IControl
