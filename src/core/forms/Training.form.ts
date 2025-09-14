import {Form} from "@/utility/interfaces/label.interface";

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
        }
    },
    action: 'trainings/training',
    method: 'POST'
};

export default trainingForm;