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
    class="flex flex-grow flex-col justify-between border-r border-warmGray-300 bg-warmGray-200/80 shadow-lg shadow-warmGray/60 backdrop-blur-20 backdrop-filter"
  >
    <div class="flex flex-col">
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'index' })"
        custom
      >
        <ABtn
          class="border-b border-warmGray-300 rounded-0 text-lg"
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
          class="rounded-0 text-lg hover:border-none"
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
        <ABadge anchor="bottom right" offset-x="20" offset-y="20" :content="9" dot color="info">
          <ABtn
            class="rounded-0 text-lg hover:border-none"
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
          class="rounded-0 text-lg hover:border-none"
          icon="i-carbon:book"
          icon-only
          :variant="isActive ? 'fill' : 'text'"
          @click="navigate"
        >
          <ATooltip placement="right" transition="scroll-x" :text="$t('content-all.title')" />
        </ABtn>
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'test' })"
        custom
      >
        <ABtn
          class="rounded-0 text-lg hover:border-none"
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
        class="border-t border-warmGray-300 rounded-0 text-lg"
        :icon="locale === 'ru' ? 'i-twemoji:flag-russia' : 'i-twemoji:flag-united-states'
        "
        icon-only
        variant="text"
        @click="setLocale(locale === 'ru' ? 'en' : 'ru')"
      />
    </div>
  </div>
</template>
