<template>
  <div>
    <ProfileComponent :username="username"/>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ProfileComponent from "../components/profile/Profile.vue";

@Options({
  components: {
    ProfileComponent,
  },
  props: {
    username: {
      type: String,
      required: false,
    },
  }
})
export default class ProfileView extends Vue {
  username!: String;
}
</script>

<style lang="scss"></style>
  