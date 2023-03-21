import { App, render, Teleport, createApp } from '@vue/runtime-dom'
import { UiButton } from '#components'
import { isClient } from '@vueuse/shared'
import { useRuntime } from '~/composables/useRuntime'
import { nanoid } from 'nanoid'
export * from './virtual'

export function validateUuid(str: string) {
  const chars = '0123456789abcdef'
  const regex = createRegExp(
    charIn(chars)
      .times(8)
      .at.lineStart()
      .and(exactly('-'))
      .and(
        charIn(chars)
          .times(4)
          .and(exactly('-'))
          .and(
            charIn(chars)
              .times(4)
              .and(exactly('-'))
              .and(
                charIn(chars)
                  .times(4)
                  .and(exactly('-'))
                  .and(charIn(chars).times(12).at.lineEnd())
              )
          )
      )
  )

  return regex.test(str)
}

export function castArray<T>(arr: T | T[]) {
  return Array.isArray(arr) ? arr : [arr]
}

export function renderTest(_app: App, count: Ref<number>, text: Ref<string>) {
  if (!isClient) {
    return
  }
  const runtime = useRuntime()
  const runtimeMap = runtime.getRuntimeContainers()
  const childrenApp = runtimeMap.value.get('button') || new Map()
  const id = nanoid()
  const button = h(
    UiButton,
    {
      onClick: () => count.value++,
      key: id,
    },
    {
      default: () => [
        h('span', count.value),
        h('span', { onClick: () => runtime.removeComponent('button', id) }, [
          [`delete component ${id}`],
        ]),
      ],
      foo: (el: Element) => 'foo',
    }
  )
  childrenApp.set(id, button)
  runtimeMap.value.set('button', childrenApp)
}

export function convertUnits(
  type: 'width' | 'height',
  value?: string | number
) {
  return typeof value === 'number'
    ? value
    : typeof value === 'string'
    ? (parseFloat(value.slice(0, value.length - 1)) / 100) *
      (type === 'width' ? window.innerWidth : window.innerHeight)
    : 0
}
