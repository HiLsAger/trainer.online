import {RouteRecordRaw} from "vue-router";
import AuthView from "@/views/AuthView.vue";

const trainingsRoutes: Array<RouteRecordRaw> = [
    {
        path: "",
        name: "Тренировки",
        component: AuthView,
        meta: {
            sidebar: true,
            bootstrapIconClass: "bi bi-calendar-event-fill",
            tooltip: 'Тренировки',
            title: 'Тренировки'
        },
        children: [
            {
                path: "/training-sheet",
                name: "Доска тренеровок",
                component: AuthView,
                meta: {
                    sidebar: true,
                    bootstrapIconClass: "",
                    tooltip: 'Доска тренеровок',
                    title: 'Доска тренеровок'
                },
            },
            {
                path: "",
                name: "Настройки тренеровок",
                component: AuthView,
                meta: {
                    sidebar: true,
                    bootstrapIconClass: "",
                    tooltip: 'Настройки тренеровок',
                    title: 'Настройки тренеровок'
                },
                children: [
                    {
                        path: "/trainings",
                        name: "Тренеровки",
                        component: AuthView,
                        meta: {
                            sidebar: true,
                            bootstrapIconClass: "",
                            tooltip: 'Тренеровки',
                            title: 'Тренеровки'
                        },
                    },
                    {
                        path: "/rooms",
                        name: "Залы",
                        component: AuthView,
                        meta: {
                            sidebar: true,
                            bootstrapIconClass: "",
                            tooltip: 'Залы',
                            title: 'Залы'
                        },
                    },
                ]
            }
        ]
    },
];

export default trainingsRoutes;