<template>
  <div :class="[label.error ? 'validate-error' : '', 'row']">
    <label v-if="label?.title" :for="label.title">{{ label.title }}</label>
    <input
        :id="name"
        :name="name"
        :required="label.required"
        :placeholder="label.placeholder"
        type="checkbox"
        :checked="!!(label.value ?? true)"
        @input="handleInput"
    />
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
export default class Checkbox extends BaseField {
  public handleInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    this.$emit("handleInput", inputElement.checked);
  }

  protected triggerInitialInput(): void {
    if (this.labelValue === undefined) {
      return;
    }

    const fakeEvent = {
      target: {
        checked: this.labelValue
      }
    } as unknown as Event;

    this.handleInput(fakeEvent);
  }
}
</script>
