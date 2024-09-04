import { Vue } from "vue-class-component";
import Settings from "../interfaces/settings.interface";

export default class ConfigHelper extends Vue {
    getSettings(): Settings {
        return this.$config as Settings
    }
}