import {createApp} from "vue";
import App from "./App.vue";
import router from "./modules/router";
import store from "./modules/vuex/store";
import settingsData from "./configs/settings.json";
import Settings from "./utility/interfaces/settings.interface";
import ApiFacade from "@/core/api/Api.facade";
import TooltipDirective from "@/components/directives/tooltip/Tooltip.vue";

store.dispatch("initializeStore");

const app = createApp(App);
ApiFacade.getInstance();

app.provide('$settings', settingsData as Settings)
app.config.globalProperties.$store = store;
app.directive('tooltip', TooltipDirective)
app.use(store).use(router).mount("#app");
