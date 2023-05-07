<template>
  <UiSimplebar
    :scrollbar-min-size="100"
    :scrollbar-max-size="300"
  >
    <div class="flex flex-col p-4">
      <slot />
    </div>
  </UiSimplebar>
</template>
