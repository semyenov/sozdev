import { IMetaScope } from './client'

export interface IWindowInfo {
  x: number
  y: number
  width: number
  height: number
  fullscreen: boolean
  minimized: boolean
  maximized: boolean
  active: boolean
  needSave?: boolean
}

export type WinBoxParamsTether = 'right' | 'left' | 'top' | 'bottom'

export type WinBoxParams = WinBox.Params & {
  tether?: WinBoxParamsTether[]
  needSave?: boolean
  maximized?: boolean
  minimized?: boolean
}

export type TWinboxParamsKeys =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'border'
  | 'width'
  | 'height'
  | 'minwidth'
  | 'class'
  | 'tether'
  | 'needSave'

export interface ISettingsWindox {
  componentInfo: {
    name: string
    id: string
    params?: {
      [key: string]: string | number | boolean | undefined
      title?: string
    }
    slot?: {
      name: string
    }
  }
  item: {
    scope: IMetaScope
    id: string
  }
}

export interface ISettingsWindoxStorage {
  [id: string]: ISettingsWindox
}
