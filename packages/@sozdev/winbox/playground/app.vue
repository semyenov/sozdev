<script setup>
</script>

<template>
  <div>
    <WinboxRoot />
    <WinboxWindow
      :params="{
        id: 'nuxt-welcome',
        title: 'Nuxt Welcome Window'
      }"
    >
      <NuxtWelcome />
    </WinboxWindow>
  </div>
</template>
