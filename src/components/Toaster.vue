<template>
  <div class="toaster">
    <ToastComponent
      v-for="(toast, index) in toasts"
      :key="index"
      :index="index"
      :toast="toast"
    />
  </div>
</template>

<script lang="ts">
import { toastsInterface } from "@/vuex/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import ToastComponent from "./Toast.vue";

@Options({
  components: {
    ToastComponent,
  },
})
export default class ToasterComponent extends Vue {
  store = useStore();
  get toasts(): toastsInterface[] {
    return this.store.getters.toasts;
  }

  closeToast(index: number) {
    this.store.dispatch("closeToast", index);
  }
}
</script>

<style lang="scss">
.toaster {
  position: fixed;
  right: 1vh;
  bottom: 1vh;

  .toast {
    background-color: var(--black);
    width: 30vw;
    max-width: 350px;
    min-height: 100px;
    text-align: left;
    color: var(--white);
    margin-top: 0.5em;
    position: relative;

    .progress-bar {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 1;

      .line {
        height: 2px;
        background-color: var(--white);
      }
    }
    .toast-header {
      background-color: var(--full-black);
      padding: 0.5em 1em;
      display: flex;
      justify-content: space-between;

      .close-toast {
        background-color: transparent;
        color: var(--white);
        font-size: 1em;
        padding: 0;
        border: none;
        outline: none;
      }
    }
    .toast-content {
      padding: 0.5em 1em;
      font-size: 1em;
    }
  }
}
</style>
