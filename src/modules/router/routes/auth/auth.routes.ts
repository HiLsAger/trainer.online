import AuthService from "@/components/auth/services/auth.service";
import EmptyView from "@/views/EmptyView.vue";
import {RouteRecordRaw} from "vue-router";
import AuthView from "@/views/AuthView.vue";

const authRoutes: Array<RouteRecordRaw> = [
    {
        path: "/auth",
        name: "Аутентификация",
        component: AuthView,
        meta: {
            bootstrapIconClass: ""
        },
    },
    {
        path: "/logout",
        name: "Выйти из аккаунта",
        beforeEnter(to, from, next) {
            var authService = new AuthService();
            authService.logout();
            next("/auth")
        },
        component: EmptyView,
        meta: {
            sidebar: true,
            bootstrapIconClass: "bi-door-open-fill",
            tooltip: 'Выйти из аккаунта'
        },
    }
]

export default authRoutes;