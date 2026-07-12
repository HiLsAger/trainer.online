import {RouteRecordRaw} from "vue-router";
import TrainingsView from "@/views/trainings/TrainingsView.vue";
import RoomsView from "@/views/trainings/RoomsView.vue";
import TrainingSheetView from "@/views/trainings/TrainingSheetView.vue";
import TrainingListView from "@/views/trainings/TrainingListView.vue";

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
                name: "Доска тренировок",
                component: TrainingSheetView,
                meta: {
                    sidebar: true,
                    bootstrapIconClass: "",
                    tooltip: 'Доска тренировок',
                    title: 'Доска тренировок'
                },
            },
            {
                path: "/training-list",
                name: "Список тренировок за дату",
                meta: {
                    sidebar: true,
                    bootstrapIconClass: "bi-person-fill",
                    tooltip: 'Список тренировок за дату',
                    title: 'Список тренировок за дату',

                },
                component: TrainingListView,
                props: (route) => ({
                    date: route.params.date || '',
                    training_room_id: route.params.training_room_id || ''
                }),
                children: [
                    {
                        path: ':training_room_id/:date',
                        name: "Список тренировок за дату",
                        component: TrainingListView,
                        meta: {
                            title: 'Список тренировок за дату'
                        },
                        props: true
                    },
                ],
            },
            {
                path: "/trainings",
                name: "Список тренировок",
                component: TrainingsView,
                meta: {
                    sidebar: true,
                    bootstrapIconClass: "",
                    tooltip: 'Список тренировок',
                    title: 'Список тренировок'
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
