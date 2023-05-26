<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const usersStore = useUsersStore()
const item = await usersStore.itemGetter(props.id)

const { t } = useI18n()

const input = ref('')
const fields = computed(() => item.value && Object.entries(item.value).filter(([key, val]) => (input.value === '' || key.concat(' ', JSON.stringify(val)).includes(input.value)) && val !== undefined).map(([key, val]) => ({ key, val })))
</script>

<template>
  <AList
    v-if="fields"
    :items="fields"
    class="grid-rows-[auto_1fr_auto] my-0 h-full"
  >
    <template #before>
      <AInput v-model="input" color="primary" class="border-b spacing-95" append-inner-icon="i-ph:magnifying-glass" input-wrapper-classes="rounded-0 border-none  bg-white" :placeholder="t('users.item.search.placeholder')" />
    </template>

    <template #default>
      <UiSimplebar
        class="overflow-auto py-2"
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
              <span class="min-w-auto self-start text-right font-bold">
                <AChip
                  color="success"
                  class="abosolute right-4 rounded text-xs"
                >
                  {{ t(`users.item.fields.${field.key}`) }}
                </AChip>
              </span>
            </template>
          </AListItem>
        </div>
      </UiSimplebar>
    </template>

    <!-- 👉 Slot: After -->
    <template #after>
      <AListItem
        :subtitle="t('users.item.search.status', fields.length)"
        class="border-t bg-white"
      />
    </template>
  </AList>
</template>
