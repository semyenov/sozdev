<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const objectsStore = useObjectsStore()
const item = await objectsStore.itemGetter(props.id)

const input = ref('')
const fields = computed(() => item.value && Object.entries(item.value).filter(([key, val]) => (input.value === '' || key.includes(input.value)) && val !== undefined).map(([key, val]) => ({ key, val })))
</script>

<template>
  <AList
    v-if="fields"
    :items="fields"
    class="grid-rows-[auto_1fr_auto] m-0 h-full"
  >
    <!-- 👉 Slot: Before -->
    <template #before>
      <AInput v-model="input" class="my-4 px-4 text-xs" />
      <hr class="mb-2">
    </template>

    <template #default>
      <SimpleBar
        class="overflow-auto"
        :scrollbar-min-size="100"
        :scrollbar-max-size="300"
      >
        <div class="flex flex-grow flex-col">
          <AListItem
            v-for="field in fields"
            :key="field.key"
            :text="[field.val, 'text-sm']"
            class="items-start border-b border-b-dashed"
          >
            <template #append>
              <span class="min-w-20% self-start text-right font-bold">
                <AChip
                  color="success"
                  class="rounded text-xs"
                >
                  {{ field.key }}
                </AChip>
              </span>
            </template>
          </AListItem>
        </div>
      </SimpleBar>
    </template>

    <!-- 👉 Slot: After -->
    <template #after>
      <hr class="mt-2">
      <AListItem
        :subtitle="`${fields.length} fields found`"
        class="opacity-75"
      />
    </template>
  </AList>
</template>
