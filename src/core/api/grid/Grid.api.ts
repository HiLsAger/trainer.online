import ServerHelper from "@/core/helpers/Server.helper";
import axios from "axios";
import ConfigHelper from "@/core/helpers/Config.helper";
import {Grid} from "@/utility/interfaces/grid.interface";
import {defaultUserGrid} from "@/core/models/User";

export default class GridApi {

    protected static instance: GridApi | null;

    protected serverHelper: ServerHelper | null = null;

    protected configHelper: ConfigHelper | null = null;

    protected async init(): Promise<void> {
        this.serverHelper = await ServerHelper.getInstance();
        this.configHelper = await ConfigHelper.getInstance();
    }

    public static async getInstance(): Promise<GridApi> {
        if (!GridApi.instance) {
            GridApi.instance = new GridApi();
            await GridApi.instance.init();
        }

        return this.instance as GridApi;
    }

    public async getGrid(url: string, params: object): Promise<Grid> {
        if (!this.serverHelper) {
            console.error('Не инициализирован serverHelper')
            return defaultUserGrid;
        }

        return await axios.get(this.serverHelper?.getApiUrl(url), {
            params: params,
            headers: {'Authorization': `${this.configHelper?.getSelf().token}`}
        })
            .then(response => response ? response.data : defaultUserGrid)
            .catch((error) => {
                console.error(error);
                return defaultUserGrid;
            });
    }
}