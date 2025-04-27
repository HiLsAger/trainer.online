<template>
  <div :class="label.error ? 'validate-error' : ''">
    <label :for="label.title">{{ label.title }}</label>
    <select :value="label?.value" @change="handleInput">
      <option v-for="(value, index) in list" :value="index">{{ value }}</option>
    </select>
    <div v-if="label.error" class="validate-message"><span>{{ label.error }}</span></div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Label} from '@/utility/interfaces/label.interface';
import AxiosHelper from "@/core/helpers/Axios.helper";

@Options({
  props: {
    label: Object as () => Label,
    name: String
  },
})
export default class SelectRole extends Vue {
  label!: Label;
  name!: string;
  list?: object = {};

  axiosHelper?: AxiosHelper;

  public handleInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    this.$emit("handleInput", inputElement.value);
  }

  async mounted() {
    this.axiosHelper = await AxiosHelper.getInstance();

    if (typeof this.label.list === 'string') {
      this.list = await this.axiosHelper.sendGetRequest(this.label.list)
    } else if (Array.isArray(this.label?.list)) {
      this.list = this.label.list;
    }
  }
}
</script>
