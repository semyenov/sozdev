<script setup lang="ts">
// const now = useNow()
// const mouseStore = useMouseStore()
</script>

<template>
  <div
    class="component-page-title w-full flex flex-row items-center justify-between border-b border-gray-300 border-dashed px-6 py-2 text-gray-700"
    un-dark="border-gray-700 text-gray-200"
  >
    <!-- <div
      class="flex flex-row items-center justify-center text-gray-600 text-base font-semibold gap-1 mb-1"
      un-dark="text-gray-400"
    >
      <span>{{ mouseStore.x }}</span>
      <span class="text-xs text-gray-400" un-dark="text-gray-500">
        &Cross;
      </span>
      <span>{{ mouseStore.y }}</span>
    </div> -->

    <div class="text-xl font-extrabold text-gray-700" un-dark="text-gray-200">
      <slot />
    </div>
    <button
      class="i-carbon:sun text-xl text-gray-500"
      un-dark="text-gray-400 i-carbon:moon"
      @click="toggleDark()"
    />

    <!-- <div class="flex text-gray-400" un-dark="text-gray-600">
      {{ now.toDateString() }}
    </div> -->
  </div>
</template>

<style lang="postcss" scoped>
/* .component-page-title {
  background-image: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0) 10rem
  );
  box-shadow: 0px 20px 10px -10px rgba(191, 219, 254, 0.4);
}
.dark .component-page-title {
  background-image: linear-gradient(
    0deg,
    rgba(8, 10, 48, 0.4) 0%,
    rgba(0, 0, 0, 0) 10rem
  );
  box-shadow: 0px 20px 10px -10px rgba(10, 52, 190, 0.3);
} */
</style>
