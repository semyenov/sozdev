<script setup lang="ts">
import type { IMove } from '~/types'

const props = withDefaults(defineProps<{
  content: IMove
}>(),
{})
</script>

<template>
  <div id="popup-moves">
    <div class="custom-tooltip custom-tooltip--move">
      <div class="custom-tooltip__header">
        <span>${props.content} - ${value}</span>
      </div>
      <div class="custom-tooltip__body">
        <div class="custom-tooltip__row">
          <span>Отправитель:</span> ${from}
        </div>
        <div class="custom-tooltip__row">
          <span>Получатель:</span> ${to}
        </div>
      </div>
    </div>
  </div>
</template>
