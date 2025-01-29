<template>
  <div>
    <table class="data-grid">
      <thead :class="gridOptions?.classParams.tHeadClass">
      <tr>
        <td v-for="item in tableHead">{{ item }}</td>
      </tr>
      <tr v-if="tableFilters">

      </tr>
      </thead>
      <tbody :class="gridOptions?.classParams.tBodyClass">
      <tr v-for="row in tableBody"
          @click="onRowClick(row.actions.rowActionUrl ?? '')">
        <td v-for="item in row.columns">{{ item }}</td>
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
import {TableBody} from "@/utility/interfaces/grid.interface";
import AxiosHelper from "@/core/helpers/Axios.helper";
import {useStore} from "vuex";

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
      type: Array as () => TableBody[],
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

  axiosHelper?: AxiosHelper;
  store = useStore()

  async onRowClick(action: string) {
    if (!action || !this.axiosHelper) {
      this.store.dispatch("addToast", {
        type: "error",
        title: "Ошибка",
        message: 'Произошла неизвестная ошибка',
      });
      return;
    }

    return this.$emit(
        'rowActionData',
        (await this.axiosHelper.sendGetRequest(action)) ?? null
    );
  }

  async mounted() {
    this.axiosHelper = await AxiosHelper.getInstance();
  }
}
</script>

<style lang="scss">
.data-grid {
  width: 100%;
  border-collapse: collapse;

  thead {
    font-weight: bold;
  }

  td {
    padding: 5px;
  }

  tr {
    border-bottom: 1px solid black;
  }

  tbody {
    tr {
      background-color: var(--table-row);

      &:nth-child(even) {
        background-color: var(--table-row-even);
      }

      &:hover {
        background-color: var(--table-row-hover);
        cursor: pointer;
      }
    }
  }
}
</style>