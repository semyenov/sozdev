<script setup lang="ts">
const localePath = useLocalePath()
const { setLocale, locale } = useI18n()
</script>

<template>
  <div
    class="box-color__default--2 flex flex-grow flex-col justify-between border-r bg-white"
  >
    <div class="flex flex-col">
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'index' })"
        custom
      >
        <ABtn
          class="border-b border-b-dashed"
          color="teal"
          :states="!isActive"
          icon="i-carbon:home"
          icon-only
          variant="text"
          @click="navigate"
        >
          <!-- <i class="i-carbon:home inline-block h-6.5" />
          </UiButton> -->
        </abtn>
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'objects' })"
        custom
      >
        <ABtn
          class="border-b border-b-dashed"
          color="teal"
          :states="!isActive"
          icon="i-carbon:data-blob"
          icon-only
          variant="text"
          @click="navigate"
        />
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'users' })"
        custom
      >
        <ABtn
          class="border-b border-b-dashed"
          color="teal"
          :states="!isActive"
          icon="i-carbon:user"
          icon-only
          variant="text"
          @click="navigate"
        />
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'test' })"
        custom
      >
        <ABtn
          class="border-b border-b-dashed"
          color="teal"
          :states="!isActive"
          icon="i-carbon:text-scale"
          icon-only
          variant="text"
          @click="navigate"
        />
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'content-all', params: { all: ['test'] } })"
        custom
      >
        <ABtn
          class="border-b border-b-dashed"
          color="teal"
          :states="!isActive"
          icon="i-carbon:book"
          icon-only
          variant="text"
          @click="navigate"
        />
      </NuxtLink>
    </div>

    <div class="mt-8 flex flex-col">
      <ABtn
        class="border-b border-b-dashed"
        color="default"
        :icon="locale === 'ru' ? 'i-twemoji:flag-russia' : 'i-twemoji:flag-united-states'
        "
        icon-only
        variant="text"
        @click="setLocale(locale === 'ru' ? 'en' : 'ru')"
      />
    </div>
  </div>
</template>
