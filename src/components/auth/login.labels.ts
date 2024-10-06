import { loginLabels } from "@/utility/interfaces/label.interface";
export const loginPropertyes: loginLabels = {
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
};

export interface loginInputs {
  login: string;
  hash: string;
}
