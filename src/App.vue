<template>
  <div class="container">
    <SidebarComponent v-if="self" />
    <div id="content">
      <router-view />
    </div>
  </div>
  <Toaster />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import SidebarComponent from "./components/Sidebar.vue";
import Toaster from "./components/Toaster.vue";
import self_intefrace from "./utility/interfaces/SelfInterface";
import { useStore } from "vuex";

@Options({
  components: {
    SidebarComponent,
    Toaster
  },
})
export default class App extends Vue {
  store = useStore();
  get self(): self_intefrace | null {
    return this.store.getters.self;
  }
}
</script>
<style lang="scss">
:root {
  --black: #1f1f1f;
  --white: #f1f1f1;
  --full-black: #000000;
}
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.container {
  width: 100%;
  min-height: 100vh;
  background-color: #f1f1f1;
  display: flex;
  #content {
    flex: 1;
  }
}
.text-danger {
  color: #dc3545;
}
.text-success {
  color: #28a745;
}
.text-warning {
  color: #ffc107;
}
</style>
