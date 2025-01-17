import AboutView from "@/views/AboutView.vue";
import HomeView from "@/views/HomeView.vue";
import UsersView from "@/views/UsersView.vue";
import {RouteRecordRaw} from "vue-router";

const pagesRoutes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Главная",
        meta: {
            sidebar: true,
            bootstrapIconClass: "bi-house-fill",
            tooltip: 'Главная',
            title: 'Главная'
        },
        component: HomeView,
    },
    {
        path: "/about",
        name: "Описание",
        meta: {
            sidebar: true,
            bootstrapIconClass: "bi-info-circle-fill",
            tooltip: 'Описание',
            title: 'Описание'
        },
        component: AboutView,
    },
    {
        path: "/users",
        name: "Пользователи",
        meta: {
            sidebar: true,
            bootstrapIconClass: "bi-people-fill",
            tooltip: 'Пользователи',
            title: 'Пользователи'
        },
        component: UsersView,
    }
]

export default pagesRoutes;