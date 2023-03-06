<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker'

const props = defineProps({
  modelValue: {
    type: [String, Date],
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | Date): void
}>()

const { d } = useI18n()

const valueComputed = computed({
  get: () => {
    return props.modelValue
  },
  set: (newValue: Date | string) => {
    const formatedDate = d(newValue, 'medium')
    return emit('update:modelValue', formatedDate)
  },
})
</script>

<template>
  <div>
    <div>
      <Datepicker
        v-model="valueComputed"
        format="dd.MM.yyyy HH:mm"
        :flow="['calendar', 'time']"
        :clearable="false"
        :highlight-week-days="[0, 6]"
        locale="ru"
        select-text="Выбрать"
        cancel-text="Отмена"
        keep-action-row
        hide-input-icon
      >
        <template #dp-input>
          <UiInput readonly :value="valueComputed" />
        </template>
      </Datepicker>
    </div>
  </div>
</template>
