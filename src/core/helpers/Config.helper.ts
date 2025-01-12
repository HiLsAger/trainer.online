import Settings from '@/utility/interfaces/settings.interface';
import Self from "@/utility/interfaces/self.interface";
import store from "@/modules/vuex/store";

export default class ConfigHelper {
    private static instance: ConfigHelper | null = null;

    private settings?: Settings;

    public constructor() {
    }

    private async init(): Promise<void> {
        if (!this.settings) {
            this.settings = await import('@/configs/settings.json');
        }
    }

    public static async getInstance(): Promise<ConfigHelper> {
        if (!ConfigHelper.instance) {
            ConfigHelper.instance = new ConfigHelper();
            ConfigHelper.instance.init();
        }

        return this.instance as ConfigHelper;
    }

    public getSettings(): Settings {
        if (!this.settings) {
            throw new Error('Settings have not been initialized yet. Call init() first.')

        }
        return this.settings;
    }

    public getSelf(): Self {
        const self = store.getters.self as Self | null;

        if (!self) {
            throw new Error("User is not authenticated");
        }

        return self;
    }
}
