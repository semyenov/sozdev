export type WinBoxParamsTether = 'right' | 'left' | 'top' | 'bottom'

export type WinBoxParams = WinBox.Params & {
  id: string
  teleportId: string

  tether?: WinBoxParamsTether[]

  runtime?: boolean
  maximized?: boolean
  minimized?: boolean
}

export interface WinBoxState {
  x: number
  y: number
  width: number
  height: number
  fullscreen: boolean
  minimized: boolean
  maximized: boolean
  active: boolean
}

export interface WinBoxComponent {
  name: string
  props: object
}

export interface IWindowInfo {
  params: WinBoxParams
  state: WinBoxState
  component?: WinBoxComponent
}