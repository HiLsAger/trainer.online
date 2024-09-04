import AuthView from "@/views/AuthView.vue";
import { RouteRecordRaw } from "vue-router";

const authRoutes: Array<RouteRecordRaw> = [
    {
        path: "/auth",
        name: "Аутентификация",
        component: AuthView,
        meta: {
            bootstrapIconClass: "",
        },
    },
]

export default authRoutes;