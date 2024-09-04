import AboutView from "@/views/AboutView.vue";
import HomeView from "@/views/HomeView.vue";
import { RouteRecordRaw } from "vue-router";

const pagesRoutes: Array<RouteRecordRaw> = [
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
    }
]

export default pagesRoutes;