import {Flags, Form} from "@/utility/interfaces/label.interface";

const trainingRoomForm: Form = {
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
        },
        sort: {
            title: 'Стили',
            placeholder: 'Порядок сортировки',
            templateType: 'field',
            type: 'number',
        }
    },
    action: 'training-rooms/room',
    method: 'POST'
};

export default trainingRoomForm;