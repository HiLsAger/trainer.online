<template>
    <div class="login-form">
      <h1>Регистрация</h1>
      <FieldsComponent :labels="loginPropertyes" @input="handleInputUpdate" />
      <button class="btn btn-auth" v-on:click="onSubmit()">Создать аккаунт</button>
    </div>
  </template>
  
  <script lang="ts">
  import Self from "@/utility/interfaces/self.interface";
  import axios, { AxiosResponse } from "axios";
  import { Options, Vue } from "vue-class-component";
  import {registerPropertyes, registerInputs} from "./register.labels"
  import { useStore } from "vuex";
  import FieldsComponent from "@/components/fields/FieldComponent.vue";
  import router from '@/modules/router/index';
  import ServerHelper from "@/core/helpers/singletonServer.helper"
  
  @Options({
    components: {
      FieldsComponent
    }
  })
  export default class RegisterComponent extends Vue {
    store = useStore();
    loginPropertyes = registerPropertyes;
    
    register: registerInputs = {
      login: "",
      hash: "",
      name: ""
    };

    serverHelper?: ServerHelper;

    async mounted() {
      this.serverHelper = await ServerHelper.getInstance();
    }
  
    handleInputUpdate(data: Record<string, string>) {
      this.register = { ...this.register, ...data };
    }
  
    async onSubmit() {
      if (!this.serverHelper) {
        throw new Error('ServerHelper is not initialized');
      }

      axios
        .post(this.serverHelper.getApiUrl("auth/register"), this.register)
        .then((response: AxiosResponse<Self>) => {
          console.log(response);
          this.store.dispatch("setSelf", response.data);
          router.push('/')
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  </script>
  
  <style lang="scss"></style>