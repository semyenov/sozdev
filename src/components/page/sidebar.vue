<script setup lang="ts">
// const { t } = useI18n()
// const router = useRouter()

const localePath = useLocalePath()
const { setLocale, locale } = useI18n()

// const activeTab = ref(0)
// const tabs: {
//   title?: string
//   icon: string
//   name: RoutesNamesList
// }[] = [
//   {
//     // title: t('index.title'),
//     title: '',
//     icon: 'i-ph:house',
//     name: 'index',
//   },
//   {
//     // title: t('objects.title'),
//     title: '',
//     icon: 'i-ph:buildings',
//     name: 'objects',
//   },
//   {
//     // title: t('users.title'),
//     title: '',
//     icon: 'i-ph:user',
//     name: 'users',
//   },
//   {
//     // title: t('help.title'),
//     title: '',
//     icon: 'i-ph:lifebuoy',
//     name: 'help',
//   },
//   {
//     // title: t('test.title'),
//     title: '',
//     icon: 'i-ph:bird',
//     name: 'test',
//   },
// ]

// watch(activeTab, (at) => {
//   router.push({ name: tabs[at].name })
// })

// function log(amount = 0): Middleware {
//   return {
//     name: 'shiftByAmount',
//     options: amount,
//     fn: ({ x, y }) => {
//       console.log(x, y)

//       return {
//         x: x + amount,
//         y: y + amount,
//       }
//     },
//   }
// }

// function middleware(_referenceEl: Ref<HTMLElement>, _floatingEl: Ref<HTMLElement>) {
//   console.log('referenceEl :>> ', _referenceEl)
//   console.log('floatingEl :>> ', _floatingEl)

//   return [log(10), offset(1000)]
// }
</script>

<template>
  <div
    class="flex flex-grow flex-col justify-between border-r border-warmGray-300 bg-warmGray-200/80 shadow-lg shadow-warmGray/60 backdrop-blur-20 backdrop-filter"
  >
    <div class="flex flex-col">
      <!-- <ATabs v-model="activeTab" :tabs="tabs" vertical class="w-full text-lg [&_.a-tab]:(w-full justify-start px-3.5 py-3.3)" /> -->

      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'index' })"
        custom
      >
        <ABtn
          class="border-b border-warmGray-300 rounded-0 text-lg"
          icon="i-ph:house-simple"
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
          icon="i-ph:buildings"
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
        <ABadge anchor="bottom right" offset-x="16" offset-y="16" dot :content="9" color="primary" class="pointer-events-none">
          <ABtn
            class="rounded-0 text-lg hover:border-none"
            icon="i-ph:user"
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
        :to="localePath({ name: 'help' })"
        custom
      >
        <ABtn
          class="rounded-0 text-lg hover:border-none"
          icon="i-ph:lifebuoy"
          icon-only
          :variant="isActive ? 'fill' : 'text'"
          @click="navigate"
        >
          <ATooltip placement="right" transition="scroll-x" :text="$t('help.title')" />
        </ABtn>
      </NuxtLink>
      <NuxtLink
        v-slot="{ isActive, navigate }"
        :to="localePath({ name: 'test' })"
        custom
      >
        <ABtn
          class="rounded-0 text-lg hover:border-none"
          icon="i-ph:bird"
          icon-only
          :variant="isActive ? 'fill' : 'text'"
          @click="navigate"
        >
          <ATooltip class="[&_.a-tooltip]:(bg-danger px-4)" placement="right" transition="scroll-x" :text="$t('test.title')" />
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
