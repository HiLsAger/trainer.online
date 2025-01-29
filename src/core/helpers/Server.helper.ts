import Profile from "@/utility/interfaces/profile.interface";
import ConfigHelper from "./Config.helper";
import axios, {AxiosResponse} from "axios";
import Self from "@/utility/interfaces/self.interface";
import store from "@/modules/vuex/store";

export default class ServerHelper {
    private static instance: ServerHelper | null = null;

    public configHelper?: ConfigHelper;

    private constructor() {
    }

    private async init(): Promise<void> {
        this.configHelper = await ConfigHelper.getInstance();
    }

    public static async getInstance(): Promise<ServerHelper> {
        if (!ServerHelper.instance) {
            ServerHelper.instance = new ServerHelper();
            await ServerHelper.instance.init();
        }

        return this.instance as ServerHelper;
    }


    public getApiUrl(page: string): string {
        let settings = this.configHelper?.getSettings();
        if (!settings || !settings.apiUrl) {
            throw new Error("Конфигурацию или apiUrl не удалось найти");
        }

        return `${settings.apiUrl}/${page}`;
    }

    public async getProfile(username: string): Promise<Profile | null> {
        const self = store.getters.self as Self | null;

        if (!self) {
            throw new Error("User is not authenticated");
        }

        const response: AxiosResponse<Profile> | null = await axios
            .get(this.getApiUrl('profile/info'), {
                params: {
                    login: username
                },
                headers: {
                    'Authorization': `${self.token}`
                }
            })
            .then((response: AxiosResponse<Profile>) => {
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
