<script setup lang="ts">
const localePath = useLocalePath()
const { setLocale, locale } = useI18n()
</script>

<template>
  <div class="flex justify-between flex-grow flex-col">
    <div class="flex flex-col">
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'index' })"
        custom
      >
        <UiButton
          class="border-b border-dashed"
          color="primary"
          :outline="!isActive"
          size="md"
          rounded="none"
          :border="false"
          @click="navigate"
        >
          <i class="inline-block i-carbon:home h-6.5" />
        </UiButton>
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'objects' })"
        custom
      >
        <UiButton
          class="border-b border-dashed"
          color="secondary"
          :outline="!isActive"
          size="md"
          rounded="none"
          :border="false"
          @click="navigate"
        >
          <i class="inline-block h-6.5 i-carbon:data-blob" />
        </UiButton>
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'users' })"
        custom
      >
        <UiButton
          class="border-b border-dashed"
          color="third"
          :outline="!isActive"
          size="md"
          rounded="none"
          :border="false"
          @click="navigate"
        >
          <i class="inline-block h-6.5 i-carbon:user" />
        </UiButton>
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'test' })"
        custom
      >
        <UiButton
          class="border-b border-dashed"
          color="fourth"
          size="md"
          :outline="!isActive"
          rounded="none"
          :border="false"
          @click="navigate"
        >
          <i class="inline-block h-6.5 i-carbon:text-scale" />
        </UiButton>
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'content-all', params: { all: ['test'] } })"
        custom
      >
        <UiButton
          class="border-b border-dashed"
          color="primary"
          :outline="!isActive"
          size="md"
          rounded="none"
          :border="false"
          @click="navigate"
        >
          <i class="inline-block h-6.5 i-carbon:book" />
        </UiButton>
      </NuxtLink>
    </div>

    <div class="flex flex-col mt-8">
      <UiButton
        class="border-dashed border-t"
        color="default"
        outline
        size="md"
        rounded="none"
        :border="false"
        @click="setLocale(locale === 'ru' ? 'en' : 'ru')"
      >
        <i
          class="inline-block h-6.5"
          :class="[
            locale === 'ru'
              ? 'i-twemoji:flag-russia'
              : 'i-twemoji:flag-united-states',
          ]"
        />
      </UiButton>
    </div>
  </div>
</template>
