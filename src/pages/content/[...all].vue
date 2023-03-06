<script setup lang="ts">
const { t } = useI18n()

const route = useRoute()
const contentPath = route.path.replace(/^\/content/s, '/')
</script>

<template>
  <UiWinbox
    show
    teleport-id="teleport-layer--10"
    :params="{
      title: t('content.title'),
      class: ['simple', 'wb-left', 'no-move', 'no-close', 'border-l-none'],
      index: 10,
      border: 0,
      top: 0,
      left: 44,
      bottom: 0,
      right: '50%',
      height: '100%',
      minheight: '100%',
      width: 550,
      minwidth: 500,
      tether: ['left', 'top', 'bottom'],
    }"
  >
    <div
      class="h-full max-h-screen w-full flex flex-col items-start overflow-y-scroll p-6 scrollbar scrollbar-rounded"
    >
      <ContentDoc :path="contentPath" />
    </div>
  </UiWinbox>
</template>
