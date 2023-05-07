<script setup lang="ts">
const route = useRoute('content-all')
const contentPath = route.params.all.join('/')
</script>

<template>
  <div class="page" :class="`page__${route.name}`">
    <WinboxWindow
      :params="{
        id: 'page-content-all',
        teleportId: 'teleport-layer--10',
        title: $t('content.title'),
        class: ['wb-left', 'no-header'],
        border: 0,
        top: 45,
        left: 45,
        bottom: 0,
        width: 400,
        minwidth: 300,
        tether: ['left', 'top', 'bottom'],
      }"
    >
      <UiSimplebar
        class="overflow-auto"
        :scrollbar-min-size="100"
        :scrollbar-max-size="300"
      >
        <ContentDoc class="p-4" :path="contentPath" />
      </UiSimplebar>
    </WinboxWindow>
  </div>
</template>
