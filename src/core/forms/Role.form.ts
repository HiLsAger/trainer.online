import {Form} from "@/utility/interfaces/label.interface";

const typeList: Record<number, string> = {
    0: "Без роли",
    1: "Тренер",
    2: "Менеджер",
};

const roleForm: Form = {
    labels: {
        name: {
            title: "Название",
            placeholder: "Название",
            type: "text",
            templateType: 'text',
            required: true
        },
        description: {
            title: "Описание",
            placeholder: "Описание",
            type: "text",
            templateType: 'text'
        },
        type: {
            title: "Тип",
            placeholder: "Тип",
            type: "text",
            templateType: 'select',
            value: 0,
            list: typeList,
        },
        permissions: {
            title: "Права",
            placeholder: "Описание",
            type: "select",
            templateType: 'multiSelectAdvanced',
            list: "fields/permissions",
        },
    },
    action: 'roles/role',
    method: 'POST'
};

export default roleForm;