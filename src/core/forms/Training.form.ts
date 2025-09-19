import {Flags, Form} from "@/utility/interfaces/label.interface";

const trainingForm: Form = {
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
        style_id: {
            placeholder: 'Стили',
            templateType: 'selectAdvanced',
            list: 'fields/styles',
            title: 'Стили',
            type: 'text',
            flags: [Flags.AS_HTML]
        }
    },
    action: 'trainings/training',
    method: 'POST'
};

export default trainingForm;