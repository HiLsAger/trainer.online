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
        <td v-for="item in row.columns">
          <template v-if="typeof item === 'string' || typeof item === 'number'">{{ item }}</template>
          <template v-for="(element, index) in item" :key="index">
            <div class="action-links">
              <a
                  class="action-link icon-link"
                  v-if="element.icon"
                  :href="element.url"
                  @click.prevent.stop="actionClick(element)"
                  v-html="element.icon"
                  v-tooltip="element.title"
              ></a>
              <a
                  class="action-link"
                  v-else
                  :href="element.url"
                  @click.prevent.stop="actionClick(element)"
                  v-html="element.title"
              ></a>
            </div>
          </template>
        </td>
      </tr>
      </tbody>
      <tfoot :class="gridOptions?.classParams.tFootClass"></tfoot>
      <caption v-if="caption">{{ caption }}}</caption>
    </table>
    <ConfirmModalComponent
        :show="isShowModal"
        :text="modalText"
        @confirm="confirm"
        @cancel="cancel"
    />
  </div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";
import CellFilter from "@/components/grid/interfaces/CellFilter";
import {GridOptions} from "@/components/grid/interfaces/GridOptions";
import {Action, TableBody} from "@/utility/interfaces/grid.interface";
import AxiosHelper from "@/core/helpers/Axios.helper";
import {useStore} from "vuex";
import ConfirmModalComponent from "@/components/modal/ConfirmModal.vue";
import {useConfirmModal} from "@/components/modal/useConfirmModal";
import {Ref} from "vue";

@Options({
  components: {ConfirmModalComponent},
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

  private modal = useConfirmModal()

  get isShowModal(): Ref<boolean> {
    return this.modal.isShowModal;
  }

  get modalText(): Ref<string> {
    return this.modal.modalText;
  }

  ask = async (text: string) => this.modal.ask(text);
  confirm = () => this.modal.confirm();
  cancel = () => this.modal.cancel();

  async doAction(action: string) {
    if (!action || !this.axiosHelper) {
      this.store.dispatch("addToast", {
        type: "error",
        title: "Ошибка",
        message: 'Произошла неизвестная ошибка',
      });
      return;
    }
  }

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

  async actionClick(action: Action) {
    if (action.confirm && !(await this.ask(action.confirm))) {
      return;
    }

    this.update(await this.axiosHelper?.sendRequest(action.url, action.method));
  }

  update(data: any) {
    return this.$emit(
        'rowUpdate',
        data
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

      td {
        .action-links {
          display: flex;

          .action-link {
            display: flex;

            &.icon-link {

              svg {
                color: var(--danger);
                width: 1.2em;
                height: 1.2em;

                &:hover {
                  color: var(--hover-danger);
                }
              }
            }
          }
        }
      }

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