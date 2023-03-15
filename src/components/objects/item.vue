<script setup lang="ts">
import type { PropType } from 'vue'

import type { IObject } from '~/types'
import { UiWinboxTest } from '#components';

const props = defineProps({
  index: {
    type: Number,
    default: 0,
  },
  item: {
    type: Object as PropType<IObject>,
    required: true,
  },
})
const item = toRef(props, 'item')


const runtime = useRuntime()
const keyContainer = 'winbox'

const removeComponent = (val?:string) => {
  return runtime.removeComponent(keyContainer, item.value._id)
}

const addComponent = () => {
  const component = h(UiWinboxTest, {
      show:true,
      teleportId:"teleport-layer--20",
      params:{
        title: `${item.value.info.name}`,
        top: 0,
        bottom: 0,
        left: 44,
        right: 0,
        border: 0,
        width: 550,
        height: '100%',
        minwidth: 500,
        class: ['simple', 'wb-right', 'no-move', 'border-r-none'],
        tether: ['right', 'top', 'bottom'],
      },
      onCloseWindow: (val) => removeComponent(val)
  }, () => props.item._id
  )
  runtime.addComponent({
    keyContainer: keyContainer,
    keyComponent: item.value._id,
    VNode: component
})

}

// const TemplateTest = runtime.renderComponent<typeof UiWinboxTest>()
const isAdded = computed(() => runtime.checkComponent(keyContainer,item.value._id))



const actionComponent = () => {
  if(isAdded.value) {
    removeComponent()
    return
  }
  addComponent()
}

</script>

<template>
  <div class="component-object-item">
    <UiCard
      dashed
      :color="isAdded ? 'fourth' : 'secondary'"
      class="cursor-pointer select-none"
      @click="actionComponent"
    >
      <template v-if="item" #header>
        <div class="flex flex-row w-full justify-between px-4 py-2">
          {{ `# ${item.info.name}` }}

          <!-- <div
            v-if="item.feature && item.feature.geometry.coordinates[1]"
            class="inline-flex flex-row items-center px-2 box-color__default--6 box-rounded__sm border border-dashed font-mono font-light text-sm"
          >
            {{ item.feature.geometry.coordinates.join(', ') }}
          </div> -->
        </div>
      </template>
      <template #footer>
        <div class="px-4 py-1.5">
          {{ item._id }}
        </div>
      </template>
    </UiCard>
    <!-- <TemplateTest  >asd</TemplateTest> -->
    <!-- <UiWinboxTest
      v-model:show="showFlag"
      teleport-id="teleport-layer--20"
      :params="{
        title: `${item.info.name}`,
        top: 0,
        bottom: 0,
        left: 44,
        right: 0,
        border: 0,
        width: 550,
        height: '100%',
        minwidth: 500,
        class: ['simple', 'wb-right', 'no-move', 'border-r-none'],
        tether: ['right', 'top', 'bottom'],
      }"
    >
      <pre class="p-6 text-sm">{{ item }}</pre>
    </UiWinboxTest> -->
    <!-- <UiWinbox
      v-model:show="showFlag"
      teleport-id="teleport-layer--20"
      :params="{
        title: `${item.info.name}`,
        top: 0,
        bottom: 0,
        left: 44,
        right: 0,
        border: 0,
        width: 550,
        height: '100%',
        minwidth: 500,
        class: ['simple', 'wb-right', 'no-move', 'border-r-none'],
        tether: ['right', 'top', 'bottom'],
      }"
    >
      <pre class="p-6 text-sm">{{ item }}</pre>
    </UiWinbox> -->
  </div>
</template>
