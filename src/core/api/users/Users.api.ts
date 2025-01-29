import ServerHelper from "@/core/helpers/Server.helper";
import axios from "axios";
import ConfigHelper from "@/core/helpers/Config.helper";
import {Grid} from "@/utility/interfaces/grid.interface";
import {defaultUserGrid} from "@/core/models/User";

export default class UsersApi {

    protected static instance: UsersApi | null;

    protected serverHelper: ServerHelper | null = null;

    protected configHelper: ConfigHelper | null = null;

    protected async init(): Promise<void> {
        this.serverHelper = await ServerHelper.getInstance();
        this.configHelper = await ConfigHelper.getInstance();
    }

    public static async getInstance(): Promise<UsersApi> {
        if (!UsersApi.instance) {
            UsersApi.instance = new UsersApi();
            await UsersApi.instance.init();
        }

        return this.instance as UsersApi;
    }

    public async getUsersGrid(limit: number = 10, page: number = 1): Promise<Grid> {
        if (!this.serverHelper) {
            console.error('Не инициализирован serverHelper')
            return defaultUserGrid;
        }
        
        return await axios.get(this.serverHelper?.getApiUrl('users/grid'), {
            params: {limit: limit, page: page},
            headers: {'Authorization': `${this.configHelper?.getSelf().token}`}
        })
            .then(response => response ? response.data : defaultUserGrid)
            .catch((error) => {
                console.error(error);
                return defaultUserGrid;
            });
    }

    public async getUserForm(id: number) {

    }
}