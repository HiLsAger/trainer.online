import {Grid} from "@/utility/interfaces/grid.interface";
import {defaultUserGrid} from "@/core/models/User";
import ApiFacade from "@/core/api/Api.facade";

export default class PermissionsApi {

    protected static instance: PermissionsApi | null;

    protected api: ApiFacade | null = null;

    protected async init(): Promise<void> {
        this.api = await ApiFacade.getInstance();
    }

    public static async getInstance(): Promise<PermissionsApi> {
        if (!PermissionsApi.instance) {
            PermissionsApi.instance = new PermissionsApi();
            await PermissionsApi.instance.init();
        }

        return this.instance as PermissionsApi;
    }

    public async getPermissionsGrid(limit: number = 10, page: number = 1): Promise<Grid> {
        if (!this.api) {
            console.error('Не инициализирован ApiFacade')
            return defaultUserGrid;
        }

        if (!this.api.grids) {
            console.error('Не инициализирован GridApi')
            return defaultUserGrid;
        }

        return this.api.grids.getGrid(
            'permissions/grid',
            {limit: limit, page: page}
        );
    }
}