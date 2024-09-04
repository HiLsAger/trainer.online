import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./modules/vuex/store";
import settingsData from "./configs/settings.json";
import Settings from "./utility/interfaces/settings.interface";

store.dispatch("initializeStore");

const app = createApp(App);

const settings: Settings = settingsData as Settings;
app.config.globalProperties.$settings = settingsData;

app.use(router).use(store).mount("#app");
