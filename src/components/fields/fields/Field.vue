<template>
  <div>
    <label :for="label.title">{{ label.title }}</label>
    <input
      :id="label.title"
      :required="label.required"
      :placeholder="label.placeholder"
      :type="label.type"
      @input="handleInput"
    />
  </div>
</template>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  import { Label } from '@/utility/interfaces/label.interface';

  @Options({
    props: {
      label: Object as () => Label,
    },
  })
  export default class FieldText extends Vue {
    label!: Label;

    handleInput(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      this.$emit("input", inputElement.value); // Отправляем значение
    }
  }
</script>
