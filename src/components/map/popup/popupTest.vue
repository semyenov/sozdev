<script setup lang="ts">
import type { Feature, Point } from 'geojson'

const props = withDefaults(defineProps<{
  content: Feature<Point>
}>(),
{})
</script>

<template>
  <div id="objects-popup">
    <div class="custom-tooltip custom-tooltip--object">
      <div class="custom-tooltip__header">
        <h3>cluster count: {{ props.content.properties?.point_count }}</h3>
      </div>
    </div>
  </div>
</template>
