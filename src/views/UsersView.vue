<template>
  <div>
    <UsersComponent/>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import UsersComponent from "@/components/users/Users.vue";

@Options({
  components: {
    UsersComponent
  }
})
export default class UsersView extends Vue {
}
</script>

<style lang="scss"></style>
