import SettingsView from "@/views/SettingsView.vue";
import {RouteRecordRaw} from "vue-router";

const settingsRoutes: Array<RouteRecordRaw> = [
    {
        path: "/settings",
        name: "settings",
        meta: {
            bootstrapIconClass: "bi-gear-fill",
            title: 'Настройки'
        },
        component: SettingsView,
    },
]

export default settingsRoutes;