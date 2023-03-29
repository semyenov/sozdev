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

  max: boolean
  min: boolean
  hidden: boolean
  fullscreen: boolean
}

export type WinBoxElement = HTMLElement & {
  winbox?: WinBox
}

export interface WinBoxWindow {
  params: WinBoxParams
  state?: WinBoxState
  winbox?: WinBox
}
