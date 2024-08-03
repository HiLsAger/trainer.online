<template>
    <div class="form-fields">
      <div class="form-field" v-for="(item, index) in labels" :key="index">
        <label :for="item.title">{{ item.title }}</label>
        <input
          v-model="formData[index]"
          :id="item.title"
          :required="item.required"
          :placeholder="item.placeholder"
          :type="item.type"
          @input="onFieldInput(index)"
        />
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  import { labelPropertyes } from "@/utility/interfaces/LabelPropertyes";
  
  @Options({
    props: {
      labels: {
        type: Array as () => labelPropertyes[],
        required: true,
      },
    },
  })
  export default class FieldsComponent extends Vue {
    labels!: labelPropertyes[];
    formData: Record<string, string> = {};
  
    onFieldInput(index: number) {
      this.$emit("input", { [index]: this.formData[index] });
    }
  }
  </script>
  
  <style lang="scss">
  </style>