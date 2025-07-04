import {RouteRecordRaw} from "vue-router";
import EmptyView from "@/views/EmptyView.vue";
import PermissionsView from "@/views/permissions/PermissionsView.vue";

const permissionsRoutes: Array<RouteRecordRaw> = [
    {
        path: "/permission",
        name: "Работа с правами",
        meta: {
            sidebar: true,
            bootstrapIconClass: "bi-lock-fill",
            tooltip: 'Работа с правами',
            title: 'Работа с правами'
        },
        children: [
            {
                path: "/permission/permission-list",
                name: "Список прав",
                meta: {
                    sidebar: true,
                    bootstrapIconClass: "",
                    tooltip: 'Список прав',
                    title: 'Список прав'
                },
                component: PermissionsView,
            },
            {
                path: "/permission/roles",
                name: "Роли",
                meta: {
                    sidebar: true,
                    bootstrapIconClass: "",
                    tooltip: 'Роли',
                    title: 'Роли'
                },
                component: EmptyView,
            },
        ]
    },
];

export default permissionsRoutes;