import ServerHelper from "@/core/helpers/Server.helper";
import ConfigHelper from "@/core/helpers/Config.helper";
import {defaultUserGrid} from "@/core/models/User";
import axios, {AxiosError, AxiosResponse} from "axios";
import store from "@/modules/vuex/store";
import {ErrorMessageInterface} from "@/utility/interfaces/errorMessage.interface";
import ToasterHelper from "@/core/helpers/Toaster.helper";
import AuthService from "@/components/auth/services/auth.service";

export default class AxiosHelper {
    private static instance: AxiosHelper;

    protected serverHelper: ServerHelper;
    protected configHelper: ConfigHelper;
    protected toasterHelper: ToasterHelper;
    protected authService: AuthService;

    constructor(
        serverHelper: ServerHelper,
        configHelper: ConfigHelper,
        toasterHelper: ToasterHelper,
        authService: AuthService
    ) {
        this.serverHelper = serverHelper;
        this.configHelper = configHelper;
        this.toasterHelper = toasterHelper;
        this.authService = authService
    }

    public static async getInstance(): Promise<AxiosHelper> {
        if (!AxiosHelper.instance) {
            const [serverHelper, configHelper, toasterHelper, authService] = await Promise.all([
                ServerHelper.getInstance(),
                ConfigHelper.getInstance(),
                ToasterHelper.getInstance(),
                AuthService.getInstance()
            ]);
            AxiosHelper.instance = new AxiosHelper(serverHelper, configHelper, toasterHelper, authService);
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
            .catch(async (error) => {
                if (!error.response) {
                    return null
                }

                await this.handleCheckStatus(error.response);

                return null;
            });
    }

    public async sendGetRequest(url: string, query: object = {}) {
        if (!this.serverHelper) {
            console.error('Не инициализирован serverHelper')
            return defaultUserGrid;
        }

        return await axios.get(this.serverHelper?.getApiUrl(url, query), {
            headers: {'Authorization': this.configHelper?.getSelf().token}
        })
            .then(response => response ? response.data : null)
            .catch(async (error) => {
                if (!error.response) {
                    return null
                }

                await this.handleCheckStatus(error.response);

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
            .catch(async (error: AxiosError) => {
                if (!error.response) {
                    return null
                }

                await this.handleCheckStatus(error.response);

                if (error.response.data) {
                    this.toasterHelper.addErrorToast((error.response.data as ErrorMessageInterface).message);
                    return null
                }

                this.toasterHelper.addErrorToast(error.response.statusText);
                return null;
            });
    }

    protected async handleCheckStatus(response: AxiosResponse): Promise<void> {
        switch (response.status) {
            case 401:
                await this.authService.logout(true);
                break;
            default:
                console.log(response);
        }
    }
}