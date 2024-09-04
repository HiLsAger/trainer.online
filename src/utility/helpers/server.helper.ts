import { Vue } from "vue-class-component";
import Settings from "../interfaces/settings.interface";

export default class ServerHelper extends Vue {
    getApiUrl(page:string): string {
        const config = this.$config as Settings;
        return config.apiUrl + "/" + page;
    }
}