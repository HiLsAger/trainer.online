import UsersApi from "@/core/api/users/Users.api";
import GridApi from "@/core/api/grid/Grid.api";
import PermissionsApi from "@/core/api/permissions/Permissions.api";

export default class ApiFacade {
    protected static instance: ApiFacade | null;

    public users: UsersApi | null = null;

    public grids: GridApi | null = null;

    public permissions: PermissionsApi | null = null;

    protected async init(): Promise<void> {
        this.users = await UsersApi.getInstance();
        this.grids = await GridApi.getInstance();
        this.permissions = await PermissionsApi.getInstance();
    }

    public static async getInstance(): Promise<ApiFacade> {
        if (!ApiFacade.instance) {
            ApiFacade.instance = new ApiFacade();
            await ApiFacade.instance.init();
        }

        return this.instance as ApiFacade;
    }
}