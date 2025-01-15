<template>
  <div>
    <GridComponent
        :table-body="usersList"
        :table-head="['Id', 'Логин', 'Имя', 'Статус профиля', 'Роль']">
    </GridComponent>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ServerHelper from "@/core/helpers/Server.helper";
import GridComponent from "@/components/grid/Grid.vue";
import ApiFacade from "@/core/api/Api.facade";

@Options({
  components: {GridComponent}
})
export default class UsersComponent extends Vue {
  api?: ApiFacade | null = null;
  usersList: (string | number)[][] = [];

  serverHelper?: ServerHelper;

  async loadUsers() {
    if (this.api && this.api.users) {
      this.usersList = (await this.api.users.getUsersList()
          .then(users => {
            return users?.map(user => [
              user.id,
              user.login,
              user.name,
              user.status,
              user.roleName
            ])
          })) ?? [];
    }
  }

  async mounted() {
    this.serverHelper = await ServerHelper.getInstance();
    this.api = await ApiFacade.getInstance();
    await this.loadUsers();
  }
}
</script>

<style lang="scss"></style>
