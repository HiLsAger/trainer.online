import { useStore } from "vuex";

export default class AuthService{
    logout(): void {
        useStore().dispatch("clearSelf");
    };
}