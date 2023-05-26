<script setup lang="ts">
// import type { NuxtComponentMetaNames } from '#nuxt-component-meta/types'

definePageMeta({
  layout: 'default',
})

const route = useRoute('index')

// const specificComponentName = ref<NuxtComponentMetaNames>('WinboxObjectsDetailItem')

// const specificComponentMeta = await useComponentMeta(specificComponentName)
// const composableData = await useComponentMeta()

const { data } = await useFetch('/api/test', {
  method: 'get',
  query: {
    name: 'Alexander',
  },
})
// const { themes, activeThemeName, activeTheme } = useAnu()
</script>

<template>
  <div class="page" :class="`page__${String(route.name)}`">
    <WinboxWindow
      :params="{
        id: 'page-index',
        teleportId: 'teleport-layer--10',
        title: $t('index.title'),
        class: ['no-header'],
        index: 10,
        border: 0,
        top: 44,
        left: 44,
        bottom: -1,
        right: -1,
        width: 400,
        minwidth: 300,
        tether: ['left', 'top', 'bottom'],
      }"
    >
      <UiSimplebar
        class="chroma-linear-3-lab-blue-100-red-100 chroma-shape-[to_bottom] overflow-auto"
        :scrollbar-min-size="100"
        :scrollbar-max-size="300"
      >
        <div
          class="flex flex-col items-start p-4"
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

          <!-- {{ themes }} -->
          <!-- <PageProse
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
            <h2>
              <span>Components from</span>
              <code>useComponentMeta('{{ specificComponentName }}')</code>
            </h2>
            <pre>{{ specificComponentMeta }}</pre>

            <h2>
              <span>Components from</span>
              <code>useComponentMeta</code>
            </h2>
            <pre>{{ composableData }}</pre>
          </PageProse> -->

          <div class="flex flex-row justify-center gap-2 text-3xl">
            <i class="i-logos:vue text-8xl" />
            <div
              class="i-twemoji:grinning-face-with-smiling-eyes text-7xl hover:i-twemoji:face-with-tears-of-joy"
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
      </UiSimplebar>
    </WinboxWindow>
  </div>
</template>
