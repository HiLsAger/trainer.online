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
  import { Label } from "@/utility/interfaces/label.interface";
  
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
  
    onFieldInput(index: number) {
      this.$emit("input", { [index]: this.formData[index] });
    }
  }
  </script>
  
  <style lang="scss">
  </style>@/utility/interfaces/labelPropertyes.interface@/utility/interfaces/label.interface