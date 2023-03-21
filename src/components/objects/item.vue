<script setup lang="ts">
import type {  PropType } from 'vue'

import { IMetaScope, IObject } from '~/types'
import { UiWinboxTest, UiButton } from '#components';
import { nanoid } from 'nanoid';

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
const winboxCompose = useWinbox()

const keyContainer = winboxCompose.idContainer.value
const keyComponent = nanoid(10)

const removeComponent = () => {
  return runtime.removeComponent(keyContainer, keyComponent, true,
  winboxCompose.removePreserveItem)
}

const renderComponent = () => {
  return h(UiWinboxTest, {
      show:true,
      teleportId:"teleport-layer--20",
      dataId: keyComponent,
      params:{
        ...winboxCompose.winboxParams,
        title: `${item.value.info.name}`,
      },
      onCloseWindow: () => removeComponent(),

  },
  () => h(UiButton, {}, () => item.value.info.name)
  )
}

const addComponent = () => {
  const component = renderComponent()
  runtime.addComponent({
    keyContainer: keyContainer,
    keyComponent: keyComponent,
    VNode: component,
    preserveInfo: {
      componentInfo: {
        name: 'UiWinboxTest',
        id: keyComponent,
        params: {
          title: `${item.value.info.name}`
        },
        slot: {name: 'UiButton'}
      },
      item: {
        id: item.value._id,
        scope: IMetaScope.OBJECTS
      }
    },
    setterPreserve: winboxCompose.setPreserveItem
  })

}



const isAdded = computed(() => runtime.checkComponent(keyContainer, keyComponent))



const clickUser = () => {
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
      @click="clickUser"
    >
      <template v-if="item" #header>
        <div class="flex flex-row w-full justify-between px-4 py-2">
          {{ `# ${item.info.name}` }}
        </div>
      </template>
      <template #footer>
        <div class="px-4 py-1.5">
          {{ item._id }}
        </div>
      </template>
    </UiCard>
  </div>
</template>
