export type WinBoxParamsTether = 'right' | 'left' | 'top' | 'bottom'

export interface WinBoxParams extends WinBox.Params {
  id: string
  teleportId: string

  dataComponent?: string
  dataProps?: object

  tether?: WinBoxParamsTether[]
  fullscreen?: boolean
}

export interface WinBoxState {
  x: number
  y: number
  width: number
  height: number
  fullscreen: boolean
  hidden: boolean
  min: boolean
  max: boolean
}

export type WinBoxElement = HTMLElement & {
  winbox?: WinBox
}

export interface WinBoxWindow {
  winbox?: WinBox
  state?: WinBoxState
  params: WinBoxParams
}
