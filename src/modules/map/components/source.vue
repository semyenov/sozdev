<script setup lang="ts">
import { getSourceTemplate } from '../utils'

import type { TSourceTemplate } from '../types'
import type { Map, SourceSpecification } from 'maplibre-gl'
import type { ShallowRef } from 'nuxt/dist/app/compat/capi'

const props = withDefaults(defineProps<{
  sourceId: string
  sourceTemplate?: TSourceTemplate
  sourceOptions: SourceSpecification
}>(), {})

const map: ShallowRef<Map> | undefined = inject('map-key')
const initialized = ref<boolean>(false)
const sourceOptions = Object.assign(getSourceTemplate(props.sourceTemplate), props.sourceOptions)

onMounted(() => initializeLayer())

function initializeLayer() {
  if (!map)
    return

  map.value.addSource(
    props.sourceId,
    sourceOptions,
  )
  initialized.value = true
}
</script>

<template>
  <slot v-if="initialized" />
</template>
