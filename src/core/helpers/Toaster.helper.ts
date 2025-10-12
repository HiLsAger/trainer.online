import store from "@/modules/vuex/store";
import ToasterStorage from "@/core/storages/toaster.storage";

export default class ToasterHelper {
    protected static instance: ToasterHelper | null = null;


    protected async init(): Promise<void> {
    }

    public static async getInstance(): Promise<ToasterHelper> {
        if (!ToasterHelper.instance) {
            ToasterHelper.instance = new ToasterHelper();
            await ToasterHelper.instance.init();
        }

        return this.instance as ToasterHelper;
    }

    public addToast(type: string, title: string, message: string): void {
        store.dispatch("addToast", {
            type: type,
            title: title,
            message: message,
        });
    }

    public addErrorToast(title: string, message: string): void {
        this.addToast(ToasterStorage.TYPE_ERROR, title, message);
    }

    public addSuccessToast(title: string, message: string): void {
        this.addToast(ToasterStorage.TYPE_SUCCESS, title, message);
    }
}
