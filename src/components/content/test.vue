<template>
  <div class="test">
    <div class="mb-6">
      CONTENT TEST COMPONENT
    </div>
    <UiCard color="primary">
      <template #header>
        <slot name="header" />
      </template>
      <slot />
      <template #footer>
        <slot name="footer" />
      </template>
    </UiCard>
  </div>
</template>
