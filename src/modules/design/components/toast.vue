<script setup lang="ts">
// import type { Toast } from '~/utils/toast/toast.d';



// const toast = inject('$toast') as Toast;
const app = useNuxtApp()


const count = ref(0)
const testClick = () => {
  window.Toast('test')
  renderTest(app.vueApp, count)
}


</script>

<template>
  <div>

    <button ref="elementRef" @click="testClick" id="create-toast">Create Toast</button>
    {{ count }}
    <button  @click="count++">Increment</button>
  </div>
</template>

