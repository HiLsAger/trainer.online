import { registerLabels } from "../../utility/interfaces/LabelPropertyes";
export const registerPropertyes: registerLabels = {
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
  name: {
    title: "Логин",
    placeholder: "Логин пользователя",
    required: true,
    type: "text",
  },
};

export interface registerInputs {
  login: string;
  hash: string;
  name: string;
}
