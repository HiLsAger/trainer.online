<template>
  <div class="form-fields">
    <div class="form-field" v-for="(label, index) in localLabels" :key="label.error">
      <component
          :is="getComponent(label)"
          :name="index"
          :label="label"
          @handleInput="onFieldInput(index, $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Component} from "vue";
import {Label} from '@/utility/interfaces/label.interface';
import FieldFactory from './factories/field.factory';
import {IFieldsComponent} from "@/components/fields/IFieldsComponent.intefrace";
import Validator from "@/components/fields/Validator";

@Options({
  props: {
    labels: {
      type: Object,
      required: true,
    },
  },
})
export default class FieldsComponent extends Vue implements IFieldsComponent {
  labels!: { [key: string]: Label };
  localLabels?: { [key: string]: Label };
  formData: Record<string, string> = {};

  validator?: Validator;

  validate(): boolean {
    if (!!this.validator && this.localLabels) {
      this.localLabels = {...this.validator.validate(this.localLabels)};
      return this.validator.isValid;
    }

    return false;
  }

  getComponent(label: Label): Component | null {
    return FieldFactory.getInstance().createField(label);
  }

  onFieldInput(name: string, value: string) {
    this.formData[name.toLowerCase()] = value;
    this.labels[name].value = value;
    this.validate();
    this.$emit("handleInputFields", this.formData);
  }

  created() {
    this.localLabels = {...this.labels};
  }

  mounted() {
    this.validator = new Validator();
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
      background-color: transparent;
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

    .validate-message {
      margin-top: 0;
    }

    &.validate-error {
      input {
        border-bottom: 2px solid var(--danger);
        color: var(--danger);

        &::placeholder {
          color: var(--danger);
        }
      }

      label {
        color: var(--danger);
      }

      .validate-message {
        color: var(--danger);
      }
    }
  }
}
</style>