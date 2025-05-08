<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper" @click.self="cancel">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">Подтверждение действия!</slot>
          </div>

          <div class="modal-body">
            <slot>{{ text }}</slot>
          </div>

          <div class="modal-footer">
            <button class="modal-default-button" @click="cancel">
              Отмена
            </button>
            <button class="modal-default-button confirm" @click="confirm">
              Подтвердить
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({
  props: {
    show: {
      type: Boolean,
      required: true
    },
    text: {
      type: String,
      default: 'Вы уверены, что хотите выполнить это действие?'
    }
  }
})
export default class ConfirmModalComponent extends Vue {
  show?: boolean;
  text?: string;

  confirm() {
    this.$emit('confirm')
  }

  cancel() {
    this.$emit('cancel')
  }
}
</script>

<style lang="scss">
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;

  .modal-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    .modal-container {
      width: 300px;
      margin: 0 auto;
      padding: 20px 30px;
      background-color: var(--white);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      transition: all 0.3s ease;


      .modal-header {
        margin-bottom: 20px;
        font-size: 1.2em;
        font-weight: bold;
      }

      .modal-body {
        margin: 20px 0;
      }

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;

        .modal-default-button {
          padding: 8px 16px;
          border: none;
          cursor: pointer;

          &.confirm {
            background-color: var(--danger);
            color: white;

            &:hover {
              background-color: var(--hover-danger);
            }
          }
        }
      }
    }
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transform: scale(1.1);
}
</style>