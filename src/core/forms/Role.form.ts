import {Form} from "@/utility/interfaces/label.interface";

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