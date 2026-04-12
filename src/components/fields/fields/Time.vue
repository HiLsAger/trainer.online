<template>
  <div :class="label.error ? 'validate-error' : ''">
    <label :for="label.title">{{ label.title }}</label>
    <input
        :id="name"
        :name="name"
        :required="label.required"
        :placeholder="label.placeholder"
        :type="label.type"
        :value="label?.value"
        @input="handleInput"
    />
    <div class="clock-modal">
      <div class="clock-section">
        <input class="clock clock-hour" pattern="[0-24]+" type="number">
        <span>:</span>
        <input class="clock clock-minutes" pattern="[0-60]+" type="number">
      </div>
    </div>
    <div v-if="label.error" class="validate-message"><span>{{ label.error }}</span></div>
  </div>
</template>

<script lang="ts">
import {Options} from 'vue-class-component';
import {Label} from '@/utility/interfaces/label.interface';
import BaseField from "@/components/fields/fields/BaseField";

@Options({
  props: {
    label: Object as () => Label,
    name: String,
    alias: String,
  },
})
export default class Time extends BaseField {
}
</script>

<style lang="scss">
.clock-modal {
  display: block;

  .clock-section {
    display: flex;
    flex-direction: row;

    .clock {
      width: 20%;
      appearance: none;
      text-align: center;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }
}
</style>
