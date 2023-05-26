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
        class: ['no-header'],
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
        class="overflow-auto"
        :scrollbar-min-size="100"
        :scrollbar-max-size="300"
      >
        <div class="flex flex-col p-4">
          <ContentList
            v-slot="{
              list,
            }: {
                list: Array<{
                _id: string
                title: string
                description: string
                _path: string
              }>
            }" path="/"
          >
            <HelpLink v-for="article in list" :key="article._id" :item="article" />
          </ContentList>
        </div>
      </UiSimplebar>
    </WinboxWindow>
  </div>
</template>
