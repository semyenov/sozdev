export type WinBoxParamsTether = 'right' | 'left' | 'top' | 'bottom'

export type WinBoxParams = WinBox.Params & {
  id: string
  teleportId: string

  runtime?: boolean

  dataId?: string
  dataComponent?: string

  tether?: WinBoxParamsTether[]

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

export interface IWindowInfo {
  params: WinBoxParams
  state: WinBoxState
}
