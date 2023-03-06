import type { AllowedComponentProps, VNode, VNodeProps } from 'vue'
import { defineComponent, h } from 'vue'

type ComponentProps<C extends Component> = C extends new (...args: any) => any
  ? Omit<
      InstanceType<C>['$props'],
      keyof VNodeProps | keyof AllowedComponentProps
    >
  : never

interface GenericSlots<T> {
  props: T
}

export function useGenericComponent<T = unknown>(
  BaseGenericComponent: Component
) {
  const wrapper = defineComponent(
    (props: ComponentProps<typeof BaseGenericComponent>, { slots }) => {
      return () => {
        return h(BaseGenericComponent, props, slots)
      }
    }
  )

  return wrapper as typeof wrapper & {
    new (): {
      $slots: {
        default: (arg: GenericSlots<T>) => VNode[]
      }
    }
  }
}
