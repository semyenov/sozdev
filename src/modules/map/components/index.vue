<script setup lang="ts">
const { initializeMap } = useMap()

// onMounted(() => initializeMap({
//   container: 'mapContainer',
//   style: '/map/styles/streets/style.json',
//   center: [37.61199474334717, 54.198741669025175],
//   maxZoom: 18,
//   minZoom: 0,
//   zoom: 14,
//   attributionControl: false,
//   trackResize: true,
//   localIdeographFontFamily: '\'Noto Sans Regular\', \'Roboto Regular\'',
// }))
</script>

<template>
  <div
    class="layout-default__map fixed left-0 top-0 h-full w-full flex flex-grow"
  >
    <!-- <div id="mapContainer" class="layout-default__map z-0 h-full w-full" /> -->
  </div>
</template>
