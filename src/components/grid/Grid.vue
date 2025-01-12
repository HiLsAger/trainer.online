<template>
  <div>
    <table>
      <thead :class="gridOptions?.classParams.tHeadClass">
      <tr>
        <td v-for="item in tableHead">{{ item }}</td>
      </tr>
      <tr v-if="tableFilters">

      </tr>
      </thead>
      <tbody :class="gridOptions?.classParams.tBodyClass">
      <tr v-for="row in tableBody">
        <td v-for="item in row">{{ item }}</td>
      </tr>
      </tbody>
      <tfoot :class="gridOptions?.classParams.tFootClass"></tfoot>
      <caption v-if="caption">{{ caption }}}</caption>
    </table>
  </div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";
import CellFilter from "@/components/grid/interfaces/CellFilter";
import {GridOptions} from "@/components/grid/interfaces/GridOptions";

@Options({
  props: {
    tableHead: {
      type: Array as () => string[],
      required: true,
    },
    tableFilters: {
      type: Array as () => CellFilter[],
      required: false
    },
    tableBody: {
      type: Array as () => (string | number)[][],
      required: true,
    },
    gridOptions: {
      type: Object as () => GridOptions,
      required: false
    },
    caption: {
      type: String,
      required: false
    },
  }
})
export default class GridComponent extends Vue {
  tableHead!: string[];
  tableFilters!: CellFilter[];
  tableBody!: (string | number)[][];
  gridOptions!: GridOptions;
  caption!: string;
}
</script>

<style lang="scss">

</style>