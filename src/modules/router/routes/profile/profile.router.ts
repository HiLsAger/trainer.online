import ProfileVue from "@/views/ProfileView.vue";
import {RouteRecordRaw} from "vue-router";

const profileRoutes: Array<RouteRecordRaw> = [
    {
        path: "/profile",
        name: "Профиль",
        meta: {
            sidebar: true,
            bootstrapIconClass: "bi-person-fill",
            tooltip: 'Профиль'
        },
        component: ProfileVue,
    },
    {
        path: "/profile/:username",
        name: "Профиль",
        meta: {
            bootstrapIconClass: "bi-person-fill",
        },
        component: ProfileVue,
        props: true
    },
]

export default profileRoutes;