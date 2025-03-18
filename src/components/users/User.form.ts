import {Form} from "@/utility/interfaces/label.interface";

const userForm: Form = {
    labels: {
        login: {
            placeholder: 'Логин',
            required: true,
            templateType: 'text',
            title: 'Логин',
            type: 'text'
        },
        password: {
            placeholder: 'Пароль',
            required: true,
            templateType: 'text',
            title: 'Пароль',
            type: 'text'
        },
        name: {
            placeholder: 'Имя',
            required: true,
            templateType: 'text',
            title: 'Имя',
            type: 'text'
        },
        status: {
            placeholder: 'Статус',
            templateType: 'text',
            title: 'Статус',
            type: 'text'
        }
    },
    action: 'users/user',
    method: 'POST'
};

export default userForm;