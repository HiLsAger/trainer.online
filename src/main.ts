import {createApp} from "vue";
import App from "./App.vue";
import router from "./modules/router";
import store from "./modules/vuex/store";
import settingsData from "./configs/settings.json";
import Settings from "./utility/interfaces/settings.interface";
import TooltipDirective from "@/components/tooltip/Tooltip.vue";

store.dispatch("initializeStore");

const app = createApp(App);

app.provide('$settings', settingsData as Settings)
app.config.globalProperties.$store = store;
app.directive('tooltip', TooltipDirective)
app.use(router).use(store).mount("#app");
