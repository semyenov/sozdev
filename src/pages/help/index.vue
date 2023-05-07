<script setup lang="ts">
const route = useRoute('help')
</script>

<template>
  <div class="page" :class="`page__${route.name}`">
    <WinboxWindow
      :params="{
        id: 'page-help',
        teleportId: 'teleport-layer--10',
        title: $t('help.title'),
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
        <div class="flex flex-col p-4">
          <ContentList path="/" v-slot="{ list }">
            <HelpLink v-for="article in list" :key="article._id" :item="article" />
          </ContentList>
        </div>
      </UiSimplebar>
    </WinboxWindow>
  </div>
</template>
