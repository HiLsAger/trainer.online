import ServerHelper from "@/core/helpers/Server.helper";
import ConfigHelper from "@/core/helpers/Config.helper";
import {defaultUserGrid} from "@/core/models/User";
import axios from "axios";
import store from "@/modules/vuex/store";

export default class AxiosHelper {
    private static instance: AxiosHelper | null = null;

    protected serverHelper: ServerHelper | null = null;

    protected configHelper: ConfigHelper | null = null;

    private async init(): Promise<void> {
        this.serverHelper = await ServerHelper.getInstance();
        this.configHelper = await ConfigHelper.getInstance();
    }

    public static async getInstance(): Promise<AxiosHelper> {
        if (!AxiosHelper.instance) {
            AxiosHelper.instance = new AxiosHelper();
            AxiosHelper.instance.init();
        }

        return this.instance as AxiosHelper;
    }

    public async sendRequest(url: string, method: string) {
        if (!this.serverHelper) {
            console.error('Не инициализирован serverHelper')
            return defaultUserGrid;
        }

        return await axios.request({
            url: this.serverHelper?.getApiUrl(url),
            method: method,
            headers: {'Authorization': this.configHelper?.getSelf().token}
        })
            .then(response => response ? response.data : null)
            .catch((error) => {
                console.error(error);
                return null;
            });
    }

    public async sendGetRequest(url: string) {
        if (!this.serverHelper) {
            console.error('Не инициализирован serverHelper')
            return defaultUserGrid;
        }

        return await axios.get(this.serverHelper?.getApiUrl(url), {
            headers: {'Authorization': this.configHelper?.getSelf().token}
        })
            .then(response => response ? response.data : null)
            .catch((error) => {
                console.error(error);
                return null;
            });
    }

    public async sendForm(url: string, data: Object) {
        if (!this.serverHelper) {
            console.error('Не инициализирован serverHelper')
            return defaultUserGrid;
        }
        console.log(data)
        return await axios.post(this.serverHelper.getApiUrl(url), data, {
            headers: {'Authorization': this.configHelper?.getSelf().token}
        })
            .then(response => {
                store.dispatch("addToast", {
                    type: "success",
                    title: "Успех!",
                    message: 'Запись успешно изменена!',
                });

                return response ? response.data : null
            })
            .catch((error) => {
                console.error(error);
                return null;
            });
    }
}