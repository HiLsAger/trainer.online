<template>
  <div class="login-form">
    <h1>Регистрация</h1>
    <FieldsComponent :labels="loginPropertyes" @handleInput="handleInputUpdate"/>
    <button class="btn btn-auth" v-on:click="onSubmit()">Создать аккаунт</button>
  </div>
</template>

<script lang="ts">
import Self from "@/utility/interfaces/self.interface";
import axios, {AxiosResponse} from "axios";
import {Options, Vue} from "vue-class-component";
import {registerPropertyes} from "./register.labels"
import {useStore} from "vuex";
import FieldsComponent from "@/components/fields/FieldComponent.vue";
import router from '@/modules/router/index';
import ServerHelper from "@/core/helpers/Server.helper"

@Options({
  components: {
    FieldsComponent
  }
})
export default class RegisterComponent extends Vue {
  store = useStore();
  loginPropertyes = registerPropertyes;

  register: object = {};

  serverHelper?: ServerHelper;

  async mounted() {
    this.serverHelper = await ServerHelper.getInstance();
  }

  handleInputUpdate(data: object) {
    this.register = data;
  }

  async onSubmit() {
    if (!this.serverHelper) {
      throw new Error('ServerHelper is not initialized');
    }

    axios
        .post(this.serverHelper.getApiUrl("auth/register"), this.register)
        .then((response: AxiosResponse<Self>) => {
          this.store.dispatch("setSelf", response.data);
          router.push('/')
        })
        .catch((error) => {
          this.store.dispatch("addToast", {
            type: "error",
            title: "Ошибка",
            message: error.response.data.message,
          });
        });
  }
}
</script>

<style lang="scss"></style>