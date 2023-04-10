import chroma from 'chroma-js'
import { objectMap, range } from '@antfu/utils'
import {
  presetUno as createPresetUno,
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import transformerCompileClass from '@unocss/transformer-compile-class'

import type {
  UIColorVariants,
  UIRoundedVariants,
  UISizeVariants,
  UnoColorVariants,
} from '~/types/ui'

import { presetChroma } from './unocss-preset-chroma'

export const unoColorVariants: UnoColorVariants[] = [
  'rose',
  'pink',
  'fuchsia',
  'purple',
  'violet',
  'indigo',
  'blue',
  'sky',
  'cyan',
  'teal',
  'emerald',
  'green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'red',
  'gray',
  'slate',
  'zinc',
  'neutral',
  'stone',
]

export const uiSizeVariants: UISizeVariants[] = ['xs', 'sm', 'md', 'lg', 'xl']

export const uiColorVariants: UIColorVariants[] = [
  'default',
  'primary',
  'secondary',
  'third',
  'fourth',
]

export const uiRoundedVariants: UIRoundedVariants[] = [
  'none',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'full',
]

const presetUno = createPresetUno()
const presetUnoTheme = presetUno.theme!

type UnoTheme = typeof presetUnoTheme
type UnoColors = Exclude<typeof presetUnoTheme.colors, undefined>

const shortcuts = {
  ...[...unoColorVariants, ...uiColorVariants].reduce(
    (s, c) => ({
      ...s,
      [`box-color__${c}--1`]: `
        bg-${c}-50
        text-${c}-600
        border-${c}-250

        dark:bg-${c}-900
        dark:text-${c}-400
        dark:border-${c}-800
      `,
      [`box-color__${c}--2`]: `
        bg-${c}-100
        text-${c}-650
        border-${c}-250

        dark:bg-${c}-850
        dark:text-${c}-350
        dark:border-${c}-750
      `,
      [`box-color__${c}--3`]: `
        bg-${c}-150
        text-${c}-700
        border-${c}-300

        dark:bg-${c}-750
        dark:text-${c}-100
        dark:border-${c}-800
      `,
      [`box-color__${c}--4`]: `
        bg-${c}-200
        text-${c}-750
        border-${c}-350

        dark:bg-${c}-700
        dark:text-${c}-100
        dark:border-${c}-750
      `,
      [`box-color__${c}--5`]: `
        bg-${c}-500
        text-${c}-50
        border-${c}-550

        dark:bg-${c}-650
        dark:text-${c}-100
        dark:border-${c}-700
      `,
      [`box-color__${c}--6`]: `
        bg-${c}-550
        text-${c}-50
        border-${c}-650

        dark:bg-${c}-550
        dark:text-${c}-50
        dark:border-${c}-650
      `,
      [`box-color__${c}--7`]: `
        bg-${c}-650
        text-${c}-100
        border-${c}-700

        dark:bg-${c}-500
        dark:text-${c}-900
        dark:border-${c}-700
      `,
      [`box-color__${c}--8`]: `
        bg-${c}-700
        text-${c}-100
        border-${c}-750

        dark:bg-${c}-450
        dark:text-${c}-900
        dark:border-${c}-650
      `,
      [`box-color__${c}--9`]: `
        bg-${c}-750
        text-${c}-100
        border-${c}-800

        dark:bg-${c}-400
        dark:text-${c}-900
        dark:border-${c}-700
      `,

      [`list-color__${c}`]: `
        divide-y
        bg-white
        divide-${c}-300
        border-${c}-350

        dark:divide-${c}-800
        dark:border-${c}-800
        dark:bg-gray-900
      `,
    }),
    {} as Record<string, string>,
  ),

  ...[...uiRoundedVariants].reduce(
    (s, c) => ({
      ...s,
      [`list-rounded__${c}`]: `
        last-rounded-b-${c}
        first-rounded-t-${c}
      `,
    }),
    {} as Record<string, string>,
  ),

  'box-rounded__xs': 'rounded-sm',
  'box-rounded__sm': 'rounded',
  'box-rounded__md': 'rounded-md',
  'box-rounded__lg': 'rounded-lg',
  'box-rounded__xl': 'rounded-xl',
  'box-rounded__full': 'rounded-full',

  'box-size__xs': 'gap-1 px-3 py-1.5 text-xs min-h-6',
  'box-size__sm': 'gap-1.5 px-3.5 py-2 text-sm min-h-8',
  'box-size__md': 'gap-2 px-3.5 py-2.25 text-base min-h-10',
  'box-size__lg': 'gap-2.5 px-3.75 py-2.5 text-lg min-h-12',
  'box-size__xl': 'gap-3 px-4 py-3 text-xl min-h-13',
}

const lightThemeBg = '#ffffff'
const darkThemeBg = '#1c1b22'

function createColorScale(
  color: UnoColors | string,
  steps = 18,
): UnoColors | string {
  if (!color)
    return '#ff00ff'

  if (typeof color === 'string')
    return color

  const start = color[300] as string
  const base = color[500] as string
  const stop = color[700] as string

  return chroma
    .scale([lightThemeBg, start, base, stop, darkThemeBg])
    .mode('lab')
    .colors(steps)
    .reduce(
      (s, c, i) => ({
        ...s,
        [50 * (i + 1)]: chroma(c)
          .brighten(0.08 * i - 0.6)
          .saturate((-i + steps) * 0.02 - 0.3)
          .darken(0.05 * i - 0.5)
          .hex(),
      }),
      {} as UnoColors,
    )
}

export default defineConfig<UnoTheme>({
  extendTheme: (theme) => {
    if (!theme.colors)
      return

    if (typeof theme.colors === 'string')
      return theme.colors

    theme.colors = objectMap(theme.colors, (key, color) => {
      return [key, createColorScale(color)]
    })

    theme.colors.default = theme.colors.coolGray
    theme.colors.primary = theme.colors.emerald
    theme.colors.secondary = theme.colors.sky
    theme.colors.third = theme.colors.rose
    theme.colors.fourth = theme.colors.yellow

    return theme
  },
  // rules: [['custom-rule', { color: 'red' }]],
  safelist: [
    ...range(12).map(i => `gap-${i / 2}`),
    ...Object.keys(shortcuts).flatMap(c => [
      `${c}`,
      `!${c}`,
      `hover:${c}`,
      `focus:${c}`,
    ]),
  ],

  presets: [
    presetIcons(),
    presetAttributify(),
    presetTypography(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        lato: 'Lato',
      },
    }),
    presetUno,
    presetChroma(),
  ],

  transformers: [transformerDirectives(), transformerVariantGroup(), transformerCompileClass()],

  shortcuts,
})
