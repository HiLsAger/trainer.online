<template>
  <div class="form-fields">
    <div class="form-field" v-for="(label, index) in labels" :key="index">
      <component
          :is="getComponent(label)"
          :label="label"
          @input="onFieldInput(index, $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Component} from "vue";
import {Label} from '@/utility/interfaces/label.interface';
import FieldFactory from './factories/field.factory';

@Options({
  props: {
    labels: {
      type: Array as () => Label[],
      required: true,
    },
  },
})
export default class FieldsComponent extends Vue {
  labels!: Label[];
  formData: Record<string, string> = {};

  getComponent(label: Label): Component | null {
    // Получаем компонент с помощью фабрики
    return FieldFactory.getInstance().createField(label);
  }

  onFieldInput(index: number, value: string) {
    if (typeof value === 'string') {
      this.formData[index] = value;
      this.$emit("input", {[index]: value});
    }
  }
}
</script>

<style lang="scss">
.form-field {
  div {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;

    input {
      background-color: var(--white);
      color: var(--black);
      outline: none;
      border: none;
      border-bottom: 2px solid var(--black);
      font-size: 1rem;
      padding: 0;

      &:hover {
        color: var(--hover-color);

        &::placeholder {
          color: var(--hover-color);
        }
      }
    }

    label {
      text-align: left;
      font-size: 1rem;
    }
  }
}
</style>