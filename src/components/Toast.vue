<template>
  <div class="toast" v-if="toast.show">
    <div class="progress-bar">
      <div class="line" :style="'width: ' + percentProgress + '%'"></div>
    </div>
    <div class="toast-header">
      <span>
        <i v-if="toast.type" :class="['bi', getIconClass(toast.type)]"></i>
        {{ toast.title }}
      </span>
      <button class="close-toast" @click="closeToast(index)">
        <i class="bi bi-x"></i>
      </button>
    </div>
    <div class="toast-content">{{ toast.message }}</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { toastsInterface } from "@/vuex/store";
import { useStore } from "vuex";

@Options({
  props: {
    index: Number,
  },
})
export default class ToastComponent extends Vue {
  index!: number;
  store = useStore();

  toast: toastsInterface = this.store.getters.toasts[this.index];

  getIconClass(type: string) {
    switch (type) {
      case "danger":
        return "text-danger bi-exclamation-circle-fill";
      case "warning":
        return "text-warning bi-exclamation-triangle-fill";
      case "success":
        return "text-success bi-check";
    }
  }

  get percentProgress() {
    return (this.toast.timer / this.toast.maxTimer) * 100;
  }

  closeToast(index: number) {
    this.store.dispatch("closeToast", index);
  }

  created() {
    this.toast = this.store.getters.toasts[this.index];
    if (this.toast) {
      const interval = setInterval(() => {
        this.toast.timer -= 15;

        if (this.toast.timer <= 0) {
          this.store.dispatch("updateToast", {
            toast: this.toast,
            index: this.index,
          });
          clearInterval(interval);
        }
      }, 20);
    }
  }
}
</script>
