<template>
  <div><ProfileComponent /></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ProfileComponent from "../components/settings/Profile.vue";

@Options({
  components: {
    ProfileComponent,
  },
})
export default class SettingsView extends Vue {}
</script>

<style lang="scss"></style>
