import SettingsView from "@/views/SettingsView.vue";
import {RouteRecordRaw} from "vue-router";

const settingsRoutes: Array<RouteRecordRaw> = [
    {
        path: "/settings",
        name: "Настройки",
        meta: {
            sidebar: true,
            bootstrapIconClass: "bi bi-gear-fill",
            tooltip: 'Настройки',
            title: 'Настройки'
        },
        component: SettingsView,
    },
]

export default settingsRoutes;