import UsersApi from "@/core/api/users/Users.api";

export default class ApiFacade {
    protected static instance: ApiFacade | null;

    public users: UsersApi | null = null;

    protected async init(): Promise<void> {
        this.users = await UsersApi.getInstance();
    }

    public static async getInstance(): Promise<ApiFacade> {
        if (!ApiFacade.instance) {
            ApiFacade.instance = new ApiFacade();
            await ApiFacade.instance.init();
        }

        return this.instance as ApiFacade;
    }
}