import type { App } from 'vue'
import { createApp, h, onMounted } from 'vue'

const runtimeMap = ref<Map<string, VNode[]>>(new Map())
const runtimeApps = ref<Map<string, App>>(new Map())
const runtimeTarget = ref<string>('')

export const useRuntime = () => ({
  getRuntimeNode: () => runtimeMap,
  getRuntimeApps: () => runtimeApps,
  getRuntimeTarget: () => runtimeTarget,
})
