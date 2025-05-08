<template>
  <div id="right-modal" :class="['modal', isVisible ? 'show' : 'hide']">
    <div v-if="isVisible" class="modal__content">
      <div class="modal__header">
        <h2 v-if="getTitle">{{ getTitle() }}</h2>
        <button @click="toggleModal()" class="modal-close btn btn-transparent">
          <i class="bi bi-x"></i>
        </button>
      </div>
      <div class="modal__body">
        <div v-if="beforeHtml" v-html="beforeHtml"></div>
        <div v-if="$slots.beforeHtml">
          <slot name="beforeHtml"></slot>
        </div>
        <FieldComponent
            :key="fieldsCounter"
            ref="fieldsComponentRef"
            :labels="form.labels"
            @handleInputFields="handleInputUpdate"
        />
        <button v-if="form.action" class="btn btn-submit" @click="onSubmit()">
          {{ buttonSubmit }}
        </button>
        <div v-if="afterHtml" v-html="afterHtml"></div>
        <div v-if="$slots.afterHtml">
          <slot name="beforeHtml"></slot>
        </div>
      </div>
      <div v-if="footerHtml" v-html="footerHtml"></div>
      <div v-if="$slots.footerHtml">
        <slot name="beforeHtml"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import FieldComponent from "@/components/fields/FieldComponent.vue";
import {Form} from "@/utility/interfaces/label.interface";
import AxiosHelper from "@/core/helpers/Axios.helper";
import {useStore} from "vuex";
import {IFieldsComponent} from "@/components/fields/IFieldsComponent.intefrace";

@Options({
  components: {FieldComponent},
  props: {
    title: {
      type: String,
      required: false
    },
    form: {
      type: Object as () => Form,
      required: true,
    },
    beforeHtml: {
      type: String,
      required: false
    },
    afterHtml: {
      type: String,
      required: false
    },
    footerHtml: {
      type: String,
      required: false
    },
    buttonSubmit: {
      type: String,
      default: 'Подать запрос'
    },
    show: {
      type: Boolean,
      default: false
    }
  }
})
export default class ModalComponent extends Vue {
  title!: string;
  form!: Form;
  beforeHtml!: string;
  afterHtml!: string;
  footerHtml!: string;
  show!: boolean;
  buttonSubmit!: string;

  axiosHelper?: AxiosHelper;
  store = useStore()

  isVisible: boolean = false;
  requestData: object = {};

  fieldsCounter = 0;

  getTitle(): string {
    return this.title ?? this.form.title ?? null;
  }

  handleInputUpdate(data: any) {
    this.requestData = data;
  }

  async onSubmit(method: string = 'POST'): Promise<void> {
    if (!this.form.action || !this.requestData || !this.axiosHelper) {
      this.store.dispatch("addToast", {
        type: "error",
        title: "Ошибка",
        message: 'Произошла неизвестная ошибка',
      });
      return;
    }

    const fieldsComponent = this.$refs.fieldsComponentRef as IFieldsComponent;
    if (!fieldsComponent.validate()) {
      this.store.dispatch("addToast", {
        type: "error",
        title: "Ошибка",
        message: 'Ошибки в введённых данных',
      });
      return;
    }

    await this.axiosHelper.sendForm(this.form.action, this.requestData);
    this.toggleModal();
    this.$emit("handleSuccess");
  }

  toggleModal() {
    this.isVisible = !this.isVisible;
  }

  handleClickOutside = (event: MouseEvent) => {
    if (!this.isVisible) return;
    const modalContent = document.getElementById('right-modal');
    if (modalContent && !modalContent.contains(event.target as Node)) {
      this.toggleModal();
    }
  }

  async mounted() {
    setTimeout(() => {
      this.isVisible = this.show;
    }, 0);

    document.addEventListener('mousedown', this.handleClickOutside);
    this.axiosHelper = await AxiosHelper.getInstance();
  }
}
</script>

<style lang="scss">
#right-modal {
  position: absolute;
  top: 0;
  right: -35%;
  height: 100%;
  width: 35%;
  opacity: 1;
  background-color: var(--orig-white);

  .modal__header {
    display: flex;
    justify-content: space-between;
  }

  &.hide {
    transition: right 0.2s ease-in-out;
  }

  &.show {
    right: 0;
    transition: right 0.2s ease-in-out;
  }

  .modal__content {
    padding: 1em;

    .actions {
      display: flex;
      justify-content: end;
    }
  }
}
</style>