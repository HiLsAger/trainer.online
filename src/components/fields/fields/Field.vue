<template>
  <div :class="validateErrorMessage ? 'validate-error' : ''">
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
    <div v-if="validateErrorMessage" class="validate-message"><span>{{ validateMessage }}</span></div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Label} from '@/utility/interfaces/label.interface';

@Options({
  props: {
    label: Object as () => Label,
    name: String
  },
})
export default class FieldText extends Vue implements IField {
  label!: Label;
  name!: string;

  validateMessage: string = '';

  public validate(element: HTMLInputElement): boolean {
    if (!element.value) {
      this.enterValidateMessage(`Значение в поле "${this.label.title}" не может быть пустым`);
    }

    return true
  }

  public enterValidateMessage(message: string): void {
    this.validateMessage = message;
  }

  public handleInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (this.validate(inputElement)) {
      this.$emit("handleInput", inputElement.value);
    }
  }
}
</script>
