<template>
  <div><ProfileComponent /></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ProfileComponent from "../components/profile/Profile.vue";

@Options({
  components: {
    ProfileComponent,
  },
})
export default class SettingsView extends Vue {}
</script>

<style lang="scss"></style>
