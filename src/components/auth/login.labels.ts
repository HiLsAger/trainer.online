import { loginLabels } from "../../utility/interfaces/LabelPropertyes";
export const loginPropertyes: loginLabels = {
  login: {
    title: "Логин",
    placeholder: "Логин пользователя",
    required: true,
    type: "text",
  },
  hash: {
    title: "Пароль",
    placeholder: "Пароль пользователя",
    required: true,
    type: "password",
  },
};

export interface loginInputs {
  login: string;
  hash: string;
}
