import {RouteRecordRaw} from "vue-router";
import ProfileVue from "@/views/ProfileView.vue";

const permissionsRoutes: Array<RouteRecordRaw> = [
    {
        path: "",
        name: "Настройка доступов",
        meta: {
            sidebar: true,
            bootstrapIconClass: "bi-lock-fill",
            tooltip: 'Настройка доступов',
            title: 'Настройка доступов'
        },
        component: ProfileVue,
        children: [
            {
                path: "/users-permissions",
                name: "Права пользователей",
                meta: {
                    sidebar: true,
                    bootstrapIconClass: "",
                    tooltip: 'Права пользователей',
                    title: 'Права пользователей'
                },
                component: ProfileVue,
            },
        ]
    },
];

export default permissionsRoutes;