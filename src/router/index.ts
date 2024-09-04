import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "@/modules/vuex/store";
import settingsRoutes from "./routes/settings/settings.routes";
import authRoutes from "./routes/auth/auth.routes";
import pagesRoutes from "./routes/pages/pages.routes";

const routes: Array<RouteRecordRaw> = [
  ...authRoutes,
  ...pagesRoutes,
  ...settingsRoutes
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
