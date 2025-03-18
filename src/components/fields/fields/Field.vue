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
    <div v-if="label.error" class="validate-message"><span>{{ label.error }}</span></div>
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
export default class FieldText extends Vue {
  label!: Label;
  name!: string;

  public handleInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    this.$emit("handleInput", inputElement.value);
  }
}
</script>
