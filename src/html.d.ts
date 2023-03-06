// for UnoCSS attributify mode compact in Volar
// refer: https://github.com/johnsoncodehk/volar/issues/1077#issuecomment-1145361472

type UnoCSSPropType = `un-${string}`

declare module '@vue/runtime-dom' {
  interface HTMLAttributes {
    [key: UnoCSSPropType]: any
  }
}
declare module '@vue/runtime-core' {
  interface AllowedComponentProps {
    [key: UnoCSSPropType]: any
  }
}

export {}
