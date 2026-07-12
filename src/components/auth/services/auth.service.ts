import store from "@/modules/vuex/store";

export default class AuthService {
    protected static authService: AuthService | null = null;

    public static getInstance(): AuthService {
        if (!this.authService) {
            this.authService = new AuthService()
        }

        return this.authService;
    }

    public logout(isRedirectAuth: boolean = false): void {
        store.dispatch("clearSelf");

        if (isRedirectAuth) {
            window.location.href = '/auth';
        }
    };
}
