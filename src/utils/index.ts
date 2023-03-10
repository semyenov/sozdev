import { App, render, Teleport, createApp } from '@vue/runtime-dom'
import { UiButton } from '#components'
import { isClient } from '@vueuse/shared'
import { useRuntime } from '~/composables/useRuntime'
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

export function renderTest(_app: App, count: Ref<number>) {
  if (!isClient) {
    return
  }
  const runtime = useRuntime()

  const runtimeMap = runtime.getRuntimeNode()
  const runtimeTarget = runtime.getRuntimeTarget()
  const listNode = runtimeMap.value.get('button') || []
  const button = h(UiButton, { onClick: () => count.value++ }, () =>
    h('span', count.value)
  )
  listNode.push(button)
  runtimeMap.value.set('button', listNode)
  runtimeTarget.value = 'button'
}
