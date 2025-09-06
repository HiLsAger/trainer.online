<template>
  <div>
    <GridComponent
        :key="gridScore"
        :table-body="itemsList.body"
        :table-head="itemsList.head"
        @rowActionData="handleForm"
        @rowUpdate="handleGridUpdate"
    >
    </GridComponent>
    <transition name="fade">
      <ModalComponent
          v-if="form.labels && Object.keys(form.labels).length > 0"
          :key="formChangeKey"
          :form="form"
          :show="true"
          @handleSuccess="handleGridUpdate"
      >
      </ModalComponent>
    </transition>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ModalComponent from "@/components/modal/Modal.vue";
import GridComponent from "@/components/grid/Grid.vue";
import ApiFacade from "@/core/api/Api.facade";
import {Form} from "@/utility/interfaces/label.interface";
import {Grid} from "@/utility/interfaces/grid.interface";
import ServerHelper from "@/core/helpers/Server.helper";
import {defaultUserGrid} from "@/core/models/User";
import userForm from "@/core/forms/User.form";

@Options({
  components: {ModalComponent, GridComponent}
})
export default class PermissionsView extends Vue {
  form?: Form = {
    labels: {},
    action: '',
    method: ''
  };
  itemsList: Grid = {
    head: [],
    body: []
  };
  formChangeKey: number = 0;
  gridScore = 0;

  api?: ApiFacade | null = null;
  serverHelper?: ServerHelper;

  handleForm(form: Form | null) {
    if (!form) {
      form = JSON.parse(JSON.stringify(userForm)) as Form
    }

    this.reloadForm();
    this.form = form;
  }

  reloadForm() {
    this.formChangeKey++;
  }

  async loadData() {
    if (this.api && this.api.users) {
      this.itemsList = await this.api.permissions?.getPermissionsGrid() ?? defaultUserGrid
    }
  }

  async handleGridUpdate() {
    await this.loadData()

    this.gridScore++;
  }

  async mounted() {
    this.serverHelper = await ServerHelper.getInstance();
    this.api = await ApiFacade.getInstance();
    await this.loadData();
  }
}
</script>