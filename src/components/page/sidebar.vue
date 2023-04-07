<script setup lang="ts">
const localePath = useLocalePath()
const { setLocale, locale } = useI18n()
</script>

<template>
  <div
    class="flex flex-grow flex-col justify-between border-r box-color__default--2"
  >
    <div class="flex flex-col">
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'index' })"
        custom
      >
        <UiButton
          class="border-b border-b-dashed"
          color="default"
          :outline="!isActive"
          size="md"
          rounded="none"
          :border="false"
          @click="navigate"
        >
          <i class="i-carbon:home inline-block h-6.5" />
        </UiButton>
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'objects' })"
        custom
      >
        <UiButton
          class="border-b border-b-dashed"
          color="secondary"
          :outline="!isActive"
          size="md"
          rounded="none"
          :border="false"
          @click="navigate"
        >
          <i class="i-carbon:data-blob inline-block h-6.5" />
        </UiButton>
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'users' })"
        custom
      >
        <UiButton
          class="border-b border-b-dashed"
          color="third"
          :outline="!isActive"
          size="md"
          rounded="none"
          :border="false"
          @click="navigate"
        >
          <i class="i-carbon:user inline-block h-6.5" />
        </UiButton>
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'test' })"
        custom
      >
        <UiButton
          class="border-b border-b-dashed"
          color="fourth"
          size="md"
          :outline="!isActive"
          rounded="none"
          :border="false"
          @click="navigate"
        >
          <i class="i-carbon:text-scale inline-block h-6.5" />
        </UiButton>
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'content-all', params: { all: ['test'] } })"
        custom
      >
        <UiButton
          class="border-b border-b-dashed"
          color="primary"
          :outline="!isActive"
          size="md"
          rounded="none"
          :border="false"
          @click="navigate"
        >
          <i class="i-carbon:book inline-block h-6.5" />
        </UiButton>
      </NuxtLink>
    </div>

    <div class="mt-8 flex flex-col">
      <UiButton
        class="border-t border-t-dashed"
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
