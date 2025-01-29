import {createStore} from "vuex";
import Self from "@/utility/interfaces/self.interface";
import Toasts from "@/utility/interfaces/toasts.interface";

export default createStore({
    state: {
        toasts: [] as Toasts[],
        self: null as Self | null,
    },
    mutations: {
        addToast(state, toast: Toasts) {
            toast.timer = 3000;
            toast.maxTimer = 3000;
            toast.show = true;
            state.toasts.push(toast);
        },
        updateToast(
            state,
            {toast, index}: { toast: Toasts; index: number }
        ) {
            state.toasts[index] = toast;
            if (state.toasts[index].timer <= 0) {
                state.toasts[index].show = false;
            }
        },
        closeToast(state, index: number) {
            state.toasts[index].show = false;
        },
        setSelf(state, self: Self) {
            state.self = self;
            localStorage.setItem("self", JSON.stringify(self));
        },
        clearSelf(state) {
            state.self = null;
            localStorage.removeItem("self");
        },
    },
    actions: {
        addToast({commit}, toast: Toasts) {
            commit("addToast", toast);
        },
        updateToast(
            {commit},
            payload: { toast: Toasts; index: number }
        ) {
            commit("updateToast", payload);
        },
        closeToast({commit}, index: number) {
            commit("closeToast", index);
        },
        setSelf({commit}, self: Self) {
            commit("setSelf", self);
        },
        clearSelf({commit}) {
            commit("clearSelf", self);
        },
        initializeStore({commit}) {
            const jsonSelf = localStorage.getItem("self");
            if (jsonSelf !== null) {
                const self = JSON.parse(jsonSelf);
                commit("setSelf", self);
            }
        },
    },
    getters: {
        toasts: (state) => state.toasts,
        self: (state) => state.self,
        profile: (state) => state.self?.user,
    },
});
