import ProfileVue from "@/views/ProfileView.vue";
import {RouteRecordRaw} from "vue-router";
import ConfigHelper from "@/core/helpers/Config.helper";

const configHelper = await ConfigHelper.getInstance();

const profileRoutes: Array<RouteRecordRaw> = [
    {
        path: "/profile",
        name: "Профиль",
        meta: {
            sidebar: true,
            bootstrapIconClass: "bi-person-fill",
            tooltip: 'Профиль',
            title: 'Профиль'
        },
        component: ProfileVue,
        children: [
            {
                path: ':username',
                component: ProfileVue,
                meta: {
                    title: 'Профиль'
                }
            },
        ],
        props: true
    },
]

export default profileRoutes;