<template>
  <div>
    <GridComponent
        :table-body="api ? api.users?.getUsersList() : []"
        :table-head="['id', 'ligin', 'name', 'status', 'role']">
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

  serverHelper?: ServerHelper;

  getUsers() {
    return this.api?.users?.getUsersList();
  }

  async mounted() {
    this.serverHelper = await ServerHelper.getInstance();
    this.api = await ApiFacade.getInstance();
  }
}
</script>

<style lang="scss"></style>
