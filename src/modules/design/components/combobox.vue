<script setup lang="ts">
import { clamp, objectPick } from '@antfu/utils'
import { Document } from 'flexsearch'

import { AInput, UiVirtualList } from '#components'

import type { IUser } from '~/types'
import type {
  UIColorVariants,
  UIRoundedVariants,
  UISizeVariants,
} from '~/types/ui'

import type { PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
  },

  color: {
    type: String as PropType<UIColorVariants>,
    default: 'default',
  },
  size: {
    type: String as PropType<UISizeVariants>,
    default: 'text-sm',
  },
  rounded: {
    type: String as PropType<UIRoundedVariants>,
    default: 'md',
  },
  border: {
    type: Boolean,
    default: true,
  },

  searchFields: {
    type: Array as PropType<string[]>,
    default: () => ['info:first_name', 'info:first_name'],
  },

  options: {
    type: Array as PropType<Array<Record<string, any> & { _id: string }>>,
    required: true,
  },

  dataComponent: {
    type: [Object, Function],
    required: false,
  },
  dataKey: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', val?: string): void
}>()

const dirtyFlag = ref(false)
const [focusFlag, toggleFocused] = useToggle(false)

const rootRef = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const inputComponent = ref<InstanceType<typeof AInput> | null>(null)
const listComponent = ref<InstanceType<typeof UiVirtualList> | null>(null)

const input = ref<string>('')

const options = toRef(props, 'options')

const index = new Document<IUser, true>({
  preset: 'performance',

  cache: true,
  optimize: true,

  worker: true,

  tokenize: 'forward',
  resolution: 10,

  context: {
    depth: 3,
    resolution: 10,
    bidirectional: true,
  },

  document: {
    id: '_id',
    store: true,

    index: [
      {
        field: 'info:first_name',
        tokenize: 'forward',
        optimize: true,
      },
      {
        field: 'info:last_name',
        tokenize: 'forward',
        optimize: true,
      },
    ],
  },
})

const dataIds = asyncComputed(async () => {
  if (!dirtyFlag)
    return []

  const ids = (
    await index.search(input.value, {
      index: ['info:first_name', 'info:last_name'],
      enrich: false,
    })
  ).flatMap(item => item.result)

  return ids.length > 0 ? ids : options.value.map(item => item._id)
})

async function dataGetter(id: string) {
  return computed(() => options.value.find(item => item._id === id))
}

const showFlag = computed(() => focusFlag.value && dataIds.value.length > 0)
const cursor = ref(
  dataIds.value ? dataIds.value.findIndex(id => id === props.modelValue) : -1,
)

watch(
  options,
  async (options) => {
    if (!options.length)
      return

    for (const item of options)
      await index.addAsync(item._id, item as IUser)
  },
  { immediate: true },
)

watch(focusFlag, () => (dirtyFlag.value = true))

watch(dataIds, () => {
  if (!listComponent.value)
    return

  listComponent.value.scrollToIndex(0)
})

watch(input, (i) => {
  if (!listComponent.value)
    return

  listComponent.value.scrollToIndex(0)
  cursor.value = -1

  if (i !== '')
    return

  emit('update:modelValue', undefined)
})

onClickOutside(rootRef, () => {
  toggleFocused(false)
})

onKeyStroke('Backspace', async () => {
  if (!focusFlag.value || !props.modelValue)
    return

  const item = await dataGetter(props.modelValue)
  if (!item)
    return

  const field = getField(item, props.searchFields)
  const str = field ? field.toString() : ''
  if (input.value === str)
    input.value = ''
})

onKeyStroke('ArrowUp', (event) => {
  if (!focusFlag.value)
    return

  event.preventDefault()

  cursor.value = clamp(cursor.value - 1, 0, dataIds.value.length - 1)
  if (listComponent.value)
    listComponent.value.scrollToIndex(cursor.value)
})

onKeyStroke('ArrowDown', (event) => {
  if (!focusFlag.value)
    return

  event.preventDefault()

  cursor.value = clamp(cursor.value + 1, 0, dataIds.value.length - 1)
  if (listComponent.value)
    listComponent.value.scrollToIndex(cursor.value)
})

onKeyStroke('Enter', async (event) => {
  if (!focusFlag.value || cursor.value < 0)
    return

  event.preventDefault()

  itemClickHandler(cursor.value)
})

onMounted(() => {
  if (!inputEl.value)
    return

  // inputRef.value.rootRef.addEventListener('focus', focusEventListener)

  document.addEventListener('focusin', documentFocusinEventListener)
  documentFocusinEventListener()

  if (cursor.value < 0)
    return

  itemClickHandler(cursor.value)
})

onUnmounted(() => {
  if (!inputEl.value)
    return

  document.removeEventListener('focusin', documentFocusinEventListener)
})

