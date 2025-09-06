<template>
  <template v-for="route in routes">
    <li :key="route.name" v-if="route.meta && route.meta.sidebar">
      <a v-if="route.children"
         class="nav-link"
         href="#"
         v-tooltip="route.meta.tooltip"
         @click.prevent="toggle(route.name)">
        <i :class="['bi', BootstrapIconClass(route)]"></i>
        <span>{{ route.name }}</span>
      </a>
      <router-link
          v-else
          :to="route.path"
          class="nav-link"
          v-tooltip="route.meta.tooltip"
          @click="toggle(route.name)">
        <i :class="['bi', BootstrapIconClass(route)]"></i>
        <span>{{ route.name }}</span>
      </router-link>
      <template v-if="route.children">
        <ul class="children" v-show="isOpen(route.name)">
          <SidebarItemsComponent :routes="route.children"/>
        </ul>
      </template>
    </li>
  </template>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {RouteLocationNormalizedLoaded, RouteRecordRaw} from "vue-router";

@Options({
  props: {
    routes: {
      type: Array,
      required: true
    }
  },
  components: {
    SidebarItemsComponent
  }
})
export default class SidebarItemsComponent extends Vue {
  routes!: RouteRecordRaw[];
  openStates: Record<string, boolean> = {};

  isOpen(routeName: string): boolean {
    return !!this.openStates[routeName];
  }

  toggle(routeName: string) {
    this.openStates[routeName] = !this.openStates[routeName];
  }

  BootstrapIconClass(route: RouteRecordRaw | RouteLocationNormalizedLoaded | null) {
    return route && route.meta && route.meta.bootstrapIconClass
        ? route.meta.bootstrapIconClass
        : 'bi-caret-right-fill';
  }
}
</script>