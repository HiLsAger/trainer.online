import {RouteRecordRaw} from "vue-router";
import EmptyView from "@/views/EmptyView.vue";
import TrainingsView from "@/views/trainings/TrainingsView.vue";
import RoomsView from "@/views/trainings/RoomsView.vue";

const trainingsRoutes: Array<RouteRecordRaw> = [
    {
        path: "/trainings",
        name: "Тренировки",
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
                component: EmptyView,
                meta: {
                    sidebar: true,
                    bootstrapIconClass: "",
                    tooltip: 'Доска тренеровок',
                    title: 'Доска тренеровок'
                },
            },
            {
                path: "/trainings",
                name: "Список тренеровок",
                component: TrainingsView,
                meta: {
                    sidebar: true,
                    bootstrapIconClass: "",
                    tooltip: 'Список тренеровок11',
                    title: 'Список тренеровок'
                },
            },
            {
                path: "/rooms",
                name: "Залы",
                component: RoomsView,
                meta: {
                    sidebar: true,
                    bootstrapIconClass: "",
                    tooltip: 'Залы',
                    title: 'Залы'
                },
            },
        ]
    },
];

export default trainingsRoutes;