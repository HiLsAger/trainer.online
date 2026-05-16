import store from "@/modules/vuex/store";
import ToasterStorage from "@/core/storages/toaster.storage";

export default class ToasterHelper {
    protected static instance: ToasterHelper | null = null;

    public static getInstance(): ToasterHelper {
        if (!ToasterHelper.instance) {
            ToasterHelper.instance = new ToasterHelper();
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

    public addErrorToast(message: string): void {
        this.addToast(ToasterStorage.TYPE_ERROR, "Ошибка!", message);
    }

    public addSuccessToast(title: string, message: string): void {
        this.addToast(ToasterStorage.TYPE_SUCCESS, "Успех!", message);
    }
}