// function filterByField(item: any, path: string[], str: string) {
//   let val = item
//   for (const p of path) {
//     if (!Object.hasOwn(val, p)) {
//       return false
//     }

//     val = val[p]
//   }

//   if (typeof val === 'string') {
//     return val.toLowerCase().includes(str.toLowerCase())
//   }

//   return false
// }

function getField<T extends object>(
  obj: T,
  path: string[],
  defaultValue?: string,
): string | object | undefined {
  const travel = () => {
    let val: object = obj

    for (const i in path) {
      const p = path[i] as keyof typeof val
      if (!Object.hasOwn(val, p))
        return

      val = val[p] as T[typeof p]
    }

    return val
  }

  const result = travel()
  return (result === undefined || result === obj)
    ? defaultValue
    : result
}

function itemClassAdd(n: number) {
  if (n === cursor.value)
    return props.color && 'bg-primary text-white'

  return ''
}

async function itemClickHandler(n: number) {
  cursor.value = n
  const itemId = dataIds.value[cursor.value]
  const item = await dataGetter(itemId as string)
  if (!item.value)
    return

  emit('update:modelValue', itemId as string)

  if (!inputEl.value)
    return

  toggleFocused(false)
  inputEl.value.blur()

  const field = getField(item.value, props.searchFields)
  const str = field ? field.toString() : ''

  input.value = str
}

async function itemHoverHandler(n: number) {
  cursor.value = n
}

function inputCleanHandler() {
  if (!inputEl.value)
    return

  emit('update:modelValue', '')

  toggleFocused(true)
  input.value = ''
  cursor.value = -1
  inputEl.value.focus()
}

function inputFocusHandler() {
  if (!inputEl.value)
    return

  toggleFocused()
  inputEl.value.focus()
}

function documentFocusinEventListener() {
  if (!inputEl.value || !document.activeElement)
    return

  // console.log(inputEl.value)

  toggleFocused(
    document.activeElement.isEqualNode(inputEl.value),
  )
}

watch(inputComponent, (input) => {
  if (!input || inputEl.value)
    return

  inputEl.value = input.$el.querySelector('input')
  // document.addEventListener('focusin', documentFocusinEventListener)
  // documentFocusinEventListener()
})
</script>

<template>
  <div ref="rootRef" class="c-combobox relative flex flex-row">
    <!-- <div class="flex flex-row">{{ dataIds }}</div> -->

    <AInput
      ref="inputComponent"
      v-model="input"
      class="w-full"
      :input-wrapper-classes="
        showFlag && 'rounded-b-none'
      "
      :class="[
        props.size,
        focusFlag
          ? `!box-color__${props.color}--3`
          : `!box-color__${props.color}--2`,
      ]"
    >
      asdasd
    </AInput>
    <ACard
      v-if="dirtyFlag"
      class="left-0 right-0 top-full z-1 rounded-t-none !absolute"
    >
      <UiVirtualList
        v-show="showFlag"
        ref="listComponent"
        v-bind="objectPick(props, ['dataComponent', 'dataKey'])"
        :data-component="props.dataComponent"
        :data-key="props.dataKey"
        :data-ids="dataIds as string[]"
        :data-getter="dataGetter"
        :keeps="40"
        :page-mode="false"
        :wrap-class="[
          'flex flex-col w-full',
          props.color && `list-color__${props.color}`,
        ]"
        :class="[
          props.rounded && `box-rounded__${props.rounded}`,
          props.color && `box-color__${props.color}--4`,
        ]"
        :estimate-size="50"
        :item-class-add="itemClassAdd"
        class="max-h-100 w-full flex flex-col items-center overflow-auto border rounded-t-none border-t-none"
        @item-click="itemClickHandler"
        @item-hover="itemHoverHandler"
      />
    </ACard>
    <ABtn
      v-if="input.length === 0"
      size="text-xs"

      tabindex="-1"
      :color="props.color"

      class="bottom-0 right-0 top-0 h-full rounded-l-none p-0 !absolute"
      :class="[
        showFlag && `rounded-b-none`,
        focusFlag
          ? `!box-color__${props.color}--3`
          : `!box-color__${props.color}--2`,
      ]"
      @click="inputFocusHandler"
    >
      <i v-if="!focusFlag" class="i-carbon:caret-down inline-block h-6" />
      <i v-else class="i-carbon:caret-up inline-block h-6" />
    </ABtn>
    <ABtn
      v-else
      size="text-xs"
      tabindex="-1"
      :color="props.color"
      class="bottom-0 right-0 top-0 h-full rounded-l-none p-0 !absolute"
      :class="[
        showFlag && `rounded-b-none`,
        focusFlag
          ? `!box-color__${props.color}--3`
          : `!box-color__${props.color}--2`,
      ]"
      @click="inputCleanHandler"
    >
      <i class="i-carbon:close inline-block h-6" />
    </ABtn>
  </div>
</template>
