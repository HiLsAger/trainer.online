import {RouteRecordRaw} from "vue-router";
import StylesView from "@/views/lists/StylesView.vue";

const stylesRoutes: Array<RouteRecordRaw> = [
    {
        path: "/lists",
        name: "Справочники",
        meta: {
            sidebar: true,
            bootstrapIconClass: "bi bi-calendar-event-fill",
            tooltip: 'Справочники',
            title: 'Справочники'
        },
        children: [
            {
                path: "/styles",
                name: "Стили",
                component: StylesView,
                meta: {
                    sidebar: true,
                    bootstrapIconClass: "",
                    tooltip: 'Стили',
                    title: 'Стили'
                },
            },
        ]
    },
];

export default stylesRoutes;