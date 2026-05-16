<template>
  <div class="form-fields">
    <div :class="[isHorizontal ? 'form-field-horizontal' : '', 'form-field']" v-for="(label, index) in localLabels"
         :key="label.error">
      <component
          :is="getComponent(label)"
          :name="index"
          :label="label"
          :alias="alias"
          v-if="!label.hidden"
          @handleInput="onFieldInput(index, $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Component} from "vue";
import {Label} from '@/utility/interfaces/label.interface';
import FieldFactory from './factories/Field.factory';
import {IFieldsComponent} from "@/components/fields/IFieldsComponent.intefrace";
import Validator from "@/components/fields/Validator";
import {ConvertHelper} from "@/core/helpers/Convert.helper";

@Options({
  props: {
    labels: {
      type: Object,
      required: true,
    },
    alias: {
      type: String,
      required: false
    },
    isHorizontal: {
      type: Boolean,
      required: false,
      default: false
    }
  },
})
export default class FieldsComponent extends Vue implements IFieldsComponent {
  labels!: { [key: string]: Label };
  alias!: string;
  isHorizontal!: boolean;
  localLabels?: { [key: string]: Label };
  formData: Record<string, string | boolean | number> = {};

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

  onFieldInput(name: string, value: string | boolean | number) {
    this.formData[name.toLowerCase()] = this.prepareValue(value, this.labels[name]);
    this.labels[name].value = value;
    this.validate();
    this.$emit("handleInputFields", this.formData);
  }

  prepareValue(
      value: string | boolean | number,
      label: Label
  ): string | boolean | number {
    if (typeof value !== "string") {
      return value;
    }

    const mask = label.options?.mask;
    const convert = label.options?.convert;

    if (!mask || !convert) {
      return value;
    }

    return ConvertHelper.convertDataTimeValue(mask, convert, value);
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
  position: relative;

  div {
    display: flex;
    flex-direction: column;
    margin-top: 1em;

    input, select, textarea, .custom-field {
      background-color: transparent;
      color: var(--black);
      outline: none;
      border: none;
      border-bottom: 2px solid var(--black);
      font-size: 1em;
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
      font-size: 1em;
    }

    .validate-message {
      margin-top: 0;
    }

    &.row {
      display: flex;
      flex-direction: row;
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
