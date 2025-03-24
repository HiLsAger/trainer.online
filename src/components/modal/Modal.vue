<template>
  <div id="right-modal" :class="['modal', isVisible ? 'show' : 'hide']">
    <div class="modal__content">
      <div class="modal__header">
        <h2>{{ title }}</h2>
        <button @click="toggleModal()" class="modal-close btn btn-transparent">
          <i class="bi bi-x"></i>
        </button>
      </div>
      <div class="modal__body">
        {{ beforeHtml }}
        <FieldComponent ref="fieldsComponentRef" :labels="form.labels" @handleInputFields="handleInputUpdate"/>
        <button v-if="form.action" class="btn btn-submit" @click="onSubmit()">
          {{ buttonSubmit }}
        </button>
        {{ afterHtml }}
      </div>
      <div class="modal__footer">
        {{ footerHtml }}
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
      required: true
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

  async mounted() {
    setTimeout(() => {
      this.isVisible = this.show;
    }, 0);

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
    padding: 1rem;

    .actions {
      display: flex;
      justify-content: end;
    }
  }
}
</style>