<script setup lang="ts">

const runtime = useRuntime()
const apps = runtime.getRuntimeContainers()
const refElements = ref<Map<string, Element| ComponentPublicInstance|null>>(new Map)

</script>

<template>
  <div
    class="layout layout-modals fixed w-full"
  >
      <div  v-for="[keyApp, app] of apps.entries()" :key="keyApp" :id="keyApp" :ref="(el) => refElements.set(keyApp, el)">
          <component
            v-for="[key,component] of app.entries()"
            :root-el="refElements.get(keyApp)"
            :key="key" :is="component">
          </component>
      </div>
  </div>
</template>
