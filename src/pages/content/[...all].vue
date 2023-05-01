<script setup lang="ts">
const { t } = useI18n()

const route = useRoute('content-all')
const contentPath = route.params.all.join('/')
</script>

<template>
  <div class="page" :class="`page__${route.name}`">
    <WinboxWindow
      :params="{
        id: 'page-content-all',
        teleportId: 'teleport-layer--10',
        title: t('content.title'),
        class: ['wb-left', 'no-close'],
        border: 0,
        top: 45,
        left: 45,
        bottom: 0,
        width: 400,
        minwidth: 300,
        tether: ['left', 'top', 'bottom'],
      }"
    >
      <div
        class="h-full max-h-screen w-full flex flex-col items-start overflow-y-scroll p-4"
      >
        <ContentDoc :path="contentPath" />
      </div>
    </WinboxWindow>
  </div>
</template>
