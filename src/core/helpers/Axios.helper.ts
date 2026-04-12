import ServerHelper from "@/core/helpers/Server.helper";
import ConfigHelper from "@/core/helpers/Config.helper";
import {defaultUserGrid} from "@/core/models/User";
import axios, {AxiosError} from "axios";
import store from "@/modules/vuex/store";
import {ErrorMessageInterface} from "@/utility/interfaces/errorMessage.interface";
import ToasterHelper from "@/core/helpers/Toaster.helper";

export default class AxiosHelper {
    private static instance: AxiosHelper;

    protected serverHelper: ServerHelper;

    protected configHelper: ConfigHelper;

    protected toasterHelper: ToasterHelper;

    constructor(
        serverHelper: ServerHelper,
        configHelper: ConfigHelper,
        toasterHelper: ToasterHelper
    ) {
        this.serverHelper = serverHelper;
        this.configHelper = configHelper;
        this.toasterHelper = toasterHelper;
    }

    public static async getInstance(): Promise<AxiosHelper> {
        if (!AxiosHelper.instance) {
            const [serverHelper, configHelper, toasterHelper] = await Promise.all([
                ServerHelper.getInstance(),
                ConfigHelper.getInstance(),
                ToasterHelper.getInstance()
            ]);
            AxiosHelper.instance = new AxiosHelper(serverHelper, configHelper, toasterHelper);
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
            .catch((error: AxiosError) => {
                if (!error.response) {
                    return null
                }

                if (error.response.data) {
                    this.toasterHelper.addErrorToast((error.response.data as ErrorMessageInterface).message);
                    return null
                }

                this.toasterHelper.addErrorToast(error.response.statusText);
                return null;
            });
    }
}