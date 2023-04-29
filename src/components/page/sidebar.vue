<script setup lang="ts">
import { offset } from '@floating-ui/dom'

import type { Middleware } from '@floating-ui/dom'

const localePath = useLocalePath()
const { setLocale, locale } = useI18n()
function log(amount = 0): Middleware {
  return {
    name: 'shiftByAmount',
    options: amount,
    fn: ({ x, y }) => {
      // console.log(x, y)

      return {
        x: x + amount,
        y: y + amount,
      }
    },
  }
}
function middleware(_referenceEl: Ref<HTMLElement>, _floatingEl: Ref<HTMLElement>) {
  // console.log('referenceEl :>> ', referenceEl)
  // console.log('floatingEl :>> ', floatingEl)

  // We aren't adding any middleware
  // console.log('mmmmmm', referenceEl, floatingEl)

  return [log(10), offset(1000)]
}
</script>

<template>
  <div
    class="dark-bg-primary-900 flex flex-grow flex-col justify-between border-r bg-gray-50 shadow"
  >
    <div class="flex flex-col">
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'index' })"
        custom
      >
        <ABtn
          class="border-b rounded-0 text-lg"
          color="primary"
          icon="i-carbon:home"
          icon-only
          :variant="isActive ? 'fill' : 'text'"
          @click="navigate"
        >
          <ATooltip placement="right" transition="scroll-x" :text="$t('index.title')" />
        </ABtn>
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'objects' })"
        custom
      >
        <ABtn
          class="border-b rounded-0 text-lg"
          color="primary"
          icon="i-carbon:data-blob"
          icon-only
          :variant="isActive ? 'fill' : 'text'"
          @click="navigate"
        >
          <ATooltip placement="right" transition="scroll-x" :text="$t('objects.title')" />
        </ABtn>
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'users' })"
        custom
      >
        <ABadge :content="9" color="info">
          <ABtn
            class="border-b rounded-0 text-lg"
            color="primary"
            icon="i-carbon:user"
            icon-only
            :variant="isActive ? 'fill' : 'text'"
            @click="navigate"
          >
            <ATooltip placement="right" transition="scroll-x" :text="$t('users.title')" />
          </ABtn>
        </ABadge>
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'content-all', params: { all: ['test'] } })"
        custom
      >
        <ABtn
          class="border-b rounded-0 text-lg"
          color="primary"
          icon="i-carbon:book"
          icon-only
          :variant="isActive ? 'fill' : 'text'"
          @click="navigate"
        >
          <ATooltip placement="right" transition="scroll-x" :text="$t('content.title')" />
        </ABtn>
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'test' })"
        custom
      >
        <ABtn
          class="border-b rounded-0 text-lg"
          color="primary"
          icon="i-carbon:text-scale"
          icon-only
          :variant="isActive ? 'fill' : 'text'"
          @click="navigate"
        >
          <ATooltip class="[&_.a-tooltip]:(bg-danger px-4)" placement="right" transition="scroll-x" :middleware="middleware" :text="$t('test.title')" />
        </ABtn>
      </NuxtLink>
    </div>

    <div class="mt-8 flex flex-col">
      <ABtn
        class="border-t rounded-0 text-lg"
        color="primary"
        :icon="locale === 'ru' ? 'i-twemoji:flag-russia' : 'i-twemoji:flag-united-states'
        "
        icon-only
        variant="text"
        @click="setLocale(locale === 'ru' ? 'en' : 'ru')"
      />
    </div>
  </div>
</template>
