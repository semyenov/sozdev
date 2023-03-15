<script setup lang="ts">
// import type { Toast } from '~/utils/toast/toast.d';



// const toast = inject('$toast') as Toast;
const app = useNuxtApp()
const usersStore = useUsersStore()
const count = ref(0)
const testCount = toRef(usersStore, 'testCount')
const testClick = () => {
  // window.Toast('test')
  renderTest(app.vueApp, testCount)
}


</script>

<template>
  <div>

    <button ref="elementRef" @click="testClick" id="create-toast">Create !Toast</button>
    {{ testCount }}
    <button  @click="testCount++">Increment</button>
  </div>
</template>

