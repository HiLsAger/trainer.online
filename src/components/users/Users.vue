<template>
  <div>
    <button class="btn btn-submit" @click="handleForm(userForm)">Добавить</button>
    <GridComponent
        :table-body="usersList.body"
        :table-head="usersList.head"
        @rowActionData="handleForm"
    >
    </GridComponent>
    <transition name="fade">
      <ModalComponent
          v-if="form.labels && Object.keys(form.labels).length > 0"
          :key="formChangeKey"
          title="test"
          :form="form"
          :show="true"/>
    </transition>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ServerHelper from "@/core/helpers/Server.helper";
import GridComponent from "@/components/grid/Grid.vue";
import ApiFacade from "@/core/api/Api.facade";
import {Grid} from "@/utility/interfaces/grid.interface";
import {defaultUserGrid} from "@/core/models/User";
import ModalComponent from "@/components/modal/Modal.vue";
import {Form} from "@/utility/interfaces/label.interface";
import userForm from "@/components/users/User.form";

@Options({
  components: {ModalComponent, GridComponent}

})
export default class UsersComponent extends Vue {
  api?: ApiFacade | null = null;
  form?: Form = {
    labels: {},
    action: '',
    method: ''
  };
  usersList: Grid = {
    head: [],
    body: []
  };
  formChangeKey: number = 0;
  userForm = userForm;

  serverHelper?: ServerHelper;

  handleForm(form: Form | null) {
    if (!form) {
      return;
    }

    this.formChangeKey++;
    this.form = form;
  }

  async loadUsers() {
    if (this.api && this.api.users) {
      this.usersList = await this.api.users.getUsersGrid() ?? defaultUserGrid
    }
  }

  async mounted() {
    this.serverHelper = await ServerHelper.getInstance();
    this.api = await ApiFacade.getInstance();
    await this.loadUsers();
  }
}
</script>

<style lang="scss">
#right-modal.fade-leave-active.fade-leave-to {
  opacity: (0);
  transition: opacity 0.2s linear;
}
</style>
