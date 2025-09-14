import {Form} from "@/utility/interfaces/label.interface";

const stylesForm: Form = {
    labels: {
        name: {
            title: "Название",
            placeholder: "Название",
            type: "text",
            templateType: 'text',
            required: true
        },
        background_color: {
            title: "Задний фон",
            placeholder: "Задний фон",
            type: "text",
            templateType: 'colorPicker',
        },
        color: {
            title: "Цвет текста",
            placeholder: "Цвет текста",
            type: "text",
            templateType: "colorPicker",
        },
        font_size: {
            title: "Размер шрифта",
            placeholder: "Размер шрифта",
            type: "number",
            templateType: "text",
        },
        css: {
            title: "CSS стили поля",
            placeholder: "CSS стили поля",
            type: "text",
            templateType: "textArea",
            size: 6,
        },
    },
    action: 'styles/style',
    method: 'POST'
};

export default stylesForm;