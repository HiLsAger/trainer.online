<template>
  <div :class="label.error ? 'validate-error' : ''">
    <label :for="label.title">{{ label.title }}</label>
    <div class="custom-field" @click="toggleActive">
      <p v-if="asHtml" v-html="getActiveItemValue"></p>
      <p v-else>{{ getActiveItemValue }}</p>
      <div :class="[getVisibleSelectItemsClass, 'items']" ref="items">
        <div v-for="(text, index) in list" class="item" @click="setValue(index)">
          <div v-if="asHtml" v-html="text"></div>
          <div v-else>{{ text }}</div>
        </div>
      </div>
    </div>
    <div v-if="label.error" class="validate-message"><span>{{ label.error }}</span></div>
  </div>
</template>

<script lang="ts">
import {Options} from 'vue-class-component';
import {Flags, Label} from '@/utility/interfaces/label.interface';
import AxiosHelper from "@/core/helpers/Axios.helper";
import BaseField from "@/components/fields/fields/BaseField";

@Options({
  props: {
    label: Object as () => Label,
    name: String
  },
})
export default class SelectAdvanced extends BaseField {
  name!: string;
  list?: Record<string, string | number> = {};

  active: boolean = false;

  value: string | number | boolean | null = null;

  axiosHelper?: AxiosHelper;

  declare $refs: {
    items: HTMLElement
  }

  public setValue(value: string | number): void {
    this.value = value;

    this.handleInput()
  }

  get asHtml(): boolean {
    if (!this.label.flags) return false;

    return Object.values(this.label.flags).includes(Flags.AS_HTML);
  }

  get getActiveItemValue(): string | number {
    if (!this.value || !this.list) {
      return "";
    }

    return this.list[String(this.value)] || ""
  }

  get getVisibleSelectItemsClass(): string {
    return !this.active ? "disabled" : "";
  }

  public handleInput(): void {
    this.$emit("handleInput", this.value);
  }

  public toggleActive(): void {
    this.active = !this.active;
  }

  private handleClickOutside(event: MouseEvent): void {
    const itemsElement = this.$refs.items;
    const customField = event.target as HTMLElement;

    if (itemsElement && !itemsElement.contains(customField) &&
        !customField.closest('.custom-field')) {
      this.active = false;
    }
  }

  async mounted() {
    this.axiosHelper = await AxiosHelper.getInstance();

    if (typeof this.label.list === 'string') {
      this.list = await this.axiosHelper.sendGetRequest(this.label.list)
    } else if (Array.isArray(this.label?.list)) {
      const arrayToList: Record<string, string | number> = {};
      this.label.list.forEach((item: any) => {
        arrayToList[item.id] = item.value;
      });
      this.list = arrayToList;
    }

    this.value = 1;

    document.addEventListener("click", this.handleClickOutside);

    this.handleInput()
  }

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }
}
</script>

<style lang="scss">
.form-field .custom-field {
  position: relative;
  margin: 0;

  p {
    margin: 0;
    padding: 0 .2rem;
  }

  .items {
    position: absolute;
    width: 100%;
    top: 100%;
    background-color: var(--white);
    margin: .1rem 0;
    border: 1px solid var(--black);
    border-top: none;

    .item {
      margin: 0;
      padding: .25rem 0;

      & div {
        margin: 0;
      }

      &:hover {
        background-color: var(--hover-color);
        color: var(--white);
        cursor: pointer;
      }
    }
  }

  .disabled {
    display: none;
  }
}
</style>