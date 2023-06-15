<script setup lang="ts">
import type { Feature, Point } from 'geojson'

const props = withDefaults(defineProps<{
  content: Feature<
        Point,
        { id: string; label: string }
      >
}>(),
{})
</script>

<template>
  <div id="popup">
    {{ props.content.properties }}
  </div>
</template>
