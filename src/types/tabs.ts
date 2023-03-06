import type { ComponentInternalInstance } from 'vue'

export interface TabsPanelsState {
  panels: Ref<ComponentInternalInstance[]>
  active: Ref<number>
}
export interface TabsListState {
  tabs: Ref<ComponentInternalInstance[]>
  selectTab: (tab: number) => void
  active: Ref<number>
}
