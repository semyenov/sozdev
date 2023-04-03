export type WinBoxParamsTether = 'right' | 'left' | 'top' | 'bottom'

export interface WinBoxParams extends WinBox.Params {
  id: string
  teleportId: string

  dataComponent?: string
  dataProps?: object

  tether?: WinBoxParamsTether[]
  full?: boolean
}

export interface WinBoxBbox {
  left: number
  right: number
  top: number
  bottom: number
  maxwidth: number
  maxheight: number
  minwidth: number
  minheight: number
}

export interface WinBoxState {
  max: boolean
  min: boolean
  full: boolean
  hidden: boolean

  x: number
  y: number
  width: number
  height: number
}

export type WinBoxElement = HTMLElement & {
  winbox?: WinBox
}

export interface WinBoxWindow {
  params: WinBoxParams
  state?: WinBoxState
  winbox?: WinBox
}