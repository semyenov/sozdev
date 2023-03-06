<script setup lang="ts">
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: 'default',
})

const { t } = useI18n()

const { data } = await useFetch('/api/test', {
  method: 'get',
  query: {
    name: 'Alexander',
  },
})
</script>

<template>
  <UiWinbox
    show
    teleport-id="teleport-layer--10"
    :params="{
      title: t('index.title'),
      class: ['simple', 'wb-left', 'no-close', 'border-l-none'],
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
      class="page page-index h-full max-h-screen w-full flex flex-col items-start overflow-y-scroll p-6 scrollbar box-color__default--1 scrollbar-rounded"
    >
      <PageProse
        v-if="data"
        v-motion
        :initial="{
          y: -100,
          opacity: 0,
        }"
        :enter="{
          y: 0,
          opacity: 1,
        }"
        class="mb-6"
      >
        {{ data.text }}
      </PageProse>

      <div class="flex flex-row justify-center gap-2 text-3xl">
        <i class="i-logos:vue text-9xl" />
        <div
          class="i-twemoji:grinning-face-with-smiling-eyes hover:i-twemoji:face-with-tears-of-joy text-7xl"
        />
        <i
          class="i-mdi:alarm text-6xl text-orange-400"
          un-hover="text-blue-400"
        />
        <i
          class="i-ph:airplane-duotone text-4xl text-blue-600"
          un-dark="text-blue-500"
        />
        <i
          class="i-ph:anchor-simple text-3xl text-gray-600"
          un-dark="text-gray-400"
        />
      </div>
    </div>
  </UiWinbox>
</template>
