<template>
  <div class="container">
    <SidebarComponent v-if="self"/>
    <div id="content">
      <h1>{{ $route.meta.title }}</h1>
      <div class="page-content">
        <router-view/>
      </div>
    </div>
  </div>
  <Toaster/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import SidebarComponent from "./components/menu/Sidebar.vue";
import Toaster from "./components/toaster/Toaster.vue";
import self_intefrace from "./utility/interfaces/self.interface";
import {useStore} from "vuex";

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
  --danger: #dc3545;
  --success: #28a745;
  --warning: #ffc107;

  --hover-color: #2d5cc0;

  --table-row: #f1f1f1;
  --table-row-even: #d1d1d1;
  --table-row-hover: #e5faff;
}

body {
  font-size: 14px;
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
    padding: 0 2rem;
    width: 100%;
    text-align: left;
  }

  .page-content {
    & > div {
      width: 100%;
    }

    .component-content {
      flex: 1;
    }
  }
}

.text-danger {
  color: var(--danger);
}

.text-success {
  color: var(--success);
}

.text-warning {
  color: var(--warning);
}

.btn {
  display: block;
  background-color: transparent;
  border: 2px solid var(--black);
  color: var(--black);
  font-size: 1rem;
  margin-top: 1rem;
}

.btn-auth {
  margin-top: 1rem;
  font-size: 1.2rem;
  margin-left: auto;
  width: 100%;

  &:hover {
    background-color: var(--hover-color);
    border: 2px solid var(--hover-color);
  }
}
</style>