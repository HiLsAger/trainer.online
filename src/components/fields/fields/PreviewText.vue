<template>
  <div :class="label.error ? 'validate-error' : ''">
    <label :for="label.title">{{ label.title }}</label>
    {{ name }}
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
export default class PreviewText extends Vue {
  label!: Label;
  name!: string;

  public handleInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    this.$emit("handleInput", inputElement.value);
  }
}
</script>
