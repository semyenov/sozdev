<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const usersStore = useUsersStore()
const item = await usersStore.itemGetter(props.id)

const input = ref('')
const fields = computed(() => item.value && Object.entries(item.value).filter(([key, val]) => (input.value === '' || key.concat(' ', JSON.stringify(val)).includes(input.value)) && val !== undefined).map(([key, val]) => ({ key, val })))
</script>

<template>
  <AList
    v-if="fields"
    :items="fields"
    class="grid-rows-[auto_1fr_auto] m-0 h-full"
  >
    <template #before>
      <AInput v-model="input" class="border-b py-0" append-inner-icon="i-carbon:search" input-wrapper-classes="rounded-0 border-none" :placeholder="$t('users.item.search.placeholder')" />
    </template>

    <template #default>
      <SimpleBar
        class="overflow-auto"
        :scrollbar-min-size="100"
        :scrollbar-max-size="300"
      >
        <div class="divide-y divide-dashed">
          <AListItem
            v-for="field in fields"
            :key="field.key"
            :text="[field.val, 'text-sm']"
            class="items-start"
          >
            <template #append>
              <span class="min-w-20% self-start text-right font-bold">
                <AChip
                  color="success"
                  class="rounded text-xs"
                >
                  {{ $t(`users.item.fields.${field.key}`) }}
                </AChip>
              </span>
            </template>
          </AListItem>
        </div>
      </SimpleBar>
    </template>

    <!-- 👉 Slot: After -->
    <template #after>
      <hr>
      <AListItem
        :subtitle="`${fields.length} fields found`"
        class="opacity-75"
      />
    </template>
  </AList>
</template>
