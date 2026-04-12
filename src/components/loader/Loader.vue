<template>
  <div class="loader-container" :class="customClass">
    <slot name="loader">
      <div class="spinner" :style="spinnerStyle"></div>
    </slot>
    <p v-if="text" class="loader-text">{{ text }}</p>
    <slot name="footer"></slot>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({
  props: {
    text: {
      type: Text,
      required: true,
    },
    color: {
      type: String,
      default: '#3498db'
    },
    size: {
      type: Number,
      default: 50,
    },
    customClass: {
      type: String,
      default: ''
    }
  }
})
export default class LoaderComponent extends Vue {
  text!: string;
  color!: string;
  size!: number;
  customClass!: string;
}
</script>

<style lang="scss">
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 16px;

  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loader-text {
    color: #666;
    font-size: 14px;
    margin: 0;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
