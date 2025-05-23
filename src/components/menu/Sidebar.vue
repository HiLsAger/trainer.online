<template>
  <div id="sidebar" :aria-hidden="hidden">
    <button v-on:click="HideAndShow" class="resize-sidebar">
      <i :class="['bi', HideAndShowIcon]"></i>
    </button>
    <div class="sidebar-content">
      <nav>
        <router-link
            v-for="route in sidebarRoutes"
            :key="route.name"
            :to="route.path"
            class="nav-link"
            v-tooltip="route.meta.tooltip">
          <i :class="[ 'bi', BootstrapIconClass(route) ]"></i>
          <span>{{ route.name }}</span>
        </router-link>
      </nav>
      <router-link :to="{ name: 'settings' }" class="settings">
        <i :class="['bi', BootstrapIconClass(settingsRoute)]"></i>
        <span>Параметры</span>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-class-component';
import {RouteLocationNormalizedLoaded, RouteRecordRaw} from 'vue-router';

export default class SidebarComponent extends Vue {
  hidden = false;


  get sidebarRoutes(): RouteRecordRaw[] {
    return this.$router.options.routes.filter(route => route.meta && route.meta.sidebar);
  }

  get HideAndShowIcon() {
    return this.hidden ? 'bi-arrow-bar-right' : 'bi-arrow-bar-left';
  }

  get settingsRoute(): RouteLocationNormalizedLoaded | null {
    return (this
        .$router
        .getRoutes()
        .find(route => route.name === 'settings') || null) as RouteLocationNormalizedLoaded | null;
  }

  BootstrapIconClass(route: RouteRecordRaw | RouteLocationNormalizedLoaded | null) {
    return route && route.meta && route.meta.bootstrapIconClass
        ? route.meta.bootstrapIconClass
        : 'bi-square-fill text-danger';
  }

  HideAndShow() {
    this.hidden = !this.hidden;
    localStorage.hidden = this.hidden;
  }

  mounted() {
    const localStorageHidden = localStorage.getItem('hidden');
    if (localStorageHidden !== null) {
      this.hidden = JSON.parse(localStorageHidden);
    }
  }
}

</script>

<style lang="scss">
#sidebar {
  width: 30%;
  max-width: 300px;
  min-width: 200px;
  padding: 3em 1em;
  background-color: var(--black);
  position: relative;
  transition: .3s;
  z-index: 100;

  .sidebar-content {
    position: sticky;
    height: 100%;
    display: flex;
    flex-direction: column;

    nav {
      display: flex;
      flex-direction: column;
    }

    .settings, .nav-link {
      margin-top: auto;
      text-align: left;
      color: var(--white);
      text-decoration: none;
      font-size: 1.2em;
      line-height: 1.5;
      white-space: nowrap;
      transition: .3s;

      span {
        margin-left: .5em;
      }
    }

    .settings:hover, .nav-link:hover {
      background-color: var(--white);
      color: var(--black);
    }
  }

  .resize-sidebar {
    position: absolute;
    top: 0;
    width: 3vh;
    height: 3vh;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    color: var(--white);
    font-size: 1.5em;
    transition: 0.3s;
    right: 0;
    background-color: var(--black);
    outline: none;
    z-index: 10;
    border-bottom: 2px solid var(--white);
    border-left: 2px solid var(--white);
  }

  .resize-sidebar:hover {
    background-color: var(--white);
    color: var(--black);
    cursor: pointer;
  }

  &[aria-hidden=true] {
    width: 2em;
    min-width: 2em;
    transition: .3s;

    .nav-link, .settings {
      display: flex;

      i {
        margin: auto;
      }

      span {
        display: none;
      }
    }
  }

  &[aria-hidden=false] {
    [data-tooltip]:after {
      display: none;
    }
  }
}
</style>