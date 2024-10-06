import { registerLabels } from "../../utility/interfaces/label.interface";
export const registerPropertyes: registerLabels = {
  login: {
    title: "Логин",
    placeholder: "Логин пользователя",
    required: true,
    type: "text",
    templateType: "text"
  },
  hash: {
    title: "Пароль",
    placeholder: "Пароль пользователя",
    required: true,
    type: "password",
    templateType: "text"
  },
  name: {
    title: "Имя",
    placeholder: "Имя пользователя",
    required: true,
    type: "text",
    templateType: "text"
  },
};

export interface registerInputs {
  login: string;
  hash: string;
  name: string;
}
