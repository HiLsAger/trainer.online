<template>
  <div :class="label.error ? 'validate-error' : ''">
    <label :for="label.title">{{ label.title }}</label>
    <div class="multi-select-advanced">
      <div class="row multi-select-advanced__actions">
        <div class="multi-select-advanced__action action-move-left">
          <button v-on:click="selectAll">Выбрать все</button>
        </div>
        <div class="multi-select-advanced__action action-move-left">
          <button v-on:click="unselectAll">убрать все</button>
        </div>
      </div>
      <div class="row">
        <div class="left-column column">
          <div v-for="(name, id) in columns.left">
            <button v-on:click="move(id, 'right')">{{ name }}</button>
          </div>
        </div>
        <div class="right-column column">
          <div v-for="(name, id) in columns.right">
            <button v-on:click="move(id, 'left')">{{ name }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {Label} from "@/utility/interfaces/label.interface";
import AxiosHelper from "@/core/helpers/Axios.helper";

@Options({
  props: {
    label: Object as () => Label,
    name: String
  },
})
export default class MultiSelectAdvanced extends Vue {
  label!: Label;
  name!: string;
  list?: object = {};

  columns: MultiSelectColumnsInterface = {
    left: {},
    right: {},
  }

  axiosHelper?: AxiosHelper;

  public handleInput(): void {
    console.log(Object.keys(this.columns.right))
    this.$emit("handleInput", Object.keys(this.columns.right));
  }

  public move(id: number | string, to: string): void {
    switch (to) {
      case 'left':
        this.columns.left[id] = this.columns.right[id];
        delete this.columns.right[id];
        break
      case 'right':
        this.columns.right[id] = this.columns.left[id];
        delete this.columns.left[id];
        break
    }

    this.handleInput()
  }

  public selectAll(): void {
    for (const id of Object.keys(this.columns.left)) {
      this.move(id, 'right');
    }
  }

  public unselectAll(): void {
    for (const id of Object.keys(this.columns.right)) {
      this.move(id, 'left');
    }
  }

  async mounted() {
    this.axiosHelper = await AxiosHelper.getInstance();

    if (typeof this.label.list === 'string') {
      this.list = await this.axiosHelper.sendGetRequest(this.label.list)
    } else if (Array.isArray(this.label?.list)) {
      this.list = this.label.list;
    }

    const labelValues = (this.label.values || []) as number[];
    const labelValuesSet = new Set(labelValues);

    for (const id in this.list) {
      if (Object.prototype.hasOwnProperty.call(this.list, id)) {
        const numericId = Number(id);

        const value = (this.list as Record<string | number, any>)[numericId] || (this.list as Record<string | number, any>)[id];

        if (labelValuesSet.has(numericId)) {
          this.columns.right[numericId] = value;
        } else {
          this.columns.left[numericId] = value;
        }
      }
    }

    this.handleInput()
  }
}
</script>

<style lang="scss">
.form-field {
  .multi-select-advanced {
    border: 2px solid var(--black);
    margin-top: 0;

    .row {
      display: flex;
      flex-direction: row;
      padding: .35rem;
      justify-content: space-between;
      margin-top: 0;

      &.multi-select-advanced__actions {
        justify-content: start;

        .multi-select-advanced__action {
          border: none;

          button {
            margin-right: .25rem;
          }
        }
      }

      .column {
        width: 45%;
        font-size: .1rem;
      }
    }

    button {
      outline: none;
      border: 2px solid var(--black);
      color: var(--black);
      background-color: var(--white);

      &:hover {
        background-color: var(--black);
        color: var(--white);
      }
    }
  }
}
</style>