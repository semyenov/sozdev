<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const { t } = useI18n()
const route = useRoute('index')

const { data } = await useFetch('/api/test', {
  method: 'get',
  query: {
    name: 'Alexander',
  },
})
</script>

<template>
  <div class="page" :class="`page__${route.name}`">
    <WinboxWindow
      :params="{
        id: 'page-index',
        teleportId: 'teleport-layer--10',
        title: t('index.title'),
        class: ['simple', 'wb-left', 'no-close'],
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
        class="w-full flex h-full max-h-screen flex-col items-start overflow-y-scroll p-6 scrollbar scrollbar-rounded page page-index box-color__default--1"
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

        <NuxtImg provider="unsplash" src="photo-1549574518-8f791f8a16d4" sizes="xs:200px md:500px lg:1024" class="mb-6" />

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
            class="text-4xl i-ph:airplane-duotone text-blue-600"
            un-dark="text-blue-500"
          />
          <i
            class="text-3xl i-ph:anchor-simple text-gray-600"
            un-dark="text-gray-400"
          />
        </div>
      </div>
    </WinboxWindow>
  </div>
</template>
