import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import SettingsView from "@/views/SettingsView.vue";
import AuthView from "@/views/AuthView.vue";
import store from "@/vuex/store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Главная",
    meta: {
      sidebar: true,
      bootstrapIconClass: "bi-house-fill",
    },
    component: HomeView,
  },
  {
    path: "/about",
    name: "Описание",
    meta: {
      sidebar: true,
      bootstrapIconClass: "bi-info-circle-fill",
    },
    component: AboutView,
  },
  {
    path: "/settings",
    name: "settings",
    meta: {
      bootstrapIconClass: "bi-gear-fill",
    },
    component: SettingsView,
  },
  {
    path: "/auth",
    name: "Аутентификация",
    component: AuthView,
    meta: {
      bootstrapIconClass: "",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const self = store.state.self;
  if (!self && to.path !== "/auth") {
    next({ path: "/auth" });
  } else if (self && to.path === "/auth") {
    next({ path: "/" });
  } else next();
});

export default router;
