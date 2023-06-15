<script setup lang="ts">
import { getSourceTemplate } from '../utils'

import type { TSourceTemplate } from '../types'
import type { Map, SourceSpecification } from 'maplibre-gl'
import type { ShallowRef } from 'nuxt/dist/app/compat/capi'

const props = withDefaults(defineProps<{
  sourceId: string
  sourceTemplate?: TSourceTemplate
  sourceOptions: SourceSpecification
}>(), {
})

const map = inject('map-key') as ShallowRef<Map>
const initialized = shallowRef<boolean>(false)
const sourceOptions = Object.assign(getSourceTemplate(props.sourceTemplate), props.sourceOptions)

onMounted(() => initializeLayer())
function initializeLayer() {
  map.value.addSource(`${props.sourceId}`,
    sourceOptions)
  initialized.value = true
}
</script>

<template>
  <slot v-if="initialized" />
</template>
