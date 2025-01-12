import ServerHelper from "@/core/helpers/Server.helper";
import {IUser} from "@/core/models/User";
import axios, {AxiosResponse} from "axios";
import ConfigHelper from "@/core/helpers/Config.helper";

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

    public async getUsersList(limit: number = 10, page: number = 1): Promise<IUser | null> {
        if (!this.serverHelper) {
            console.error('Не инициализирован serverHelper')
            return null;
        }
        console.log('test')
        const response: AxiosResponse<IUser> | null = await axios
            .get(this.serverHelper?.getApiUrl('users/user'), {
                params: {
                    limit: limit,
                    page: page
                },
                headers: {
                    'Authorization': `${this.configHelper?.getSelf().token}`
                }
            })
            .then((response: AxiosResponse<IUser>) => {
                return response;
            })
            .catch((error) => {
                console.error(error);
                return null;
            });

        if (response) {
            return response.data;
        }

        return null;
    }
}